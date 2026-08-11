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

export default function RegisterScreen() {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [county, setCounty] = useState("");
  const [subCounty, setSubCounty] = useState("");
  const [ward, setWard] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordsMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  const getPasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^a-zA-Z\d]/.test(pwd)) score++;
    return score;
  };

  const strength = getPasswordStrength(password);
  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["#EF4444", "#F59E0B", "#208AEF", "#10B981"];

  const handleRegister = () => {
    router.push("/verify-phone");
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
        <Text style={styles.title}>Finish setting up your account</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Almost there! Please complete the form below to create your account.
        </Text>

        {/* Form */}
        <View style={styles.form}>
          {/* ── Personal Information ── */}
          <Text style={styles.sectionHeader}>Personal Information</Text>

          {/* First Name */}
          <Text style={styles.label}>First name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your first name"
            placeholderTextColor="#9CA3AF"
            value={firstName}
            onChangeText={setFirstName}
          />

          {/* Middle Name */}
          <Text style={styles.label}>Middle name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your middle name"
            placeholderTextColor="#9CA3AF"
            value={middleName}
            onChangeText={setMiddleName}
          />

          {/* Last Name */}
          <Text style={styles.label}>Last name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your last name"
            placeholderTextColor="#9CA3AF"
            value={lastName}
            onChangeText={setLastName}
          />

          {/* National ID */}
          <Text style={styles.label}>National ID number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your national ID number"
            placeholderTextColor="#9CA3AF"
            keyboardType="number-pad"
            value={nationalId}
            onChangeText={setNationalId}
          />
          <Text style={styles.infoText}>
            We'll use this to verify your identity
          </Text>

          {/* ── County Information ── */}
          <Text style={styles.sectionHeader}>County Information</Text>

          {/* County */}
          <Text style={styles.label}>County</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your county"
            placeholderTextColor="#9CA3AF"
            value={county}
            onChangeText={setCounty}
          />

          {/* Sub-county */}
          <Text style={styles.label}>Constituency</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your constituency"
            placeholderTextColor="#9CA3AF"
            value={subCounty}
            onChangeText={setSubCounty}
          />

          {/* Ward */}
          <Text style={styles.label}>Ward</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your ward"
            placeholderTextColor="#9CA3AF"
            value={ward}
            onChangeText={setWard}
          />

          {/* ── Password ── */}
          <Text style={styles.sectionHeader}>Password</Text>

          {/* Password */}
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Text style={styles.infoText}>
            Must be at least 8 characters and include a mix of letters and
            numbers
          </Text>

          {/* Confirm Password */}
          <Text style={styles.label}>Confirm password</Text>
          <TextInput
            style={[styles.input, passwordsMismatch && styles.inputError]}
            placeholder="Confirm your password"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          {passwordsMismatch ? (
            <Text style={styles.errorText}>Passwords do not match</Text>
          ) : (
            <Text style={styles.infoText}>
              Must match the password entered above
            </Text>
          )}

          {/* Password Strength Bar */}
          {password.length > 0 && (
            <View style={styles.strengthContainer}>
              <View style={styles.strengthBar}>
                <View
                  style={[
                    styles.strengthFill,
                    {
                      width: `${((strength + 1) / 4) * 100}%`,
                      backgroundColor: strengthColors[strength],
                    },
                  ]}
                />
              </View>
              <Text
                style={[
                  styles.strengthLabel,
                  { color: strengthColors[strength] },
                ]}
              >
                {strengthLabels[strength]}
              </Text>
            </View>
          )}

          {/* Register Button */}
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
          >
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.replace("/login")}>
              <Text style={styles.loginLink}>Login</Text>
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
    paddingTop: 60,
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
    marginBottom: 32,
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
    marginTop: 14,
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
  inputError: {
    borderColor: "#EF4444",
  },
  infoText: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 4,
  },
  errorText: {
    fontSize: 12,
    color: "#EF4444",
    marginTop: 4,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.brand,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 24,
    marginBottom: 4,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  strengthContainer: {
    marginTop: 12,
  },
  strengthBar: {
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
    overflow: "hidden",
  },
  strengthFill: {
    height: "100%",
    borderRadius: 2,
  },
  strengthLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
  registerButton: {
    width: "100%",
    height: 50,
    backgroundColor: Colors.brand,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 28,
    marginBottom: 24,
  },
  registerButtonText: {
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
