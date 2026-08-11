import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
import { verifyEmail, sendEmailOtp } from "../../services/api";
import { Colors } from "../../theme/colors";

export default function CreateAccountScreen() {
  const [companyName, setCompanyName] = useState("");
  const [companyNumber, setCompanyNumber] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const isFormValid =
    companyName.trim() !== "" &&
    companyNumber.trim() !== "" &&
    email.trim() !== "";

  const handleVerify = async () => {
    if (!isFormValid) return;

    setLoading(true);
    try {
      const response = await verifyEmail(
        email.trim(),
        companyName.trim(),
        companyNumber.trim()
      );

      if (response.data.exists) {
        Alert.alert(
          "Account Exists",
          "An account with this email already exists. Please log in instead.",
          [{ text: "OK", onPress: () => router.replace("/login") }]
        );
        return;
      }

      const otp = String(Math.floor(100000 + Math.random() * 900000));
      router.push({
        pathname: "/otp-create-account",
        params: { email: email.trim(), otp },
      });

      sendEmailOtp(email.trim(), otp).catch(() => {});
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Verification failed. Please try again.";
      Alert.alert("Verification Failed", message);
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
        <Text style={styles.title}>Create your account</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Join thousands of businesses building their future
        </Text>

        {/* Form */}
        <View style={styles.form}>
          {/* Company/Business Name */}
          <Text style={styles.label}>Company/Business Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter company or business name"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="words"
            value={companyName}
            onChangeText={setCompanyName}
          />

          {/* Company/Business Number */}
          <Text style={[styles.label, { marginTop: 20 }]}>
            Company/Business Number
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter company or business number"
            placeholderTextColor="#9CA3AF"
            value={companyNumber}
            onChangeText={setCompanyNumber}
          />

          {/* Email Field */}
          <Text style={[styles.label, { marginTop: 20 }]}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
          />

          {/* Info text */}
          <Text style={styles.infoText}>
            We'll send a verification code to this email
          </Text>

          {/* Verify Button */}
          <TouchableOpacity
            style={[
              styles.verifyButton,
              (!isFormValid || loading) && styles.verifyButtonDisabled,
            ]}
            onPress={handleVerify}
            disabled={!isFormValid || loading}
            activeOpacity={isFormValid && !loading ? 0.7 : 1}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.verifyButtonText}>Verify</Text>
            )}
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.loginLink}>Log in</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>© 2026 EbisCloud Solutions</Text>
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
  infoText: {
    fontSize: 13,
    color: "#9CA3AF",
    marginTop: 8,
    marginBottom: 24,
  },
  verifyButton: {
    width: "100%",
    height: 50,
    backgroundColor: Colors.brand,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  verifyButtonDisabled: {
    backgroundColor: "#B0A0C8",
  },
  verifyButtonText: {
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
