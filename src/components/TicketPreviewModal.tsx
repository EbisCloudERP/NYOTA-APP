import Ionicons from "@react-native-vector-icons/ionicons";
import { useState } from "react";
import {
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
import { Colors } from "../theme/colors";

// ── Types ──
interface ChatMessage {
  id: number;
  sender: "user" | "support";
  message: string;
  time: string;
}

interface Ticket {
  id: string;
  subject: string;
  module: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  status: "Open" | "Ongoing" | "Resolved" | "Closed";
  date: string;
}

interface TicketPreviewModalProps {
  visible: boolean;
  ticket: Ticket | null;
  onClose: () => void;
}

// ── Helpers ──
const priorityColor = (p: Ticket["priority"]): string => {
  switch (p) {
    case "Critical":
      return "#DC2626";
    case "High":
      return "#EA580C";
    case "Medium":
      return "#CA8A04";
    case "Low":
      return "#16A34A";
  }
};

const statusColor = (s: Ticket["status"]): string => {
  switch (s) {
    case "Open":
      return "#2563EB";
    case "Ongoing":
      return "#9333EA";
    case "Resolved":
      return "#16A34A";
    case "Closed":
      return "#6B7280";
  }
};

// ── Dummy chat data ──
const dummyMessages: ChatMessage[] = [
  {
    id: 1,
    sender: "user",
    message:
      "Hi, I'm unable to access the course materials for the Advanced React module. It keeps showing a loading spinner.",
    time: "10:30 AM",
  },
  {
    id: 2,
    sender: "support",
    message:
      "Hello! Thank you for reaching out. I'll look into this right away. Could you confirm which browser you're using?",
    time: "10:32 AM",
  },
  {
    id: 3,
    sender: "user",
    message: "I'm using Chrome on my laptop, version 120.",
    time: "10:33 AM",
  },
  {
    id: 4,
    sender: "support",
    message:
      "Thanks for confirming. We've identified the issue — it's related to a recent update. Our team is deploying a fix now. It should be resolved within the hour.",
    time: "10:35 AM",
  },
  {
    id: 5,
    sender: "user",
    message: "Okay, thank you! I'll check back later.",
    time: "10:36 AM",
  },
  {
    id: 6,
    sender: "support",
    message:
      "You're welcome! Feel free to reach out if you need anything else. We'll also send you an email once the fix is live.",
    time: "10:37 AM",
  },
];

// ── Component ──
export default function TicketPreviewModal({
  visible,
  ticket,
  onClose,
}: TicketPreviewModalProps) {
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] =
    useState<ChatMessage[]>(dummyMessages);

  const handleSend = () => {
    if (!message.trim()) return;
    const newMsg: ChatMessage = {
      id: chatMessages.length + 1,
      sender: "user",
      message: message.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setChatMessages((prev) => [...prev, newMsg]);
    setMessage("");
  };

  const handleClose = () => {
    setMessage("");
    setChatMessages(dummyMessages);
    onClose();
  };

  if (!ticket) return null;

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
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} activeOpacity={0.7}>
            <Ionicons name="close" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{ticket.id}</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          style={styles.body}
          contentContainerStyle={styles.bodyContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Ticket Info Card ── */}
          <View style={styles.infoCard}>
            <Text style={styles.subject}>{ticket.subject}</Text>
            <Text style={styles.meta}>
              {ticket.id} &bull; {ticket.date}
            </Text>

            {/* Badges */}
            <View style={styles.badgesRow}>
              <View style={[styles.badge, styles.badgeModule]}>
                <Text style={styles.badgeModuleText}>{ticket.module}</Text>
              </View>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: priorityColor(ticket.priority) + "1A" },
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
                  {ticket.priority}
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
                  {ticket.status}
                </Text>
              </View>
            </View>
          </View>

          {/* ── Chat Section ── */}
          <Text style={styles.chatHeading}>Conversation</Text>

          {chatMessages.map((msg) => (
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
                  {msg.sender === "user" ? "You" : "Support Team"}
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
            placeholder="Type your message..."
            placeholderTextColor="#9CA3AF"
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendBtn, !message.trim() && styles.sendBtnDisabled]}
            activeOpacity={0.7}
            onPress={handleSend}
            disabled={!message.trim()}
          >
            <Ionicons
              name="send"
              size={18}
              color={message.trim() ? Colors.white : "#9CA3AF"}
            />
          </TouchableOpacity>
        </View>
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
