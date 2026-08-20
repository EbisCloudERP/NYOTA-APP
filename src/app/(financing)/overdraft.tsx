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

    // Account Holder
    if (!form.accountHolderName.trim())
      e.accountHolderName = "Account holder name is required";
    if (!form.accountNumber.trim())
      e.accountNumber = "Account number is required";
    if (!form.contactInfo.trim()) e.contactInfo = "Contact info is required";

    // Overdraft Request
    if (!form.requestedAmount.trim()) {
      e.requestedAmount = "Requested overdraft amount is required";
    } else if (
      isNaN(Number(form.requestedAmount)) ||
      Number(form.requestedAmount) <= 0
    ) {
      e.requestedAmount = "Enter a valid amount";
    }
    if (!form.purpose.trim()) e.purpose = "Purpose of overdraft is required";
    if (!form.currentBalance.trim()) {
      e.currentBalance = "Current account balance is required";
    } else if (
      isNaN(Number(form.currentBalance)) ||
      Number(form.currentBalance) < 0
    ) {
      e.currentBalance = "Enter a valid balance";
    }
    if (!form.avgMonthlyRevenue.trim()) {
      e.avgMonthlyRevenue = "Average monthly revenue is required";
    } else if (
      isNaN(Number(form.avgMonthlyRevenue)) ||
      Number(form.avgMonthlyRevenue) <= 0
    ) {
      e.avgMonthlyRevenue = "Enter a valid amount";
    }
    if (!form.repaymentPeriod.trim())
      e.repaymentPeriod = "Repayment period is required";
    if (!form.interestRate.trim()) e.interestRate = "Interest rate is required";

    // Collateral
    if (!form.collateralDetails.trim())
      e.collateralDetails = "Collateral details are required";
    if (!form.collateralValuation.trim()) {
      e.collateralValuation = "Collateral valuation is required";
    } else if (
      isNaN(Number(form.collateralValuation)) ||
      Number(form.collateralValuation) <= 0
    ) {
      e.collateralValuation = "Enter a valid valuation";
    }
    if (!collateralDoc) e.collateralDoc = "Supporting documents are required";

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

    showToast("Your overdraft application has been submitted successfully.", "success");
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
        Access flexible overdraft facilities to manage your day-to-day cash flow
        and cover short-term funding gaps as they arise.
      </Text>

      {/* Required fields note */}
      <Text style={styles.requiredNote}>
        All fields marked with <Text style={styles.asterisk}>*</Text> are
        required
      </Text>

      {/* ── Account Holder ── */}
      <Text style={styles.sectionTitle}>Account Holder</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          Account Holder's Name <Text style={styles.asterisk}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.accountHolderName && styles.inputError]}
          placeholder="Enter account holder's name"
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
          Account Number <Text style={styles.asterisk}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.accountNumber && styles.inputError]}
          placeholder="Enter account number"
          placeholderTextColor="#9CA3AF"
          value={form.accountNumber}
          onChangeText={(v) => updateField("accountNumber", v)}
        />
        {errors.accountNumber && (
          <Text style={styles.errorText}>{errors.accountNumber}</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Business / Trading Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter business or trading name (optional)"
          placeholderTextColor="#9CA3AF"
          value={form.tradingName}
          onChangeText={(v) => updateField("tradingName", v)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          Contact Info <Text style={styles.asterisk}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.contactInfo && styles.inputError]}
          placeholder="e.g. +254 712 345 678"
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
      <Text style={styles.sectionTitle}>Overdraft Request Details</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          Requested Overdraft Amount (KES){" "}
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
          Purpose of Overdraft <Text style={styles.asterisk}>*</Text>
        </Text>
        <TextInput
          style={[
            styles.input,
            styles.textArea,
            errors.purpose && styles.inputError,
          ]}
          placeholder="Describe the purpose of the overdraft"
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
          Current Account Balance (KES) <Text style={styles.asterisk}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.currentBalance && styles.inputError]}
          placeholder="Enter current balance"
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
          Average Monthly Revenue (KES) <Text style={styles.asterisk}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.avgMonthlyRevenue && styles.inputError]}
          placeholder="Enter average monthly revenue"
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
          Proposed Repayment Period <Text style={styles.asterisk}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.repaymentPeriod && styles.inputError]}
          placeholder="e.g. 6 months"
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

      {/* ── Collateral ── */}
      <View style={styles.sectionDivider} />
      <Text style={styles.sectionTitle}>Collateral</Text>

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

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          Valuation of Collateral (KES) <Text style={styles.asterisk}>*</Text>
        </Text>
        <TextInput
          style={[
            styles.input,
            errors.collateralValuation && styles.inputError,
          ]}
          placeholder="Enter valuation amount"
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
          Upload Supporting Documents <Text style={styles.asterisk}>*</Text>
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
            {collateralDoc || "Upload supporting documents"}
          </Text>
        </TouchableOpacity>
        <Text style={styles.uploadHint}>
          Accepted formats: PDF, JPG, PNG, DOC (Max 10MB)
        </Text>
        {errors.collateralDoc && (
          <Text style={styles.errorText}>{errors.collateralDoc}</Text>
        )}
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
