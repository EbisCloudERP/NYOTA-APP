import Ionicons from "@react-native-vector-icons/ionicons";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import {
    getFeedbackTicket,
    replyFeedbackTicket,
    type FeedbackTicket,
} from "../services/api";
import { useAuth } from "../services/AuthContext";
import { useFeedback } from "../services/FeedbackContext";
import { useLanguage } from "../services/LanguageContext";
import { Colors } from "../theme/colors";

// ── Types ──
interface ChatMessage {
  id: number;
  sender: "user" | "support";
  name: string;
  message: string;
  time: string;
}

interface TicketPreviewModalProps {
  visible: boolean;
  ticketId: number | null;
  onClose: () => void;
}

// ── Helpers ──
const priorityColor = (p: string): string => {
  switch (p.toLowerCase()) {
    case "urgent":
    case "critical":
      return "#DC2626";
    case "high":
      return "#EA580C";
    case "medium":
      return "#CA8A04";
    case "low":
      return "#16A34A";
    default:
      return "#6B7280";
  }
};

const statusColor = (s: string): string => {
  switch (s.toLowerCase()) {
    case "open":
      return "#2563EB";
    case "in_progress":
    case "ongoing":
      return "#9333EA";
    case "resolved":
      return "#16A34A";
    case "closed":
      return "#6B7280";
    default:
      return "#6B7280";
  }
};

const priorityLabel = (p: string): string =>
  p.charAt(0).toUpperCase() + p.slice(1).toLowerCase();

const statusLabel = (s: string): string => {
  switch (s.toLowerCase()) {
    case "in_progress":
    case "ongoing":
      return "In Progress";
    case "open":
      return "Open";
    case "resolved":
      return "Resolved";
    case "closed":
      return "Closed";
    default:
      return s;
  }
};

const categoryLabel = (c: string): string =>
  c.replace(/_/g, " ").replace(/\b\w/g, (ch) => ch.toUpperCase());

const formatDate = (value: string): string => {
  const d = new Date(value.replace(" ", "T"));
  if (Number.isNaN(d.getTime())) return value.slice(0, 10);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatTime = (value: string): string => {
  const d = new Date(value.replace(" ", "T"));
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ── Component ──
export default function TicketPreviewModal({
  visible,
  ticketId,
  onClose,
}: TicketPreviewModalProps) {
  const { user } = useAuth();
  const { showToast } = useFeedback();
  const { t } = useLanguage();
  const [ticket, setTicket] = useState<FeedbackTicket | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const loadTicket = useCallback(
    async (id: number) => {
      setLoading(true);
      setTicket(null);
      try {
        const res = await getFeedbackTicket(id);
        setTicket(res.data ?? null);
      } catch (e) {
        showToast(
          e instanceof Error ? e.message : t("ticket.failedLoad"),
          "error",
        );
      } finally {
        setLoading(false);
      }
    },
    [showToast],
  );

  useEffect(() => {
    if (visible && ticketId != null) {
      loadTicket(ticketId);
      setMessage("");
    }
  }, [visible, ticketId, loadTicket]);

  const messages: ChatMessage[] = ticket
    ? [
        ...(ticket.description
          ? [
              {
                id: -1,
                sender: "user" as const,
                name: t("common.you"),
                message: ticket.description,
                time: formatTime(ticket.created_at),
              },
            ]
          : []),
        ...(ticket.replies ?? []).map((r) => ({
          id: r.id,
          sender: r.is_admin_reply ? ("support" as const) : ("user" as const),
          name: r.is_admin_reply ? r.user_name : t("common.you"),
          message: r.message,
          time: formatTime(r.created_at),
        })),
      ]
    : [];

  const handleSend = async () => {
    const text = message.trim();
    if (!text || sending || ticketId == null) return;
    setSending(true);
    try {
      const uuid = user?.uuid ?? "";
      if (!uuid) {
        showToast(t("webinars.unableIdentify"), "error");
        return;
      }
      await replyFeedbackTicket(ticketId, text, uuid);
      setTicket((prev) =>
        prev
          ? {
              ...prev,
              replies: [
                ...(prev.replies ?? []),
                {
                  id: Date.now(),
                  message: text,
                  is_admin_reply: false,
                  user_name: t("common.you"),
                  created_at: new Date().toISOString(),
                },
              ],
            }
          : prev,
      );
      setMessage("");
    } catch (e) {
      showToast(
        e instanceof Error ? e.message : t("ticket.failedReply"),
        "error",
      );
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    setMessage("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} activeOpacity={0.7}>
            <Ionicons name="close" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {ticket?.ticket_number ?? t("ticket.ticket")}
          </Text>
          <View style={{ width: 24 }} />
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.brand} />
          </View>
        ) : (
          <>
            <ScrollView
              style={styles.body}
              contentContainerStyle={styles.bodyContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* ── Ticket Info Card ── */}
              {ticket && (
                <View style={styles.infoCard}>
                  <Text style={styles.subject}>{ticket.subject}</Text>
                  <Text style={styles.meta}>
                    {ticket.ticket_number} &bull;{" "}
                    {formatDate(ticket.created_at)}
                  </Text>

                  {/* Badges */}
                  <View style={styles.badgesRow}>
                    <View style={[styles.badge, styles.badgeModule]}>
                      <Text style={styles.badgeModuleText}>
                        {categoryLabel(ticket.category)}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.badge,
                        {
                          backgroundColor:
                            priorityColor(ticket.priority) + "1A",
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.badgeDot,
                          { backgroundColor: priorityColor(ticket.priority) },
                        ]}
                      />
                      <Text
                        style={[
                          styles.badgeText,
                          { color: priorityColor(ticket.priority) },
                        ]}
                      >
                        {priorityLabel(ticket.priority)}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.badge,
                        { backgroundColor: statusColor(ticket.status) + "1A" },
                      ]}
                    >
                      <View
                        style={[
                          styles.badgeDot,
                          { backgroundColor: statusColor(ticket.status) },
                        ]}
                      />
                      <Text
                        style={[
                          styles.badgeText,
                          { color: statusColor(ticket.status) },
                        ]}
                      >
                        {statusLabel(ticket.status)}
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              {/* ── Chat Section ── */}
              <Text style={styles.chatHeading}>{t("ticket.conversation")}</Text>

              {messages.map((msg) => (
                <View
                  key={msg.id}
                  style={[
                    styles.chatBubble,
                    msg.sender === "user"
                      ? styles.chatBubbleUser
                      : styles.chatBubbleSupport,
                  ]}
                >
                  <View style={styles.chatBubbleHeader}>
                    <Text
                      style={
                        msg.sender === "user"
                          ? styles.chatSenderUser
                          : styles.chatSenderSupport
                      }
                    >
                      {msg.name}
                    </Text>
                    <Text
                      style={
                        msg.sender === "user"
                          ? styles.chatTimeUser
                          : styles.chatTimeSupport
                      }
                    >
                      {msg.time}
                    </Text>
                  </View>
                  <Text
                    style={
                      msg.sender === "user"
                        ? styles.chatMessageUser
                        : styles.chatMessageSupport
                    }
                  >
                    {msg.message}
                  </Text>
                </View>
              ))}

              <View style={{ height: 20 }} />
            </ScrollView>

            {/* ── Message Input ── */}
            <View style={styles.inputBar}>
              <TextInput
                style={styles.messageInput}
                placeholder={t("ticket.typeMessage")}
                placeholderTextColor="#9CA3AF"
                value={message}
                onChangeText={setMessage}
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                style={[
                  styles.sendBtn,
                  (!message.trim() || sending) && styles.sendBtnDisabled,
                ]}
                activeOpacity={0.7}
                onPress={handleSend}
                disabled={!message.trim() || sending}
              >
                {sending ? (
                  <ActivityIndicator color={Colors.white} size="small" />
                ) : (
                  <Ionicons
                    name="send"
                    size={18}
                    color={message.trim() ? Colors.white : "#9CA3AF"}
                  />
                )}
              </TouchableOpacity>
            </View>
          </>
        )}
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ── Styles ──
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: Colors.brand,
  },

  // Body
  body: {
    flex: 1,
  },
  bodyContent: {
    padding: 20,
  },

  // Info Card
  infoCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
  },
  subject: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 6,
  },
  meta: {
    fontSize: 13,
    color: "#9CA3AF",
    marginBottom: 14,
  },
  badgesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 5,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  badgeModule: {
    backgroundColor: Colors.brand + "12",
  },
  badgeModuleText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.brand,
  },

  // Chat
  chatHeading: {
    fontSize: 15,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 14,
  },
  chatBubble: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    maxWidth: "85%",
  },
  chatBubbleUser: {
    alignSelf: "flex-end",
    backgroundColor: Colors.brand,
  },
  chatBubbleSupport: {
    alignSelf: "flex-start",
    backgroundColor: "#F3F4F6",
  },
  chatBubbleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  chatSenderUser: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.white,
  },
  chatSenderSupport: {
    fontSize: 12,
    fontWeight: "700",
    color: "#374151",
  },
  chatTimeUser: {
    fontSize: 11,
    color: "#FFFFFF99",
    marginLeft: 12,
  },
  chatTimeSupport: {
    fontSize: 11,
    color: "#9CA3AF",
    marginLeft: 12,
  },
  chatMessageUser: {
    fontSize: 14,
    color: Colors.white,
    lineHeight: 20,
  },
  chatMessageSupport: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },

  // Input bar
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingBottom: 36,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    gap: 10,
  },
  messageInput: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: "#111827",
    maxHeight: 100,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.brand,
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnDisabled: {
    backgroundColor: "#E5E7EB",
  },
});
