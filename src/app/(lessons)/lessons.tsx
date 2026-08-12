import Ionicons from "@react-native-vector-icons/ionicons";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../../theme/colors";

interface Lesson {
  id: number;
  title: string;
  duration: string;
  status: "current" | "upcoming" | "completed";
}

const DUMMY_COURSE = {
  title: "Financial Literacy 101",
  subtitle: "Master the fundamentals of personal and business finance",
};

const DUMMY_COMPLETED_LESSONS = [
  { id: 101, title: "Setting Financial Goals" },
  { id: 102, title: "Understanding Credit Scores" },
];

const DUMMY_LESSONS: Lesson[] = [
  {
    id: 1,
    title: "Introduction to Financial Planning",
    duration: "15 min",
    status: "current",
  },
  {
    id: 2,
    title: "Budgeting and Saving Strategies",
    duration: "20 min",
    status: "upcoming",
  },
];

export default function LessonsScreen() {
  const completedFromList = DUMMY_LESSONS.filter(
    (l) => l.status === "completed",
  ).length;
  const totalCompleted = completedFromList + DUMMY_COMPLETED_LESSONS.length;
  const totalCount = DUMMY_LESSONS.length + DUMMY_COMPLETED_LESSONS.length;
  const progressPercent =
    totalCount > 0 ? (totalCompleted / totalCount) * 100 : 0;
  const remainingCount = totalCount - totalCompleted;
  const allCompleted = true; // TODO: revert after preview

  const currentLesson =
    DUMMY_LESSONS.find((l) => l.status === "current") || DUMMY_LESSONS[0];

  return (
    <View style={styles.container}>
      {/* Course title & subtitle */}
      <Text style={styles.courseTitle}>{DUMMY_COURSE.title}</Text>
      <Text style={styles.courseSubtitle}>{DUMMY_COURSE.subtitle}</Text>

      {/* Progress Card */}
      <View style={styles.progressCard}>
        {/* Header row */}
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Course progress</Text>
          <Text style={styles.progressPercent}>{progressPercent}%</Text>
        </View>

        {/* Current lesson row */}
        <View style={styles.currentLessonRow}>
          <Ionicons name="play-circle" size={20} color={Colors.brand} />
          <Text style={styles.currentLessonText} numberOfLines={1}>
            {currentLesson.title}
          </Text>
        </View>

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
        {DUMMY_COMPLETED_LESSONS.length > 0 && (
          <View style={styles.completedSection}>
            <Text style={styles.completedSubtitle}>Completed lessons</Text>
            <View style={styles.completedBadgesRow}>
              {DUMMY_COMPLETED_LESSONS.map((lesson) => (
                <View key={lesson.id} style={styles.completedBadge}>
                  <Ionicons name="checkmark-circle" size={12} color="#059669" />
                  <Text style={styles.completedBadgeText} numberOfLines={1}>
                    {lesson.title}
                  </Text>
                </View>
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
            onPress={() => {
              // Navigate to certificates
            }}
          >
            <Ionicons name="ribbon" size={16} color={Colors.white} />
            <Text style={styles.certificateButtonText}>Go to certificates</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Lessons Section */}
      <Text style={styles.sectionTitle}>Lessons</Text>

      {DUMMY_LESSONS.map((lesson, index) => {
        const isLocked = lesson.status === "upcoming";
        const isCurrent = lesson.status === "current";
        const lessonNumber = index + 1;

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
                <Text style={styles.lessonLabel}>Lesson {lessonNumber}:</Text>
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
                  router.push("/(lesson)/lesson");
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 20,
    paddingTop: 24,
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
