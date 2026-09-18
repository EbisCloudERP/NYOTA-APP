import Ionicons from "@react-native-vector-icons/ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { VideoView, useVideoPlayer, type VideoPlayer } from "expo-video";
import {
  useEffect,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
} from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  completeLesson,
  getLesson,
  type LessonDetail,
} from "../../services/api";
import { useFeedback } from "../../services/FeedbackContext";
import { useLanguage } from "../../services/LanguageContext";
import { getUuid } from "../../services/storage";
import { Colors } from "../../theme/colors";

const KEY_TAKEAWAYS_STOP_SECTIONS = [
  "introduction",
  "learning content",
  "success factors",
  "common mistakes",
  "common challenges",
  "conclusion",
  "summary",
];

const BULLET_CHARS = ["•", String.fromCharCode(0xf0b7), "-"];
const NEWLINE = String.fromCharCode(10);

function stripCheckPrefix(line: string): string {
  return line.split("✓").join("").trim();
}

function stripBulletPrefix(line: string): string | null {
  const first = line.charAt(0);
  if (!BULLET_CHARS.includes(first)) {
    return null;
  }
  const rest = line.slice(1).trim();
  return rest.length > 0 ? rest : null;
}

function parseLessonContent(content: string): {
  keyTakeaways: string[];
  remainingContent: string;
} {
  const lines = content.split(NEWLINE);
  const before: string[] = [];
  const after: string[] = [];
  const keyTakeaways: string[] = [];
  let phase: "before" | "inside" | "after" = "before";

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();

    if (phase === "before") {
      if (trimmed.toLowerCase() === "key takeaways") {
        phase = "inside";
        continue;
      }
      before.push(rawLine);
      continue;
    }

    if (phase === "inside") {
      if (trimmed === "") {
        continue;
      }
      if (KEY_TAKEAWAYS_STOP_SECTIONS.includes(trimmed.toLowerCase())) {
        phase = "after";
        after.push(rawLine);
        continue;
      }
      keyTakeaways.push(trimmed);
      continue;
    }

    after.push(rawLine);
  }

  return {
    keyTakeaways,
    remainingContent: [...before, ...after].join(NEWLINE).trim(),
  };
}

const NON_BEGINNER_SECTION_HEADINGS = [
  "introduction",
  "key takeaways",
  "success factors",
  "learning content",
  "financial proposal mistakes",
  "technical proposal mistakes",
  "administrative mistakes",
  "common mistakes",
  "common mistakes in proposals",
  "common challenges",
];

const NON_BEGINNER_STOP_WORDS = [
  "key takeaways",
  "introduction",
  "learning content",
  "success factors",
  "common mistakes",
  "common challenges",
];

const QUESTION_START_WORDS = [
  "what",
  "who",
  "why",
  "how",
  "when",
  "where",
  "which",
  "can",
  "could",
  "should",
  "is",
  "are",
  "do",
  "does",
  "did",
];

function isBulletOrCheckStart(line: string): boolean {
  return line.startsWith("✓") || BULLET_CHARS.includes(line.charAt(0));
}

function isNumberedHeading(line: string): boolean {
  let i = 0;
  while (i < line.length && line.charAt(i) >= "0" && line.charAt(i) <= "9") {
    i += 1;
  }
  if (i === 0 || line.charAt(i) !== ".") {
    return false;
  }
  return line.charAt(i + 1) === " ";
}

function isQuestionHeading(line: string): boolean {
  if (!line.endsWith("?")) {
    return false;
  }
  const lower = line.toLowerCase();
  for (const word of QUESTION_START_WORDS) {
    if (!lower.startsWith(word)) {
      continue;
    }
    const next = lower.charAt(word.length);
    const isLetter = next >= "a" && next <= "z";
    if (!isLetter) {
      return true;
    }
  }
  return false;
}

function isShortHeadingStyle(line: string): boolean {
  if (line.length === 0 || line.length > 80) {
    return false;
  }
  const last = line.charAt(line.length - 1);
  if (last === "." || last === "," || last === ";" || last === ":") {
    return false;
  }
  if (isBulletOrCheckStart(line) || isNumberedHeading(line)) {
    return false;
  }
  const first = line.charAt(0);
  if (first < "A" || first > "Z") {
    return false;
  }
  for (let i = 1; i < line.length; i += 1) {
    const ch = line.charAt(i);
    const isUpper = ch >= "A" && ch <= "Z";
    const isLower = ch >= "a" && ch <= "z";
    const isDigit = ch >= "0" && ch <= "9";
    const isAllowedSymbol =
      ch === " " ||
      ch === "&" ||
      ch === "(" ||
      ch === ")" ||
      ch === "/" ||
      ch === "-";
    if (!isUpper && !isLower && !isDigit && !isAllowedSymbol) {
      return false;
    }
  }
  return true;
}

function normalizeContentLines(content: string): string[] {
  const lines = content.split(NEWLINE);
  const normalized: string[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line === "") {
      continue;
    }

    const isContinuation =
      normalized.length > 0 &&
      !isBulletOrCheckStart(line) &&
      !isNumberedHeading(line) &&
      !line.endsWith("?") &&
      !NON_BEGINNER_STOP_WORDS.includes(line.toLowerCase());

    if (isContinuation) {
      const last = normalized[normalized.length - 1];
      if (last.startsWith("✓") || BULLET_CHARS.includes(last.charAt(0))) {
        normalized[normalized.length - 1] = `${last} ${line}`;
        continue;
      }
    }

    normalized.push(line);
  }

  return normalized;
}

function LessonVideo({
  url,
  playerRef,
}: {
  url: string;
  playerRef: MutableRefObject<VideoPlayer | null>;
}) {
  const player = useVideoPlayer(url, (p) => {
    p.loop = false;
  });

  useEffect(() => {
    playerRef.current = player;
    return () => {
      playerRef.current = null;
    };
  }, [player, playerRef]);

  return (
    <View style={styles.videoCard}>
      <VideoView player={player} style={styles.video} nativeControls />
    </View>
  );
}

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<{ id: number; text: string }[]>([]);
  const playerRef = useRef<VideoPlayer | null>(null);
  const { showToast } = useFeedback();
  const { t } = useLanguage();

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    getLesson(id)
      .then((res) => setLesson(res.data))
      .catch((e) =>
        showToast(
          e instanceof Error ? e.message : t("lesson.failedLoad"),
          "error",
        ),
      )
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.brand} />
      </View>
    );
  }

  if (!lesson) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.emptyText}>{t("lesson.notFound")}</Text>
      </View>
    );
  }

  const contentText = lesson.content?.content?.replace(/\r/g, "") ?? "";
  const video = lesson.videos?.[0];
  const videoUrl = video?.mux_playback_id
    ? `https://stream.mux.com/${video.mux_playback_id}.m3u8`
    : null;
  const courseLessons = lesson.course?.lessons ?? [];
  const currentIndex = courseLessons.findIndex(
    (l) => String(l.id) === String(lesson.id),
  );
  const nextLesson =
    currentIndex >= 0 ? courseLessons[currentIndex + 1] : undefined;
  const completedLessonsCount = lesson.course?.completed_lessons ?? 0;
  const isAlreadyCompleted =
    currentIndex >= 0 && currentIndex < completedLessonsCount;

  const hasQuiz = lesson.quizz?.length > 0;
  const { keyTakeaways } = parseLessonContent(contentText);
  const isBeginner = (lesson.course?.level ?? "").toLowerCase() === "beginner";

  const handlePrimaryAction = async () => {
    if (hasQuiz) {
      const quiz = lesson.quizz?.[0];
      if (quiz) {
        playerRef.current?.pause();
        router.push({
          pathname: "/(quiz)/quiz",
          params: { lessonId: String(lesson.id), quizId: String(quiz.id) },
        });
      }
      return;
    }

    try {
      setSubmitting(true);
      const uuid = (await getUuid()) ?? "";
      await completeLesson(lesson.id, uuid);
      setCompleted(true);
    } catch (e) {
      showToast(
        e instanceof Error ? e.message : t("lesson.failedComplete"),
        "error",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handlePostComment = () => {
    const text = commentText.trim();
    if (!text) {
      return;
    }
    setComments((prev) => [...prev, { id: Date.now(), text }]);
    setCommentText("");
  };

  const renderFormattedContent = (): ReactNode[] => {
    const nodes: ReactNode[] = [];
    const lines = normalizeContentLines(contentText);
    let bulletBuffer: string[] = [];

    const flushBullets = () => {
      if (bulletBuffer.length === 0) {
        return;
      }
      nodes.push(
        <View key={`bullets-${nodes.length}`} style={styles.bulletList}>
          {bulletBuffer.map((text, i) => (
            <View key={`bullet-${i}`} style={styles.bulletItem}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>{text}</Text>
            </View>
          ))}
        </View>,
      );
      bulletBuffer = [];
    };

    for (const line of lines) {
      const bulletText = stripBulletPrefix(line);
      if (bulletText !== null) {
        bulletBuffer.push(bulletText);
        continue;
      }

      flushBullets();

      if (line.startsWith("✓")) {
        nodes.push(
          <View key={`check-${nodes.length}`} style={styles.checkItem}>
            <Ionicons name="checkmark-circle" size={16} color="#059669" />
            <Text style={styles.checkItemText}>{stripCheckPrefix(line)}</Text>
          </View>,
        );
        continue;
      }

      if (isNumberedHeading(line)) {
        nodes.push(
          <Text key={`heading-${nodes.length}`} style={styles.headingMain}>
            {line}
          </Text>,
        );
        continue;
      }

      if (
        NON_BEGINNER_SECTION_HEADINGS.includes(line.toLowerCase()) ||
        isQuestionHeading(line) ||
        isShortHeadingStyle(line)
      ) {
        nodes.push(
          <Text key={`section-${nodes.length}`} style={styles.headingSection}>
            {line}
          </Text>,
        );
        continue;
      }

      if (line.endsWith(":")) {
        nodes.push(
          <Text key={`sub-${nodes.length}`} style={styles.headingSub}>
            {line}
          </Text>,
        );
        continue;
      }

      nodes.push(
        <Text key={`p-${nodes.length}`} style={styles.paragraph}>
          {line}
        </Text>,
      );
    }

    flushBullets();

    return nodes;
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Lesson title */}
      <Text style={styles.lessonTitle}>{lesson.title}</Text>

      {/* Description / duration card */}
      {(lesson.description || lesson.duration_minutes > 0) && (
        <View style={styles.objectiveCard}>
          <View style={styles.objectiveRow}>
            <View style={styles.objectiveLeft}>
              <Ionicons name="bulb" size={20} color={Colors.brand} />
              <Text style={styles.objectiveLabel}>{t("lesson.about")}</Text>
            </View>
            {lesson.duration_minutes > 0 && (
              <View style={styles.durationBadge}>
                <Ionicons name="time-outline" size={12} color="#6B7280" />
                <Text style={styles.durationBadgeText}>
                  {lesson.duration_minutes} {t("common.min")}
                </Text>
              </View>
            )}
          </View>
          {lesson.description && (
            <Text style={styles.description}>{lesson.description}</Text>
          )}
        </View>
      )}

      {/* Video card */}
      {videoUrl && <LessonVideo url={videoUrl} playerRef={playerRef} />}

      {/* Lesson content */}
      {contentText ? (
        isBeginner ? (
          keyTakeaways.length > 0 ? (
            <View style={styles.takeawaysCard}>
              <Text style={styles.takeawaysHeader}>
                {t("lesson.keyTakeaways")}
              </Text>
              {keyTakeaways.map((line, index) => {
                if (line.startsWith("✓")) {
                  return (
                    <View key={index} style={styles.takeawayBadge}>
                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color="#059669"
                      />
                      <Text style={styles.takeawayBadgeText}>
                        {stripCheckPrefix(line)}
                      </Text>
                    </View>
                  );
                }

                const bulletText = stripBulletPrefix(line);
                if (bulletText !== null) {
                  return (
                    <View key={index} style={styles.takeawayRow}>
                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color="#059669"
                      />
                      <Text style={styles.takeawayRowText}>{bulletText}</Text>
                    </View>
                  );
                }

                return (
                  <Text key={index} style={styles.takeawayMutedText}>
                    {line}
                  </Text>
                );
              })}
            </View>
          ) : null
        ) : (
          <View style={styles.contentCard}>{renderFormattedContent()}</View>
        )
      ) : null}

      {/* Complete lesson / completion state */}
      {completed || isAlreadyCompleted ? (
        <View style={styles.completedCard}>
          <View style={styles.completedTitleRow}>
            <Ionicons name="checkmark-circle" size={24} color="#059669" />
            <Text style={styles.completedTitle}>{t("lesson.completed")}</Text>
          </View>
          <Text style={styles.completedText}>{t("lesson.completedText")}</Text>
          {nextLesson ? (
            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.7}
              onPress={() =>
                router.replace({
                  pathname: "/(lesson)/lesson",
                  params: { id: String(nextLesson.id) },
                })
              }
            >
              <Text style={styles.primaryButtonText}>
                {t("lesson.nextLesson")}
              </Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.7}
              onPress={() => router.back()}
            >
              <Text style={styles.primaryButtonText}>
                {t("lesson.backToLessons")}
              </Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <TouchableOpacity
          style={[
            styles.completeButton,
            submitting && styles.completeButtonDisabled,
          ]}
          activeOpacity={0.7}
          disabled={submitting}
          onPress={handlePrimaryAction}
        >
          {submitting ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <Ionicons
              name={
                hasQuiz ? "help-circle-outline" : "checkmark-circle-outline"
              }
              size={20}
              color={Colors.white}
            />
          )}
          <Text style={styles.completeButtonText}>
            {hasQuiz
              ? "Go to quiz"
              : submitting
                ? "Completing..."
                : "Mark as complete"}
          </Text>
        </TouchableOpacity>
      )}

      {/* Feedback section */}
      {completed || isAlreadyCompleted ? (
        <View style={styles.feedbackCard}>
          <View style={styles.feedbackHeader}>
            <Ionicons
              name="chatbox-ellipses-outline"
              size={18}
              color={Colors.brand}
            />
            <Text style={styles.feedbackTitle}>{t("lesson.feedback")}</Text>
          </View>
          <Text style={styles.feedbackSubtitle}>
            {t("lesson.feedbackSubtitle")}
          </Text>

          <TextInput
            style={styles.commentInput}
            multiline
            value={commentText}
            onChangeText={setCommentText}
            placeholder={t("lesson.feedbackPlaceholder")}
            placeholderTextColor="#9CA3AF"
            maxLength={2000}
          />
          <Text style={styles.charCount}>{commentText.length}/2000</Text>

          <TouchableOpacity
            style={[
              styles.postButton,
              !commentText.trim() && styles.postButtonDisabled,
            ]}
            disabled={!commentText.trim()}
            activeOpacity={0.7}
            onPress={handlePostComment}
          >
            <Text style={styles.postButtonText}>{t("lesson.postComment")}</Text>
          </TouchableOpacity>

          <View style={styles.commentsArea}>
            {comments.length === 0 ? (
              <Text style={styles.noCommentsText}>
                {t("lesson.noComments")}
              </Text>
            ) : (
              comments.map((comment) => (
                <View key={comment.id} style={styles.commentItem}>
                  <Text style={styles.commentText}>{comment.text}</Text>
                </View>
              ))
            )}
          </View>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9FAFB",
  },
  emptyText: {
    fontSize: 14,
    color: "#9CA3AF",
  },

  // Lesson title
  lessonTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 14,
    marginTop: 20,
  },

  // Objective & Description Card
  objectiveCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  objectiveRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  objectiveLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  objectiveLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.brand,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  objectiveText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 10,
    lineHeight: 21,
  },

  // Description
  description: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },

  // Duration badge
  durationBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  durationBadgeText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6B7280",
  },

  // Video card
  videoCard: {
    backgroundColor: Colors.black,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
  },
  video: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: Colors.black,
  },

  // Lesson content
  contentCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 10,
  },
  contentText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 22,
  },

  // Key takeaways
  takeawaysCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  takeawaysHeader: {
    fontSize: 16,
    fontWeight: "700",
    color: "#059669",
    marginBottom: 10,
  },
  takeawayBadge: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: "#ECFDF5",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  takeawayBadgeText: {
    flex: 1,
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  takeawayRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 8,
  },
  takeawayRowText: {
    flex: 1,
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  takeawayMutedText: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 19,
    marginBottom: 8,
  },

  // Formatted lesson content (non-beginner)
  bulletList: {
    marginBottom: 8,
    paddingLeft: 4,
  },
  bulletItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    marginBottom: 4,
  },
  bulletDot: {
    fontSize: 14,
    lineHeight: 20,
    color: "#374151",
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: "#374151",
  },
  checkItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: "#ECFDF5",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  checkItemText: {
    flex: 1,
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  headingMain: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    marginTop: 12,
    marginBottom: 6,
  },
  headingSection: {
    fontSize: 15,
    fontWeight: "700",
    color: "#059669",
    marginTop: 12,
    marginBottom: 6,
  },
  headingSub: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
    marginTop: 10,
    marginBottom: 4,
  },
  paragraph: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 21,
    marginBottom: 8,
  },

  // Complete lesson button
  completeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.brand,
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 24,
    marginBottom: 10,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.white,
  },
  completeButtonDisabled: {
    opacity: 0.7,
  },

  // Completion state
  completedCard: {
    backgroundColor: "#ECFDF5",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#A7F3D0",
    padding: 20,
    marginTop: 24,
    alignItems: "center",
  },
  completedTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#065F46",
  },
  completedTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  completedText: {
    fontSize: 13,
    color: "#065F46",
    textAlign: "center",
    lineHeight: 19,
    marginTop: 4,
    marginBottom: 16,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#059669",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignSelf: "stretch",
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.white,
  },

  // Feedback section
  feedbackCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  feedbackHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  feedbackSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 12,
  },
  commentInput: {
    minHeight: 96,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#111827",
    textAlignVertical: "top",
    backgroundColor: "#F9FAFB",
  },
  charCount: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "right",
    marginTop: 4,
    marginBottom: 12,
  },
  postButton: {
    backgroundColor: Colors.brand,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  postButtonDisabled: {
    opacity: 0.5,
  },
  postButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.white,
  },
  commentsArea: {
    marginTop: 16,
  },
  noCommentsText: {
    fontSize: 13,
    color: "#9CA3AF",
    textAlign: "center",
    paddingVertical: 16,
  },
  commentItem: {
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  commentText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
});
