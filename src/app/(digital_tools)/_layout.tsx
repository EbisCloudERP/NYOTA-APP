import { Stack } from "expo-router";

export default function DigitalToolsGroupLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="digital-tools"
        options={{
          headerShown: true,
          headerTitle: "Digital Tools",
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
