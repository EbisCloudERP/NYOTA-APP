import Ionicons from "@react-native-vector-icons/ionicons";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../theme/colors";

type Tab = "all" | "recommended";

type Level = "Beginner" | "Intermediate" | "Advanced";
type Pace = "Self-paced" | "Instructor-led";

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: Level;
  pace: Pace;
  progress: number; // 0–100
  totalLessons: number;
  completedLessons: number;
  duration: string;
  isRecommended: boolean;
}

const COURSES: Course[] = [
  {
    id: "1",
    title: "Introduction to Public Procurement",
    description:
      "Learn the fundamentals of public procurement processes, legal frameworks, and best practices in Kenya.",
    category: "Procurement",
    level: "Beginner",
    pace: "Self-paced",
    progress: 75,
    totalLessons: 12,
    completedLessons: 9,
    duration: "4h 30m",
    isRecommended: true,
  },
  {
    id: "2",
    title: "AGPO Certification Guide",
    description:
      "Step-by-step guide to obtaining AGPO certification for youth, women, and PWD-owned businesses.",
    category: "Certification",
    level: "Intermediate",
    pace: "Self-paced",
    progress: 40,
    totalLessons: 8,
    completedLessons: 3,
    duration: "3h 15m",
    isRecommended: true,
  },
  {
    id: "3",
    title: "Digital Literacy for Business",
    description:
      "Master essential digital tools and platforms to run and grow your business online.",
    category: "Digital Skills",
    level: "Beginner",
    pace: "Instructor-led",
    progress: 0,
    totalLessons: 10,
    completedLessons: 0,
    duration: "5h 00m",
    isRecommended: false,
  },
  {
    id: "4",
    title: "Financial Management Basics",
    description:
      "Understand budgeting, cash flow, and financial reporting for small and medium enterprises.",
    category: "Finance",
    level: "Beginner",
    pace: "Self-paced",
    progress: 100,
    totalLessons: 6,
    completedLessons: 6,
    duration: "2h 45m",
    isRecommended: true,
  },
  {
    id: "5",
    title: "Tender Application Process",
    description:
      "Navigate the end-to-end tender application process including documentation, pricing, and submission.",
    category: "Procurement",
    level: "Advanced",
    pace: "Instructor-led",
    progress: 20,
    totalLessons: 14,
    completedLessons: 3,
    duration: "6h 00m",
    isRecommended: false,
  },
  {
    id: "6",
    title: "Entrepreneurship Fundamentals",
    description:
      "Build a strong foundation in entrepreneurship covering ideation, validation, and go-to-market strategies.",
    category: "Business",
    level: "Beginner",
    pace: "Self-paced",
    progress: 0,
    totalLessons: 16,
    completedLessons: 0,
    duration: "7h 30m",
    isRecommended: false,
  },
];

export default function MyLearningScreen() {
  const [activeTab, setActiveTab] = useState<Tab>("all");

  const filteredCourses =
    activeTab === "all" ? COURSES : COURSES.filter((c) => c.isRecommended);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Header ── */}
      <Text style={styles.title}>Your Learning Path</Text>
      <Text style={styles.subtitle}>
        Complete courses to earn certificates and unlock opportunities
      </Text>

      {/* ── Tabs ── */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "all" && styles.tabActive]}
          onPress={() => setActiveTab("all")}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "all" && styles.tabTextActive,
            ]}
          >
            All courses
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "recommended" && styles.tabActive]}
          onPress={() => setActiveTab("recommended")}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "recommended" && styles.tabTextActive,
            ]}
          >
            Recommended for you
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── Course Cards ── */}
      {filteredCourses.map((course) => (
        <View key={course.id} style={styles.card}>
          {/* Top row: icon + category + duration */}
          <View style={styles.cardHeader}>
            <View style={styles.cardCategoryRow}>
              <View style={styles.categoryIcon}>
                <Ionicons name="book-outline" size={16} color={Colors.brand} />
              </View>
              <Text style={styles.cardCategory}>{course.category}</Text>
            </View>
            <View style={styles.durationRow}>
              <Ionicons name="time-outline" size={14} color="#9CA3AF" />
              <Text style={styles.duration}>{course.duration}</Text>
            </View>
          </View>

          {/* Title & description */}
          <Text style={styles.cardTitle}>{course.title}</Text>
          <Text style={styles.cardDescription} numberOfLines={2}>
            {course.description}
          </Text>

          {/* Progress section */}
          <View style={styles.progressSection}>
            <View style={styles.progressBar}>
              <View
                style={[styles.progressFill, { width: `${course.progress}%` }]}
              />
            </View>
            <Text style={styles.progressPercent}>{course.progress}%</Text>
          </View>

          {/* Lessons info + badges */}
          <View style={styles.lessonsRow}>
            <Ionicons name="document-text-outline" size={14} color="#6B7280" />
            <Text style={styles.lessonsText}>
              {course.completedLessons}/{course.totalLessons} lessons
            </Text>
            <View style={styles.badgesRow}>
              <View style={styles.levelBadge}>
                <Text style={styles.levelBadgeText}>{course.level}</Text>
              </View>
              <View style={styles.paceBadge}>
                <Text style={styles.paceBadgeText}>{course.pace}</Text>
              </View>
            </View>
          </View>

          {/* Action button */}
          <TouchableOpacity
            style={[
              styles.cardButton,
              course.progress > 0 &&
                course.progress < 100 &&
                styles.cardButtonOutline,
            ]}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.cardButtonText,
                course.progress > 0 &&
                  course.progress < 100 &&
                  styles.cardButtonTextOutline,
              ]}
            >
              {course.progress === 0
                ? "Enroll now"
                : course.progress === 100
                  ? "Review course"
                  : "Go to lessons"}
            </Text>
            <Ionicons
              name="arrow-forward"
              size={16}
              color={
                course.progress > 0 && course.progress < 100
                  ? Colors.brand
                  : "#FFFFFF"
              }
            />
          </TouchableOpacity>
        </View>
      ))}

      {/* Empty state */}
      {filteredCourses.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="book-outline" size={48} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>No courses found</Text>
          <Text style={styles.emptySubtitle}>
            Check back later for new recommendations.
          </Text>
        </View>
      )}

      {/* Bottom spacer */}
      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  // ── Header ──
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 20,
  },

  // ── Tabs ──
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    padding: 4,
    marginBottom: 18,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#9CA3AF",
  },
  tabTextActive: {
    color: Colors.brand,
  },

  // ── Card ──
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    padding: 16,
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  cardCategoryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  categoryIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#F3EFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  cardCategory: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.brand,
  },
  durationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  duration: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
    lineHeight: 21,
  },
  cardDescription: {
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 17,
    marginBottom: 14,
  },

  // ── Progress ──
  progressSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: "#F3F4F6",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.brand,
    borderRadius: 3,
  },
  progressPercent: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.brand,
    width: 38,
    textAlign: "right",
  },

  // ── Lessons ──
  lessonsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 14,
    flexWrap: "wrap",
  },
  lessonsText: {
    fontSize: 12,
    color: "#6B7280",
  },
  badgesRow: {
    flexDirection: "row",
    gap: 6,
    marginLeft: 4,
  },
  levelBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 5,
    backgroundColor: "#F3EFFF",
  },
  levelBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: Colors.brand,
  },
  paceBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 5,
    backgroundColor: "#F0FDF4",
  },
  paceBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#16A34A",
  },

  // ── Button ──
  cardButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: Colors.brand,
    paddingVertical: 10,
    borderRadius: 10,
  },
  cardButtonOutline: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: Colors.brand,
  },
  cardButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  cardButtonTextOutline: {
    color: Colors.brand,
  },

  // ── Empty state ──
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#9CA3AF",
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    color: "#D1D5DB",
    textAlign: "center",
  },

  // ── Bottom spacer ──
  bottomSpacer: {
    height: 24,
  },
});
