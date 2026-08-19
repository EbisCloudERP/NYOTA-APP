import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {
    getEligibilityQuestions,
    submitEligibilityAnswers,
    type EligibilityQuestion,
} from "../../services/api";
import { getUuid } from "../../services/storage";
import { Colors } from "../../theme/colors";

interface LikertMetadata {
  min?: number;
  max?: number;
  icon?: string;
  scale_labels?: Record<string, string>;
}

function LikertScale({
  question,
  selectedValue,
  onSelect,
}: {
  question: EligibilityQuestion;
  selectedValue?: string | string[];
  onSelect: (value: string) => void;
}) {
  const meta = (question.metadata ?? {}) as LikertMetadata;
  const min = meta.min ?? 1;
  const max = meta.max ?? 5;
  const labels = meta.scale_labels ?? {};

  const values: number[] = [];
  for (let v = min; v <= max; v += 1) {
    values.push(v);
  }

  return (
    <View style={styles.likertContainer}>
      <View style={styles.likertRow}>
        {values.map((value) => {
          const key = String(value);
          const isSelected = key === selectedValue;
          return (
            <TouchableOpacity
              key={key}
              style={styles.likertPoint}
              activeOpacity={0.7}
              onPress={() => onSelect(key)}
            >
              <View
                style={[
                  styles.likertCircle,
                  isSelected && styles.likertCircleSelected,
                ]}
              >
                <Text
                  style={[
                    styles.likertNumber,
                    isSelected && styles.likertNumberSelected,
                  ]}
                >
                  {value}
                </Text>
              </View>
              <Text
                style={[
                  styles.likertValueLabel,
                  isSelected && styles.likertValueLabelSelected,
                ]}
              >
                {labels[key] ?? ""}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function KycScreen() {
  const [questions, setQuestions] = useState<EligibilityQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const { uuid: paramUuid } = useLocalSearchParams<{ uuid: string }>();
  const [uuid, setUuid] = useState<string>(paramUuid ?? "");

  useEffect(() => {
    if (uuid) return;
    getUuid().then((stored) => {
      if (stored) setUuid(stored);
    });
  }, [uuid]);

  useEffect(() => {
    getEligibilityQuestions()
      .then((res) => setQuestions(Array.isArray(res.data) ? res.data : []))
      .catch(() => Alert.alert("Error", "Failed to load questions. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = (questionKey: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionKey]: value }));
    if (currentStep < questions.length - 1) {
      setTimeout(() => setCurrentStep((prev) => prev + 1), 300);
    }
  };

  const allAnswered = questions.every((q) => answers[q.key] !== undefined);

  const handleSubmit = async () => {
    if (!uuid) {
      Alert.alert("Error", "Missing user UUID. Please log in again.");
      return;
    }

    setSubmitting(true);
    try {
      await submitEligibilityAnswers(uuid, answers);

      router.replace({
        pathname: "/results",
        params: { uuid },
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Submission failed. Please try again.";
      Alert.alert("Error", message);
    } finally {
      setSubmitting(false);
    }
  };

  const sorted = useMemo(
    () => [...questions].sort((a, b) => a.order - b.order),
    [questions]
  );

  return (
    <View style={styles.container}>
      {/* Progress Header */}
      <View style={styles.progressHeader}>
        <View style={styles.progressRow}>
          <Text style={styles.progressLabel}>
            Question {currentStep + 1} of {sorted.length}
          </Text>
          <Text style={styles.progressPercent}>
            {Math.round(((currentStep + 1) / sorted.length) * 100)}%
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${((currentStep + 1) / sorted.length) * 100}%` },
            ]}
          />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Eligibility & Context</Text>
        <Text style={styles.subtitle}>
          Help us match you with the right opportunities
        </Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.brand} />
            <Text style={styles.loadingText}>Loading questions...</Text>
          </View>
        ) : (
          <View style={styles.questionsContainer}>
            {sorted.map((q, idx) => {
              if (idx > currentStep) return null;
              const isAnswered = answers[q.key] !== undefined;

              return (
                <View key={q.id} style={styles.questionCard}>
                  <View style={styles.questionHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.questionLabel}>
                        {q.question}
                        {q.is_required && <Text style={styles.required}> *</Text>}
                      </Text>
                      {q.description ? (
                        <Text style={styles.questionDesc}>{q.description}</Text>
                      ) : null}
                  </View>
                  {isAnswered && <Text style={styles.checkmark}>✓</Text>}
                </View>
                {q.type?.toLowerCase() === "likert_scale" ? (
                  <LikertScale
                    question={q}
                    selectedValue={answers[q.key]}
                    onSelect={(value) => handleSelect(q.key, value)}
                  />
                ) : (
                  <View style={styles.optionsList}>
                    {(q.q_options ?? []).map((option) => {
                      const selected = answers[q.key] === option.value;
                      return (
                        <TouchableOpacity
                          key={option.id}
                          style={[styles.option, selected && styles.optionSelected]}
                          onPress={() => handleSelect(q.key, option.value)}
                        >
                          <View style={styles.radio}>
                            {selected && <View style={styles.radioFill} />}
                          </View>
                          <Text
                            style={[styles.optionText, selected && styles.optionTextSelected]}
                          >
                            {option.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Fixed Bottom */}
      <View style={styles.bottomFixed}>
        <TouchableOpacity
          style={[styles.submitButton, !allAnswered && styles.submitButtonDisabled]}
          disabled={!allAnswered || submitting}
          onPress={handleSubmit}
        >
          {submitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>Submit</Text>
          )}
        </TouchableOpacity>
        <Text style={styles.footer}>
          You can update your profile anytime from the dashboard
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  progressHeader: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressLabel: { fontSize: 13, fontWeight: "600", color: "#6B7280" },
  progressPercent: { fontSize: 13, fontWeight: "600", color: Colors.brand },
  progressBar: { height: 4, backgroundColor: "#E5E7EB", borderRadius: 2, overflow: "hidden" },
  progressFill: { height: "100%", backgroundColor: Colors.brand, borderRadius: 2 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 20 },
  title: { fontSize: 22, fontWeight: "700", color: "#1F2937", marginBottom: 6 },
  subtitle: {
    fontSize: 15, color: "#6B7280", marginBottom: 24, lineHeight: 21,
  },
  loadingContainer: { alignItems: "center", paddingVertical: 60 },
  loadingText: { marginTop: 14, fontSize: 14, color: "#9CA3AF" },
  questionsContainer: { marginTop: 8 },
  questionCard: { marginBottom: 16 },
  questionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  questionLabel: { flex: 1, fontSize: 15, fontWeight: "600", color: "#1F2937", marginBottom: 4, lineHeight: 21 },
  questionDesc: { fontSize: 13, color: "#6B7280", marginBottom: 10, lineHeight: 18 },
  checkmark: { fontSize: 16, color: "#10B981", fontWeight: "700", marginLeft: 8 },
  required: { color: "#EF4444" },
  optionsList: { marginTop: 8 },
  option: {
    flexDirection: "row", alignItems: "center", paddingVertical: 12, paddingHorizontal: 14,
    borderRadius: 10, borderWidth: 1, borderColor: "#E5E7EB", backgroundColor: "#F9FAFB",
    marginBottom: 8,
  },
  optionSelected: { borderColor: Colors.brand, backgroundColor: "#F5F3FF" },
  radio: {
    width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: "#D1D5DB",
    alignItems: "center", justifyContent: "center", marginRight: 12,
  },
  radioFill: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.brand },
  optionText: { flex: 1, fontSize: 14, color: "#374151", lineHeight: 20 },
  optionTextSelected: { fontWeight: "500", color: Colors.brand },
  likertContainer: { marginTop: 8, marginBottom: 4 },
  likertRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  likertPoint: { flex: 1, alignItems: "center", paddingHorizontal: 4 },
  likertCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
  },
  likertCircleSelected: { borderColor: Colors.brand, backgroundColor: Colors.brand },
  likertNumber: { fontSize: 16, fontWeight: "600", color: "#374151" },
  likertNumberSelected: { color: "#FFFFFF" },
  likertValueLabel: {
    marginTop: 6,
    fontSize: 10,
    color: "#6B7280",
    lineHeight: 13,
    textAlign: "center",
  },
  likertValueLabelSelected: { color: Colors.brand, fontWeight: "600" },
  submitButton: {
    width: "100%", height: 50, backgroundColor: Colors.brand, borderRadius: 12,
    alignItems: "center", justifyContent: "center", marginBottom: 12,
  },
  submitButtonDisabled: { opacity: 0.4 },
  submitButtonText: { fontSize: 16, fontWeight: "600", color: "#FFFFFF" },
  bottomFixed: {
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40,
    borderTopWidth: 1, borderTopColor: "#F3F4F6", backgroundColor: "#FFFFFF",
  },
  footer: { fontSize: 12, color: "#9CA3AF", textAlign: "center" },
});
