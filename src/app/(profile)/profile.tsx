import Ionicons from "@react-native-vector-icons/ionicons";
import { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Colors } from "../../theme/colors";

export default function ProfileScreen() {
  const [firstName, setFirstName] = useState("Joab");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("Rogony");
  const [email] = useState("joab.rogony@example.com");
  const [phone] = useState("+254 712 345 678");
  const [dob, setDob] = useState("1995-06-15");
  const [gender, setGender] = useState("Male");
  const [county, setCounty] = useState("Nairobi");
  const [constituency, setConstituency] = useState("Westlands");
  const [subCounty, setSubCounty] = useState("Kitisuru");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showWhyInfo, setShowWhyInfo] = useState(false);

  const handleSave = () => {
    if (password && password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
    Alert.alert("Saved", "Your profile has been updated successfully.");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Header ── */}
      {/* <Text style={styles.title}>Profile</Text> */}
      <Text style={styles.subtitle}>
        Update your personal information and account settings
      </Text>

      {/* ── Personal Information ── */}
      <Text style={styles.sectionHeading}>Personal Information</Text>

      <View style={styles.card}>
        {/* First Name */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>First name</Text>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Enter first name"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Middle Name */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Middle name</Text>
          <TextInput
            style={styles.input}
            value={middleName}
            onChangeText={setMiddleName}
            placeholder="Enter middle name"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Last Name */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Last name</Text>
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Enter last name"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Email (non-editable) */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Email address</Text>
          <View style={styles.readonlyInput}>
            <Text style={styles.readonlyText}>{email}</Text>
            <Ionicons name="lock-closed-outline" size={14} color="#9CA3AF" />
          </View>
        </View>

        {/* Phone (non-editable) */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Phone number</Text>
          <View style={styles.readonlyInput}>
            <Text style={styles.readonlyText}>{phone}</Text>
            <Ionicons name="lock-closed-outline" size={14} color="#9CA3AF" />
          </View>
        </View>

        {/* Date of Birth */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Date of birth</Text>
          <TextInput
            style={styles.input}
            value={dob}
            onChangeText={setDob}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Gender */}
        <View style={styles.fieldGroupLast}>
          <Text style={styles.label}>Gender</Text>
          <TextInput
            style={styles.input}
            value={gender}
            onChangeText={setGender}
            placeholder="Enter gender"
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      {/* ── Company ── */}
      <Text style={styles.sectionHeading}>Location Information</Text>

      <View style={styles.card}>
        {/* County */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>County</Text>
          <TextInput
            style={styles.input}
            value={county}
            onChangeText={setCounty}
            placeholder="Enter county"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Constituency */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Constituency</Text>
          <TextInput
            style={styles.input}
            value={constituency}
            onChangeText={setConstituency}
            placeholder="Enter constituency"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Sub-county */}
        <View style={styles.fieldGroupLast}>
          <Text style={styles.label}>Sub-county</Text>
          <TextInput
            style={styles.input}
            value={subCounty}
            onChangeText={setSubCounty}
            placeholder="Enter sub-county"
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      {/* ── Why we need this information ── */}
      <TouchableOpacity
        style={styles.whySection}
        activeOpacity={0.7}
        onPress={() => setShowWhyInfo(!showWhyInfo)}
      >
        <View style={styles.whyHeader}>
          <View style={styles.whyHeaderLeft}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color={Colors.brand}
            />
            <Text style={styles.whyTitle}>Why we need this information</Text>
          </View>
          <Ionicons
            name={showWhyInfo ? "chevron-up" : "chevron-down"}
            size={18}
            color="#6B7280"
          />
        </View>
        {showWhyInfo && (
          <Text style={styles.whyText}>
            We collect this information to personalize your learning experience,
            match you with relevant opportunities in your region, and ensure
            compliance with procurement eligibility requirements. Your county
            and constituency details help us surface tenders and training
            programs available in your area.
          </Text>
        )}
      </TouchableOpacity>

      {/* ── Password ── */}
      <Text style={styles.sectionHeading}>Password</Text>

      <View style={styles.card}>
        {/* New Password */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>New password</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter new password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeButton}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={18}
                color="#9CA3AF"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Confirm Password */}
        <View style={styles.fieldGroupLast}>
          <Text style={styles.label}>Confirm password</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={styles.passwordInput}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm new password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.eyeButton}
            >
              <Ionicons
                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                size={18}
                color="#9CA3AF"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ── Save Button ── */}
      <TouchableOpacity
        style={styles.saveButton}
        activeOpacity={0.8}
        onPress={handleSave}
      >
        <Text style={styles.saveButtonText}>Save changes</Text>
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
    paddingTop: 24,
  },

  // ── Header ──
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 24,
  },

  // ── Section headings ──
  sectionHeading: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 10,
  },

  // ── Card ──
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
    marginBottom: 24,
  },

  // ── Fields ──
  fieldGroup: {
    marginBottom: 16,
  },
  fieldGroupLast: {
    marginBottom: 0,
  },
  label: {
    fontSize: 13,
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
    paddingVertical: 12,
    fontSize: 14,
    color: "#1F2937",
  },
  readonlyInput: {
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  readonlyText: {
    fontSize: 14,
    color: "#6B7280",
  },

  // ── Password ──
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: "#1F2937",
  },
  eyeButton: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },

  // ── Why section ──
  whySection: {
    backgroundColor: "#F5F3FF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
  },
  whyHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  whyHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  whyTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.brand,
  },
  whyText: {
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 20,
    marginTop: 10,
    paddingLeft: 28,
  },

  // ── Save Button ──
  saveButton: {
    backgroundColor: Colors.brand,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 12,
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  bottomSpacer: {
    height: 40,
  },
});
