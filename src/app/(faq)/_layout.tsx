import { Stack } from "expo-router";

export default function FaqGroupLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="faq"
        options={{
          headerShown: true,
          headerTitle: "FAQ",
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
