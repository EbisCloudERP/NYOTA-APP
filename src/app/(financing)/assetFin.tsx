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
  // Company Info
  companyName: string;
  phoneNumber: string;
  contactPerson: string;
  registrationNumber: string;
  vatNumber: string;
  companyAddress: string;
  // Asset Details
  assetType: string;
  assetDescription: string;
  assetCost: string;
  supplierName: string;
  supplierContact: string;
  // Financing Request
  downPayment: string;
  requestedAmount: string;
  repaymentPeriod: string;
  interestRate: string;
  collateralDetails: string;
}

interface FormErrors {
  companyName?: string;
  phoneNumber?: string;
  contactPerson?: string;
  registrationNumber?: string;
  companyAddress?: string;
  assetType?: string;
  assetDescription?: string;
  assetCost?: string;
  supplierName?: string;
  supplierContact?: string;
  downPayment?: string;
  requestedAmount?: string;
  repaymentPeriod?: string;
  interestRate?: string;
  collateralDetails?: string;
  assetInvoice?: string;
  nationalId?: string;
}

export default function AssetFinancingScreen() {
  const [form, setForm] = useState<FormData>({
    companyName: "",
    phoneNumber: "",
    contactPerson: "",
    registrationNumber: "",
    vatNumber: "",
    companyAddress: "",
    assetType: "",
    assetDescription: "",
    assetCost: "",
    supplierName: "",
    supplierContact: "",
    downPayment: "",
    requestedAmount: "",
    repaymentPeriod: "",
    interestRate: "",
    collateralDetails: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const { showToast, confirm } = useFeedback();
  const { t } = useLanguage();

  // File upload states
  const [taxCertificate, setTaxCertificate] = useState<string | null>(null);
  const [assetInvoice, setAssetInvoice] = useState<string | null>(null);
  const [nationalId, setNationalId] = useState<string | null>(null);
  const [proofOfIncome, setProofOfIncome] = useState<string | null>(null);

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

    // Company Info
    if (!form.companyName.trim())
      e.companyName = t("financing.companyNameRequired");
    if (!form.phoneNumber.trim()) e.phoneNumber = t("financing.phoneRequired");
    if (!form.contactPerson.trim())
      e.contactPerson = t("financing.contactPersonRequired");
    if (!form.registrationNumber.trim())
      e.registrationNumber = t("financing.registrationRequired");
    if (!form.companyAddress.trim())
      e.companyAddress = t("financing.addressRequired");

    // Asset Details
    if (!form.assetType.trim()) e.assetType = t("assetFin.assetTypeRequired");
    if (!form.assetDescription.trim())
      e.assetDescription = t("assetFin.assetDescriptionRequired");
    if (!form.assetCost.trim()) {
      e.assetCost = t("assetFin.assetCostRequired");
    } else if (isNaN(Number(form.assetCost)) || Number(form.assetCost) <= 0) {
      e.assetCost = t("assetFin.validCost");
    }
    if (!assetInvoice) e.assetInvoice = t("assetFin.invoiceRequired");
    if (!form.supplierName.trim())
      e.supplierName = t("assetFin.supplierNameRequired");
    if (!form.supplierContact.trim())
      e.supplierContact = t("assetFin.supplierContactRequired");

    // Financing Request
    if (!form.downPayment.trim()) {
      e.downPayment = t("assetFin.downPaymentRequired");
    } else if (
      isNaN(Number(form.downPayment)) ||
      Number(form.downPayment) < 0
    ) {
      e.downPayment = t("financing.validAmount");
    }
    if (!form.requestedAmount.trim()) {
      e.requestedAmount = t("financing.requestedRequired");
    } else if (
      isNaN(Number(form.requestedAmount)) ||
      Number(form.requestedAmount) <= 0
    ) {
      e.requestedAmount = t("financing.validAmount");
    }
    if (!form.repaymentPeriod.trim())
      e.repaymentPeriod = t("financing.repaymentRequired");
    if (!form.interestRate.trim())
      e.interestRate = t("financing.interestRequired");
    if (!form.collateralDetails.trim())
      e.collateralDetails = t("financing.collateralRequired");

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

    showToast(t("assetFin.submitted"), "success");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* Subtitle */}
      <Text style={styles.subtitle}>{t("assetFin.subtitle")}</Text>

      {/* Required fields note */}
      <Text style={styles.requiredNote}>{t("common.requiredNote")}</Text>

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

      {/* Tax Compliance Certificate */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>{t("assetFin.taxCertificate")}</Text>
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
            {taxCertificate || t("assetFin.taxCertificatePlaceholder")}
          </Text>
        </TouchableOpacity>
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

      {/* ── Asset Details ── */}
      <View style={styles.sectionDivider} />
      <Text style={styles.sectionTitle}>{t("assetFin.assetDetails")}</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          {t("assetFin.assetType")} <Text style={styles.asterisk}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.assetType && styles.inputError]}
          placeholder={t("assetFin.assetTypePlaceholder")}
          placeholderTextColor="#9CA3AF"
          value={form.assetType}
          onChangeText={(v) => updateField("assetType", v)}
        />
        {errors.assetType && (
          <Text style={styles.errorText}>{errors.assetType}</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          {t("assetFin.assetDescription")}{" "}
          <Text style={styles.asterisk}>*</Text>
        </Text>
        <TextInput
          style={[
            styles.input,
            styles.textArea,
            errors.assetDescription && styles.inputError,
          ]}
          placeholder={t("assetFin.assetDescriptionPlaceholder")}
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          value={form.assetDescription}
          onChangeText={(v) => updateField("assetDescription", v)}
        />
        {errors.assetDescription && (
          <Text style={styles.errorText}>{errors.assetDescription}</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          {t("assetFin.assetCost")} <Text style={styles.asterisk}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.assetCost && styles.inputError]}
          placeholder={t("assetFin.assetCostPlaceholder")}
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
          value={form.assetCost}
          onChangeText={(v) => updateField("assetCost", v)}
        />
        {errors.assetCost && (
          <Text style={styles.errorText}>{errors.assetCost}</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          {t("assetFin.assetInvoice")} <Text style={styles.asterisk}>*</Text>
        </Text>
        <TouchableOpacity
          style={[
            styles.uploadButton,
            errors.assetInvoice && styles.inputError,
          ]}
          activeOpacity={0.7}
          onPress={() => handleUpload("Asset Invoice", setAssetInvoice)}
        >
          <Ionicons
            name={assetInvoice ? "checkmark-circle" : "cloud-upload-outline"}
            size={20}
            color={assetInvoice ? "#059669" : Colors.brand}
          />
          <Text
            style={[
              styles.uploadText,
              assetInvoice && styles.uploadTextSelected,
            ]}
          >
            {assetInvoice || t("assetFin.assetInvoicePlaceholder")}
          </Text>
        </TouchableOpacity>
        <Text style={styles.uploadHint}>{t("common.acceptedFormats")}</Text>
        {errors.assetInvoice && (
          <Text style={styles.errorText}>{errors.assetInvoice}</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          {t("assetFin.supplierName")} <Text style={styles.asterisk}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.supplierName && styles.inputError]}
          placeholder={t("assetFin.supplierNamePlaceholder")}
          placeholderTextColor="#9CA3AF"
          value={form.supplierName}
          onChangeText={(v) => updateField("supplierName", v)}
        />
        {errors.supplierName && (
          <Text style={styles.errorText}>{errors.supplierName}</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          {t("assetFin.supplierContact")} <Text style={styles.asterisk}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.supplierContact && styles.inputError]}
          placeholder={t("financing.phonePlaceholder")}
          placeholderTextColor="#9CA3AF"
          keyboardType="phone-pad"
          value={form.supplierContact}
          onChangeText={(v) => updateField("supplierContact", v)}
        />
        {errors.supplierContact && (
          <Text style={styles.errorText}>{errors.supplierContact}</Text>
        )}
      </View>

      {/* ── Financing Request ── */}
      <View style={styles.sectionDivider} />
      <Text style={styles.sectionTitle}>{t("financing.financingRequest")}</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          {t("assetFin.downPayment")} <Text style={styles.asterisk}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.downPayment && styles.inputError]}
          placeholder={t("assetFin.downPaymentPlaceholder")}
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
          value={form.downPayment}
          onChangeText={(v) => updateField("downPayment", v)}
        />
        {errors.downPayment && (
          <Text style={styles.errorText}>{errors.downPayment}</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          {t("financing.requestedAmount")}{" "}
          <Text style={styles.asterisk}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.requestedAmount && styles.inputError]}
          placeholder={t("financing.requestedAmountPlaceholder")}
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
          {t("financing.repaymentPeriod")}{" "}
          <Text style={styles.asterisk}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.repaymentPeriod && styles.inputError]}
          placeholder={t("financing.repaymentPeriodPlaceholder")}
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

      {/* ── Supporting Documents ── */}
      <View style={styles.sectionDivider} />
      <Text style={styles.sectionTitle}>{t("assetFin.supportingDocs")}</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>{t("assetFin.nationalId")}</Text>
        <TouchableOpacity
          style={[styles.uploadButton]}
          activeOpacity={0.7}
          onPress={() => handleUpload("National ID", setNationalId)}
        >
          <Ionicons
            name={nationalId ? "checkmark-circle" : "cloud-upload-outline"}
            size={20}
            color={nationalId ? "#059669" : Colors.brand}
          />
          <Text
            style={[styles.uploadText, nationalId && styles.uploadTextSelected]}
          >
            {nationalId || t("assetFin.nationalIdPlaceholder")}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>{t("assetFin.proofIncome")}</Text>
        <TouchableOpacity
          style={[styles.uploadButton]}
          activeOpacity={0.7}
          onPress={() => handleUpload("Proof of Income", setProofOfIncome)}
        >
          <Ionicons
            name={proofOfIncome ? "checkmark-circle" : "cloud-upload-outline"}
            size={20}
            color={proofOfIncome ? "#059669" : Colors.brand}
          />
          <Text
            style={[
              styles.uploadText,
              proofOfIncome && styles.uploadTextSelected,
            ]}
          >
            {proofOfIncome || t("assetFin.proofIncomePlaceholder")}
          </Text>
        </TouchableOpacity>
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
