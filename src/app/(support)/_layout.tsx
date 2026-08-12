import { Stack } from "expo-router";

export default function SupportGroupLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="support"
        options={{
          headerShown: true,
          headerTitle: "Support",
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
