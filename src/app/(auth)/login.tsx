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
import { requestLoginOtp, sendSms } from "../../services/api";
import { useFeedback } from "../../services/FeedbackContext";
import { useLanguage } from "../../services/LanguageContext";
import { toKenyanMsisdn } from "../../services/phone";
import { setUuid } from "../../services/storage";
import { Colors } from "../../theme/colors";

const NYOTA_IMAGE = require("../../../assets/images/nyotapic_teens.jpeg");

const LOCAL_NUMBER_PATTERN = /^[71]\d{8}$/;

const normalizeLocalNumber = (value: string): string =>
  value.replace(/\D/g, "").replace(/^0+/, "");

export default function LoginScreen() {
  const [phone, setPhone] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useFeedback();
  const { t } = useLanguage();

  const handleLoginPress = async () => {
    const contact = normalizeLocalNumber(phone);

    if (!LOCAL_NUMBER_PATTERN.test(contact)) {
      showToast(t("auth.login.phoneInfo"), "error");
      return;
    }

    setLoading(true);
    try {
      const mobile = toKenyanMsisdn(contact);
      const response = await requestLoginOtp(mobile);
      const { otp, uuid } = response.data;

      await setUuid(uuid);

      try {
        await sendSms(mobile, `Your NYOTA verification code is: ${otp}`);
      } catch {
        showToast(t("auth.login.smsFailed"), "error");
      }

      router.push({
        pathname: "/otp-login",
        params: { contact: mobile, uuid },
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : t("auth.login.failed");
      showToast(
        /credentials are incorrect/i.test(message)
          ? t("auth.login.noAccount")
          : message,
        "error",
      );
    } finally {
      setLoading(false);
    }
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
      <View style={[styles.bottomCard, isFocused && styles.bottomCardFocused]}>
        <ScrollView
          contentContainerStyle={styles.bottomScrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <LanguageSelector />
          <Text style={styles.title}>{t("auth.login.welcome")}</Text>

          <Text style={styles.subtitle}>{t("auth.login.subtitle")}</Text>

          <View style={styles.form}>
            <Text style={styles.label}>{t("auth.login.phone")}</Text>
            <View style={styles.phoneRow}>
              <View style={styles.prefixContainer}>
                <Text style={styles.prefix}>+254</Text>
              </View>
              <TextInput
                style={styles.phoneInput}
                placeholder={t("auth.login.phonePlaceholder")}
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                maxLength={10}
                value={phone}
                onChangeText={(value) =>
                  setPhone(value.replace(/\D/g, "").replace(/^254/, ""))
                }
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
            </View>
            <Text style={styles.infoText}>{t("auth.login.phoneInfo")}</Text>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[
              styles.loginButton,
              loading && styles.loginButtonDisabled,
            ]}
            onPress={handleLoginPress}
            disabled={loading}
            activeOpacity={0.7}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.loginButtonText}>
                {t("auth.login.login")}
              </Text>
            )}
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={styles.onboardTestContainer}
            onPress={() => router.push("/getstarted")}
            disabled={loading}
          >
            <Text style={styles.onboardTestText}>Onboard test</Text>
          </TouchableOpacity> */}

          {/* Footer */}
          <Text style={styles.footer}>{t("common.footer")}</Text>
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
  // ── Bottom: Card (overlaps image, hugs its content) ──
  bottomCard: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  bottomCardFocused: {
    top: "18%",
  },
  bottomScrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
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
    marginBottom: 12,
  },
  // ── Buttons ──
  loginButton: {
    width: "100%",
    height: 50,
    backgroundColor: Colors.brand,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
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
