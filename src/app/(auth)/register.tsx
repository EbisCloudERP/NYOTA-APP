import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import LanguageSelector from "../../components/LanguageSelector";
import { getCounties, registerUser, type County } from "../../services/api";
import { useFeedback } from "../../services/FeedbackContext";
import { useLanguage } from "../../services/LanguageContext";
import { Colors } from "../../theme/colors";

const PICKER_ITEM_HEIGHT = 48;

function PickerModal({
  visible,
  items,
  onSelect,
  onClose,
  label,
}: {
  visible: boolean;
  items: { label: string; value: string }[];
  onSelect: (item: { label: string; value: string }) => void;
  onClose: () => void;
  label: string;
}) {
  const { t } = useLanguage();

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{label}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.modalClose}>{t("common.done")}</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={items}
            keyExtractor={(item) => item.value}
            getItemLayout={(_data, index) => ({
              length: PICKER_ITEM_HEIGHT,
              offset: PICKER_ITEM_HEIGHT * index,
              index,
            })}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                <Text style={styles.modalItemText}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );
}

export default function RegisterScreen() {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [selectedCounty, setSelectedCounty] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const [selectedConstituency, setSelectedConstituency] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const [selectedWard, setSelectedWard] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const [counties, setCounties] = useState<County[]>([]);
  const [loadingCounties, setLoadingCounties] = useState(true);
  const [countyPickerVisible, setCountyPickerVisible] = useState(false);
  const [constituencyPickerVisible, setConstituencyPickerVisible] =
    useState(false);
  const [wardPickerVisible, setWardPickerVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { email } = useLocalSearchParams<{ email: string }>();
  const { showToast } = useFeedback();
  const { t } = useLanguage();

  useEffect(() => {
    getCounties()
      .then((res) => setCounties(res.data))
      .catch(() => {})
      .finally(() => setLoadingCounties(false));
  }, []);

  const countyItems = useMemo(
    () => counties.map((c) => ({ label: c.county_name, value: String(c.id) })),
    [counties],
  );

  const constituencyItems = useMemo(() => {
    if (!selectedCounty) return [];
    const county = counties.find((c) => String(c.id) === selectedCounty.value);
    if (!county) return [];
    const seen = new Set<string>();
    const unique: { label: string; value: string }[] = [];
    for (const sc of county.sub_counties) {
      if (!seen.has(sc.constituency_name)) {
        seen.add(sc.constituency_name);
        unique.push({
          label: sc.constituency_name,
          value: sc.constituency_name,
        });
      }
    }
    return unique;
  }, [selectedCounty, counties]);

  const wardItems = useMemo(() => {
    if (!selectedCounty || !selectedConstituency) return [];
    const county = counties.find((c) => String(c.id) === selectedCounty.value);
    if (!county) return [];
    return county.sub_counties
      .filter((sc) => sc.constituency_name === selectedConstituency.value)
      .map((sc) => ({ label: sc.ward, value: sc.ward }));
  }, [selectedCounty, selectedConstituency, counties]);

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
  const strengthLabels = [
    t("auth.register.weak"),
    t("auth.register.fair"),
    t("auth.register.good"),
    t("auth.register.strong"),
  ];
  const strengthColors = ["#EF4444", "#F59E0B", "#208AEF", "#10B981"];

  const handleRegister = async () => {
    if (!firstName.trim() || !lastName.trim() || !nationalId.trim()) {
      showToast(t("auth.register.fillPersonal"), "error");
      return;
    }
    if (!selectedCounty || !selectedConstituency) {
      showToast(t("auth.register.selectCountyError"), "error");
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

    setSubmitting(true);
    try {
      await registerUser({
        first_name: firstName.trim(),
        middle_name: middleName.trim(),
        last_name: lastName.trim(),
        national_id: nationalId.trim(),
        type: "email",
        contact: email,
        county: selectedCounty.label,
        sub_county: selectedConstituency.value,
        password,
        password_confirmation: confirmPassword,
      });

      router.replace({
        pathname: "/verify-phone",
        params: { password },
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : t("auth.register.registrationFailed");
      showToast(message, "error");
    } finally {
      setSubmitting(false);
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
        <Text style={styles.title}>{t("auth.register.title")}</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>{t("auth.register.subtitle")}</Text>

        {/* Form */}
        <View style={styles.form}>
          {/* ── Personal Information ── */}
          <Text style={styles.sectionHeader}>
            {t("auth.register.personalInfo")}
          </Text>

          {/* First Name */}
          <Text style={styles.label}>{t("auth.register.firstName")}</Text>
          <TextInput
            style={styles.input}
            placeholder={t("auth.register.firstNamePlaceholder")}
            placeholderTextColor="#9CA3AF"
            value={firstName}
            onChangeText={setFirstName}
          />

          {/* Middle Name */}
          <Text style={styles.label}>{t("auth.register.middleName")}</Text>
          <TextInput
            style={styles.input}
            placeholder={t("auth.register.middleNamePlaceholder")}
            placeholderTextColor="#9CA3AF"
            value={middleName}
            onChangeText={setMiddleName}
          />

          {/* Last Name */}
          <Text style={styles.label}>{t("auth.register.lastName")}</Text>
          <TextInput
            style={styles.input}
            placeholder={t("auth.register.lastNamePlaceholder")}
            placeholderTextColor="#9CA3AF"
            value={lastName}
            onChangeText={setLastName}
          />

          {/* National ID */}
          <Text style={styles.label}>{t("auth.register.nationalId")}</Text>
          <TextInput
            style={styles.input}
            placeholder={t("auth.register.nationalIdPlaceholder")}
            placeholderTextColor="#9CA3AF"
            keyboardType="number-pad"
            value={nationalId}
            onChangeText={setNationalId}
          />
          <Text style={styles.infoText}>{t("auth.register.identityInfo")}</Text>

          {/* ── County Information ── */}
          <Text style={styles.sectionHeader}>
            {t("auth.register.countyInfo")}
          </Text>

          {/* County */}
          <Text style={styles.label}>{t("auth.register.county")}</Text>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => !loadingCounties && setCountyPickerVisible(true)}
            disabled={loadingCounties}
          >
            {loadingCounties ? (
              <ActivityIndicator size="small" color={Colors.brand} />
            ) : (
              <Text
                style={
                  selectedCounty ? styles.pickerText : styles.pickerPlaceholder
                }
              >
                {selectedCounty?.label ?? t("auth.register.selectCounty")}
              </Text>
            )}
            <Text style={styles.pickerChevron}>▼</Text>
          </TouchableOpacity>

          {/* Constituency */}
          <Text style={styles.label}>{t("auth.register.constituency")}</Text>
          <TouchableOpacity
            style={[
              styles.pickerButton,
              !selectedCounty && styles.pickerButtonDisabled,
            ]}
            onPress={() => selectedCounty && setConstituencyPickerVisible(true)}
            disabled={!selectedCounty}
          >
            <Text
              style={
                selectedConstituency
                  ? styles.pickerText
                  : styles.pickerPlaceholder
              }
            >
              {selectedConstituency?.label ??
                t("auth.register.selectConstituency")}
            </Text>
            <Text style={styles.pickerChevron}>▼</Text>
          </TouchableOpacity>

          {/* Ward */}
          <Text style={styles.label}>{t("auth.register.ward")}</Text>
          <TouchableOpacity
            style={[
              styles.pickerButton,
              !selectedConstituency && styles.pickerButtonDisabled,
            ]}
            onPress={() => selectedConstituency && setWardPickerVisible(true)}
            disabled={!selectedConstituency}
          >
            <Text
              style={
                selectedWard ? styles.pickerText : styles.pickerPlaceholder
              }
            >
              {selectedWard?.label ?? t("auth.register.selectWard")}
            </Text>
            <Text style={styles.pickerChevron}>▼</Text>
          </TouchableOpacity>

          {/* ── Password ── */}
          <Text style={styles.sectionHeader}>
            {t("auth.register.passwordSection")}
          </Text>

          {/* Password */}
          <Text style={styles.label}>{t("auth.login.password")}</Text>
          <TextInput
            style={styles.input}
            placeholder={t("auth.register.passwordPlaceholder")}
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Text style={styles.infoText}>{t("auth.register.passwordInfo")}</Text>

          {/* Confirm Password */}
          <Text style={styles.label}>{t("auth.register.confirmPassword")}</Text>
          <TextInput
            style={[styles.input, passwordsMismatch && styles.inputError]}
            placeholder={t("auth.register.confirmPasswordPlaceholder")}
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          {passwordsMismatch ? (
            <Text style={styles.errorText}>
              {t("auth.register.passwordsDoNotMatch")}
            </Text>
          ) : (
            <Text style={styles.infoText}>
              {t("auth.register.confirmPasswordInfo")}
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
            style={[
              styles.registerButton,
              submitting && styles.registerButtonDisabled,
            ]}
            onPress={handleRegister}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.registerButtonText}>
                {t("auth.register.register")}
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

      <PickerModal
        visible={countyPickerVisible}
        label={t("auth.register.selectCountyModal")}
        items={countyItems}
        onSelect={(item) => {
          setSelectedCounty(item);
          setSelectedConstituency(null);
          setSelectedWard(null);
        }}
        onClose={() => setCountyPickerVisible(false)}
      />

      <PickerModal
        visible={constituencyPickerVisible}
        label={t("auth.register.selectConstituencyModal")}
        items={constituencyItems}
        onSelect={(item) => {
          setSelectedConstituency(item);
          setSelectedWard(null);
        }}
        onClose={() => setConstituencyPickerVisible(false)}
      />

      <PickerModal
        visible={wardPickerVisible}
        label={t("auth.register.selectWardModal")}
        items={wardItems}
        onSelect={setSelectedWard}
        onClose={() => setWardPickerVisible(false)}
      />
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
  registerButtonDisabled: {
    opacity: 0.7,
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
  // ── Picker / Modal ──
  pickerButton: {
    width: "100%",
    height: 48,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "#F9FAFB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pickerButtonDisabled: {
    opacity: 0.5,
  },
  pickerText: {
    fontSize: 16,
    color: "#1F2937",
    flex: 1,
  },
  pickerPlaceholder: {
    fontSize: 16,
    color: "#9CA3AF",
    flex: 1,
  },
  pickerChevron: {
    fontSize: 12,
    color: "#9CA3AF",
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "60%",
    paddingBottom: 34,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1F2937",
  },
  modalClose: {
    fontSize: 15,
    color: Colors.brand,
    fontWeight: "600",
  },
  modalItem: {
    height: PICKER_ITEM_HEIGHT,
    paddingHorizontal: 20,
    justifyContent: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#F3F4F6",
  },
  modalItemText: {
    fontSize: 16,
    color: "#1F2937",
    textTransform: "capitalize",
  },
});
