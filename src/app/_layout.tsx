import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState, type ReactNode } from "react";
import { Linking, StyleSheet, Text, View } from "react-native";
import { AuthProvider } from "../services/AuthContext";
import { isDeviceCompromised } from "../services/deviceSecurity";
import { FeedbackProvider, useFeedback } from "../services/FeedbackContext";
import { LanguageProvider } from "../services/LanguageContext";
import { isSafeDeepLink } from "../services/urlSafety";

SplashScreen.setOptions({
  duration: 0,
  fade: false,
});

function DeviceSecurityGate({ children }: { children: ReactNode }) {
  const [compromised, setCompromised] = useState(false);

  useEffect(() => {
    setCompromised(isDeviceCompromised());
  }, []);

  if (compromised) {
    return (
      <View style={styles.gate}>
        <Text style={styles.gateTitle}>Security check failed</Text>
        <Text style={styles.gateBody}>
          This device appears to be jailbroken or rooted. Access is blocked for
          your protection.
        </Text>
      </View>
    );
  }

  return <>{children}</>;
}

function DeepLinkGuard({ children }: { children: ReactNode }) {
  const { showToast } = useFeedback();

  useEffect(() => {
    const check = (url: string | null) => {
      if (url && !isSafeDeepLink(url)) {
        showToast("Blocked an untrusted link.", "error");
      }
    };

    Linking.getInitialURL()
      .then(check)
      .catch(() => {});
    const subscription = Linking.addEventListener("url", ({ url }) =>
      check(url),
    );

    return () => subscription.remove();
  }, [showToast]);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <FeedbackProvider>
          <DeviceSecurityGate>
            <DeepLinkGuard>
              <Stack screenOptions={{ headerShown: false }} />
            </DeepLinkGuard>
          </DeviceSecurityGate>
        </FeedbackProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  gate: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#FFFFFF",
  },
  gateTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  gateBody: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
  },
});
