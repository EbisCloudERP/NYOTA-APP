import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { AuthProvider } from "../services/AuthContext";
import { LanguageProvider } from "../services/LanguageContext";

SplashScreen.setOptions({
  duration: 0,
  fade: false,
});

export default function RootLayout() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </LanguageProvider>
    </AuthProvider>
  );
}
