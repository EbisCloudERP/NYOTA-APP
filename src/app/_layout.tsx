import { Stack } from "expo-router";
import { AuthProvider } from "../services/AuthContext";
import { LanguageProvider } from "../services/LanguageContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </LanguageProvider>
    </AuthProvider>
  );
}
