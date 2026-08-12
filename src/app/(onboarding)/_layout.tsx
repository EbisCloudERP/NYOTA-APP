import Ionicons from "@react-native-vector-icons/ionicons";
import { router, Stack } from "expo-router";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../services/AuthContext";

function HeaderRight() {
  const { signOut } = useAuth();

  const handleLogout = () => {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: async () => {
          await signOut();
          router.replace("/login");
        },
      },
    ]);
  };

  return (
    <View style={styles.headerRight}>
      <TouchableOpacity style={styles.iconButton}>
        <Ionicons name="notifications-outline" size={20} color="#374151" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconButton}>
        <Ionicons name="globe-outline" size={20} color="#374151" />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLogout} style={styles.iconButton}>
        <Ionicons name="log-out-outline" size={20} color="#EF4444" />
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
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
});
