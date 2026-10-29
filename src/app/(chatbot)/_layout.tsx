import { Stack } from "expo-router";
import { useLanguage } from "../../services/LanguageContext";
import { Colors } from "../../theme/colors";

export default function ChatbotGroupLayout() {
  const { t } = useLanguage();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTintColor: Colors.brand,
        headerTitleStyle: {
          fontWeight: "700",
          color: "#111827",
        },
        headerShadowVisible: false,
        headerStyle: { backgroundColor: "#FFFFFF" },
      }}
    >
      <Stack.Screen
        name="chatbot"
        options={{ headerTitle: t("chatbot.headerTitle") }}
      />
    </Stack>
  );
}
