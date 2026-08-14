import Ionicons from "@react-native-vector-icons/ionicons";
import { router } from "expo-router";
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
import { enrollCourse, getCourseCatalogue } from "../../services/api";
import { getUuid } from "../../services/storage";
import { Colors } from "../../theme/colors";

type Tab = "all" | "recommended";

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  pace: string;
  progress: number; // 0–100
  totalLessons: number;
  completedLessons: number;
  isRecommended: boolean;
}

const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

export default function MyLearningScreen() {
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCourseCatalogue()
      .then((res) =>
        setCourses(
          res.data.map((c) => ({
            id: String(c.id),
            title: c.title,
            description: c.description,
            category: c.category?.name ?? "",
            level: capitalize(c.level),
            pace: "Self-paced",
            progress: 0,
            totalLessons: c.total_lessons,
            completedLessons: 0,
            isRecommended: false,
          })),
        ),
      )
      .catch((e) =>
        Alert.alert(
          "Error",
          e instanceof Error ? e.message : "Failed to load courses.",
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  const handleEnroll = (course: Course) => {
    Alert.alert(
      "Enroll in Course",
      `You are about to enroll in "${course.title}". Are you sure you want to continue?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Enroll",
          onPress: async () => {
            try {
              const uuid = (await getUuid()) ?? "";
              await enrollCourse(course.id, uuid);
              setCourses((prev) =>
                prev.map((c) =>
                  c.id === course.id ? { ...c, progress: 1 } : c,
                ),
              );
            } catch (e) {
              Alert.alert(
                "Enroll Failed",
                e instanceof Error ? e.message : "Please try again.",
              );
            }
          },
        },
      ],
    );
  };

  const filteredCourses =
    activeTab === "all" ? courses : courses.filter((c) => c.isRecommended);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.brand} />
      </View>
    );
  }

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
            <View
              style={[
                styles.enrollmentBadge,
                course.progress === 100
                  ? styles.enrollmentBadgeCompleted
                  : course.progress > 0
                    ? styles.enrollmentBadgeEnrolled
                    : styles.enrollmentBadgeNotEnrolled,
              ]}
            >
              <Ionicons
                name={
                  course.progress === 100
                    ? "checkmark-circle"
                    : course.progress > 0
                      ? "checkmark-circle"
                      : "close-circle-outline"
                }
                size={12}
                color={
                  course.progress === 100
                    ? Colors.brand
                    : course.progress > 0
                      ? "#16A34A"
                      : "#9CA3AF"
                }
              />
              <Text
                style={[
                  styles.enrollmentBadgeText,
                  course.progress === 100
                    ? styles.enrollmentBadgeTextCompleted
                    : course.progress > 0
                      ? styles.enrollmentBadgeTextEnrolled
                      : styles.enrollmentBadgeTextNotEnrolled,
                ]}
              >
                {course.progress === 100
                  ? "Completed"
                  : course.progress > 0
                    ? "Enrolled"
                    : "Not enrolled"}
              </Text>
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
            onPress={() => {
              if (course.progress === 0) {
                handleEnroll(course);
              } else if (course.progress < 100) {
                router.push("/(lessons)/lessons");
              }
            }}
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
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
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
  enrollmentBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  enrollmentBadgeCompleted: {
    backgroundColor: "#F3EFFF",
  },
  enrollmentBadgeEnrolled: {
    backgroundColor: "#F0FDF4",
  },
  enrollmentBadgeNotEnrolled: {
    backgroundColor: "#F9FAFB",
  },
  enrollmentBadgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  enrollmentBadgeTextCompleted: {
    color: Colors.brand,
  },
  enrollmentBadgeTextEnrolled: {
    color: "#16A34A",
  },
  enrollmentBadgeTextNotEnrolled: {
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
