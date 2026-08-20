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

  const handleUpload = async (label: string, setter: (v: string | null) => void) => {
    const ok = await confirm({
      title: `Upload ${label}`,
      message: "This will open the file picker.",
      confirmText: "Select file",
      cancelText: "Cancel",
    });
    if (ok) setter("selected-file.pdf");
  };

  const validate = (): boolean => {
    const e: FormErrors = {};

    // Company Info
    if (!form.companyName.trim()) e.companyName = "Company name is required";
    if (!form.phoneNumber.trim()) e.phoneNumber = "Phone number is required";
    if (!form.contactPerson.trim())
      e.contactPerson = "Contact person is required";
    if (!form.registrationNumber.trim())
      e.registrationNumber = "Registration number is required";
    if (!form.companyAddress.trim())
      e.companyAddress = "Company address is required";

    // Asset Details
    if (!form.assetType.trim()) e.assetType = "Asset type is required";
    if (!form.assetDescription.trim())
      e.assetDescription = "Asset description is required";
    if (!form.assetCost.trim()) {
      e.assetCost = "Asset cost is required";
    } else if (isNaN(Number(form.assetCost)) || Number(form.assetCost) <= 0) {
      e.assetCost = "Enter a valid cost";
    }
    if (!assetInvoice) e.assetInvoice = "Asset invoice/quotation is required";
    if (!form.supplierName.trim()) e.supplierName = "Supplier name is required";
    if (!form.supplierContact.trim())
      e.supplierContact = "Supplier contact is required";

    // Financing Request
    if (!form.downPayment.trim()) {
      e.downPayment = "Down payment is required";
    } else if (
      isNaN(Number(form.downPayment)) ||
      Number(form.downPayment) < 0
    ) {
      e.downPayment = "Enter a valid amount";
    }
    if (!form.requestedAmount.trim()) {
      e.requestedAmount = "Requested financing amount is required";
    } else if (
      isNaN(Number(form.requestedAmount)) ||
      Number(form.requestedAmount) <= 0
    ) {
      e.requestedAmount = "Enter a valid amount";
    }
    if (!form.repaymentPeriod.trim())
      e.repaymentPeriod = "Repayment period is required";
    if (!form.interestRate.trim()) e.interestRate = "Interest rate is required";
    if (!form.collateralDetails.trim())
      e.collateralDetails = "Collateral details are required";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      showToast("Please fill in all required fields correctly.", "error");
      return;
    }

    if (!declaration || !authorizeChecks || !approvalTerms || !agreeTerms) {
      showToast("Please accept all declarations and terms before submitting.", "error");
      return;
    }

    showToast("Your asset financing application has been submitted successfully.", "success");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Acquire essential business equipment, vehicles, and machinery with
        flexible asset financing solutions tailored to your needs.
      </Text>

      {/* Required fields note */}
      <Text style={styles.requiredNote}>
        All fields marked with <Text style={styles.asterisk}>*</Text> are
        required
      </Text>

      {/* ── Company Information ── */}
      <Text style={styles.sectionTitle}>Company Information</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          Company Name <Text style={styles.asterisk}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.companyName && styles.inputError]}
          placeholder="Enter company name"
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
          Phone Number <Text style={styles.asterisk}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.phoneNumber && styles.inputError]}
          placeholder="e.g. +254 712 345 678"
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
          Contact Person <Text style={styles.asterisk}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.contactPerson && styles.inputError]}
          placeholder="Enter full name"
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
          Company Registration Number <Text style={styles.asterisk}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.registrationNumber && styles.inputError]}
          placeholder="Enter registration number"
          placeholderTextColor="#9CA3AF"
          value={form.registrationNumber}
          onChangeText={(v) => updateField("registrationNumber", v)}
        />
        {errors.registrationNumber && (
          <Text style={styles.errorText}>{errors.registrationNumber}</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>VAT Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter VAT number (optional)"
          placeholderTextColor="#9CA3AF"
          value={form.vatNumber}
          onChangeText={(v) => updateField("vatNumber", v)}
        />
      </View>

      {/* Tax Compliance Certificate */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Tax Compliance Certificate</Text>
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
            {taxCertificate || "Upload tax compliance certificate"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          Company Address <Text style={styles.asterisk}>*</Text>
        </Text>
        <TextInput
          style={[
            styles.input,
            styles.textArea,
            errors.companyAddress && styles.inputError,
          ]}
          placeholder="Enter company address"
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
      <Text style={styles.sectionTitle}>Asset Details</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          Asset Type <Text style={styles.asterisk}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.assetType && styles.inputError]}
          placeholder="e.g. Vehicle, Machinery, Equipment"
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
          Asset Description <Text style={styles.asterisk}>*</Text>
        </Text>
        <TextInput
          style={[
            styles.input,
            styles.textArea,
            errors.assetDescription && styles.inputError,
          ]}
          placeholder="Describe the asset including make, model, and specifications"
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
          Asset Cost (KES) <Text style={styles.asterisk}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.assetCost && styles.inputError]}
          placeholder="Enter asset cost"
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
          Upload Asset Invoice / Quotation{" "}
          <Text style={styles.asterisk}>*</Text>
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
            {assetInvoice || "Upload invoice or quotation"}
          </Text>
        </TouchableOpacity>
        <Text style={styles.uploadHint}>
          Accepted formats: PDF, JPG, PNG, DOC (Max 10MB)
        </Text>
        {errors.assetInvoice && (
          <Text style={styles.errorText}>{errors.assetInvoice}</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          Supplier's Name <Text style={styles.asterisk}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.supplierName && styles.inputError]}
          placeholder="Enter supplier's name"
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
          Supplier Contact Information <Text style={styles.asterisk}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.supplierContact && styles.inputError]}
          placeholder="e.g. +254 712 345 678"
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
      <Text style={styles.sectionTitle}>Financing Request</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          Down Payment (KES) <Text style={styles.asterisk}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.downPayment && styles.inputError]}
          placeholder="Enter down payment amount"
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
          Requested Financing Amount (KES){" "}
          <Text style={styles.asterisk}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.requestedAmount && styles.inputError]}
          placeholder="Enter requested amount"
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
          Repayment Period <Text style={styles.asterisk}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.repaymentPeriod && styles.inputError]}
          placeholder="e.g. 12 months"
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
          Interest Rate (%) <Text style={styles.asterisk}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.interestRate && styles.inputError]}
          placeholder="e.g. 12%"
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
          Collateral Details <Text style={styles.asterisk}>*</Text>
        </Text>
        <TextInput
          style={[
            styles.input,
            styles.textArea,
            errors.collateralDetails && styles.inputError,
          ]}
          placeholder="Describe the collateral being offered"
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
      <Text style={styles.sectionTitle}>Supporting Documents</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>National ID</Text>
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
            {nationalId || "Upload national ID"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Proof of Income (e.g. Payslip)</Text>
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
            {proofOfIncome || "Upload proof of income"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── Declarations ── */}
      <View style={styles.sectionDivider} />
      <Text style={styles.sectionTitle}>Declarations & Agreements</Text>

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
        <Text style={styles.checkboxLabel}>
          I declare that all information provided is true and accurate to the
          best of my knowledge.
        </Text>
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
        <Text style={styles.checkboxLabel}>
          I authorize the partner bank to verify the information provided and
          conduct credit checks.
        </Text>
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
        <Text style={styles.checkboxLabel}>
          I understand that approval is subject to the partner bank's terms and
          conditions.
        </Text>
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
        <Text style={styles.checkboxLabel}>
          I agree to the Terms and Conditions and Privacy Policy.
        </Text>
      </TouchableOpacity>

      {/* ── Submit Button ── */}
      <TouchableOpacity
        style={styles.submitButton}
        activeOpacity={0.7}
        onPress={handleSubmit}
      >
        <Ionicons name="paper-plane" size={18} color="#FFFFFF" />
        <Text style={styles.submitButtonText}>Submit Application</Text>
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
