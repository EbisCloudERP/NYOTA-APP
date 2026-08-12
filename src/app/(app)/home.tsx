import Ionicons from "@react-native-vector-icons/ionicons";
import { router } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../theme/colors";

export default function HomeScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Greeting */}
      <Text style={styles.greeting}>Welcome back, Joab! 👋</Text>
      <Text style={styles.subtitle}>
        Here's a summary of your recent activity.
      </Text>

      {/* Badges */}
      <View style={styles.badges}>
        <View style={styles.badge}>
          <Ionicons name="checkmark-circle" size={16} color="#10B981" />
          <Text style={styles.badgeText}>Onboarded</Text>
        </View>
        <View style={styles.badge}>
          <Ionicons name="checkmark-circle" size={16} color="#10B981" />
          <Text style={styles.badgeText}>Profile setup completed</Text>
        </View>
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
            route: null,
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

      {/* Course Card */}
      <View style={styles.courseCard}>
        {/* Header */}
        <View style={styles.courseHeader}>
          <View>
            <Text style={styles.courseTitle}>
              Introduction to Public Procurement
            </Text>
            <Text style={styles.courseSubtitle}>All lessons completed</Text>
          </View>
          <View style={styles.progressBadge}>
            <Text style={styles.progressBadgeText}>13%</Text>
          </View>
        </View>

        {/* Progress bar */}
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: "13%" }]} />
        </View>
        <Text style={styles.progressLabel}>Overall progress</Text>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Enrolled</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>4</Text>
            <Text style={styles.statLabel}>Done</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Available</Text>
          </View>
        </View>

        {/* Subtext */}
        <View style={styles.recommendRow}>
          <Ionicons name="book-outline" size={14} color="#6B7280" />
          <Text style={styles.recommendText}>
            8 recommended courses • 100% on highlighted course
          </Text>
        </View>

        {/* Continue button */}
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => router.navigate("/my-learning")}
        >
          <Text style={styles.continueButtonText}>Continue learning</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* ── Announcements ── */}
      <Text style={styles.sectionTitle}>Announcements</Text>
      <View style={styles.announcementCard}>
        <Text style={styles.announceTitle}>
          New funding opportunities available
        </Text>
        <Text style={styles.announceSub}>
          AGPO and CIDC tenders are now open for applications. Eligible youth,
          women, and PWDs are encouraged to apply before the deadlines.
        </Text>
        <View style={styles.announceFooter}>
          <Ionicons name="time-outline" size={14} color="#9CA3AF" />
          <Text style={styles.announceTime}>Posted 2 days ago</Text>
        </View>
      </View>
      <View style={styles.announcementCard}>
        <Text style={styles.announceTitle}>
          System maintenance this weekend
        </Text>
        <Text style={styles.announceSub}>
          The platform will undergo scheduled maintenance on Saturday from 2 AM
          to 6 AM EAT. Some features may be temporarily unavailable.
        </Text>
        <View style={styles.announceFooter}>
          <Ionicons name="time-outline" size={14} color="#9CA3AF" />
          <Text style={styles.announceTime}>Posted 5 days ago</Text>
        </View>
      </View>

      {/* ── Webinars ── */}
      <Text style={styles.sectionTitle}>Webinars</Text>

      {/* Live */}
      <View style={styles.webinarCard}>
        <View style={styles.webinarHeader}>
          <View style={[styles.webinarBadge, styles.webinarBadgeLive]}>
            <Text style={styles.webinarBadgeText}>● Live</Text>
          </View>
        </View>
        <Text style={styles.webinarTitle}>
          Understanding AGPO Registration Process
        </Text>
        <Text style={styles.webinarHost}>
          Hosted by Jane Muthoni • 45 attending
        </Text>
        <View style={styles.webinarMeta}>
          <Ionicons name="calendar-outline" size={14} color="#6B7280" />
          <Text style={styles.webinarMetaText}>Aug 15, 2026 • 2:00 PM</Text>
        </View>
        <TouchableOpacity style={styles.webinarWatchButton}>
          <Ionicons name="videocam-outline" size={18} color={Colors.brand} />
          <Text style={styles.webinarWatchButtonText}>Join meeting</Text>
        </TouchableOpacity>
        <View style={styles.webinarLinkRow}>
          <Ionicons name="videocam-outline" size={14} color="#9CA3AF" />
          <Text style={styles.webinarLinkText}>Meeting link available</Text>
        </View>
      </View>

      {/* Upcoming */}
      <View style={styles.webinarCard}>
        <View style={styles.webinarHeader}>
          <View style={[styles.webinarBadge, styles.webinarBadgeUpcoming]}>
            <Text style={styles.webinarBadgeTextUpcoming}>Upcoming</Text>
          </View>
        </View>
        <Text style={styles.webinarTitle}>
          CIDC Tender Application Workshop
        </Text>
        <Text style={styles.webinarHost}>
          Hosted by Peter Kimani • 0 attendees
        </Text>
        <View style={styles.webinarMeta}>
          <Ionicons name="calendar-outline" size={14} color="#6B7280" />
          <Text style={styles.webinarMetaText}>Aug 22, 2026 • 11:00 AM</Text>
        </View>
        <TouchableOpacity style={styles.webinarWatchButton}>
          <Ionicons name="calendar-outline" size={18} color={Colors.brand} />
          <Text style={styles.webinarWatchButtonText}>Mark attendance</Text>
        </TouchableOpacity>
        <View style={styles.webinarLinkRow}>
          <Ionicons name="videocam-outline" size={14} color="#9CA3AF" />
          <Text style={styles.webinarLinkText}>Meeting link available</Text>
        </View>
      </View>

      {/* Past */}
      <View style={styles.webinarCard}>
        <View style={styles.webinarHeader}>
          <View style={[styles.webinarBadge, styles.webinarBadgePast]}>
            <Text style={styles.webinarBadgeTextPast}>Past</Text>
          </View>
        </View>
        <Text style={styles.webinarTitle}>
          Introduction to Government Procurement
        </Text>
        <Text style={styles.webinarHost}>
          Hosted by Sarah Wanjiku • 120 attended
        </Text>
        <View style={styles.webinarMeta}>
          <Ionicons name="calendar-outline" size={14} color="#6B7280" />
          <Text style={styles.webinarMetaText}>Jul 30, 2026 • 3:00 PM</Text>
        </View>
        <TouchableOpacity style={styles.webinarWatchButton}>
          <Ionicons name="play-circle-outline" size={18} color={Colors.brand} />
          <Text style={styles.webinarWatchButtonText}>Watch recording</Text>
        </TouchableOpacity>
        <View style={styles.webinarLinkRow}>
          <Ionicons name="videocam-outline" size={14} color="#9CA3AF" />
          <Text style={styles.webinarLinkText}>Meeting link available</Text>
        </View>
      </View>

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
        <Text style={styles.faqCardSubtitle}>Construction Related</Text>
        {[
          {
            q: "What are the AGPO requirements for construction tenders?",
            a: "You must be registered with AGPO as a youth, woman, or PWD-owned enterprise. Your business must have a valid registration certificate and meet the turnover threshold for the specific tender category.",
          },
          {
            q: "How do I register as a contractor with NCA?",
            a: "Visit the NCA portal, submit your company details, pay the registration fee, and provide proof of qualifications. Categories range from NCA 1 to NCA 8 based on project value capacity.",
          },
          {
            q: "What safety certifications are required for site work?",
            a: "You need OSHA compliance certification, fire safety clearance, first aid training for site supervisors, and personal protective equipment (PPE) compliance documentation.",
          },
          {
            q: "How are construction bids evaluated and awarded?",
            a: "Bids are evaluated based on technical capacity, financial capability, past experience, and bid price. AGPO tenders prioritize registered enterprises with a preference margin of up to 15%.",
          },
        ].map((item, i) => (
          <View key={i} style={styles.faqItem}>
            <Ionicons name="help-circle-outline" size={16} color="#6B7280" />
            <View style={styles.faqContent}>
              <Text style={styles.faqText}>{item.q}</Text>
              <Text style={styles.faqAnswer}>{item.a}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Pre‑recorded Webinars Card */}
      <View style={styles.prerecordCard}>
        <Text style={styles.prerecordTitle}>Pre-recorded Webinars</Text>
        <Text style={styles.prerecordSubtitle}>Construction Specific</Text>
        {[
          {
            title: "Site Safety & Compliance Basics",
            date: "Aug 5, 2026 • 1:30 PM",
          },
          {
            title: "Understanding NCA Registration",
            date: "Jul 28, 2026 • 10:00 AM",
          },
          {
            title: "Tender Document Preparation",
            date: "Jul 20, 2026 • 2:00 PM",
          },
          {
            title: "Project Cost Estimation 101",
            date: "Jul 12, 2026 • 11:00 AM",
          },
        ].map((item, i) => (
          <View key={i} style={styles.prerecordItem}>
            <View style={styles.prerecordInfo}>
              <Text style={styles.prerecordItemTitle}>{item.title}</Text>
              <View style={styles.webinarMeta}>
                <Ionicons name="calendar-outline" size={13} color="#9CA3AF" />
                <Text style={styles.prerecordDate}>{item.date}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.playButton}>
              <Ionicons name="play-circle" size={28} color={Colors.brand} />
            </TouchableOpacity>
          </View>
        ))}
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
