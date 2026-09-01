import Ionicons from "@react-native-vector-icons/ionicons";
import { router, useLocalSearchParams } from "expo-router";
import * as ScreenCapture from "expo-screen-capture";
import { useCallback, useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    AppState,
    BackHandler,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {
    getExams,
    startExamAttempt,
    submitExam,
    type ExamSubmissionResult,
} from "../../services/api";
import { useFeedback } from "../../services/FeedbackContext";
import { useLanguage } from "../../services/LanguageContext";
import { getUuid } from "../../services/storage";
import { Colors } from "../../theme/colors";

// ── Types ──────────────────────────────────────────────
type Phase = "intro" | "active" | "results";

interface Option {
  id: number;
  text: string;
}

interface Question {
  id: number;
  text: string;
  options: Option[];
}

// ── Helpers ────────────────────────────────────────────
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

// ── Component ──────────────────────────────────────────
export default function QuizScreen() {
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const [examId, setExamId] = useState(0);
  const [examTitle, setExamTitle] = useState("");
  const [passMark, setPassMark] = useState(0);
  const [timeLimitSeconds, setTimeLimitSeconds] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  const [phase, setPhase] = useState<Phase>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, number>
  >({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [backgroundCount, setBackgroundCount] = useState(0);
  const [result, setResult] = useState<ExamSubmissionResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [starting, setStarting] = useState(false);
  const { showToast } = useFeedback();
  const { t } = useLanguage();

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const appStateRef = useRef(AppState.currentState);

  const hasTimeLimit = timeLimitSeconds > 0;

  // ── Fetch exam ──────────────────────────────────────
  useEffect(() => {
    if (!courseId) {
      setLoading(false);
      return;
    }

    getUuid()
      .then((uuid) => getExams(uuid ?? "", courseId))
      .then((res) => {
        const exam = res.data;
        setExamId(exam.id);
        setExamTitle(exam.title);
        setPassMark(exam.pass_mark);
        setTimeLimitSeconds((exam.time_limit_minutes ?? 0) * 60);
        setQuestions(
          (exam.questions ?? []).map((q) => ({
            id: q.id,
            text: q.question,
            options: q.options.map((o) => ({ id: o.id, text: o.option_text })),
          })),
        );
      })
      .catch((e) =>
        showToast(
          e instanceof Error ? e.message : t("quiz.failedLoad"),
          "error",
        ),
      )
      .finally(() => setLoading(false));
  }, [courseId]);

  // ── Timer ──────────────────────────────────────────
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    if (!hasTimeLimit) return;
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearTimer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [clearTimer, hasTimeLimit]);

  // Auto-submit when time runs out
  useEffect(() => {
    if (phase === "active" && hasTimeLimit && timeRemaining === 0) {
      handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRemaining, phase, hasTimeLimit]);

  // ── Security: back button, app state, screen capture ─
  useEffect(() => {
    if (phase !== "active") return;

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true,
    );

    const appStateSub = AppState.addEventListener("change", (nextState) => {
      if (
        appStateRef.current === "active" &&
        nextState.match(/inactive|background/)
      ) {
        setBackgroundCount((c) => c + 1);
      }
      appStateRef.current = nextState;
    });

    ScreenCapture.preventScreenCaptureAsync().catch(() => {});

    return () => {
      backHandler.remove();
      appStateSub.remove();
      ScreenCapture.allowScreenCaptureAsync().catch(() => {});
      clearTimer();
    };
  }, [phase, clearTimer]);

  // ── Actions ─────────────────────────────────────────
  const handleStart = async () => {
    try {
      setStarting(true);
      const uuid = (await getUuid()) ?? "";
      await startExamAttempt(uuid, examId);
      setSelectedAnswers({});
      setCurrentIndex(0);
      setTimeRemaining(timeLimitSeconds);
      setBackgroundCount(0);
      setPhase("active");
      startTimer();
    } catch (e) {
      showToast(
        e instanceof Error ? e.message : t("quiz.failedStart"),
        "error",
      );
    } finally {
      setStarting(false);
    }
  };

  const handleSelectOption = (questionId: number, optionId: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handleSubmit = async () => {
    clearTimer();
    try {
      setSubmitting(true);
      const uuid = (await getUuid()) ?? "";
      const res = await submitExam(uuid, examId, selectedAnswers);
      setResult(res.data);
      setPhase("results");
    } catch (e) {
      showToast(
        e instanceof Error ? e.message : t("quiz.failedSubmit"),
        "error",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetake = () => {
    handleStart();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.brand} />
      </View>
    );
  }

  // ── Render: Intro ───────────────────────────────────
  if (phase === "intro") {
    return (
      <View style={styles.container}>
        <Text style={styles.quizTitle}>{examTitle}</Text>
        <Text style={styles.passText}>
          {t("quiz.needToPass", { mark: `${passMark}%` })}
        </Text>

        <View style={styles.instructionsCard}>
          <View style={styles.instructionsHeader}>
            <Ionicons
              name="information-circle"
              size={22}
              color={Colors.brand}
            />
            <Text style={styles.instructionsTitle}>
              {t("quiz.instructions")}
            </Text>
          </View>
          {hasTimeLimit && (
            <View style={styles.instructionItem}>
              <Ionicons name="time-outline" size={16} color="#6B7280" />
              <Text style={styles.instructionText}>
                {t("quiz.timeLimit")}{" "}
                <Text style={styles.instructionBold}>
                  {timeLimitSeconds / 60} {t("quiz.minutes")}
                </Text>
              </Text>
            </View>
          )}
          <View style={styles.instructionItem}>
            <Ionicons name="help-circle-outline" size={16} color="#6B7280" />
            <Text style={styles.instructionText}>
              {t("quiz.questions")}{" "}
              <Text style={styles.instructionBold}>
                {questions.length} {t("quiz.multipleChoice")}
              </Text>
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Ionicons
              name="checkmark-circle-outline"
              size={16}
              color="#6B7280"
            />
            <Text style={styles.instructionText}>
              {t("quiz.passMark")}{" "}
              <Text style={styles.instructionBold}>{passMark}%</Text>
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Ionicons name="warning-outline" size={16} color="#6B7280" />
            <Text style={styles.instructionText}>{t("quiz.warning")}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.startButton, starting && styles.startButtonDisabled]}
          activeOpacity={0.7}
          disabled={starting}
          onPress={handleStart}
        >
          {starting ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <Ionicons name="play-circle" size={20} color={Colors.white} />
          )}
          <Text style={styles.startButtonText}>
            {starting ? t("quiz.starting") : t("quiz.startNow")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={18} color={Colors.brand} />
          <Text style={styles.backButtonText}>{t("quiz.backToLesson")}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Render: Active ──────────────────────────────────
  if (phase === "active") {
    const question = questions[currentIndex];
    const isLast = currentIndex === questions.length - 1;
    const selectedId = selectedAnswers[question.id];
    const isTimeLow = hasTimeLimit && timeRemaining <= 60;

    return (
      <View style={styles.container}>
        {/* Timer */}
        {hasTimeLimit && (
          <View style={[styles.timerBox, isTimeLow && styles.timerBoxWarning]}>
            <Ionicons
              name="time"
              size={24}
              color={isTimeLow ? "#DC2626" : Colors.brand}
            />
            <Text
              style={[styles.timerText, isTimeLow && styles.timerTextWarning]}
            >
              {formatTime(timeRemaining)}
            </Text>
          </View>
        )}

        {/* Question progress */}
        <Text style={styles.questionProgress}>
          {t("quiz.question", {
            current: currentIndex + 1,
            total: questions.length,
          })}
        </Text>

        {/* Question */}
        <Text style={styles.questionText}>{question.text}</Text>

        {/* Options */}
        {question.options.map((option) => {
          const isSelected = selectedId === option.id;
          return (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionButton,
                isSelected && styles.optionButtonSelected,
              ]}
              activeOpacity={0.7}
              onPress={() => handleSelectOption(question.id, option.id)}
            >
              <View style={[styles.radio, isSelected && styles.radioSelected]}>
                {isSelected && <View style={styles.radioInner} />}
              </View>
              <Text
                style={[
                  styles.optionText,
                  isSelected && styles.optionTextSelected,
                ]}
              >
                {option.text}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* Next / Submit */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            (selectedId === undefined || submitting) &&
              styles.submitButtonDisabled,
          ]}
          activeOpacity={0.7}
          disabled={selectedId === undefined || submitting}
          onPress={isLast ? handleSubmit : handleNext}
        >
          {isLast && submitting ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <Ionicons
              name={isLast ? "checkmark-circle" : "arrow-forward-circle"}
              size={20}
              color={selectedId !== undefined ? Colors.white : "#9CA3AF"}
            />
          )}
          <Text
            style={[
              styles.submitButtonText,
              (selectedId === undefined || submitting) &&
                styles.submitButtonTextDisabled,
            ]}
          >
            {isLast
              ? submitting
                ? t("quiz.submitting")
                : t("quiz.submitExam")
              : t("quiz.nextQuestion")}
          </Text>
        </TouchableOpacity>

        {/* Suspicion warning */}
        {backgroundCount > 0 && (
          <View style={styles.warningBanner}>
            <Ionicons name="warning" size={14} color="#D97706" />
            <Text style={styles.warningText}>
              {t("quiz.flagged", { count: backgroundCount })}
            </Text>
          </View>
        )}
      </View>
    );
  }

  // ── Render: Results ─────────────────────────────────
  if (!result) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.brand} />
      </View>
    );
  }

  const passed = result.passed;
  const scoreDisplay = `${Number.parseFloat(result.percentage)}%`;
  const correctCount = result.answers.filter((a) => a.is_correct).length;
  const hasNextAttempt = !passed && result.next_attempt_at;

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Score */}
      <View style={styles.scoreCircle}>
        <Text
          style={[
            styles.scorePercent,
            { color: passed ? "#059669" : "#DC2626" },
          ]}
        >
          {scoreDisplay}
        </Text>
        <Text style={styles.scoreLabel}>{t("quiz.finalScore")}</Text>
      </View>

      {/* Pass / fail message */}
      <View
        style={[
          styles.passFailBanner,
          passed ? styles.passBanner : styles.failBanner,
        ]}
      >
        <Ionicons
          name={passed ? "checkmark-circle" : "close-circle"}
          size={22}
          color={passed ? "#059669" : "#DC2626"}
        />
        <Text
          style={[
            styles.passFailText,
            { color: passed ? "#065F46" : "#991B1B" },
          ]}
        >
          {passed
            ? t("quiz.passed", { score: scoreDisplay })
            : t("quiz.failed", { score: scoreDisplay, mark: passMark })}
        </Text>
      </View>

      {/* Results card */}
      <View style={styles.resultsCard}>
        <Text style={styles.resultsCardTitle}>{examTitle}</Text>

        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>{t("quiz.status")}</Text>
          <View
            style={[
              styles.statusBadge,
              passed ? styles.statusPass : styles.statusFail,
            ]}
          >
            <Ionicons
              name={passed ? "checkmark-circle" : "close-circle"}
              size={14}
              color={passed ? "#059669" : "#DC2626"}
            />
            <Text
              style={[
                styles.statusBadgeText,
                { color: passed ? "#059669" : "#DC2626" },
              ]}
            >
              {passed ? t("quiz.passedLabel") : t("quiz.failedLabel")}
            </Text>
          </View>
        </View>

        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>{t("quiz.attempt")}</Text>
          <Text style={styles.resultValue}>{result.attempt_number}</Text>
        </View>

        {result.completed_at && (
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>{t("quiz.completedAt")}</Text>
            <Text style={styles.resultValue}>
              {formatDateTime(result.completed_at)}
            </Text>
          </View>
        )}

        {hasNextAttempt && (
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>{t("quiz.nextAttempt")}</Text>
            <Text style={styles.resultValue}>
              {formatDateTime(result.next_attempt_at!)}
            </Text>
          </View>
        )}

        {/* Performance summary */}
        <View style={styles.performanceSection}>
          <View style={styles.performanceHeader}>
            <Ionicons name="stats-chart" size={18} color={Colors.brand} />
            <Text style={styles.performanceTitle}>{t("quiz.performance")}</Text>
          </View>

          <View style={styles.performanceRow}>
            <Ionicons name="trophy-outline" size={16} color="#6B7280" />
            <Text style={styles.performanceLabel}>{t("quiz.score")}</Text>
            <Text style={styles.performanceValue}>
              {t("quiz.points", {
                score: result.score,
                total: result.total_points,
              })}
            </Text>
          </View>

          <View style={styles.performanceRow}>
            <Ionicons name="checkmark-done" size={16} color="#6B7280" />
            <Text style={styles.performanceLabel}>
              {t("quiz.correctAnswers")}
            </Text>
            <Text style={styles.performanceValue}>{correctCount}</Text>
          </View>
        </View>
      </View>

      {/* Buttons */}
      {!passed && (
        <TouchableOpacity
          style={styles.retakeButton}
          activeOpacity={0.7}
          onPress={handleRetake}
        >
          <Ionicons name="refresh" size={18} color={Colors.white} />
          <Text style={styles.retakeButtonText}>{t("quiz.retake")}</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.backToLessonsButton}
        activeOpacity={0.7}
        onPress={() => router.back()}
      >
        <Ionicons name="book-outline" size={18} color={Colors.brand} />
        <Text style={styles.backToLessonsText}>
          {t("lesson.backToLessons")}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ── Styles ─────────────────────────────────────────────
const styles = StyleSheet.create({
  // Shared
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9FAFB",
  },

  // ── Intro ───────────────────────────────────────────
  quizTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },
  passText: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 20,
  },
  passHighlight: {
    fontWeight: "700",
    color: Colors.brand,
  },

  // Instructions card
  instructionsCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  instructionsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  instructionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 13,
    color: "#4B5563",
    flex: 1,
    lineHeight: 18,
  },
  instructionBold: {
    fontWeight: "600",
    color: "#111827",
  },

  // Start / Back buttons
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.brand,
    borderRadius: 10,
    paddingVertical: 14,
    marginBottom: 12,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.white,
  },
  startButtonDisabled: {
    opacity: 0.7,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.brand,
  },

  // ── Active ──────────────────────────────────────────
  timerBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  timerBoxWarning: {
    borderColor: "#FECACA",
    backgroundColor: "#FEF2F2",
  },
  timerText: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.brand,
    fontVariant: ["tabular-nums"],
  },
  timerTextWarning: {
    color: "#DC2626",
  },
  questionProgress: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 10,
  },
  questionText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#111827",
    lineHeight: 24,
    marginBottom: 20,
  },

  // Options
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
  },
  optionButtonSelected: {
    borderColor: Colors.brand,
    backgroundColor: "#F5F3FF",
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    borderColor: Colors.brand,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.brand,
  },
  optionText: {
    fontSize: 15,
    color: "#374151",
    flex: 1,
  },
  optionTextSelected: {
    color: Colors.brand,
    fontWeight: "500",
  },

  // Submit / Next
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.brand,
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 10,
  },
  submitButtonDisabled: {
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.white,
  },
  submitButtonTextDisabled: {
    color: "#9CA3AF",
  },

  // Warning banner
  warningBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFFBEB",
    borderRadius: 8,
    padding: 10,
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  warningText: {
    flex: 1,
    fontSize: 12,
    color: "#92400E",
    lineHeight: 16,
  },

  // ── Results ─────────────────────────────────────────
  scoreCircle: {
    alignItems: "center",
    marginBottom: 16,
    marginTop: 12,
  },
  scorePercent: {
    fontSize: 48,
    fontWeight: "800",
  },
  scoreLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  passFailBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 10,
    padding: 14,
    marginBottom: 20,
  },
  passBanner: {
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  failBanner: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  passFailText: {
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
    lineHeight: 20,
  },
  resultsCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  resultsCardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 14,
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  resultLabel: {
    fontSize: 13,
    color: "#6B7280",
  },
  resultValue: {
    fontSize: 13,
    fontWeight: "500",
    color: "#111827",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusPass: {
    backgroundColor: "#ECFDF5",
  },
  statusFail: {
    backgroundColor: "#FEF2F2",
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  performanceSection: {
    marginTop: 6,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 14,
  },
  performanceHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  performanceTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.brand,
  },
  performanceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  performanceLabel: {
    fontSize: 13,
    color: "#6B7280",
    flex: 1,
  },
  performanceValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
  },
  retakeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.brand,
    borderRadius: 10,
    paddingVertical: 14,
    marginBottom: 12,
  },
  retakeButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.white,
  },
  backToLessonsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
  },
  backToLessonsText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.brand,
  },
});
