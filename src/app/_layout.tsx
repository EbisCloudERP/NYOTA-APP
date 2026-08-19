import { Stack } from "expo-router";
import { AuthProvider } from "../services/AuthContext";
import { FeedbackProvider } from "../services/FeedbackContext";
import { LanguageProvider } from "../services/LanguageContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <FeedbackProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </FeedbackProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
