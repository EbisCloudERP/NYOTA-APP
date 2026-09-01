import Ionicons from "@react-native-vector-icons/ionicons";
import { useState } from "react";
import {
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useFeedback } from "../../services/FeedbackContext";
import { useLanguage } from "../../services/LanguageContext";
import { Colors } from "../../theme/colors";

interface FormData {
  // Account Holder
  accountHolderName: string;
  accountNumber: string;
  tradingName: string;
  contactInfo: string;
  // Overdraft Request
  requestedAmount: string;
  purpose: string;
  currentBalance: string;
  avgMonthlyRevenue: string;
  repaymentPeriod: string;
  interestRate: string;
  // Collateral
  collateralDetails: string;
  collateralValuation: string;
}

interface FormErrors {
  accountHolderName?: string;
  accountNumber?: string;
  contactInfo?: string;
  requestedAmount?: string;
  purpose?: string;
  currentBalance?: string;
  avgMonthlyRevenue?: string;
  repaymentPeriod?: string;
  interestRate?: string;
  collateralDetails?: string;
  collateralValuation?: string;
  collateralDoc?: string;
}

export default function OverdraftScreen() {
  const [form, setForm] = useState<FormData>({
    accountHolderName: "",
    accountNumber: "",
    tradingName: "",
    contactInfo: "",
    requestedAmount: "",
    purpose: "",
    currentBalance: "",
    avgMonthlyRevenue: "",
    repaymentPeriod: "",
    interestRate: "",
    collateralDetails: "",
    collateralValuation: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const { showToast, confirm } = useFeedback();
  const { t } = useLanguage();

  // File upload state
  const [collateralDoc, setCollateralDoc] = useState<string | null>(null);

  // Checkboxes
  const [declaration, setDeclaration] = useState(false);
  const [authorizeChecks, setAuthorizeChecks] = useState(false);
  const [approvalTerms, setApprovalTerms] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const updateField = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    const e = errors as Record<string, string | undefined>;
    if (e[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleUpload = async (
    label: string,
    setter: (v: string | null) => void,
  ) => {
    const ok = await confirm({
      title: `Upload ${label}`,
      message: t("common.filePickerMessage"),
      confirmText: t("common.selectFile"),
      cancelText: t("common.cancel"),
    });
    if (ok) setter("selected-file.pdf");
  };

  const validate = (): boolean => {
    const e: FormErrors = {};

    // Account Holder
    if (!form.accountHolderName.trim())
      e.accountHolderName = t("overdraft.accountHolderRequired");
    if (!form.accountNumber.trim())
      e.accountNumber = t("overdraft.accountNumberRequired");
    if (!form.contactInfo.trim())
      e.contactInfo = t("overdraft.contactRequired");

    // Overdraft Request
    if (!form.requestedAmount.trim()) {
      e.requestedAmount = t("overdraft.requestedRequired");
    } else if (
      isNaN(Number(form.requestedAmount)) ||
      Number(form.requestedAmount) <= 0
    ) {
      e.requestedAmount = t("financing.validAmount");
    }
    if (!form.purpose.trim()) e.purpose = t("overdraft.purposeRequired");
    if (!form.currentBalance.trim()) {
      e.currentBalance = t("overdraft.balanceRequired");
    } else if (
      isNaN(Number(form.currentBalance)) ||
      Number(form.currentBalance) < 0
    ) {
      e.currentBalance = t("overdraft.validBalance");
    }
    if (!form.avgMonthlyRevenue.trim()) {
      e.avgMonthlyRevenue = t("overdraft.avgRequired");
    } else if (
      isNaN(Number(form.avgMonthlyRevenue)) ||
      Number(form.avgMonthlyRevenue) <= 0
    ) {
      e.avgMonthlyRevenue = t("financing.validAmount");
    }
    if (!form.repaymentPeriod.trim())
      e.repaymentPeriod = t("financing.repaymentRequired");
    if (!form.interestRate.trim())
      e.interestRate = t("financing.interestRequired");

    // Collateral
    if (!form.collateralDetails.trim())
      e.collateralDetails = t("financing.collateralRequired");
    if (!form.collateralValuation.trim()) {
      e.collateralValuation = t("overdraft.collateralValuationRequired");
    } else if (
      isNaN(Number(form.collateralValuation)) ||
      Number(form.collateralValuation) <= 0
    ) {
      e.collateralValuation = t("overdraft.validValuation");
    }
    if (!collateralDoc) e.collateralDoc = t("overdraft.docsRequired");

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      showToast(t("financing.fillRequired"), "error");
      return;
    }

    if (!declaration || !authorizeChecks || !approvalTerms || !agreeTerms) {
      showToast(t("financing.acceptTerms"), "error");
      return;
    }

    showToast(t("overdraft.submitted"), "success");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* Subtitle */}
      <Text style={styles.subtitle}>{t("overdraft.subtitle")}</Text>

      {/* Required fields note */}
      <Text style={styles.requiredNote}>{t("common.requiredNote")}</Text>

      {/* ── Account Holder ── */}
      <Text style={styles.sectionTitle}>{t("overdraft.accountHolder")}</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          {t("overdraft.accountHolderName")}{" "}
          <Text style={styles.asterisk}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.accountHolderName && styles.inputError]}
          placeholder={t("overdraft.accountHolderNamePlaceholder")}
          placeholderTextColor="#9CA3AF"
          value={form.accountHolderName}
          onChangeText={(v) => updateField("accountHolderName", v)}
        />
        {errors.accountHolderName && (
          <Text style={styles.errorText}>{errors.accountHolderName}</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          {t("overdraft.accountNumber")} <Text style={styles.asterisk}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.accountNumber && styles.inputError]}
          placeholder={t("overdraft.accountNumberPlaceholder")}
          placeholderTextColor="#9CA3AF"
          value={form.accountNumber}
          onChangeText={(v) => updateField("accountNumber", v)}
        />
        {errors.accountNumber && (
          <Text style={styles.errorText}>{errors.accountNumber}</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>{t("overdraft.tradingName")}</Text>
        <TextInput
          style={styles.input}
          placeholder={t("overdraft.tradingNamePlaceholder")}
          placeholderTextColor="#9CA3AF"
          value={form.tradingName}
          onChangeText={(v) => updateField("tradingName", v)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          {t("overdraft.contactInfo")} <Text style={styles.asterisk}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.contactInfo && styles.inputError]}
          placeholder={t("financing.phonePlaceholder")}
          placeholderTextColor="#9CA3AF"
          keyboardType="phone-pad"
          value={form.contactInfo}
          onChangeText={(v) => updateField("contactInfo", v)}
        />
        {errors.contactInfo && (
          <Text style={styles.errorText}>{errors.contactInfo}</Text>
        )}
      </View>

      {/* ── Overdraft Request Details ── */}
      <View style={styles.sectionDivider} />
      <Text style={styles.sectionTitle}>{t("overdraft.overdraftRequest")}</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          {t("overdraft.requestedAmount")}{" "}
          <Text style={styles.asterisk}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.requestedAmount && styles.inputError]}
          placeholder={t("overdraft.requestedAmountPlaceholder")}
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
          value={form.requestedAmount}
          onChangeText={(v) => updateField("requestedAmount", v)}
        />
        {errors.requestedAmount && (
          <Text style={styles.errorText}>{errors.requestedAmount}</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          {t("overdraft.purpose")} <Text style={styles.asterisk}>*</Text>
        </Text>
        <TextInput
          style={[
            styles.input,
            styles.textArea,
            errors.purpose && styles.inputError,
          ]}
          placeholder={t("overdraft.purposePlaceholder")}
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          value={form.purpose}
          onChangeText={(v) => updateField("purpose", v)}
        />
        {errors.purpose && (
          <Text style={styles.errorText}>{errors.purpose}</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          {t("overdraft.currentBalance")} <Text style={styles.asterisk}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.currentBalance && styles.inputError]}
          placeholder={t("overdraft.currentBalancePlaceholder")}
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
          value={form.currentBalance}
          onChangeText={(v) => updateField("currentBalance", v)}
        />
        {errors.currentBalance && (
          <Text style={styles.errorText}>{errors.currentBalance}</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          {t("overdraft.avgMonthly")} <Text style={styles.asterisk}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.avgMonthlyRevenue && styles.inputError]}
          placeholder={t("overdraft.avgMonthlyPlaceholder")}
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
          value={form.avgMonthlyRevenue}
          onChangeText={(v) => updateField("avgMonthlyRevenue", v)}
        />
        {errors.avgMonthlyRevenue && (
          <Text style={styles.errorText}>{errors.avgMonthlyRevenue}</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          {t("overdraft.repaymentPeriod")}{" "}
          <Text style={styles.asterisk}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.repaymentPeriod && styles.inputError]}
          placeholder={t("overdraft.repaymentPeriodPlaceholder")}
          placeholderTextColor="#9CA3AF"
          value={form.repaymentPeriod}
          onChangeText={(v) => updateField("repaymentPeriod", v)}
        />
        {errors.repaymentPeriod && (
          <Text style={styles.errorText}>{errors.repaymentPeriod}</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          {t("financing.interestRate")} <Text style={styles.asterisk}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.interestRate && styles.inputError]}
          placeholder={t("financing.interestRatePlaceholder")}
          placeholderTextColor="#9CA3AF"
          value={form.interestRate}
          onChangeText={(v) => updateField("interestRate", v)}
        />
        {errors.interestRate && (
          <Text style={styles.errorText}>{errors.interestRate}</Text>
        )}
      </View>

      {/* ── Collateral ── */}
      <View style={styles.sectionDivider} />
      <Text style={styles.sectionTitle}>{t("overdraft.collateral")}</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          {t("financing.collateralDetails")}{" "}
          <Text style={styles.asterisk}>*</Text>
        </Text>
        <TextInput
          style={[
            styles.input,
            styles.textArea,
            errors.collateralDetails && styles.inputError,
          ]}
          placeholder={t("financing.collateralPlaceholder")}
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          value={form.collateralDetails}
          onChangeText={(v) => updateField("collateralDetails", v)}
        />
        {errors.collateralDetails && (
          <Text style={styles.errorText}>{errors.collateralDetails}</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          {t("overdraft.collateralValuation")}{" "}
          <Text style={styles.asterisk}>*</Text>
        </Text>
        <TextInput
          style={[
            styles.input,
            errors.collateralValuation && styles.inputError,
          ]}
          placeholder={t("overdraft.collateralValuationPlaceholder")}
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
          value={form.collateralValuation}
          onChangeText={(v) => updateField("collateralValuation", v)}
        />
        {errors.collateralValuation && (
          <Text style={styles.errorText}>{errors.collateralValuation}</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          {t("overdraft.uploadDocs")} <Text style={styles.asterisk}>*</Text>
        </Text>
        <TouchableOpacity
          style={[
            styles.uploadButton,
            errors.collateralDoc && styles.inputError,
          ]}
          activeOpacity={0.7}
          onPress={() => handleUpload("Supporting Documents", setCollateralDoc)}
        >
          <Ionicons
            name={collateralDoc ? "checkmark-circle" : "cloud-upload-outline"}
            size={20}
            color={collateralDoc ? "#059669" : Colors.brand}
          />
          <Text
            style={[
              styles.uploadText,
              collateralDoc && styles.uploadTextSelected,
            ]}
          >
            {collateralDoc || t("overdraft.uploadDocsPlaceholder")}
          </Text>
        </TouchableOpacity>
        <Text style={styles.uploadHint}>{t("common.acceptedFormats")}</Text>
        {errors.collateralDoc && (
          <Text style={styles.errorText}>{errors.collateralDoc}</Text>
        )}
      </View>

      {/* ── Declarations ── */}
      <View style={styles.sectionDivider} />
      <Text style={styles.sectionTitle}>{t("financing.declarations")}</Text>

      <TouchableOpacity
        style={styles.checkboxRow}
        activeOpacity={0.7}
        onPress={() => setDeclaration(!declaration)}
      >
        <View style={[styles.checkbox, declaration && styles.checkboxChecked]}>
          {declaration && (
            <Ionicons name="checkmark" size={14} color="#FFFFFF" />
          )}
        </View>
        <Text style={styles.checkboxLabel}>{t("financing.declaration1")}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.checkboxRow}
        activeOpacity={0.7}
        onPress={() => setAuthorizeChecks(!authorizeChecks)}
      >
        <View
          style={[styles.checkbox, authorizeChecks && styles.checkboxChecked]}
        >
          {authorizeChecks && (
            <Ionicons name="checkmark" size={14} color="#FFFFFF" />
          )}
        </View>
        <Text style={styles.checkboxLabel}>{t("financing.declaration2")}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.checkboxRow}
        activeOpacity={0.7}
        onPress={() => setApprovalTerms(!approvalTerms)}
      >
        <View
          style={[styles.checkbox, approvalTerms && styles.checkboxChecked]}
        >
          {approvalTerms && (
            <Ionicons name="checkmark" size={14} color="#FFFFFF" />
          )}
        </View>
        <Text style={styles.checkboxLabel}>{t("financing.declaration3")}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.checkboxRow}
        activeOpacity={0.7}
        onPress={() => setAgreeTerms(!agreeTerms)}
      >
        <View style={[styles.checkbox, agreeTerms && styles.checkboxChecked]}>
          {agreeTerms && (
            <Ionicons name="checkmark" size={14} color="#FFFFFF" />
          )}
        </View>
        <Text style={styles.checkboxLabel}>{t("financing.declaration4")}</Text>
      </TouchableOpacity>

      {/* ── Submit Button ── */}
      <TouchableOpacity
        style={styles.submitButton}
        activeOpacity={0.7}
        onPress={handleSubmit}
      >
        <Ionicons name="paper-plane" size={18} color="#FFFFFF" />
        <Text style={styles.submitButtonText}>
          {t("financing.submitApplication")}
        </Text>
      </TouchableOpacity>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  // Subtitle
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 21,
    marginBottom: 12,
  },

  // Required note
  requiredNote: {
    fontSize: 13,
    color: "#9CA3AF",
    marginBottom: 24,
  },
  asterisk: {
    color: "#EF4444",
  },

  // Section
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 8,
    marginBottom: 20,
  },

  // Inputs
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "ios" ? 13 : 11,
    fontSize: 14,
    color: "#111827",
  },
  textArea: {
    minHeight: 80,
    paddingTop: 12,
  },
  inputError: {
    borderColor: "#EF4444",
  },
  errorText: {
    fontSize: 12,
    color: "#EF4444",
    marginTop: 4,
  },

  // Upload
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderStyle: "dashed",
  },
  uploadText: {
    fontSize: 14,
    color: "#9CA3AF",
    flex: 1,
  },
  uploadTextSelected: {
    color: "#059669",
  },
  uploadHint: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 6,
  },

  // Checkboxes
  checkboxRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 16,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
    flexShrink: 0,
  },
  checkboxChecked: {
    backgroundColor: Colors.brand,
    borderColor: Colors.brand,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 19,
  },

  // Submit
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.brand,
    paddingVertical: 15,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 12,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  bottomSpacer: {
    height: 40,
  },
});
