import { router, Stack } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Colors } from "../../theme/colors";

interface Question {
  id: number;
  label: string;
  options: string[];
}

const questions: Question[] = [
  {
    id: 1,
    label: "What is your primary interest in this programme?",
    options: [
      "I want to learn about AGPO and government procurement",
      "I want to access tenders and business opportunities",
      "I want training and capacity building for my enterprise",
      "I want to network with other youth entrepreneurs",
    ],
  },
  {
    id: 2,
    label: "Which group best describes you or your enterprise?",
    options: [
      "Youth-owned enterprise",
      "Women-owned enterprise",
      "Persons with disability-owned enterprise",
      "General SME / Startup",
    ],
  },
  {
    id: 3,
    label: "What is your current AGPO status?",
    options: [
      "Registered with AGPO",
      "In the process of registering",
      "Not registered yet",
      "I don't know what AGPO is",
    ],
  },
  {
    id: 4,
    label: "What is your gender?",
    options: ["Male", "Female", "Non-binary", "Prefer not to say"],
  },
];

export default function KycScreen() {
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleSelect = (questionId: number, option: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
    if (currentStep < questions.length - 1) {
      setTimeout(() => setCurrentStep((prev) => prev + 1), 300);
    }
  };

  const allAnswered = questions.every((q) => answers[q.id]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Onboarding" }} />

      {/* Progress Header */}
      <View style={styles.progressHeader}>
        <View style={styles.progressRow}>
          <Text style={styles.progressLabel}>
            Questions {currentStep + 1} of {questions.length}
          </Text>
          <Text style={styles.progressPercent}>
            {Math.round(((currentStep + 1) / questions.length) * 100)}%
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${((currentStep + 1) / questions.length) * 100}%`,
              },
            ]}
          />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Title */}
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
            {questions.map((q, idx) => {
              const isVisible = idx <= currentStep;
              if (!isVisible) return null;

              const isAnswered = !!answers[q.id];

              return (
                <View key={q.id} style={styles.questionCard}>
                  <View style={styles.questionHeader}>
                    <Text style={styles.questionLabel}>
                      {q.label} <Text style={styles.required}>*</Text>
                    </Text>
                    {isAnswered && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <View style={styles.optionsList}>
                    {q.options.map((option) => {
                      const selected = answers[q.id] === option;
                      return (
                        <TouchableOpacity
                          key={option}
                          style={[
                            styles.option,
                            selected && styles.optionSelected,
                          ]}
                          onPress={() => handleSelect(q.id, option)}
                        >
                          <View style={styles.radio}>
                            {selected && <View style={styles.radioFill} />}
                          </View>
                          <Text
                            style={[
                              styles.optionText,
                              selected && styles.optionTextSelected,
                            ]}
                          >
                            {option}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Fixed Bottom */}
      <View style={styles.bottomFixed}>
        <TouchableOpacity
          style={[styles.nextButton, !allAnswered && styles.nextButtonDisabled]}
          disabled={!allAnswered}
          onPress={() => router.push("/results")}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
        <Text style={styles.footer}>
          You can update your profile anytime from the dashboard
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
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
  progressLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
  },
  progressPercent: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.brand,
  },
  progressBar: {
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.brand,
    borderRadius: 2,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    marginBottom: 24,
    lineHeight: 21,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 14,
    fontSize: 14,
    color: "#9CA3AF",
  },
  questionsContainer: {
    gap: 16,
  },
  questionCard: {},
  questionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  questionLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 12,
    lineHeight: 21,
  },
  checkmark: {
    fontSize: 16,
    color: "#10B981",
    fontWeight: "700",
    marginLeft: 8,
  },
  required: {
    color: "#EF4444",
  },
  optionsList: {
    gap: 8,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
  },
  optionSelected: {
    borderColor: Colors.brand,
    backgroundColor: "#F5F3FF",
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  radioFill: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.brand,
  },
  optionText: {
    flex: 1,
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  optionTextSelected: {
    fontWeight: "500",
    color: Colors.brand,
  },
  nextButton: {
    width: "100%",
    height: 50,
    backgroundColor: Colors.brand,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  nextButtonDisabled: {
    opacity: 0.4,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  bottomFixed: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    backgroundColor: "#FFFFFF",
  },
  footer: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
  },
});
