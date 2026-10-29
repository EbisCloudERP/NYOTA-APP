import Ionicons from "@react-native-vector-icons/ionicons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLanguage } from "../services/LanguageContext";
import { Colors } from "../theme/colors";

const HINT_DELAY_MS = 700;
const HINT_VISIBLE_MS = 4000;

export default function ChatbotFab() {
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const [hintVisible, setHintVisible] = useState(false);
  const hintOpacity = useRef(new Animated.Value(0)).current;
  const hintOffset = useRef(new Animated.Value(8)).current;

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setHintVisible(true);
      Animated.parallel([
        Animated.timing(hintOpacity, {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(hintOffset, {
          toValue: 0,
          duration: 220,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }, HINT_DELAY_MS);

    const hideTimer = setTimeout(() => {
      Animated.timing(hintOpacity, {
        toValue: 0,
        duration: 260,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start(() => setHintVisible(false));
    }, HINT_DELAY_MS + HINT_VISIBLE_MS);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [hintOpacity, hintOffset]);

  const openChatbot = () => {
    setHintVisible(false);
    router.push("/(chatbot)/chatbot" as any);
  };

  return (
    <View style={[styles.overlay, { bottom: insets.bottom + 64 }]}>
      {hintVisible ? (
        <Animated.View
          style={[
            styles.hint,
            { opacity: hintOpacity, transform: [{ translateX: hintOffset }] },
          ]}
        >
          <TouchableOpacity
            style={styles.hintPressable}
            activeOpacity={0.8}
            onPress={openChatbot}
            accessibilityRole="button"
            accessibilityLabel={t("chatbot.fabHint")}
          >
            <Text style={styles.hintText}>{t("chatbot.fabHint")}</Text>
          </TouchableOpacity>
        </Animated.View>
      ) : null}

      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={openChatbot}
        accessibilityRole="button"
        accessibilityLabel={t("chatbot.fabHint")}
      >
        <Ionicons name="chatbubble-ellipses" size={26} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    pointerEvents: "box-none",
  },
  hint: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#EDE7F5",
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: Colors.brand,
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  hintPressable: {
    flexDirection: "row",
    alignItems: "center",
  },
  hintText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.brand,
  },
  fab: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.brand,
    shadowColor: Colors.brand,
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
});
