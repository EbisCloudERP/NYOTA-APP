import { Stack } from "expo-router";

export default function ProfileGroupLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="profile"
        options={{
          headerShown: true,
          headerTitle: "Profile",
          headerBackTitle: "Settings",
          headerTintColor: "#4D2A7C",
          headerTitleStyle: {
            fontSize: 17,
            fontWeight: "600",
            color: "#111827",
          },
        }}
      />
    </Stack>
  );
}
