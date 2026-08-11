import { Stack } from "expo-router";

export default function SettingsGroupLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="data-policy"
        options={{
          headerShown: true,
          headerTitle: "Data Policy",
          headerBackTitle: "Settings",
          headerTintColor: "#4D2A7C",
          headerTitleStyle: {
            fontSize: 17,
            fontWeight: "600",
            color: "#111827",
          },
        }}
      />
      <Stack.Screen
        name="terms-and-conditions"
        options={{
          headerShown: true,
          headerTitle: "Terms & Conditions",
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
