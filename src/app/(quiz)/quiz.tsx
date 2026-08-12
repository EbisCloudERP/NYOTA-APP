import Ionicons from "@react-native-vector-icons/ionicons";
import { router } from "expo-router";
import * as ScreenCapture from "expo-screen-capture";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AppState,
  BackHandler,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../theme/colors";

// ── Types ──────────────────────────────────────────────
type Phase = "intro" | "active" | "results";

interface Option {
  id: string;
  text: string;
}

interface Question {
  id: number;
  text: string;
  options: Option[];
  correctOptionId: string;
}

interface QuizResult {
  score: number;
  total: number;
  correctCount: number;
  passed: boolean;
  completedAt: Date;
  nextAttemptAt: Date;
}

// ── Dummy data ─────────────────────────────────────────
const QUIZ_TITLE = "Financial Planning Basics";
const PASS_PERCENTAGE = 50;
const TIME_LIMIT_SECONDS = 300; // 5 minutes
const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "What does the 'S' in SMART goals stand for?",
    options: [
      { id: "1a", text: "Strategic" },
      { id: "1b", text: "Specific" },
      { id: "1c", text: "Simple" },
      { id: "1d", text: "Sustainable" },
    ],
    correctOptionId: "1b",
  },
  {
    id: 2,
    text: "According to the 50/30/20 rule, what percentage of income should go to savings and debt?",
    options: [
      { id: "2a", text: "10%" },
      { id: "2b", text: "30%" },
      { id: "2c", text: "20%" },
      { id: "2d", text: "50%" },
    ],
    correctOptionId: "2c",
  },
  {
    id: 3,
    text: "How many months of living expenses should an emergency fund cover?",
    options: [
      { id: "3a", text: "1–2 months" },
      { id: "3b", text: "3–6 months" },
      { id: "3c", text: "12 months" },
      { id: "3d", text: "1 month" },
    ],
    correctOptionId: "3b",
  },
  {
    id: 4,
    text: "What is the primary purpose of insurance in financial planning?",
    options: [
      { id: "4a", text: "To generate investment returns" },
      { id: "4b", text: "To replace a budget" },
      { id: "4c", text: "To protect against financial loss" },
      { id: "4d", text: "To avoid paying taxes" },
    ],
    correctOptionId: "4c",
  },
];

// ── Helpers ────────────────────────────────────────────
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function formatDateTime(date: Date): string {
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function addHours(date: Date, hours: number): Date {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

// ── Component ──────────────────────────────────────────
export default function QuizScreen() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});
  const [timeRemaining, setTimeRemaining] = useState(TIME_LIMIT_SECONDS);
  const [backgroundCount, setBackgroundCount] = useState(0);
  const [attemptNumber, setAttemptNumber] = useState(1);
  const [result, setResult] = useState<QuizResult | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<Date>(new Date());
  const appStateRef = useRef(AppState.currentState);

  // ── Timer ──────────────────────────────────────────
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearTimer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [clearTimer]);

  // Auto-submit when time runs out
  useEffect(() => {
    if (phase === "active" && timeRemaining === 0) {
      handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRemaining, phase]);

  // ── Security: back button, app state, screen capture ─
  useEffect(() => {
    if (phase !== "active") return;

    // Block hardware back
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true,
    );

    // Detect app backgrounding
    const appStateSub = AppState.addEventListener("change", (nextState) => {
      if (
        appStateRef.current === "active" &&
        nextState.match(/inactive|background/)
      ) {
        setBackgroundCount((c) => c + 1);
      }
      appStateRef.current = nextState;
    });

    // Prevent screenshots
    ScreenCapture.preventScreenCaptureAsync().catch(() => {});

    return () => {
      backHandler.remove();
      appStateSub.remove();
      ScreenCapture.allowScreenCaptureAsync().catch(() => {});
      clearTimer();
    };
  }, [phase, clearTimer]);

  // ── Actions ─────────────────────────────────────────
  const handleStart = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setTimeRemaining(TIME_LIMIT_SECONDS);
    setBackgroundCount(0);
    startTimeRef.current = new Date();
    setPhase("active");
    startTimer();
  };

  const handleSelectOption = (questionId: number, optionId: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleNext = () => {
    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handleSubmit = () => {
    clearTimer();
    const completedAt = new Date();
    let correctCount = 0;
    QUESTIONS.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctOptionId) correctCount++;
    });
    const score = Math.round((correctCount / QUESTIONS.length) * 100);
    const passed = score >= PASS_PERCENTAGE;
    const nextAttemptAt = passed ? completedAt : addHours(completedAt, 24);

    setResult({
      score,
      total: QUESTIONS.length,
      correctCount,
      passed,
      completedAt,
      nextAttemptAt,
    });
    setPhase("results");
  };

  const handleRetake = () => {
    setAttemptNumber((a) => a + 1);
    handleStart();
  };

  // ── Render: Intro ───────────────────────────────────
  if (phase === "intro") {
    return (
      <View style={styles.container}>
        <Text style={styles.quizTitle}>{QUIZ_TITLE}</Text>
        <Text style={styles.passText}>
          You need <Text style={styles.passHighlight}>{PASS_PERCENTAGE}%</Text>{" "}
          to pass
        </Text>

        <View style={styles.instructionsCard}>
          <View style={styles.instructionsHeader}>
            <Ionicons
              name="information-circle"
              size={22}
              color={Colors.brand}
            />
            <Text style={styles.instructionsTitle}>Exam Instructions</Text>
          </View>
          <View style={styles.instructionItem}>
            <Ionicons name="time-outline" size={16} color="#6B7280" />
            <Text style={styles.instructionText}>
              Time limit: <Text style={styles.instructionBold}>5 minutes</Text>
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Ionicons name="help-circle-outline" size={16} color="#6B7280" />
            <Text style={styles.instructionText}>
              Questions:{" "}
              <Text style={styles.instructionBold}>
                {QUESTIONS.length} multiple choice
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
              Pass mark:{" "}
              <Text style={styles.instructionBold}>{PASS_PERCENTAGE}%</Text>
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Ionicons name="warning-outline" size={16} color="#6B7280" />
            <Text style={styles.instructionText}>
              Do not leave the screen or switch apps during the quiz
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Ionicons name="refresh-outline" size={16} color="#6B7280" />
            <Text style={styles.instructionText}>
              You can retake the quiz after 24 hours if you fail
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.startButton}
          activeOpacity={0.7}
          onPress={handleStart}
        >
          <Ionicons name="play-circle" size={20} color={Colors.white} />
          <Text style={styles.startButtonText}>Start now</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={18} color={Colors.brand} />
          <Text style={styles.backButtonText}>Back to lesson</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Render: Active ──────────────────────────────────
  if (phase === "active") {
    const question = QUESTIONS[currentIndex];
    const isLast = currentIndex === QUESTIONS.length - 1;
    const selectedId = selectedAnswers[question.id];
    const isTimeLow = timeRemaining <= 60;

    return (
      <View style={styles.container}>
        {/* Timer */}
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

        {/* Question progress */}
        <Text style={styles.questionProgress}>
          Question {currentIndex + 1} of {QUESTIONS.length}
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
            !selectedId && styles.submitButtonDisabled,
          ]}
          activeOpacity={0.7}
          disabled={!selectedId}
          onPress={isLast ? handleSubmit : handleNext}
        >
          <Ionicons
            name={isLast ? "checkmark-circle" : "arrow-forward-circle"}
            size={20}
            color={selectedId ? Colors.white : "#9CA3AF"}
          />
          <Text
            style={[
              styles.submitButtonText,
              !selectedId && styles.submitButtonTextDisabled,
            ]}
          >
            {isLast ? "Submit quiz" : "Next question"}
          </Text>
        </TouchableOpacity>

        {/* Suspicion warning */}
        {backgroundCount > 0 && (
          <View style={styles.warningBanner}>
            <Ionicons name="warning" size={14} color="#D97706" />
            <Text style={styles.warningText}>
              Switching apps during the quiz has been flagged ({backgroundCount}
              ×). This may affect your result.
            </Text>
          </View>
        )}
      </View>
    );
  }

  // ── Render: Results ─────────────────────────────────
  if (phase === "results" && result) {
    const passed = result.passed;
    const scorePercent = result.score;

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
            {scorePercent}%
          </Text>
          <Text style={styles.scoreLabel}>Final score</Text>
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
              ? `Congratulations! You passed with ${scorePercent}%`
              : `You scored ${scorePercent}%. The pass mark is ${PASS_PERCENTAGE}%.`}
          </Text>
        </View>

        {/* Results card */}
        <View style={styles.resultsCard}>
          <Text style={styles.resultsCardTitle}>{QUIZ_TITLE}</Text>

          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Status</Text>
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
                {passed ? "Passed" : "Failed"}
              </Text>
            </View>
          </View>

          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Completed at</Text>
            <Text style={styles.resultValue}>
              {formatDateTime(result.completedAt)}
            </Text>
          </View>

          {!passed && (
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Next attempt</Text>
              <Text style={styles.resultValue}>
                {formatDateTime(result.nextAttemptAt)}
              </Text>
            </View>
          )}

          {/* Performance summary */}
          <View style={styles.performanceSection}>
            <View style={styles.performanceHeader}>
              <Ionicons name="stats-chart" size={18} color={Colors.brand} />
              <Text style={styles.performanceTitle}>Performance summary</Text>
            </View>

            <View style={styles.performanceRow}>
              <Ionicons name="trophy-outline" size={16} color="#6B7280" />
              <Text style={styles.performanceLabel}>Score</Text>
              <Text style={styles.performanceValue}>
                {result.correctCount}/{result.total} points
              </Text>
              <Text style={styles.attemptBadge}>Attempt {attemptNumber}</Text>
            </View>

            <View style={styles.performanceRow}>
              <Ionicons name="checkmark-done" size={16} color="#6B7280" />
              <Text style={styles.performanceLabel}>Correct answers</Text>
              <Text style={styles.performanceValue}>{result.correctCount}</Text>
            </View>
          </View>
        </View>

        {/* Buttons */}
        <TouchableOpacity
          style={styles.retakeButton}
          activeOpacity={0.7}
          onPress={handleRetake}
        >
          <Ionicons name="refresh" size={18} color={Colors.white} />
          <Text style={styles.retakeButtonText}>Retake exam</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backToLessonsButton}
          activeOpacity={0.7}
          onPress={() => router.back()}
        >
          <Ionicons name="book-outline" size={18} color={Colors.brand} />
          <Text style={styles.backToLessonsText}>Back to lessons</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return null;
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

  // Pass/fail banner
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

  // Results card
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

  // Performance summary
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
  attemptBadge: {
    fontSize: 11,
    fontWeight: "500",
    color: "#6B7280",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: "hidden",
  },

  // Retake / Back
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
