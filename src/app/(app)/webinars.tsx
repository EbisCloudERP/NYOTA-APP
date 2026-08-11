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

type Tab = "live" | "upcoming" | "past";

interface Webinar {
  id: string;
  title: string;
  description: string;
  organizer: string;
  attendees: number;
  date: string;
  time: string;
  linkType: string;
  tab: Tab;
}

const WEBINARS: Webinar[] = [
  {
    id: "1",
    title: "Understanding AGPO Registration Process",
    description:
      "Learn the step-by-step process of registering for AGPO certification and how it benefits youth, women, and PWD-owned businesses.",
    organizer: "Jane Muthoni",
    attendees: 45,
    date: "Aug 15, 2026",
    time: "2:00 PM",
    linkType: "Google Meet",
    tab: "live",
  },
  {
    id: "2",
    title: "CIDC Tender Application Workshop",
    description:
      "A practical workshop on preparing competitive tender applications for CIDC opportunities, including documentation and pricing tips.",
    organizer: "Peter Kimani",
    attendees: 0,
    date: "Aug 22, 2026",
    time: "11:00 AM",
    linkType: "Zoom",
    tab: "upcoming",
  },
  {
    id: "3",
    title: "Introduction to Government Procurement",
    description:
      "An overview of Kenya's public procurement system covering legal frameworks, key players, and how SMEs can participate effectively.",
    organizer: "Sarah Wanjiku",
    attendees: 120,
    date: "Jul 30, 2026",
    time: "3:00 PM",
    linkType: "Google Meet",
    tab: "past",
  },
];

export default function WebinarsScreen() {
  const [activeTab, setActiveTab] = useState<Tab>("live");

  const filteredWebinars = WEBINARS.filter((w) => w.tab === activeTab);

  const getBadge = (tab: Tab) => {
    switch (tab) {
      case "live":
        return {
          label: "● Live",
          style: styles.badgeLive,
          textStyle: styles.badgeTextLive,
        };
      case "upcoming":
        return {
          label: "Upcoming",
          style: styles.badgeUpcoming,
          textStyle: styles.badgeTextUpcoming,
        };
      case "past":
        return {
          label: "Ended",
          style: styles.badgePast,
          textStyle: styles.badgeTextPast,
        };
    }
  };

  const getButton = (tab: Tab) => {
    switch (tab) {
      case "live":
        return {
          label: "Join meeting",
          icon: "videocam-outline",
          style: styles.joinButton,
        };
      case "upcoming":
        return {
          label: "Enroll now",
          icon: "calendar-outline",
          style: styles.outlineButton,
        };
      case "past":
        return {
          label: "Watch recording",
          icon: "play-circle-outline",
          style: styles.outlineButton,
        };
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Header ── */}
      <Text style={styles.title}>Webinars</Text>
      <Text style={styles.subtitle}>
        Join live webinars and interactive sessions led by industry experts
      </Text>

      {/* ── Tabs ── */}
      <View style={styles.tabBar}>
        {(["live", "upcoming", "past"] as Tab[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.tabTextActive,
              ]}
            >
              {tab === "live"
                ? "Live"
                : tab === "upcoming"
                  ? "Upcoming"
                  : "Past"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Webinar Cards ── */}
      {filteredWebinars.map((webinar) => {
        const badge = getBadge(webinar.tab);
        const button = getButton(webinar.tab);

        return (
          <View key={webinar.id} style={styles.card}>
            {/* Badge */}
            <View style={[styles.badge, badge.style]}>
              <Text style={badge.textStyle}>{badge.label}</Text>
            </View>

            {/* Title & description */}
            <Text style={styles.cardTitle}>{webinar.title}</Text>
            <Text style={styles.cardDescription} numberOfLines={3}>
              {webinar.description}
            </Text>

            {/* Organizer & attendees */}
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Ionicons name="person-outline" size={14} color="#6B7280" />
                <Text style={styles.infoText}>{webinar.organizer}</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="people-outline" size={14} color="#6B7280" />
                <Text style={styles.infoText}>
                  {webinar.attendees} attending
                </Text>
              </View>
            </View>

            {/* Date & time */}
            <View style={styles.dateRow}>
              <Ionicons name="calendar-outline" size={14} color="#6B7280" />
              <Text style={styles.dateText}>
                {webinar.date} • {webinar.time}
              </Text>
            </View>

            {/* Action button */}
            <TouchableOpacity style={button.style} activeOpacity={0.7}>
              <Ionicons
                name={button.icon as any}
                size={18}
                color={webinar.tab === "live" ? "#FFFFFF" : Colors.brand}
              />
              <Text
                style={[
                  styles.buttonText,
                  webinar.tab !== "live" && styles.buttonTextOutline,
                ]}
              >
                {button.label}
              </Text>
            </TouchableOpacity>

            {/* Link type */}
            <View style={styles.linkRow}>
              <Ionicons name="videocam-outline" size={14} color="#9CA3AF" />
              <Text style={styles.linkText}>
                {webinar.linkType} link available
              </Text>
            </View>
          </View>
        );
      })}

      {/* Empty state */}
      {filteredWebinars.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="tv-outline" size={48} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>No webinars found</Text>
          <Text style={styles.emptySubtitle}>
            Check back later for new sessions.
          </Text>
        </View>
      )}

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
    borderColor: "#E5E7EB",
    padding: 16,
    marginBottom: 12,
  },

  // ── Badge ──
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 8,
  },
  badgeLive: {
    backgroundColor: "#FEE2E2",
  },
  badgeUpcoming: {
    backgroundColor: "#EDE9FE",
  },
  badgePast: {
    backgroundColor: "#F3F4F6",
  },
  badgeTextLive: {
    fontSize: 12,
    fontWeight: "700",
    color: "#DC2626",
  },
  badgeTextUpcoming: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.brand,
  },
  badgeTextPast: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
  },

  // ── Card content ──
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 18,
    marginBottom: 10,
  },

  // ── Organizer & attendees ──
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 8,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  infoText: {
    fontSize: 12,
    color: "#6B7280",
  },

  // ── Date ──
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 12,
  },
  dateText: {
    fontSize: 13,
    color: "#6B7280",
  },

  // ── Buttons ──
  joinButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: Colors.brand,
    borderRadius: 10,
    paddingVertical: 12,
    marginBottom: 8,
  },
  outlineButton: {
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
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  buttonTextOutline: {
    color: Colors.brand,
  },

  // ── Link type ──
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  linkText: {
    fontSize: 12,
    color: "#9CA3AF",
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
