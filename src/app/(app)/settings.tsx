import Ionicons from "@react-native-vector-icons/ionicons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../theme/colors";

interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
}

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: true,
    sms: false,
    push: true,
  });

  const handleLogout = () => {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: () => router.replace("/login"),
      },
    ]);
  };

  const toggleNotification = (key: keyof NotificationSettings) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Header ── */}
      <Text style={styles.heading}>Settings</Text>

      {/* ── Menu items ── */}
      <TouchableOpacity
        style={styles.menuItem}
        activeOpacity={0.7}
        onPress={() => router.push("/profile" as any)}
      >
        <View style={styles.menuItemLeft}>
          <View style={styles.menuIcon}>
            <Ionicons name="person-outline" size={18} color={Colors.brand} />
          </View>
          <Text style={styles.menuItemText}>Profile</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
        <View style={styles.menuItemLeft}>
          <View style={styles.menuIcon}>
            <Ionicons name="headset-outline" size={18} color={Colors.brand} />
          </View>
          <Text style={styles.menuItemText}>Support</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        activeOpacity={0.7}
        onPress={() => router.push("/data-policy")}
      >
        <View style={styles.menuItemLeft}>
          <View style={styles.menuIcon}>
            <Ionicons
              name="shield-checkmark-outline"
              size={18}
              color={Colors.brand}
            />
          </View>
          <Text style={styles.menuItemText}>Data Policy</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.menuItem, styles.menuItemLast]}
        activeOpacity={0.7}
        onPress={() => router.push("/terms-and-conditions")}
      >
        <View style={styles.menuItemLeft}>
          <View style={styles.menuIcon}>
            <Ionicons
              name="document-text-outline"
              size={18}
              color={Colors.brand}
            />
          </View>
          <Text style={styles.menuItemText}>Terms & Conditions</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
      </TouchableOpacity>

      {/* ── Notifications Section ── */}
      <Text style={styles.sectionTitle}>Notifications</Text>

      {/* Email */}
      <TouchableOpacity
        style={styles.notifItem}
        activeOpacity={0.7}
        onPress={() => toggleNotification("email")}
      >
        <View style={styles.notifLeft}>
          <View style={styles.notifIcon}>
            <Ionicons name="mail-outline" size={18} color={Colors.brand} />
          </View>
          <View style={styles.notifContent}>
            <Text style={styles.notifTitle}>Email Notifications</Text>
            <Text style={styles.notifSubtext}>
              Receive updates and announcements via email
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.checkbox,
            notifications.email && styles.checkboxChecked,
          ]}
        >
          {notifications.email && (
            <Ionicons name="checkmark" size={14} color="#FFFFFF" />
          )}
        </View>
      </TouchableOpacity>

      {/* SMS */}
      <View style={[styles.notifItem, styles.notifItemDisabled]}>
        <View style={styles.notifLeft}>
          <View style={[styles.notifIcon, styles.notifIconDisabled]}>
            <Ionicons name="chatbubble-outline" size={18} color="#9CA3AF" />
          </View>
          <View style={styles.notifContent}>
            <Text style={[styles.notifTitle, styles.notifTitleDisabled]}>
              SMS Notifications
            </Text>
            <Text style={styles.notifSubtext}>
              Get important alerts and reminders via SMS
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.checkbox,
            notifications.sms && styles.checkboxChecked,
            styles.checkboxDisabled,
          ]}
        >
          {notifications.sms && (
            <Ionicons name="checkmark" size={14} color="#FFFFFF" />
          )}
        </View>
      </View>

      {/* Push */}
      <TouchableOpacity
        style={styles.notifItem}
        activeOpacity={0.7}
        onPress={() => toggleNotification("push")}
      >
        <View style={styles.notifLeft}>
          <View style={styles.notifIcon}>
            <Ionicons
              name="notifications-outline"
              size={18}
              color={Colors.brand}
            />
          </View>
          <View style={styles.notifContent}>
            <Text style={styles.notifTitle}>Push Notifications</Text>
            <Text style={styles.notifSubtext}>
              Enable real-time notifications on your device
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.checkbox,
            notifications.push && styles.checkboxChecked,
          ]}
        >
          {notifications.push && (
            <Ionicons name="checkmark" size={14} color="#FFFFFF" />
          )}
        </View>
      </TouchableOpacity>

      {/* Info bar */}
      <View style={styles.infoBar}>
        <View style={styles.infoBarIcon}>
          <Ionicons
            name="information-circle-outline"
            size={18}
            color="#92400E"
          />
        </View>
        <View style={styles.infoBarContent}>
          <Text style={styles.infoBarTitle}>Why we need this information</Text>
          <Text style={styles.infoBarText}>
            We use this information to send you important updates, reminders,
            and personalized content based on your preferences.
          </Text>
        </View>
      </View>

      {/* ── Language Section ── */}
      <Text style={[styles.sectionTitle, styles.languageSectionTitle]}>
        Language
      </Text>
      <Text style={styles.languageSubtitle}>
        Manage your language preferences
      </Text>

      {/* English */}
      <View style={[styles.langItem, styles.langItemDisabled]}>
        <View style={styles.langLeft}>
          <View style={[styles.langIcon, styles.langIconDisabled]}>
            <Ionicons name="language-outline" size={18} color="#9CA3AF" />
          </View>
          <Text style={styles.langTitleDisabled}>English</Text>
        </View>
        <View
          style={[
            styles.checkbox,
            styles.checkboxChecked,
            styles.checkboxDisabled,
          ]}
        >
          <Ionicons name="checkmark" size={14} color="#FFFFFF" />
        </View>
      </View>

      {/* Swahili */}
      <View style={[styles.langItem, styles.langItemDisabled]}>
        <View style={styles.langLeft}>
          <View style={[styles.langIcon, styles.langIconDisabled]}>
            <Ionicons name="language-outline" size={18} color="#9CA3AF" />
          </View>
          <Text style={styles.langTitleDisabled}>Swahili</Text>
        </View>
        <View style={[styles.checkbox, styles.checkboxDisabled]} />
      </View>

      {/* Info bar */}
      <View style={styles.infoBar}>
        <View style={styles.infoBarIcon}>
          <Ionicons
            name="information-circle-outline"
            size={18}
            color="#92400E"
          />
        </View>
        <View style={styles.infoBarContent}>
          <Text style={styles.infoBarTitle}>Why we need this information</Text>
          <Text style={styles.infoBarText}>
            We use this information to send you important updates, reminders,
            and personalized content based on your preferences.
          </Text>
        </View>
      </View>

      {/* ── Logout ── */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log out</Text>
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
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 20,
  },

  // ── Menu items ──
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  menuItemLast: {
    borderBottomWidth: 0,
    marginBottom: 28,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuIcon: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: "#F3EFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  menuItemText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1F2937",
  },

  // ── Notifications section ──
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 14,
  },
  notifItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  notifLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
    marginRight: 12,
  },
  notifIcon: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: "#F3EFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  notifContent: {
    flex: 1,
  },
  notifTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 2,
  },
  notifSubtext: {
    fontSize: 12,
    color: "#9CA3AF",
    lineHeight: 16,
  },
  notifItemDisabled: {
    opacity: 0.5,
  },
  notifIconDisabled: {
    backgroundColor: "#F3F4F6",
  },
  notifTitleDisabled: {
    color: "#9CA3AF",
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: Colors.brand,
    borderColor: Colors.brand,
  },

  // ── Language section ──
  languageSectionTitle: {
    marginTop: 28,
    marginBottom: 4,
  },
  languageSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 19,
    marginBottom: 14,
  },
  langItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  langItemDisabled: {
    opacity: 0.5,
  },
  langLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  langIcon: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: "#F3EFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  langIconDisabled: {
    backgroundColor: "#F3F4F6",
  },
  langTitleDisabled: {
    fontSize: 14,
    fontWeight: "600",
    color: "#9CA3AF",
  },
  checkboxDisabled: {
    opacity: 0.5,
  },

  // ── Info bar ──
  infoBar: {
    flexDirection: "row",
    backgroundColor: "#FFFBEB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FDE68A",
    padding: 14,
    marginTop: 16,
    gap: 10,
  },
  infoBarIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#FEF3C7",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  infoBarContent: {
    flex: 1,
  },
  infoBarTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#92400E",
    marginBottom: 4,
  },
  infoBarText: {
    fontSize: 12,
    color: "#A16207",
    lineHeight: 17,
  },

  // ── Logout ──
  logoutButton: {
    marginTop: 28,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
    alignItems: "center",
  },
  logoutText: {
    fontSize: 15,
    color: "#EF4444",
    fontWeight: "500",
  },

  // ── Bottom spacer ──
  bottomSpacer: {
    height: 24,
  },
});
