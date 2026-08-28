import Ionicons from "@react-native-vector-icons/ionicons";
import { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useAuth } from "../../services/AuthContext";
import { Colors } from "../../theme/colors";

export default function ProfileScreen() {
  const { user } = useAuth();
  const [showWhyInfo, setShowWhyInfo] = useState(false);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Header ── */}
      <Text style={styles.subtitle}>
        Update your personal information and account settings
      </Text>

      {/* ── Personal Information ── */}
      <Text style={styles.sectionHeading}>Personal Information</Text>

      <View style={styles.card}>
        {/* First Name */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>First name</Text>
          <View style={styles.readonlyInput}>
            <Text style={styles.readonlyText}>{user?.first_name ?? ""}</Text>
            <Ionicons name="lock-closed-outline" size={14} color="#9CA3AF" />
          </View>
        </View>

        {/* Middle Name */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Middle name</Text>
          <View style={styles.readonlyInput}>
            <Text style={styles.readonlyText}>{user?.middle_name ?? ""}</Text>
            <Ionicons name="lock-closed-outline" size={14} color="#9CA3AF" />
          </View>
        </View>

        {/* Last Name */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Last name</Text>
          <View style={styles.readonlyInput}>
            <Text style={styles.readonlyText}>{user?.last_name ?? ""}</Text>
            <Ionicons name="lock-closed-outline" size={14} color="#9CA3AF" />
          </View>
        </View>

        {/* Email */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Email address</Text>
          <View style={styles.readonlyInput}>
            <Text style={styles.readonlyText}>{user?.email ?? ""}</Text>
            <Ionicons name="lock-closed-outline" size={14} color="#9CA3AF" />
          </View>
        </View>

        {/* Phone */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Phone number</Text>
          <View style={styles.readonlyInput}>
            <Text style={styles.readonlyText}>{user?.phone ?? ""}</Text>
            <Ionicons name="lock-closed-outline" size={14} color="#9CA3AF" />
          </View>
        </View>

        {/* County */}
        <View style={styles.fieldGroupLast}>
          <Text style={styles.label}>County</Text>
          <View style={styles.readonlyInput}>
            <Text style={styles.readonlyText}>{user?.county ?? ""}</Text>
            <Ionicons name="lock-closed-outline" size={14} color="#9CA3AF" />
          </View>
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
            details help us surface tenders and training programs available in
            your area.
          </Text>
        )}
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

  bottomSpacer: {
    height: 40,
  },
});
