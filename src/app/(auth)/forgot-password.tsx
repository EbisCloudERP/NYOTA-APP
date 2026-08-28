import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import LanguageSelector from "../../components/LanguageSelector";
import { sendEmailOtp, sendSms } from "../../services/api";
import { useFeedback } from "../../services/FeedbackContext";
import { Colors } from "../../theme/colors";

const FORGOT_PW_IMAGE = require("../../../assets/images/nyotapic_girl.jpeg");

export default function ForgotPasswordScreen() {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useFeedback();

  const handleVerify = async () => {
    const contact = emailOrPhone.trim();
    if (!contact) {
      showToast("Please enter your email or phone number", "error");
      return;
    }
    const type = contact.includes("@") ? "email" : "phone";

    setLoading(true);
    try {
      const otp = String(Math.floor(100000 + Math.random() * 900000));

      router.push({
        pathname: "/otp-reset-pass",
        params: { contact, type, otp },
      });

      if (type === "email") {
        sendEmailOtp(contact, otp).catch(() => {});
      } else {
        const mobile = `254${contact.replace(/^\+|^0+/, "")}`;
        sendSms(mobile, `Your NYOTA verification code is: ${otp}`).catch(
          () => {}
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Full-screen background image */}
      <Image
        source={FORGOT_PW_IMAGE}
        style={styles.bgImage}
        contentFit="cover"
        contentPosition="top center"
      />

      {/* Spacer */}
      <View style={[styles.spacer, isFocused && styles.spacerCollapsed]} />

      {/* Bottom card */}
      <View style={[styles.bottomCard, isFocused && styles.bottomCardExpanded]}>
        <ScrollView
          contentContainerStyle={styles.bottomContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <LanguageSelector />
          <Text style={styles.title}>Forgot password</Text>

          <Text style={styles.subtitle}>
            Enter your email address or phone number and we will send you a
            password reset link
          </Text>

          {/* Email/Phone Field */}
          <Text style={styles.label}>Email address or phone number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email or phone number"
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={emailOrPhone}
            onChangeText={setEmailOrPhone}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />

          {/* Info text */}
          <Text style={styles.infoText}>
            We'll send a verification code to this email
          </Text>

          {/* Verify Button */}
          <TouchableOpacity
            style={[styles.verifyButton, loading && { opacity: 0.6 }]}
            onPress={handleVerify}
            disabled={loading}
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

          {/* Footer */}
          <Text style={styles.footer}>© 2026 EbisCloud Solutions</Text>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  bgImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  spacer: {
    flex: 5,
  },
  spacerCollapsed: {
    flex: 2,
  },
  bottomCard: {
    flex: 5,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  bottomCardExpanded: {
    flex: 8,
  },
  bottomContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },
  input: {
    width: "100%",
    height: 48,
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
    marginTop: 6,
    marginBottom: 16,
  },
  verifyButton: {
    width: "100%",
    height: 48,
    backgroundColor: Colors.brand,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
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
    marginBottom: 14,
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
