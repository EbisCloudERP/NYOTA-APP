import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
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

const CODE_LENGTH = 6;
const RESEND_COOLDOWN = 60;

export default function OtpLoginScreen() {
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [timeLeft, setTimeLeft] = useState(RESEND_COOLDOWN);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const handleCodeChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text.slice(-1);
    setCode(newCode);

    if (text && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (text && index === CODE_LENGTH - 1) {
      const fullCode = newCode.join("");
      if (fullCode.length === CODE_LENGTH) {
        handleVerify(fullCode);
      }
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = (fullCode: string) => {
    // TODO: verify login OTP
    console.log("Verify login code", { code: fullCode });
    router.replace("/home");
  };

  const handleResend = () => {
    setTimeLeft(RESEND_COOLDOWN);
    console.log("Resend code");
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
            <TextInput
              key={index}
              ref={(ref) => {
                inputRefs.current[index] = ref;
              }}
              style={styles.codeInput}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleCodeChange(text, index)}
              onKeyPress={({ nativeEvent }) =>
                handleKeyPress(nativeEvent.key, index)
              }
            />
          ))}
        </View>

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
          <TouchableOpacity onPress={handleResend}>
            <Text style={styles.resendLink}>Resend code</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.goBackContainer}
          onPress={() => router.back()}
        >
          <Text style={styles.goBackText}>Wrong details? Go back</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
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
    textAlign: "center",
    fontSize: 22,
    fontWeight: "700",
    color: "#1F2937",
    backgroundColor: "#F9FAFB",
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
    marginBottom: 32,
  },
  resendLink: {
    fontSize: 14,
    color: Colors.brand,
    fontWeight: "600",
    marginBottom: 32,
  },
  goBackContainer: { marginTop: 16 },
  goBackText: { fontSize: 14, color: Colors.brand, fontWeight: "500" },
});
