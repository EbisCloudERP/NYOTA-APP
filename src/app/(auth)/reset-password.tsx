import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import LanguageSelector from "../../components/LanguageSelector";
import { resetPassword } from "../../services/api";
import { useFeedback } from "../../services/FeedbackContext";
import { useLanguage } from "../../services/LanguageContext";
import { Colors } from "../../theme/colors";

export default function ResetPasswordScreen() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useFeedback();
  const { t } = useLanguage();
  const { contact: contactParam, type: typeParam } = useLocalSearchParams<{
    contact?: string;
    type?: string;
  }>();
  const contact = contactParam ?? "";
  const type = typeParam ?? (contact.includes("@") ? "email" : "phone");

  const handleResetPassword = async () => {
    if (!contact) {
      showToast(t("auth.reset.missingDetails"), "error");
      return;
    }
    if (!password || password.length < 8) {
      showToast(t("auth.register.passwordLength"), "error");
      return;
    }
    if (password !== confirmPassword) {
      showToast(t("auth.register.passwordMismatch"), "error");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(type, contact, password, confirmPassword);
      router.replace("/login");
      setTimeout(() => {
        showToast(t("auth.reset.success"), "success");
      }, 300);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : t("auth.reset.failed");
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Title */}
        <LanguageSelector />
        <Text style={styles.title}>{t("auth.reset.title")}</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>{t("auth.reset.subtitle")}</Text>

        {/* Form */}
        <View style={styles.form}>
          {/* Password Field */}
          <Text style={styles.label}>{t("auth.reset.newPassword")}</Text>
          <TextInput
            style={styles.input}
            placeholder={t("auth.reset.newPasswordPlaceholder")}
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {/* Confirm Password Field */}
          <Text style={styles.label}>{t("auth.reset.confirmPassword")}</Text>
          <TextInput
            style={styles.input}
            placeholder={t("auth.reset.confirmPasswordPlaceholder")}
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          {/* Reset Password Button */}
          <TouchableOpacity
            style={[styles.resetButton, loading && { opacity: 0.6 }]}
            onPress={handleResetPassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.resetButtonText}>
                {t("auth.reset.reset")}
              </Text>
            )}
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>{t("auth.create.alreadyHave")}</Text>
            <TouchableOpacity onPress={() => router.replace("/login")}>
              <Text style={styles.loginLink}>{t("auth.create.logIn")}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>{t("common.footer")}</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 22,
  },
  form: {
    width: "100%",
    maxWidth: 400,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#1F2937",
    backgroundColor: "#F9FAFB",
  },
  resetButton: {
    width: "100%",
    height: 50,
    backgroundColor: Colors.brand,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 32,
    marginBottom: 24,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  loginText: {
    fontSize: 14,
    color: "#6B7280",
  },
  loginLink: {
    fontSize: 14,
    color: Colors.brand,
    fontWeight: "600",
  },
  footer: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
  },
});
