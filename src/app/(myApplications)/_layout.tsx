import { Stack } from "expo-router";

export default function MyApplicationsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="my-applications"
        options={{
          headerShown: true,
          headerTitle: "My applications",
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
