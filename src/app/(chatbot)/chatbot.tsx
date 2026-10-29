import Ionicons from "@react-native-vector-icons/ionicons";
import {
  useEffect,
  useRef,
  useState,
  type ComponentProps,
} from "react";
import {
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLanguage } from "../../services/LanguageContext";
import type { TranslationKey } from "../../services/translations";
import { Colors } from "../../theme/colors";

type ChatMessage = {
  id: number;
  role: "bot" | "user";
  text: string;
};

const FEATURES: {
  icon: ComponentProps<typeof Ionicons>["name"];
  titleKey: TranslationKey;
  bodyKey: TranslationKey;
}[] = [
  {
    icon: "time-outline",
    titleKey: "chatbot.featureAlwaysTitle",
    bodyKey: "chatbot.featureAlwaysBody",
  },
  {
    icon: "flash-outline",
    titleKey: "chatbot.featureFastTitle",
    bodyKey: "chatbot.featureFastBody",
  },
  {
    icon: "shield-checkmark-outline",
    titleKey: "chatbot.featureSafeTitle",
    bodyKey: "chatbot.featureSafeBody",
  },
];

// Mock conversation used until the assistant API is wired up.
const BOT_INTRO: TranslationKey[] = [
  "chatbot.botMessage1",
  "chatbot.botMessage2",
  "chatbot.botMessage3",
];

const CHAT_OPTIONS: { id: string; labelKey: TranslationKey }[] = [
  { id: "get-agpo-ready", labelKey: "chatbot.optionGetReady" },
  { id: "bid-for-tenders", labelKey: "chatbot.optionTenders" },
  { id: "finance-contract", labelKey: "chatbot.optionFinancing" },
];

const FIRST_MESSAGE_DELAY_MS = 400;
const TYPING_MS = 800;
const MESSAGE_GAP_MS = 500;

const wait = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

function TypingDots() {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(pulse, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    animation.start();
    return () => animation.stop();
  }, [pulse]);

  return (
    <View style={styles.typingBubble}>
      {[0, 1, 2].map((index) => (
        <Animated.View
          key={index}
          style={[
            styles.typingDot,
            {
              opacity: pulse.interpolate({
                inputRange: [0, 0.2 + index * 0.2, 0.4 + index * 0.2, 1],
                outputRange: [0.25, 1, 0.25, 0.25],
              }),
            },
          ]}
        />
      ))}
    </View>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <View style={[styles.messageRow, isUser && styles.messageRowUser]}>
      <View
        style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}
      >
        <Text
          style={[styles.bubbleText, isUser && styles.userBubbleText]}
        >
          {message.text}
        </Text>
      </View>
    </View>
  );
}

export default function ChatbotScreen() {
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();

  const [mode, setMode] = useState<"intro" | "chat">("intro");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const scrollRef = useRef<ScrollView>(null);
  const nextId = useRef(0);
  const scriptStarted = useRef(false);
  const translateRef = useRef(t);

  useEffect(() => {
    translateRef.current = t;
  }, [t]);

  useEffect(() => {
    if (mode !== "chat" || scriptStarted.current) return;
    scriptStarted.current = true;
    let cancelled = false;

    const playIntro = async () => {
      await wait(FIRST_MESSAGE_DELAY_MS);
      for (const key of BOT_INTRO) {
        if (cancelled) return;
        setIsTyping(true);
        await wait(TYPING_MS);
        if (cancelled) return;
        setIsTyping(false);
        const id = nextId.current++;
        setMessages((prev) => [
          ...prev,
          { id, role: "bot", text: translateRef.current(key) },
        ]);
        await wait(MESSAGE_GAP_MS);
      }
      if (!cancelled) setShowOptions(true);
    };

    playIntro();

    return () => {
      cancelled = true;
    };
  }, [mode]);

  const handleSend = () => {
    const option = CHAT_OPTIONS.find((item) => item.id === selectedId);
    if (!option || isTyping) return;

    const id = nextId.current++;
    setMessages((prev) => [
      ...prev,
      { id, role: "user", text: t(option.labelKey) },
    ]);
    setSelectedId(null);
    setShowOptions(false);
    setIsTyping(true);

    // TODO(backend): send `option.id` to the assistant service, then append the
    // reply to `messages`, call setIsTyping(false) and setShowOptions(true) with
    // the next set of choices. The typing indicator stays on until then.
  };

  if (mode === "chat") {
    return (
      <View style={styles.container}>
        <ScrollView
          ref={scrollRef}
          style={styles.chatScroll}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            scrollRef.current?.scrollToEnd({ animated: true })
          }
        >
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isTyping ? <TypingDots /> : null}
        </ScrollView>

        {showOptions ? (
          <View
            style={[
              styles.composer,
              { paddingBottom: Math.max(insets.bottom, 14) },
            ]}
          >
            <Text style={styles.composerTitle}>
              {t("chatbot.chooseOption")}
            </Text>
            {CHAT_OPTIONS.map((option) => {
              const selected = option.id === selectedId;
              return (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.optionRow,
                    selected && styles.optionRowSelected,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => setSelectedId(option.id)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                >
                  <Text
                    style={[
                      styles.optionLabel,
                      selected && styles.optionLabelSelected,
                    ]}
                  >
                    {t(option.labelKey)}
                  </Text>
                  <Ionicons
                    name={selected ? "checkmark-circle" : "ellipse-outline"}
                    size={20}
                    color={selected ? Colors.brand : "#C7CBD3"}
                  />
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity
              style={[
                styles.sendButton,
                !selectedId && styles.sendButtonDisabled,
              ]}
              activeOpacity={0.85}
              disabled={!selectedId}
              onPress={handleSend}
              accessibilityRole="button"
              accessibilityLabel={t("chatbot.send")}
            >
              <Text style={styles.sendButtonText}>{t("chatbot.send")}</Text>
              <Ionicons name="arrow-up" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.statusPill}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>{t("chatbot.online")}</Text>
          </View>

          <View style={styles.botAvatar}>
            <Ionicons name="chatbubble-ellipses" size={34} color="#FFFFFF" />
          </View>

          <Text style={styles.title}>{t("chatbot.title")}</Text>
          <Text style={styles.subtitle}>{t("chatbot.subtitle")}</Text>
        </View>

        <Text style={styles.sectionTitle}>{t("chatbot.canHelp")}</Text>
        <View style={styles.featureCard}>
          {FEATURES.map((feature, index) => (
            <View
              key={feature.titleKey}
              style={[
                styles.featureRow,
                index < FEATURES.length - 1 && styles.featureRowDivider,
              ]}
            >
              <View style={styles.featureIcon}>
                <Ionicons
                  name={feature.icon}
                  size={18}
                  color={Colors.brand}
                />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{t(feature.titleKey)}</Text>
                <Text style={styles.featureBody}>{t(feature.bodyKey)}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View
        style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}
      >
        <TouchableOpacity
          style={styles.startButton}
          activeOpacity={0.85}
          onPress={() => setMode("chat")}
          accessibilityRole="button"
          accessibilityLabel={t("chatbot.start")}
        >
          <Text style={styles.startButtonText}>{t("chatbot.start")}</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.footerNote}>{t("chatbot.startHint")}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  chatScroll: {
    flex: 1,
  },
  chatContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  messageRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  messageRowUser: {
    justifyContent: "flex-end",
  },
  bubble: {
    maxWidth: "82%",
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 16,
  },
  botBubble: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: Colors.brand,
    borderBottomRightRadius: 4,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#1F2937",
  },
  userBubbleText: {
    color: "#FFFFFF",
  },
  typingBubble: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#9CA3AF",
  },
  composer: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  composerTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 10,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 8,
  },
  optionRowSelected: {
    borderColor: Colors.brand,
    backgroundColor: "#F5F0FA",
  },
  optionLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: "#1F2937",
  },
  optionLabelSelected: {
    color: Colors.brand,
    fontWeight: "600",
  },
  sendButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.brand,
    borderRadius: 14,
    paddingVertical: 15,
    marginTop: 4,
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
  sendButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 8,
  },
  hero: {
    backgroundColor: Colors.brand,
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 28,
    alignItems: "center",
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.16)",
    marginBottom: 20,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#34D399",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  botAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.16)",
    marginBottom: 18,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: "rgba(255, 255, 255, 0.82)",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F2937",
    marginTop: 24,
    marginBottom: 12,
  },
  featureCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingVertical: 14,
  },
  featureRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  featureIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F0FA",
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 2,
  },
  featureBody: {
    fontSize: 13,
    lineHeight: 19,
    color: "#6B7280",
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    backgroundColor: "#FFFFFF",
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.brand,
    borderRadius: 14,
    paddingVertical: 16,
  },
  startButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  footerNote: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 10,
  },
});
