import Ionicons from "@react-native-vector-icons/ionicons";
import { router, Tabs } from "expo-router";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import LanguageSelector from "../../components/LanguageSelector";
import { useAuth } from "../../services/AuthContext";
import { Colors } from "../../theme/colors";

function HeaderLeft() {
  const { user } = useAuth();
  const firstName = user?.first_name || "User";
  const initials =
    `${(user?.first_name?.[0] ?? "")}${(user?.last_name?.[0] ?? "")}`.toUpperCase() ||
    "U";

  return (
    <View style={styles.headerLeft}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>
      <View>
        <Text style={styles.headerGreeting}>Welcome back</Text>
        <Text style={styles.headerName}>{firstName}</Text>
      </View>
    </View>
  );
}

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
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => router.push("/my-applications")}
      >
        <Ionicons name="notifications-outline" size={20} color="#374151" />
      </TouchableOpacity>
      <LanguageSelector variant="header" />
      <TouchableOpacity onPress={handleLogout} style={styles.iconButton}>
        <Ionicons name="log-out-outline" size={20} color="#EF4444" />
      </TouchableOpacity>
    </View>
  );
}

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTitle: "",
        headerLeft: () => <HeaderLeft />,
        headerRight: () => <HeaderRight />,
        tabBarActiveTintColor: Colors.brand,
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: {
          borderTopColor: "#F3F4F6",
          backgroundColor: "#FFFFFF",
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size - 2} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="my-learning"
        options={{
          title: "My Learning",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book-outline" size={size - 2} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="opportunities"
        options={{
          title: "Opportunities",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="briefcase-outline" size={size - 2} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="webinars"
        options={{
          title: "Webinars",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="tv-outline" size={size - 2} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size - 2} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingLeft: 20,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.brand,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  headerGreeting: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  headerName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingRight: 20,
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
