import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import LanguageSelector from "../../components/LanguageSelector";
import { loginOtp } from "../../services/api";
import { useAuth, type UserData } from "../../services/AuthContext";
import { Colors } from "../../theme/colors";

const CODE_LENGTH = 6;
const RESEND_COOLDOWN = 60;

const KEYPAD_KEYS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["", "0", "⌫"],
];

export default function OtpLoginScreen() {
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [timeLeft, setTimeLeft] = useState(RESEND_COOLDOWN);
  const [focusedIndex, setFocusedIndex] = useState(0);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const handleKeypadPress = (key: string) => {
    if (key === "⌫") {
      // Find the last filled digit and clear it
      const lastFilled = code.findLastIndex((d) => d !== "");
      if (lastFilled >= 0) {
        const newCode = [...code];
        newCode[lastFilled] = "";
        setCode(newCode);
        setFocusedIndex(lastFilled);
      }
      return;
    }

    if (key === "") return; // empty spacer

    // Find the first empty slot
    const firstEmpty = code.findIndex((d) => d === "");
    if (firstEmpty >= 0) {
      const newCode = [...code];
      newCode[firstEmpty] = key;
      setCode(newCode);
      setFocusedIndex(Math.min(firstEmpty + 1, CODE_LENGTH - 1));

      // Auto-verify when all digits filled
      if (firstEmpty === CODE_LENGTH - 1) {
        const fullCode = newCode.join("");
        handleVerify(fullCode);
      }
    }
  };

  const handleVerify = (fullCode: string) => {
    // TODO: verify login OTP
    console.log("Verify login code", { code: fullCode });
    setTimeout(() => {
      router.replace("/home");
    }, 250);
  };

  const handleResend = () => {
    setTimeLeft(RESEND_COOLDOWN);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
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
        <LanguageSelector />
        <Text style={styles.title}>Enter verification code</Text>
        <Text style={styles.subtitle}>
          We've sent a 6-digit code to your email
        </Text>

        <View style={styles.codeContainer}>
          {code.map((digit, index) => (
            <View
              key={index}
              style={[
                styles.codeInput,
                focusedIndex === index && styles.codeInputFocused,
              ]}
            >
              <Text style={styles.codeDigit}>{digit}</Text>
            </View>
          ))}
        </View>

        {loading && (
          <ActivityIndicator
            color={Colors.brand}
            style={styles.loader}
          />
        )}

        <View style={styles.timerContainer}>
          <Text style={styles.clockIcon}>⏳</Text>
          <Text style={styles.timerText}>
            Code expire in: {formatTime(timeLeft)}
          </Text>
        </View>

        {timeLeft > 0 ? (
          <Text style={styles.waitText}>
            Didn't receive the code? Wait: {formatTime(timeLeft)} to resend
          </Text>
        ) : (
          <TouchableOpacity onPress={handleResend} disabled={loading}>
            <Text style={[styles.resendLink, loading && { opacity: 0.5 }]}>
              Resend code
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.goBackContainer}
          onPress={() => router.back()}
          disabled={loading}
        >
          <Text style={styles.goBackText}>Wrong details? Go back</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Custom Keypad */}
      <View style={styles.keypadContainer}>
        {KEYPAD_KEYS.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.keypadRow}>
            {row.map((key, colIndex) => (
              <TouchableOpacity
                key={colIndex}
                style={[
                  styles.keypadButton,
                  key === "" && styles.keypadButtonEmpty,
                  key === "⌫" && styles.keypadButtonBackspace,
                ]}
                onPress={() => handleKeypadPress(key)}
                disabled={key === ""}
                activeOpacity={0.6}
              >
                <Text
                  style={[
                    styles.keypadText,
                    key === "⌫" && styles.keypadTextBackspace,
                  ]}
                >
                  {key}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 24,
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
  codeContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  codeInput: {
    width: 48,
    height: 56,
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9FAFB",
  },
  codeInputFocused: {
    borderColor: Colors.brand,
    backgroundColor: "#F5F0FF",
  },
  codeDigit: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1F2937",
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  clockIcon: { fontSize: 16 },
  timerText: { fontSize: 14, color: "#6B7280" },
  waitText: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    marginBottom: 16,
  },
  resendLink: {
    fontSize: 14,
    color: Colors.brand,
    fontWeight: "600",
    marginBottom: 16,
  },
  goBackContainer: { marginTop: 8 },
  goBackText: { fontSize: 14, color: Colors.brand, fontWeight: "500" },
  // Keypad styles
  keypadContainer: {
    backgroundColor: "#F9FAFB",
    paddingTop: 16,
    paddingBottom: 32,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  keypadRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginBottom: 12,
  },
  keypadButton: {
    width: 72,
    height: 52,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  keypadButtonEmpty: {
    backgroundColor: "transparent",
    borderWidth: 0,
  },
  keypadButtonBackspace: {
    backgroundColor: "#F3F4F6",
    borderColor: "#E5E7EB",
  },
  keypadText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1F2937",
  },
  keypadTextBackspace: {
    fontSize: 20,
    color: "#4B5563",
  },
});
