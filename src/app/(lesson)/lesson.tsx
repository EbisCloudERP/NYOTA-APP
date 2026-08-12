import Ionicons from "@react-native-vector-icons/ionicons";
import { router } from "expo-router";
import { VideoView, useVideoPlayer } from "expo-video";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../theme/colors";

const MUX_PLAYBACK_ID = "9OMsZCJm01qBK3o8jB2Tqx6z6EpvYAFDHW00002w00GIitw";

const DUMMY_LESSON = {
  title: "Introduction to Financial Planning",
  objective:
    "Understand the core principles of financial planning and why it matters",
  description:
    "In this lesson, you will learn the fundamentals of financial planning, including goal setting, risk assessment, and creating a roadmap for your financial future.",
  type: "video" as "video" | "text",
  duration: "15 min",
  videoUrl: `https://stream.mux.com/${MUX_PLAYBACK_ID}.m3u8`,
  content: `Financial planning is the process of managing your money to achieve personal economic satisfaction. It allows you to control your financial situation and provides a roadmap to achieve your goals.

Key concepts covered in this lesson:

1. Setting SMART Financial Goals
Specific, Measurable, Achievable, Relevant, and Time-bound goals form the foundation of any good financial plan. Without clear goals, it's difficult to measure progress or stay motivated.

2. Understanding Your Current Financial Position
Before you can plan for the future, you need to know where you stand today. This includes assessing your income, expenses, assets, and liabilities.

3. Creating a Budget
A budget is a spending plan that helps you track where your money goes each month. The 50/30/20 rule is a simple framework: 50% for needs, 30% for wants, and 20% for savings and debt repayment.

4. Building an Emergency Fund
An emergency fund is money set aside for unexpected expenses. Aim to save 3-6 months of living expenses in an easily accessible account.

5. Risk Management and Insurance
Protecting yourself and your assets through appropriate insurance coverage is a critical part of financial planning.`,
};

export default function LessonScreen() {
  const isVideoLesson = DUMMY_LESSON.type === "video";

  const player = useVideoPlayer(DUMMY_LESSON.videoUrl, (player) => {
    player.loop = false;
  });

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Lesson title */}
      <Text style={styles.lessonTitle}>{DUMMY_LESSON.title}</Text>

      {/* Objective & Description Card */}
      <View style={styles.objectiveCard}>
        <View style={styles.objectiveRow}>
          <View style={styles.objectiveLeft}>
            <Ionicons name="bulb" size={20} color={Colors.brand} />
            <Text style={styles.objectiveLabel}>Learning objective</Text>
          </View>
          <View style={styles.durationBadge}>
            <Ionicons name="time-outline" size={12} color="#6B7280" />
            <Text style={styles.durationBadgeText}>
              {DUMMY_LESSON.duration}
            </Text>
          </View>
        </View>
        <Text style={styles.objectiveText}>{DUMMY_LESSON.objective}</Text>
        <Text style={styles.description}>{DUMMY_LESSON.description}</Text>
      </View>

      {/* Video card — only shown for video lessons */}
      {isVideoLesson && (
        <View style={styles.videoCard}>
          <VideoView player={player} style={styles.video} nativeControls />
        </View>
      )}

      {/* Lesson content */}
      <View style={styles.contentCard}>
        <Text style={styles.contentTitle}>Lesson Content</Text>
        <Text style={styles.contentText}>{DUMMY_LESSON.content}</Text>
      </View>

      {/* Start quiz button */}
      <TouchableOpacity
        style={styles.quizButton}
        activeOpacity={0.7}
        onPress={() => {
          router.push("/(quiz)/quiz");
        }}
      >
        <Ionicons name="help-circle" size={20} color={Colors.white} />
        <Text style={styles.quizButtonText}>Start quiz</Text>
      </TouchableOpacity>

      {/* Footer */}
      <Text style={styles.footerText}>
        Take the quiz to complete this lesson
      </Text>
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

  // Start quiz button
  quizButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.brand,
    borderRadius: 10,
    paddingVertical: 14,
    marginBottom: 10,
  },
  quizButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.white,
  },

  // Footer
  footerText: {
    fontSize: 13,
    color: "#9CA3AF",
    textAlign: "center",
  },
});
