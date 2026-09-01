import Ionicons from "@react-native-vector-icons/ionicons";
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
import {
    getWebinarRecordings,
    getWebinars,
    rsvpWebinar,
    type Webinar,
    type WebinarRecording,
} from "../../services/api";
import { useFeedback } from "../../services/FeedbackContext";
import { useLanguage } from "../../services/LanguageContext";
import { getUuid } from "../../services/storage";
import { Colors } from "../../theme/colors";

type Tab = "live" | "upcoming" | "past";

interface DisplayWebinar {
  id: number;
  title: string;
  description: string | null;
  speaker: string;
  dateLabel: string;
  timeLabel: string;
  rsvpCount: number;
  isRsvped: boolean;
  meetingUrl: string | null;
  vodUrl: string | null;
  tab: Tab;
}

const mapStatus = (status: string): Tab => {
  const s = status.toLowerCase();
  if (s === "live" || s === "ongoing" || s === "in_progress") return "live";
  if (s === "ended" || s === "completed" || s === "past" || s === "cancelled") {
    return "past";
  }
  return "upcoming";
};

const formatDate = (value: string) => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatTime = (value: string) => {
  const [h, m] = value.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return value;
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
};

const toDisplay = (w: Webinar): DisplayWebinar => ({
  id: w.id,
  title: w.title,
  description: w.description,
  speaker: w.speaker ?? w.speakers[0]?.name ?? "Host",
  dateLabel: formatDate(w.scheduled_date),
  timeLabel: formatTime(w.scheduled_time),
  rsvpCount: w.rsvp_count,
  isRsvped: w.is_rsvped,
  meetingUrl: w.meeting_url,
  vodUrl: w.vod_url,
  tab: mapStatus(w.status),
});

const toRecordingDisplay = (r: WebinarRecording): DisplayWebinar => {
  const [datePart, timePart] = (r.scheduled_at ?? "").split(/\s+/);
  return {
    id: r.id,
    title: r.title,
    description: r.description,
    speaker: r.speakers[0]?.name ?? "Host",
    dateLabel: formatDate(datePart ?? ""),
    timeLabel: timePart ? formatTime(timePart) : "",
    rsvpCount: 0,
    isRsvped: false,
    meetingUrl: null,
    vodUrl: r.vod_url,
    tab: "past",
  };
};

export default function WebinarsScreen() {
  const [activeTab, setActiveTab] = useState<Tab>("upcoming");
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [recordings, setRecordings] = useState<WebinarRecording[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [rsvpingId, setRsvpingId] = useState<number | null>(null);
  const { showToast } = useFeedback();
  const { t } = useLanguage();

  const loadWebinars = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setRefreshing(true);
      try {
        const [webinarsRes, recordingsRes] = await Promise.all([
          getWebinars(),
          getWebinarRecordings(),
        ]);
        setWebinars(webinarsRes.data ?? []);
        setRecordings(recordingsRes.data ?? []);
      } catch (e) {
        showToast(
          e instanceof Error ? e.message : t("webinars.failedLoad"),
          "error",
        );
      } finally {
        setLoading(false);
        if (isRefresh) setRefreshing(false);
      }
    },
    [showToast],
  );

  useEffect(() => {
    loadWebinars();
  }, [loadWebinars]);

  const handleRefresh = useCallback(() => {
    loadWebinars(true);
  }, [loadWebinars]);

  const handleRsvp = async (webinar: DisplayWebinar) => {
    if (webinar.isRsvped || rsvpingId !== null) return;
    setRsvpingId(webinar.id);
    try {
      const uuid = (await getUuid()) ?? "";
      if (!uuid) {
        showToast(t("webinars.unableIdentify"), "error");
        return;
      }
      await rsvpWebinar(webinar.id, uuid);
      setWebinars((prev) =>
        prev.map((w) =>
          w.id === webinar.id
            ? { ...w, is_rsvped: true, rsvp_count: w.rsvp_count + 1 }
            : w,
        ),
      );
      showToast(t("webinars.registeredMsg"), "success");
    } catch (e) {
      showToast(
        e instanceof Error ? e.message : t("webinars.unableRegister"),
        "error",
      );
    } finally {
      setRsvpingId(null);
    }
  };

  const openUrl = async (url: string | null) => {
    if (!url) return;
    try {
      await Linking.openURL(url);
    } catch {
      showToast(t("home.unableOpenLink"), "error");
    }
  };

  const liveUpcoming = webinars.map(toDisplay);
  const past = recordings.map(toRecordingDisplay);

  const filtered =
    activeTab === "past"
      ? past
      : liveUpcoming.filter((w) => w.tab === activeTab);

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
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {/* ── Header ── */}
      <Text style={styles.title}>{t("webinars.title")}</Text>
      <Text style={styles.subtitle}>{t("webinars.subtitle")}</Text>

      {/* ── Tabs ── */}
      <View style={styles.tabBar}>
        {(["upcoming", "live", "past"] as Tab[]).map((tab) => (
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
                ? t("webinars.live")
                : tab === "upcoming"
                  ? t("webinars.upcoming")
                  : t("webinars.past")}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Webinar Cards ── */}
      {filtered.map((webinar) => {
        const isPast = webinar.tab === "past";
        const isLive = webinar.tab === "live";
        const hasVod = Boolean(webinar.vodUrl);

        return (
          <View key={webinar.id} style={styles.card}>
            {/* Badge */}
            <View
              style={[
                styles.badge,
                isLive
                  ? styles.badgeLive
                  : isPast
                    ? styles.badgePast
                    : styles.badgeUpcoming,
              ]}
            >
              <Text
                style={
                  isLive
                    ? styles.badgeTextLive
                    : isPast
                      ? styles.badgeTextPast
                      : styles.badgeTextUpcoming
                }
              >
                {isLive
                  ? "● " + t("webinars.live")
                  : isPast
                    ? t("webinars.ended")
                    : t("webinars.upcoming")}
              </Text>
            </View>

            {/* Title & description */}
            <Text style={styles.cardTitle}>{webinar.title}</Text>
            {webinar.description ? (
              <Text style={styles.cardDescription} numberOfLines={3}>
                {webinar.description}
              </Text>
            ) : null}

            {/* Speaker & attendees */}
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Ionicons name="person-outline" size={14} color="#6B7280" />
                <Text style={styles.infoText}>{webinar.speaker}</Text>
              </View>
              {!isPast && (
                <View style={styles.infoItem}>
                  <Ionicons name="people-outline" size={14} color="#6B7280" />
                  <Text style={styles.infoText}>
                    {t("webinars.attending", { count: webinar.rsvpCount })}
                  </Text>
                </View>
              )}
            </View>

            {/* Date & time */}
            <View style={styles.dateRow}>
              <Ionicons name="calendar-outline" size={14} color="#6B7280" />
              <Text style={styles.dateText}>
                {webinar.dateLabel}
                {webinar.timeLabel ? ` • ${webinar.timeLabel}` : ""}
              </Text>
            </View>

            {/* Action button */}
            {isLive ? (
              <TouchableOpacity
                style={styles.joinButton}
                activeOpacity={0.7}
                onPress={() => openUrl(webinar.meetingUrl)}
              >
                <Ionicons name="videocam-outline" size={18} color="#FFFFFF" />
                <Text style={styles.buttonText}>
                  {t("webinars.joinMeeting")}
                </Text>
              </TouchableOpacity>
            ) : isPast ? (
              <TouchableOpacity
                style={[styles.outlineButton, !hasVod && styles.buttonDisabled]}
                activeOpacity={0.7}
                disabled={!hasVod}
                onPress={() => openUrl(webinar.vodUrl)}
              >
                <Ionicons
                  name="play-circle-outline"
                  size={18}
                  color={hasVod ? Colors.brand : "#9CA3AF"}
                />
                <Text
                  style={[
                    styles.buttonTextOutline,
                    !hasVod && styles.buttonTextOutlineDisabled,
                  ]}
                >
                  {hasVod
                    ? t("webinars.watchRecording")
                    : t("webinars.noRecording")}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[
                  styles.outlineButton,
                  (webinar.isRsvped || rsvpingId === webinar.id) &&
                    styles.buttonDisabled,
                ]}
                activeOpacity={0.7}
                disabled={webinar.isRsvped || rsvpingId === webinar.id}
                onPress={() => handleRsvp(webinar)}
              >
                {rsvpingId === webinar.id ? (
                  <ActivityIndicator color={Colors.brand} size="small" />
                ) : (
                  <Ionicons
                    name={
                      webinar.isRsvped ? "checkmark-circle" : "calendar-outline"
                    }
                    size={18}
                    color={webinar.isRsvped ? "#16A34A" : Colors.brand}
                  />
                )}
                <Text
                  style={[
                    styles.buttonTextOutline,
                    webinar.isRsvped && styles.buttonTextRegistered,
                  ]}
                >
                  {webinar.isRsvped
                    ? t("webinars.registered")
                    : t("webinars.rsvpNow")}
                </Text>
              </TouchableOpacity>
            )}

            {/* Platform / link */}
            <View style={styles.linkRow}>
              <Ionicons name="videocam-outline" size={14} color="#9CA3AF" />
              <Text style={styles.linkText}>
                {webinar.meetingUrl
                  ? t("webinars.meetingLinkAvailable")
                  : webinar.vodUrl
                    ? t("webinars.recordingAvailable")
                    : t("webinars.noLinkAvailable")}
              </Text>
            </View>
          </View>
        );
      })}

      {/* Empty state */}
      {filtered.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="tv-outline" size={48} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>{t("webinars.noWebinars")}</Text>
          <Text style={styles.emptySubtitle}>{t("webinars.checkBack")}</Text>
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

  // ── Speaker & attendees ──
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
  buttonDisabled: {
    borderColor: "#E5E7EB",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  buttonTextOutline: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.brand,
  },
  buttonTextOutlineDisabled: {
    color: "#9CA3AF",
  },
  buttonTextRegistered: {
    color: "#16A34A",
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
