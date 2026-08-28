import Ionicons from "@react-native-vector-icons/ionicons";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../services/AuthContext";
import {
  getAnnouncements,
  getCourseRecommendations,
  getEnrolledCourses,
  getWebinarFaqs,
  getWebinarRecordings,
  getWebinars,
  rsvpWebinar,
  type Announcement,
  type CatalogueCourse,
  type Faq,
  type Webinar,
  type WebinarRecording,
} from "../../services/api";
import { useFeedback } from "../../services/FeedbackContext";
import { getUuid } from "../../services/storage";
import { Colors } from "../../theme/colors";

const courseProgress = (c: CatalogueCourse) => {
  const total = c.total_lessons || 0;
  const completed = c.completed_lessons ?? 0;
  const progress =
    total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;
  return { total, completed, progress };
};

const webinarStatus = (status: string) => {
  const s = status.toLowerCase();
  if (s === "live" || s === "ongoing" || s === "in_progress") return "live";
  if (s === "ended" || s === "completed" || s === "past" || s === "cancelled") {
    return "past";
  }
  return "upcoming";
};

const formatWebinarDate = (value: string) => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatWebinarTime = (value: string) => {
  const [h, m] = value.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return value;
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
};

export default function HomeScreen() {
  const { user } = useAuth();
  const firstName = user?.first_name || "User";
  const isOnboarded = user?.is_onboarded;
  const county = user?.county;

  const [enrolled, setEnrolled] = useState<CatalogueCourse[]>([]);
  const [availableCount, setAvailableCount] = useState(0);
  const [loadingLearning, setLoadingLearning] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [recordings, setRecordings] = useState<WebinarRecording[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [rsvpingId, setRsvpingId] = useState<number | null>(null);
  const { showToast } = useFeedback();

  const loadData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const enrolledRes = await getEnrolledCourses();
      setEnrolled(enrolledRes.data ?? []);
    } catch {
      // failed to load enrolled courses — keep empty state
    }
    try {
      const uuid = (await getUuid()) ?? "";
      if (uuid) {
        const recsRes = await getCourseRecommendations(uuid);
        setAvailableCount(recsRes.data?.courses?.length ?? 0);
      }
    } catch {
      // failed to load recommendations — keep default
    }
    try {
      const [webinarsRes, recordingsRes] = await Promise.all([
        getWebinars(),
        getWebinarRecordings(),
      ]);
      setWebinars(webinarsRes.data ?? []);
      setRecordings(recordingsRes.data ?? []);
    } catch {
      // failed to load webinars — keep empty state
    }
    try {
      const announcementsRes = await getAnnouncements();
      setAnnouncements(announcementsRes.data ?? []);
    } catch {
      // failed to load announcements — keep empty state
    }
    try {
      const faqsRes = await getWebinarFaqs();
      const industries = faqsRes.data?.industries ?? [];
      setFaqs(
        industries.flatMap((ind) =>
          (ind.webinars ?? []).flatMap((w) => w.faqs ?? []),
        ),
      );
    } catch {
      // failed to load faqs — keep empty state
    }
    setLoadingLearning(false);
    if (isRefresh) setRefreshing(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = useCallback(() => {
    loadData(true);
  }, [loadData]);

  const openUrl = async (url: string | null) => {
    if (!url) return;
    try {
      await Linking.openURL(url);
    } catch {
      showToast("Unable to open the link.", "error");
    }
  };

  const handleRsvp = async (webinar: Webinar) => {
    if (webinar.is_rsvped || rsvpingId !== null) return;
    setRsvpingId(webinar.id);
    try {
      const uuid = (await getUuid()) ?? "";
      await rsvpWebinar(webinar.id, uuid);
      setWebinars((prev) =>
        prev.map((w) =>
          w.id === webinar.id
            ? { ...w, is_rsvped: true, rsvp_count: w.rsvp_count + 1 }
            : w,
        ),
      );
      showToast("You're registered for this webinar.", "success");
    } catch (e) {
      showToast(
        e instanceof Error ? e.message : "Unable to register. Please try again.",
        "error",
      );
    } finally {
      setRsvpingId(null);
    }
  };

  const enrolledCount = enrolled.length;
  const doneCount = enrolled.filter(
    (c) => (c.completed_lessons ?? 0) >= (c.total_lessons || 0),
  ).length;
  const activeCourse =
    enrolled.find(
      (c) => (c.completed_lessons ?? 0) < (c.total_lessons || 0),
    ) ?? enrolled[0];
  const active = activeCourse ? courseProgress(activeCourse) : null;

  const liveWebinar = webinars.find((w) => webinarStatus(w.status) === "live");
  const upcomingWebinar = webinars.find(
    (w) => webinarStatus(w.status) === "upcoming",
  );
  const pastRecording = recordings[0];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {/* Greeting */}
      <Text style={styles.greeting}>Welcome back, {firstName}! 👋</Text>
      <Text style={styles.subtitle}>
        Here's a summary of your recent activity.
      </Text>

      {/* Badges */}
      <View style={styles.badges}>
        <View style={styles.badge}>
          <Ionicons
            name={isOnboarded ? "checkmark-circle" : "alert-circle"}
            size={16}
            color={isOnboarded ? "#10B981" : "#F59E0B"}
          />
          <Text style={styles.badgeText}>
            {isOnboarded ? "Onboarded" : "Profile incomplete"}
          </Text>
        </View>
        {county ? (
          <View style={styles.badge}>
            <Ionicons name="location-outline" size={16} color={Colors.brand} />
            <Text style={styles.badgeText}>{county}</Text>
          </View>
        ) : null}
      </View>

      {/* Quick Access */}
      <Text style={styles.sectionTitle}>Quick Access</Text>
      <View style={styles.quickGrid}>
        {[
          {
            label: "Certificates",
            icon: "ribbon-outline",
            route: "/(certificates)/certificates",
          },
          {
            label: "Digital Tools",
            icon: "hardware-chip-outline",
            route: "/(digital_tools)/digital-tools",
          },
          {
            label: "Profile",
            icon: "person-outline",
            route: "/(profile)/profile",
          },
          {
            label: "Support",
            icon: "headset-outline",
            route: "/(support)/support",
          },
        ].map((item) => (
          <TouchableOpacity
            key={item.label}
            style={styles.quickButton}
            activeOpacity={0.7}
            onPress={() => {
              if (item.route) router.push(item.route as any);
            }}
          >
            <Ionicons name={item.icon as any} size={20} color={Colors.brand} />
            <Text style={styles.quickLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Continue Learning */}
      <Text style={styles.sectionTitle}>Continue Learning</Text>

      {loadingLearning ? (
        <View style={styles.courseCard}>
          <ActivityIndicator color={Colors.brand} />
        </View>
      ) : activeCourse && active ? (
        <View style={styles.courseCard}>
          {/* Header */}
          <View style={styles.courseHeader}>
            <View>
              <Text style={styles.courseTitle}>{activeCourse.title}</Text>
              <Text style={styles.courseSubtitle}>
                {active.completed}/{active.total} lessons completed
              </Text>
            </View>
            <View style={styles.progressBadge}>
              <Text style={styles.progressBadgeText}>{active.progress}%</Text>
            </View>
          </View>

          {/* Progress bar */}
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${active.progress}%` }]}
            />
          </View>
          <Text style={styles.progressLabel}>Overall progress</Text>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{enrolledCount}</Text>
              <Text style={styles.statLabel}>Enrolled</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{doneCount}</Text>
              <Text style={styles.statLabel}>Done</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{availableCount}</Text>
              <Text style={styles.statLabel}>Available</Text>
            </View>
          </View>

          {/* Subtext */}
          <View style={styles.recommendRow}>
            <Ionicons name="book-outline" size={14} color="#6B7280" />
            <Text style={styles.recommendText}>
              {availableCount} course
              {availableCount !== 1 ? "s" : ""} available
            </Text>
          </View>

          {/* Continue button */}
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() =>
              router.push({
                pathname: "/(lessons)/lessons",
                params: { slug: activeCourse.slug },
              })
            }
          >
            <Text style={styles.continueButtonText}>Continue learning</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.courseCard}>
          <Text style={styles.courseSubtitle}>No courses in progress.</Text>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => router.navigate("/my-learning")}
          >
            <Text style={styles.continueButtonText}>Browse courses</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}

      {/* ── Announcements ── */}
      <Text style={styles.sectionTitle}>Announcements</Text>
      {announcements.map((item) => (
        <View key={item.id} style={styles.announcementCard}>
          <Text style={styles.announceTitle}>{item.title}</Text>
          <Text style={styles.announceSub}>{item.description}</Text>
          <View style={styles.announceFooter}>
            <Ionicons name="time-outline" size={14} color="#9CA3AF" />
            <Text style={styles.announceTime}>
              {formatWebinarDate(item.published_at?.split(/\s+/)[0] ?? "")}
            </Text>
          </View>
        </View>
      ))}
      {announcements.length === 0 && (
        <View style={styles.announcementCard}>
          <Text style={styles.announceSub}>No announcements right now.</Text>
        </View>
      )}

      {/* ── Webinars ── */}
      <Text style={styles.sectionTitle}>Webinars</Text>

      {/* Live */}
      {liveWebinar ? (
        <View style={styles.webinarCard}>
          <View style={styles.webinarHeader}>
            <View style={[styles.webinarBadge, styles.webinarBadgeLive]}>
              <Text style={styles.webinarBadgeText}>● Live</Text>
            </View>
          </View>
          <Text style={styles.webinarTitle}>{liveWebinar.title}</Text>
          <Text style={styles.webinarHost}>
            Hosted by {liveWebinar.speaker ?? liveWebinar.speakers[0]?.name ?? "Host"} •{" "}
            {liveWebinar.rsvp_count} attending
          </Text>
          <View style={styles.webinarMeta}>
            <Ionicons name="calendar-outline" size={14} color="#6B7280" />
            <Text style={styles.webinarMetaText}>
              {formatWebinarDate(liveWebinar.scheduled_date)} •{" "}
              {formatWebinarTime(liveWebinar.scheduled_time)}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.webinarWatchButton}
            onPress={() => openUrl(liveWebinar.meeting_url)}
          >
            <Ionicons name="videocam-outline" size={18} color={Colors.brand} />
            <Text style={styles.webinarWatchButtonText}>Join meeting</Text>
          </TouchableOpacity>
          <View style={styles.webinarLinkRow}>
            <Ionicons name="videocam-outline" size={14} color="#9CA3AF" />
            <Text style={styles.webinarLinkText}>Meeting link available</Text>
          </View>
        </View>
      ) : null}

      {/* Upcoming */}
      {upcomingWebinar ? (
        <View style={styles.webinarCard}>
          <View style={styles.webinarHeader}>
            <View style={[styles.webinarBadge, styles.webinarBadgeUpcoming]}>
              <Text style={styles.webinarBadgeTextUpcoming}>Upcoming</Text>
            </View>
          </View>
          <Text style={styles.webinarTitle}>{upcomingWebinar.title}</Text>
          <Text style={styles.webinarHost}>
            Hosted by {upcomingWebinar.speaker ?? upcomingWebinar.speakers[0]?.name ?? "Host"} •{" "}
            {upcomingWebinar.rsvp_count} attending
          </Text>
          <View style={styles.webinarMeta}>
            <Ionicons name="calendar-outline" size={14} color="#6B7280" />
            <Text style={styles.webinarMetaText}>
              {formatWebinarDate(upcomingWebinar.scheduled_date)} •{" "}
              {formatWebinarTime(upcomingWebinar.scheduled_time)}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.webinarWatchButton}
            disabled={upcomingWebinar.is_rsvped || rsvpingId === upcomingWebinar.id}
            onPress={() => handleRsvp(upcomingWebinar)}
          >
            {rsvpingId === upcomingWebinar.id ? (
              <ActivityIndicator color={Colors.brand} size="small" />
            ) : (
              <Ionicons
                name={upcomingWebinar.is_rsvped ? "checkmark-circle" : "calendar-outline"}
                size={18}
                color={upcomingWebinar.is_rsvped ? "#16A34A" : Colors.brand}
              />
            )}
            <Text style={styles.webinarWatchButtonText}>
              {upcomingWebinar.is_rsvped ? "Registered" : "RSVP now"}
            </Text>
          </TouchableOpacity>
          <View style={styles.webinarLinkRow}>
            <Ionicons name="videocam-outline" size={14} color="#9CA3AF" />
            <Text style={styles.webinarLinkText}>Meeting link available</Text>
          </View>
        </View>
      ) : null}

      {/* Past */}
      {pastRecording ? (
        <View style={styles.webinarCard}>
          <View style={styles.webinarHeader}>
            <View style={[styles.webinarBadge, styles.webinarBadgePast]}>
              <Text style={styles.webinarBadgeTextPast}>Past</Text>
            </View>
          </View>
          <Text style={styles.webinarTitle}>{pastRecording.title}</Text>
          <Text style={styles.webinarHost}>
            Hosted by {pastRecording.speakers[0]?.name ?? "Host"}
          </Text>
          <View style={styles.webinarMeta}>
            <Ionicons name="calendar-outline" size={14} color="#6B7280" />
            <Text style={styles.webinarMetaText}>
              {formatWebinarDate(pastRecording.scheduled_at?.split(/\s+/)[0] ?? "")}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.webinarWatchButton}
            disabled={!pastRecording.vod_url}
            onPress={() => openUrl(pastRecording.vod_url)}
          >
            <Ionicons name="play-circle-outline" size={18} color={Colors.brand} />
            <Text style={styles.webinarWatchButtonText}>
              {pastRecording.vod_url ? "Watch recording" : "No recording"}
            </Text>
          </TouchableOpacity>
          <View style={styles.webinarLinkRow}>
            <Ionicons name="videocam-outline" size={14} color="#9CA3AF" />
            <Text style={styles.webinarLinkText}>
              {pastRecording.vod_url ? "Recording available" : "No link available"}
            </Text>
          </View>
        </View>
      ) : null}

      {/* Browse all */}
      <TouchableOpacity
        style={styles.continueButton}
        onPress={() => router.navigate("/webinars")}
      >
        <Text style={styles.continueButtonText}>Browse all webinars</Text>
        <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
      </TouchableOpacity>

      {/* ── Sector Specific Training ── */}
      <View style={styles.sectorHeader}>
        <View>
          <Text style={styles.sectionTitle}>Sector Specific Training</Text>
          <Text style={styles.sectorSubtitle}>Construction</Text>
        </View>
        <TouchableOpacity onPress={() => router.navigate("/webinars")}>
          <Text style={styles.viewAllText}>View all</Text>
        </TouchableOpacity>
      </View>

      {/* FAQ Card */}
      <View style={styles.faqCard}>
        <Text style={styles.faqCardTitle}>Frequently Asked Questions</Text>
        <Text style={styles.faqCardSubtitle}>Webinar FAQs</Text>
        {faqs.map((item) => (
          <View key={item.id} style={styles.faqItem}>
            <Ionicons name="help-circle-outline" size={16} color="#6B7280" />
            <View style={styles.faqContent}>
              <Text style={styles.faqText}>{item.question}</Text>
              <Text style={styles.faqAnswer}>{item.answer}</Text>
            </View>
          </View>
        ))}
        {faqs.length === 0 && (
          <Text style={styles.faqAnswer}>No FAQs available yet.</Text>
        )}
      </View>

      {/* Pre‑recorded Webinars Card */}
      <View style={styles.prerecordCard}>
        <Text style={styles.prerecordTitle}>Pre-recorded Webinars</Text>
        <Text style={styles.prerecordSubtitle}>Recorded sessions</Text>
        {recordings.map((item) => (
          <View key={item.id} style={styles.prerecordItem}>
            <View style={styles.prerecordInfo}>
              <Text style={styles.prerecordItemTitle}>{item.title}</Text>
              <View style={styles.webinarMeta}>
                <Ionicons name="calendar-outline" size={13} color="#9CA3AF" />
                <Text style={styles.prerecordDate}>
                  {formatWebinarDate(item.scheduled_at?.split(/\s+/)[0] ?? "")}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.playButton}
              disabled={!item.vod_url}
              onPress={() => openUrl(item.vod_url)}
            >
              <Ionicons
                name="play-circle"
                size={28}
                color={item.vod_url ? Colors.brand : "#D1D5DB"}
              />
            </TouchableOpacity>
          </View>
        ))}
        {recordings.length === 0 && (
          <Text style={styles.courseSubtitle}>No recorded sessions yet.</Text>
        )}
      </View>
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
    paddingBottom: 40,
  },
  greeting: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 20,
  },
  badges: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 28,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#ECFDF5",
  },
  badgeText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#065F46",
  },
  // Quick Access
  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 28,
  },
  quickButton: {
    width: "47%",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
  },
  quickLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1F2937",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 14,
  },
  courseCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 12,
  },
  courseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    flex: 1,
    marginRight: 12,
  },
  courseSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  progressBadge: {
    backgroundColor: "#EDE9FE",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  progressBadgeText: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.brand,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 6,
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.brand,
    borderRadius: 3,
  },
  progressLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
  },
  statLabel: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 2,
  },
  recommendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 16,
  },
  recommendText: {
    fontSize: 12,
    color: "#6B7280",
  },
  continueButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.brand,
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
    marginBottom: 12,
  },
  continueButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  // Announcements
  announcementCard: {
    backgroundColor: "#FFFBEB",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#FDE68A",
    padding: 16,
    marginBottom: 12,
  },
  announceTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#92400E",
    marginBottom: 6,
  },
  announceSub: {
    fontSize: 13,
    color: "#A16207",
    lineHeight: 19,
    marginBottom: 10,
  },
  announceFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  announceTime: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  // Webinars
  webinarCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
    marginBottom: 12,
  },
  webinarHeader: {
    marginBottom: 8,
  },
  webinarBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  webinarBadgeLive: {
    backgroundColor: "#FEE2E2",
  },
  webinarBadgeUpcoming: {
    backgroundColor: "#EDE9FE",
  },
  webinarBadgePast: {
    backgroundColor: "#F3F4F6",
  },
  webinarBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#DC2626",
  },
  webinarBadgeTextUpcoming: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.brand,
  },
  webinarBadgeTextPast: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
  },
  webinarTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  webinarHost: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 8,
  },
  webinarMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 12,
  },
  webinarMetaText: {
    fontSize: 13,
    color: "#6B7280",
  },
  webinarJoinButton: {
    backgroundColor: Colors.brand,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 8,
  },
  webinarJoinButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  webinarWatchButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.brand,
    paddingVertical: 11,
    marginBottom: 8,
  },
  webinarWatchButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.brand,
  },
  webinarLinkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  webinarLinkText: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  browseButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.brand,
    marginBottom: 20,
  },
  browseButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.brand,
  },
  // Sector Specific
  sectorHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  sectorSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.brand,
  },
  faqCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
    marginBottom: 12,
  },
  faqCardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2937",
  },
  faqCardSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 14,
  },
  faqItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  faqContent: {
    flex: 1,
  },
  faqText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    lineHeight: 18,
    marginBottom: 4,
  },
  faqAnswer: {
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 17,
  },
  prerecordCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
    marginBottom: 12,
  },
  prerecordTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2937",
  },
  prerecordSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 14,
  },
  prerecordItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  prerecordInfo: {
    flex: 1,
    marginRight: 12,
  },
  prerecordItemTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  prerecordDate: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  playButton: {
    padding: 2,
  },
});
