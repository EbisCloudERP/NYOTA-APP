import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import LanguageSelector from "../../components/LanguageSelector";
import { login, sendEmailOtp } from "../../services/api";
import { Colors } from "../../theme/colors";

const NYOTA_IMAGE = require("../../../assets/images/nyotapic_teens.jpeg");

export default function LoginScreen() {
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isFormValid = email.trim().length > 0 && password.trim().length > 0;
  const isLoginDisabled = showForm && !isFormValid;

  const handleLoginPress = () => {
    if (!showForm) {
      setShowForm(true);
      return;
    }
    router.push("/otp-login");
  };

  return (
    <View style={styles.container}>
      {/* Full-screen background image */}
      <Image
        source={NYOTA_IMAGE}
        style={styles.bgImage}
        contentFit="cover"
        // contentPosition="top center"
      />

      {/* Bottom card — slides up over the image */}
      <View
        style={[
          styles.bottomCard,
          isFocused
            ? styles.bottomCardFocused
            : showForm && styles.bottomCardExpanded,
        ]}
      >
        <ScrollView
          contentContainerStyle={styles.bottomScrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <LanguageSelector />
          <Text style={styles.title}>Welcome back!</Text>

          <Text style={styles.subtitle}>
            Log into your account
          </Text>

          {/* Hidden fields — revealed on first Login tap */}
          {showForm && (
            <View style={styles.form}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />

              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />

              <TouchableOpacity
                style={styles.forgotPasswordContainer}
                onPress={() => router.push("/forgot-password")}
              >
                <Text style={styles.forgotPassword}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Login Button */}
          <TouchableOpacity
            style={[
              styles.loginButton,
              isLoginDisabled && styles.loginButtonDisabled,
            ]}
            onPress={handleLoginPress}
            disabled={isLoginDisabled}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          {/* Sign Up Button (outline) */}
          <TouchableOpacity
            style={styles.signUpButton}
            onPress={() => router.push("/create-account")}
          >
            <Text style={styles.signUpButtonText}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.onboardTestContainer}
            onPress={() => router.push("/getstarted")}
            disabled={loading}
          >
            <Text style={styles.onboardTestText}>Onboard test</Text>
          </TouchableOpacity>

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
  // ── Full-screen background image ──
  bgImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 160,
  },
  // ── Bottom: Card (overlaps image) ──
  bottomCard: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    top: "60%",
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
    top: "30%",
  },
  bottomCardFocused: {
    top: "20%",
  },
  bottomScrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
    alignItems: "center",
  },
  // ── Text ──
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
    marginBottom: 24,
    lineHeight: 22,
  },
  // ── Form ──
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
    alignSelf: "flex-start",
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
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginTop: 8,
    marginBottom: 24,
  },
  forgotPassword: {
    fontSize: 14,
    color: Colors.brand,
    fontWeight: "500",
  },
  // ── Buttons ──
  loginButton: {
    width: "100%",
    height: 50,
    backgroundColor: Colors.brand,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  loginButtonDisabled: {
    opacity: 0.5,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  signUpButton: {
    width: "100%",
    height: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: Colors.brand,
    backgroundColor: "transparent",
    marginBottom: 32,
  },
  signUpButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.brand,
  },
  // ── Bottom extras ──
  onboardTestContainer: {
    alignItems: "center",
    marginBottom: 12,
  },
  onboardTestText: {
    fontSize: 12,
    color: "#9CA3AF",
    textDecorationLine: "underline",
  },
  footer: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
  },
});
