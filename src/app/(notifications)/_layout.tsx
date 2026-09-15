import { Stack } from "expo-router";

export default function NotificationsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="notifications"
        options={{
          headerShown: true,
          headerTitle: "Notifications",
          headerBackTitle: "Back",
          headerTintColor: "#4D2A7C",
          headerTitleStyle: {
            fontWeight: "700",
            color: "#111827",
          },
        }}
      />
    </Stack>
  );
}
