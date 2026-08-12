import Ionicons from "@react-native-vector-icons/ionicons";
import { useState } from "react";
import {
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Colors } from "../../theme/colors";

interface FormData {
  // Company Info
  companyName: string;
  phoneNumber: string;
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
  const [form, setForm] = useState<FormData>({
    companyName: "",
    phoneNumber: "",
    contactPerson: "",
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

  const handleUpload = (label: string, setter: (v: string | null) => void) => {
    // Placeholder for actual file picker (expo-document-picker)
    Alert.alert(`Upload ${label}`, "This will open the file picker.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Select file",
        onPress: () => setter("selected-file.pdf"),
      },
    ]);
  };

  const validate = (): boolean => {
    const e: FormErrors = {};

    if (!form.companyName.trim()) e.companyName = "Company name is required";
    if (!form.phoneNumber.trim()) e.phoneNumber = "Phone number is required";
    if (!form.contactPerson.trim())
      e.contactPerson = "Contact person is required";
    if (!form.companyAddress.trim())
      e.companyAddress = "Company address is required";
    if (!form.registrationNumber.trim())
      e.registrationNumber = "Registration number is required";

    if (!form.lpoNumber.trim()) e.lpoNumber = "LPO number is required";
    if (!form.lpoAmount.trim()) e.lpoAmount = "LPO amount is required";
    if (!form.lpoDate.trim()) e.lpoDate = "LPO date is required";
    if (!lpoDocument) e.lpoDocument = "LPO document is required";
    if (!form.buyerName.trim()) e.buyerName = "Buyer name is required";

    if (!form.requestedAmount.trim()) {
      e.requestedAmount = "Requested financing amount is required";
    } else if (
      isNaN(Number(form.requestedAmount)) ||
      Number(form.requestedAmount) <= 0
    ) {
      e.requestedAmount = "Enter a valid amount";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      Alert.alert(
        "Validation Error",
        "Please fill in all required fields correctly.",
      );
      return;
    }

    if (!declaration || !authorizeChecks || !approvalTerms || !agreeTerms) {
      Alert.alert(
        "Agreement Required",
        "Please accept all declarations and terms before submitting.",
      );
      return;
    }

    Alert.alert(
      "Submitted",
      "Your LPO financing application has been submitted successfully.",
    );
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
        Get financing against confirmed Local Purchase Orders (LPOs) to fulfill
        large contracts without straining your working capital.
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

      {/* VAT Number */}
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

      {/* Company Profile Picture */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Company Profile Picture</Text>
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
            {profilePicture || "Upload profile picture"}
          </Text>
        </TouchableOpacity>
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

      {/* ── LPO Details ── */}
      <View style={styles.sectionDivider} />
      <Text style={styles.sectionTitle}>LPO Details</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          LPO Number <Text style={styles.asterisk}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.lpoNumber && styles.inputError]}
          placeholder="Enter LPO number"
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
          LPO Amount (KES) <Text style={styles.asterisk}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.lpoAmount && styles.inputError]}
          placeholder="Enter LPO amount"
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
          LPO Date <Text style={styles.asterisk}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.lpoDate && styles.inputError]}
          placeholder="YYYY-MM-DD"
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
          LPO Document <Text style={styles.asterisk}>*</Text>
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
            {lpoDocument || "Upload LPO document"}
          </Text>
        </TouchableOpacity>
        <Text style={styles.uploadHint}>
          Accepted formats: PDF, JPG, PNG, DOC (Max 10MB)
        </Text>
        {errors.lpoDocument && (
          <Text style={styles.errorText}>{errors.lpoDocument}</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          Buyer Name <Text style={styles.asterisk}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.buyerName && styles.inputError]}
          placeholder="Enter buyer name"
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
      <Text style={styles.sectionTitle}>Financing Request</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          Requested Financing Amount (KES){" "}
          <Text style={styles.asterisk}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.requestedAmount && styles.inputError]}
          placeholder="Enter amount"
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
