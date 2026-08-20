import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { AuthProvider } from "../services/AuthContext";
import { FeedbackProvider } from "../services/FeedbackContext";
import { LanguageProvider } from "../services/LanguageContext";

SplashScreen.setOptions({
  duration: 0,
  fade: false,
});

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
