import Ionicons from "@react-native-vector-icons/ionicons";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { submitIbsInquiry } from "../../services/api";
import { useAuth } from "../../services/AuthContext";
import { useFeedback } from "../../services/FeedbackContext";
import { useLanguage } from "../../services/LanguageContext";
import { Colors } from "../../theme/colors";

interface FormData {
  // Company Info
  companyName: string;
  phoneNumber: string;
  email: string;
  contactPerson: string;
  companyAddress: string;
  registrationNumber: string;
  vatNumber: string;
  // LPO Details
  lpoNumber: string;
  lpoAmount: string;
  lpoDate: string;
  buyerName: string;
  // Financing Request
  requestedAmount: string;
}

interface FormErrors {
  companyName?: string;
  phoneNumber?: string;
  email?: string;
  contactPerson?: string;
  companyAddress?: string;
  registrationNumber?: string;
  lpoNumber?: string;
  lpoAmount?: string;
  lpoDate?: string;
  buyerName?: string;
  requestedAmount?: string;
  lpoDocument?: string;
}

export default function LpoFinancingScreen() {
  const { bankSlug, bankName, providerType } = useLocalSearchParams<{
    bankSlug?: string;
    bankName?: string;
    providerType?: string;
  }>();
  const { user } = useAuth();

  const [form, setForm] = useState<FormData>({
    companyName: "",
    phoneNumber: user?.phone ?? "",
    email: user?.email ?? "",
    contactPerson: [user?.first_name, user?.last_name]
      .filter(Boolean)
      .join(" "),
    companyAddress: "",
    registrationNumber: "",
    vatNumber: "",
    lpoNumber: "",
    lpoAmount: "",
    lpoDate: "",
    buyerName: "",
    requestedAmount: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const { showToast, confirm } = useFeedback();
  const { t } = useLanguage();

  // File upload states (store filename to show selection)
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [taxCertificate, setTaxCertificate] = useState<string | null>(null);
  const [lpoDocument, setLpoDocument] = useState<string | null>(null);

  // Checkboxes
  const [declaration, setDeclaration] = useState(false);
  const [authorizeChecks, setAuthorizeChecks] = useState(false);
  const [approvalTerms, setApprovalTerms] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const updateField = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear error on change if the field has validation
    const e = errors as Record<string, string | undefined>;
    if (e[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleUpload = async (
    label: string,
    setter: (v: string | null) => void,
  ) => {
    // Placeholder for actual file picker (expo-document-picker)
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

    if (!form.companyName.trim())
      e.companyName = t("financing.companyNameRequired");
    if (!form.phoneNumber.trim()) e.phoneNumber = t("financing.phoneRequired");
    if (!form.email.trim()) {
      e.email = t("financing.emailRequired");
    } else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      e.email = t("financing.validEmail");
    }
    if (!form.contactPerson.trim())
      e.contactPerson = t("financing.contactPersonRequired");
    if (!form.companyAddress.trim())
      e.companyAddress = t("financing.addressRequired");
    if (!form.registrationNumber.trim())
      e.registrationNumber = t("financing.registrationRequired");

    if (!form.lpoNumber.trim()) e.lpoNumber = t("lpo.lpoNumberRequired");
    if (!form.lpoAmount.trim()) e.lpoAmount = t("lpo.lpoAmountRequired");
    if (!form.lpoDate.trim()) e.lpoDate = t("lpo.lpoDateRequired");
    if (!lpoDocument) e.lpoDocument = t("lpo.lpoDocumentRequired");
    if (!form.buyerName.trim()) e.buyerName = t("lpo.buyerRequired");

    if (!form.requestedAmount.trim()) {
      e.requestedAmount = t("financing.requestedRequired");
    } else if (
      isNaN(Number(form.requestedAmount)) ||
      Number(form.requestedAmount) <= 0
    ) {
      e.requestedAmount = t("financing.validAmount");
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      showToast(t("financing.fillRequired"), "error");
      return;
    }

    if (!declaration || !authorizeChecks || !approvalTerms || !agreeTerms) {
      showToast(t("financing.acceptTerms"), "error");
      return;
    }

    if (!bankSlug) {
      showToast(t("lpo.noBank"), "error");
      return;
    }

    const description = [
      `LPO Number: ${form.lpoNumber}`,
      `LPO Amount (KES): ${form.lpoAmount}`,
      `LPO Date: ${form.lpoDate}`,
      `Buyer: ${form.buyerName}`,
    ].join("\n");

    setSubmitting(true);
    try {
      await submitIbsInquiry({
        service: "LPO Financing",
        bank_slug: bankSlug,
        category:
          providerType === "government"
            ? "government_services"
            : "bank_service",
        requester_name: form.contactPerson.trim(),
        company_name: form.companyName.trim(),
        email: form.email.trim(),
        phone: form.phoneNumber.trim(),
        description,
        receipient: form.buyerName.trim() || undefined,
        requested_amount: form.requestedAmount.trim() || undefined,
        company: {
          contact_name: form.contactPerson.trim(),
          email: form.email.trim(),
          phone: form.phoneNumber.trim(),
          address: form.companyAddress.trim() || undefined,
          registration_number: form.registrationNumber.trim() || undefined,
          vat_number: form.vatNumber.trim() || undefined,
        },
      });
      showToast(t("lpo.submitted"), "success");
    } catch (e) {
      showToast(
        e instanceof Error ? e.message : t("financing.submissionFailed"),
        "error",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* Subtitle */}
      <Text style={styles.subtitle}>{t("lpo.subtitle")}</Text>

      {/* Required fields note */}
      <Text style={styles.requiredNote}>{t("common.requiredNote")}</Text>

      {/* Selected provider */}
      {bankName ? (
        <View style={styles.providerBanner}>
          <Ionicons name="business-outline" size={18} color={Colors.brand} />
          <Text style={styles.providerBannerText}>
            {t("lpo.applyingTo")}
            <Text style={styles.providerBannerBold}>{bankName}</Text>
          </Text>
        </View>
      ) : null}

      {/* ── Company Information ── */}
      <Text style={styles.sectionTitle}>{t("financing.companyInfo")}</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          {t("financing.companyName")} <Text style={styles.asterisk}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.companyName && styles.inputError]}
          placeholder={t("financing.companyNamePlaceholder")}
          placeholderTextColor="#9CA3AF"
          value={form.companyName}
          onChangeText={(v) => updateField("companyName", v)}
        />
        {errors.companyName && (
          <Text style={styles.errorText}>{errors.companyName}</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          {t("financing.phoneNumber")} <Text style={styles.asterisk}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.phoneNumber && styles.inputError]}
          placeholder={t("financing.phonePlaceholder")}
          placeholderTextColor="#9CA3AF"
          keyboardType="phone-pad"
          value={form.phoneNumber}
          onChangeText={(v) => updateField("phoneNumber", v)}
        />
        {errors.phoneNumber && (
          <Text style={styles.errorText}>{errors.phoneNumber}</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          {t("financing.emailAddress")} <Text style={styles.asterisk}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          placeholder={t("financing.emailPlaceholder")}
          placeholderTextColor="#9CA3AF"
          keyboardType="email-address"
          autoCapitalize="none"
          value={form.email}
          onChangeText={(v) => updateField("email", v)}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          {t("financing.contactPerson")} <Text style={styles.asterisk}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.contactPerson && styles.inputError]}
          placeholder={t("financing.contactPersonPlaceholder")}
          placeholderTextColor="#9CA3AF"
          value={form.contactPerson}
          onChangeText={(v) => updateField("contactPerson", v)}
        />
        {errors.contactPerson && (
          <Text style={styles.errorText}>{errors.contactPerson}</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          {t("financing.companyAddress")} <Text style={styles.asterisk}>*</Text>
        </Text>
        <TextInput
          style={[
            styles.input,
            styles.textArea,
            errors.companyAddress && styles.inputError,
          ]}
          placeholder={t("financing.companyAddressPlaceholder")}
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          value={form.companyAddress}
          onChangeText={(v) => updateField("companyAddress", v)}
        />
        {errors.companyAddress && (
          <Text style={styles.errorText}>{errors.companyAddress}</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          {t("financing.registrationNumber")}{" "}
          <Text style={styles.asterisk}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.registrationNumber && styles.inputError]}
          placeholder={t("financing.registrationPlaceholder")}
          placeholderTextColor="#9CA3AF"
          value={form.registrationNumber}
          onChangeText={(v) => updateField("registrationNumber", v)}
        />
        {errors.registrationNumber && (
          <Text style={styles.errorText}>{errors.registrationNumber}</Text>
        )}
      </View>

      {/* VAT Number */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>{t("financing.vatNumber")}</Text>
        <TextInput
          style={styles.input}
          placeholder={t("financing.vatPlaceholder")}
          placeholderTextColor="#9CA3AF"
          value={form.vatNumber}
          onChangeText={(v) => updateField("vatNumber", v)}
        />
      </View>

      {/* Company Profile Picture */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>{t("lpo.profilePicture")}</Text>
        <TouchableOpacity
          style={[styles.uploadButton]}
          activeOpacity={0.7}
          onPress={() => handleUpload("Profile Picture", setProfilePicture)}
        >
          <Ionicons
            name={profilePicture ? "checkmark-circle" : "cloud-upload-outline"}
            size={20}
            color={profilePicture ? "#059669" : Colors.brand}
          />
          <Text
            style={[
              styles.uploadText,
              profilePicture && styles.uploadTextSelected,
            ]}
          >
            {profilePicture || t("lpo.profilePicturePlaceholder")}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tax Compliance Certificate */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>{t("lpo.taxCertificate")}</Text>
        <TouchableOpacity
          style={[styles.uploadButton]}
          activeOpacity={0.7}
          onPress={() =>
            handleUpload("Tax Compliance Certificate", setTaxCertificate)
          }
        >
          <Ionicons
            name={taxCertificate ? "checkmark-circle" : "cloud-upload-outline"}
            size={20}
            color={taxCertificate ? "#059669" : Colors.brand}
          />
          <Text
            style={[
              styles.uploadText,
              taxCertificate && styles.uploadTextSelected,
            ]}
          >
            {taxCertificate || t("lpo.taxCertificatePlaceholder")}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── LPO Details ── */}
      <View style={styles.sectionDivider} />
      <Text style={styles.sectionTitle}>{t("lpo.lpoDetails")}</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          {t("lpo.lpoNumber")} <Text style={styles.asterisk}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.lpoNumber && styles.inputError]}
          placeholder={t("lpo.lpoNumberPlaceholder")}
          placeholderTextColor="#9CA3AF"
          value={form.lpoNumber}
          onChangeText={(v) => updateField("lpoNumber", v)}
        />
        {errors.lpoNumber && (
          <Text style={styles.errorText}>{errors.lpoNumber}</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          {t("lpo.lpoAmount")} <Text style={styles.asterisk}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.lpoAmount && styles.inputError]}
          placeholder={t("lpo.lpoAmountPlaceholder")}
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
          value={form.lpoAmount}
          onChangeText={(v) => updateField("lpoAmount", v)}
        />
        {errors.lpoAmount && (
          <Text style={styles.errorText}>{errors.lpoAmount}</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          {t("lpo.lpoDate")} <Text style={styles.asterisk}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.lpoDate && styles.inputError]}
          placeholder={t("lpo.lpoDatePlaceholder")}
          placeholderTextColor="#9CA3AF"
          value={form.lpoDate}
          onChangeText={(v) => updateField("lpoDate", v)}
        />
        {errors.lpoDate && (
          <Text style={styles.errorText}>{errors.lpoDate}</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          {t("lpo.lpoDocument")} <Text style={styles.asterisk}>*</Text>
        </Text>
        <TouchableOpacity
          style={[styles.uploadButton, errors.lpoDocument && styles.inputError]}
          activeOpacity={0.7}
          onPress={() => handleUpload("LPO Document", setLpoDocument)}
        >
          <Ionicons
            name={lpoDocument ? "checkmark-circle" : "cloud-upload-outline"}
            size={20}
            color={lpoDocument ? "#059669" : Colors.brand}
          />
          <Text
            style={[
              styles.uploadText,
              lpoDocument && styles.uploadTextSelected,
            ]}
          >
            {lpoDocument || t("lpo.lpoDocumentPlaceholder")}
          </Text>
        </TouchableOpacity>
        <Text style={styles.uploadHint}>{t("common.acceptedFormats")}</Text>
        {errors.lpoDocument && (
          <Text style={styles.errorText}>{errors.lpoDocument}</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          {t("lpo.buyerName")} <Text style={styles.asterisk}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.buyerName && styles.inputError]}
          placeholder={t("lpo.buyerNamePlaceholder")}
          placeholderTextColor="#9CA3AF"
          value={form.buyerName}
          onChangeText={(v) => updateField("buyerName", v)}
        />
        {errors.buyerName && (
          <Text style={styles.errorText}>{errors.buyerName}</Text>
        )}
      </View>

      {/* ── Financing Request ── */}
      <View style={styles.sectionDivider} />
      <Text style={styles.sectionTitle}>{t("financing.financingRequest")}</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          {t("financing.requestedAmount")}{" "}
          <Text style={styles.asterisk}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.requestedAmount && styles.inputError]}
          placeholder={t("lpo.amountPlaceholder")}
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
          value={form.requestedAmount}
          onChangeText={(v) => updateField("requestedAmount", v)}
        />
        {errors.requestedAmount && (
          <Text style={styles.errorText}>{errors.requestedAmount}</Text>
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
        style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
        activeOpacity={0.7}
        onPress={handleSubmit}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Ionicons name="paper-plane" size={18} color="#FFFFFF" />
        )}
        <Text style={styles.submitButtonText}>
          {submitting ? "Submitting..." : "Submit Application"}
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

  // Provider banner
  providerBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F5F3FF",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 20,
  },
  providerBannerText: {
    fontSize: 14,
    color: "#4B5563",
    flex: 1,
  },
  providerBannerBold: {
    fontWeight: "700",
    color: Colors.brand,
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
  submitButtonDisabled: {
    opacity: 0.7,
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
