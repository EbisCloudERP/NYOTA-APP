import Ionicons from "@react-native-vector-icons/ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getCourse, type CourseDetail } from "../../services/api";
import { useFeedback } from "../../services/FeedbackContext";
import { Colors } from "../../theme/colors";

type LessonStatus = "current" | "upcoming" | "completed";

interface Lesson {
  id: number;
  title: string;
  duration: string;
  status: LessonStatus;
  number: number;
}

export default function LessonsScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { showToast } = useFeedback();

  const loadCourse = useCallback(async (isRefresh = false) => {
    if (!slug) {
      setLoading(false);
      return;
    }
    if (isRefresh) setRefreshing(true);
    try {
      const res = await getCourse(slug);
      setCourse(res.data);
    } catch (e) {
      showToast(
        e instanceof Error ? e.message : "Failed to load lessons.",
        "error",
      );
    } finally {
      setLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  }, [slug]);

  useEffect(() => {
    loadCourse();
  }, [loadCourse]);

  const handleRefresh = useCallback(() => {
    loadCourse(true);
  }, [loadCourse]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.brand} />
      </View>
    );
  }

  if (!course) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.emptyText}>Course not found.</Text>
      </View>
    );
  }

  const completedCount = course.progress?.completed ?? course.completed_lessons ?? 0;

  const lessons: Lesson[] = (course.lessons ?? []).map((lesson, index) => {
    const status: LessonStatus =
      index < completedCount
        ? "completed"
        : index === completedCount
          ? "current"
          : "upcoming";

    return {
      id: lesson.id,
      title: lesson.title,
      duration: lesson.duration_minutes
        ? `${lesson.duration_minutes} min`
        : "—",
      status,
      number: index + 1,
    };
  });

  const completedLessons = lessons.filter((l) => l.status === "completed");
  const activeLessons = lessons.filter((l) => l.status !== "completed");
  const totalCount = lessons.length;
  const totalCompleted = completedLessons.length;
  const progressPercent =
    course.progress?.percentage ??
    (totalCount > 0 ? Math.round((totalCompleted / totalCount) * 100) : 0);
  const remainingCount = totalCount - totalCompleted;
  const allCompleted = totalCount > 0 && totalCompleted === totalCount;
  const currentLesson =
    activeLessons.find(
      (l) => l.id === course.progress?.current_lesson?.id,
    ) ||
    activeLessons.find((l) => l.status === "current") ||
    activeLessons[0];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {/* Course title & subtitle */}
      <Text style={styles.courseTitle}>{course.title}</Text>
      <Text style={styles.courseSubtitle}>{course.description || ""}</Text>

      {/* Progress Card */}
      <View style={styles.progressCard}>
        {/* Header row */}
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Course progress</Text>
          <Text style={styles.progressPercent}>{progressPercent}%</Text>
        </View>

        {/* Current lesson row */}
        {currentLesson && (
          <View style={styles.currentLessonRow}>
            <Ionicons name="play-circle" size={20} color={Colors.brand} />
            <Text style={styles.currentLessonText} numberOfLines={1}>
              {currentLesson.title}
            </Text>
          </View>
        )}

        {/* Progress bar */}
        <View style={styles.progressBarTrack}>
          <View
            style={[styles.progressBarFill, { width: `${progressPercent}%` }]}
          />
        </View>

        {/* Lesson count row */}
        <View style={styles.lessonCountRow}>
          <Text style={styles.lessonCountText}>
            {totalCompleted} of {totalCount} lessons completed
          </Text>
          <Text style={styles.lessonRemainingText}>
            {remainingCount} lesson{remainingCount !== 1 ? "s" : ""} remaining
          </Text>
        </View>

        {/* Completed lessons */}
        {completedLessons.length > 0 && (
          <View style={styles.completedSection}>
            <Text style={styles.completedSubtitle}>Completed lessons</Text>
            <View style={styles.completedBadgesRow}>
              {completedLessons.map((lesson) => (
                <TouchableOpacity
                  key={lesson.id}
                  style={styles.completedBadge}
                  activeOpacity={0.7}
                  onPress={() =>
                    router.push({
                      pathname: "/(lesson)/lesson",
                      params: { id: String(lesson.id) },
                    })
                  }
                >
                  <Ionicons name="checkmark-circle" size={12} color="#059669" />
                  <Text style={styles.completedBadgeText} numberOfLines={1}>
                    {lesson.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* Course Completion Alert */}
      {allCompleted && (
        <View style={styles.completionAlert}>
          <Ionicons name="checkmark-circle" size={24} color="#059669" />
          <Text style={styles.completionAlertText}>
            Course Completed! You have successfully completed all lessons in
            this course.
          </Text>
          <TouchableOpacity
            style={styles.certificateButton}
            activeOpacity={0.7}
            onPress={() => router.push("/(certificates)/certificates")}
          >
            <Ionicons name="ribbon" size={16} color={Colors.white} />
            <Text style={styles.certificateButtonText}>Go to certificates</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Lessons Section */}
      <Text style={styles.sectionTitle}>Lessons</Text>

      {activeLessons.map((lesson) => {
        const isLocked = lesson.status === "upcoming";
        const isCurrent = lesson.status === "current";

        return (
          <View key={lesson.id} style={styles.lessonCard}>
            {/* Lesson header row */}
            <View style={styles.lessonHeader}>
              <View style={styles.lessonTitleRow}>
                <Ionicons
                  name="play-circle"
                  size={22}
                  color={isLocked ? "#9CA3AF" : Colors.brand}
                />
                <Text style={styles.lessonLabel}>Lesson {lesson.number}:</Text>
                <Text style={styles.lessonTitle} numberOfLines={1}>
                  {lesson.title}
                </Text>
              </View>

              {/* Status badge */}
              <View
                style={[
                  styles.statusBadge,
                  isCurrent
                    ? styles.statusBadgeCurrent
                    : styles.statusBadgeUpcoming,
                ]}
              >
                {isLocked && (
                  <Ionicons name="lock-closed" size={10} color="#9CA3AF" />
                )}
                <Text
                  style={[
                    styles.statusBadgeText,
                    isCurrent
                      ? styles.statusBadgeTextCurrent
                      : styles.statusBadgeTextUpcoming,
                  ]}
                >
                  {isCurrent ? "Current" : "Upcoming"}
                </Text>
              </View>
            </View>

            {/* Duration row */}
            <View style={styles.durationRow}>
              <Ionicons name="time-outline" size={14} color="#6B7280" />
              <Text style={styles.durationText}>{lesson.duration}</Text>
            </View>

            {/* Start lesson button */}
            <TouchableOpacity
              style={[
                styles.startButton,
                isLocked && styles.startButtonDisabled,
              ]}
              disabled={isLocked}
              activeOpacity={0.7}
              onPress={() => {
                if (!isLocked) {
                  router.push({
                    pathname: "/(lesson)/lesson",
                    params: { id: String(lesson.id) },
                  });
                }
              }}
            >
              <Ionicons
                name={isLocked ? "lock-closed" : "play-circle"}
                size={18}
                color={isLocked ? "#9CA3AF" : Colors.white}
              />
              <Text
                style={[
                  styles.startButtonText,
                  isLocked && styles.startButtonTextDisabled,
                ]}
              >
                {isLocked ? "Locked" : "Start lesson"}
              </Text>
            </TouchableOpacity>
          </View>
        );
      })}

      {activeLessons.length === 0 && !allCompleted && (
        <View style={styles.emptyState}>
          <Ionicons name="book-outline" size={40} color="#D1D5DB" />
          <Text style={styles.emptyText}>No lessons available.</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
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
  emptyState: {
    alignItems: "center",
    paddingVertical: 24,
  },
  emptyText: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 12,
  },

  // Course title & subtitle
  courseTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  courseSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 20,
  },

  // Progress Card
  progressCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  progressPercent: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.brand,
  },
  currentLessonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  currentLessonText: {
    fontSize: 14,
    color: "#374151",
    flex: 1,
  },

  // Progress bar
  progressBarTrack: {
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 3,
    marginBottom: 10,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: Colors.brand,
    borderRadius: 3,
  },

  // Lesson count row
  lessonCountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lessonCountText: {
    fontSize: 12,
    color: "#6B7280",
  },
  lessonRemainingText: {
    fontSize: 12,
    color: Colors.brand,
    fontWeight: "500",
  },

  // Lessons section
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },

  // Lesson card
  lessonCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  lessonHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  lessonTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
    marginRight: 8,
  },
  lessonLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },
  lessonTitle: {
    fontSize: 13,
    fontWeight: "400",
    color: "#374151",
    flex: 1,
  },

  // Status badge
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusBadgeCurrent: {
    backgroundColor: "#EDE9FE",
  },
  statusBadgeUpcoming: {
    backgroundColor: "#F3F4F6",
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  statusBadgeTextCurrent: {
    color: Colors.brand,
  },
  statusBadgeTextUpcoming: {
    color: "#9CA3AF",
  },

  // Duration
  durationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 14,
  },
  durationText: {
    fontSize: 13,
    color: "#6B7280",
  },

  // Start lesson button
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: Colors.brand,
    borderRadius: 8,
    paddingVertical: 10,
  },
  startButtonDisabled: {
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  startButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.white,
  },
  startButtonTextDisabled: {
    color: "#9CA3AF",
  },

  // Completed lessons section
  completedSection: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 10,
  },
  completedSubtitle: {
    fontSize: 11,
    fontWeight: "600",
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  completedBadgesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  completedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  completedBadgeText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#059669",
    maxWidth: 140,
  },

  // Completion alert
  completionAlert: {
    backgroundColor: "#ECFDF5",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#A7F3D0",
    alignItems: "center",
  },
  completionAlertText: {
    fontSize: 13,
    color: "#065F46",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 14,
    lineHeight: 19,
  },
  certificateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#059669",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  certificateButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.white,
  },
});
