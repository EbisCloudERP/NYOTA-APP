import { router } from "expo-router";
import { useState } from "react";
import {
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
import { Colors } from "../../theme/colors";

export default function VerifyPhoneScreen() {
  const [phone, setPhone] = useState("");

  const handleVerify = () => {
    router.push("/otp-verify-phone");
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
        <Text style={styles.title}>Verify your phone number</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Enter your phone number to verify your account
        </Text>

        {/* Form */}
        <View style={styles.form}>
          {/* Phone Field */}
          <Text style={styles.label}>Phone number</Text>
          <View style={styles.phoneRow}>
            <View style={styles.prefixContainer}>
              <Text style={styles.prefix}>+254</Text>
            </View>
            <TextInput
              style={styles.phoneInput}
              placeholder="712 345 678"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
              maxLength={9}
              value={phone}
              onChangeText={setPhone}
            />
          </View>
          <Text style={styles.infoText}>
            Example: +254 712 345 678 → enter 712345678
          </Text>

          {/* Verify Button */}
          <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
            <Text style={styles.verifyButtonText}>Verify</Text>
          </TouchableOpacity>

          {/* Go Back */}
          <TouchableOpacity
            style={styles.goBackContainer}
            onPress={() => router.back()}
          >
            <Text style={styles.goBackText}>Wrong details? Go back</Text>
          </TouchableOpacity>
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
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  prefixContainer: {
    height: 50,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    borderRightWidth: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
  },
  prefix: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  phoneInput: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#1F2937",
    backgroundColor: "#F9FAFB",
  },
  infoText: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 6,
    marginBottom: 28,
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
  verifyButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  goBackContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  goBackText: {
    fontSize: 14,
    color: Colors.brand,
    fontWeight: "500",
  },
  footer: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
  },
});
