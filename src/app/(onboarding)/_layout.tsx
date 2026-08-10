import { router, Stack } from "expo-router";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

function HeaderRight() {
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

  return (
    <View style={styles.headerRight}>
      <TouchableOpacity style={styles.langButton}>
        <Text style={styles.langText}>🌐 EN</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutIcon}>🚪</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        title: "Get Started",
        headerTitleStyle: {
          fontWeight: "700",
          color: "#1F2937",
        },
        headerRight: () => <HeaderRight />,
      }}
    />
  );
}

const styles = StyleSheet.create({
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginRight: 4,
  },
  langButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  langText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#374151",
  },
  logoutButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  logoutIcon: {
    fontSize: 18,
    color: "#6B7280",
  },
});
