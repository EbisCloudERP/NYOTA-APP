import Ionicons from "@react-native-vector-icons/ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { VideoView, useVideoPlayer } from "expo-video";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getLesson, completeLesson, type LessonDetail } from "../../services/api";
import { getUuid } from "../../services/storage";
import { Colors } from "../../theme/colors";

function LessonVideo({ url }: { url: string }) {
  const player = useVideoPlayer(url, (p) => {
    p.loop = false;
  });

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

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    getLesson(id)
      .then((res) => setLesson(res.data))
      .catch((e) =>
        Alert.alert(
          "Error",
          e instanceof Error ? e.message : "Failed to load lesson.",
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
        <Text style={styles.emptyText}>Lesson not found.</Text>
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

  const handleCompleteLesson = async () => {
    try {
      setSubmitting(true);
      const uuid = (await getUuid()) ?? "";
      await completeLesson(lesson.id, uuid);

      if (lesson.quizz?.length) {
        const courseId = lesson.course?.id;
        if (!courseId) {
          Alert.alert("Error", "Course information is missing.");
          return;
        }
        router.push({
          pathname: "/(quiz)/quiz",
          params: { courseId: String(courseId) },
        });
      } else {
        setCompleted(true);
      }
    } catch (e) {
      Alert.alert(
        "Error",
        e instanceof Error ? e.message : "Failed to complete lesson.",
      );
    } finally {
      setSubmitting(false);
    }
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
              <Text style={styles.objectiveLabel}>About this lesson</Text>
            </View>
            {lesson.duration_minutes > 0 && (
              <View style={styles.durationBadge}>
                <Ionicons name="time-outline" size={12} color="#6B7280" />
                <Text style={styles.durationBadgeText}>
                  {lesson.duration_minutes} min
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
      {videoUrl && <LessonVideo url={videoUrl} />}

      {/* Lesson content */}
      {contentText ? (
        <View style={styles.contentCard}>
          <Text style={styles.contentTitle}>Lesson Content</Text>
          <Text style={styles.contentText}>{contentText}</Text>
        </View>
      ) : null}

      {/* Complete lesson / completion state */}
      {completed || isAlreadyCompleted ? (
        <View style={styles.completedCard}>
          <Ionicons name="checkmark-circle" size={32} color="#059669" />
          <Text style={styles.completedTitle}>Lesson completed!</Text>
          <Text style={styles.completedText}>
            Great job! The next lesson is now unlocked.
          </Text>
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
                Continue to next lesson
              </Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.7}
              onPress={() => router.back()}
            >
              <Text style={styles.primaryButtonText}>Back to lessons</Text>
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
          onPress={handleCompleteLesson}
        >
          {submitting ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <Ionicons
              name="checkmark-circle-outline"
              size={20}
              color={Colors.white}
            />
          )}
          <Text style={styles.completeButtonText}>
            {submitting ? "Completing..." : "Mark as complete"}
          </Text>
        </TouchableOpacity>
      )}
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
    marginTop: 8,
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
});
