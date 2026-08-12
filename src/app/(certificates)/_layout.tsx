import { Stack } from "expo-router";

export default function CertificatesGroupLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="certificates"
        options={{
          headerShown: true,
          headerTitle: "My Certificates",
          headerBackTitle: "Lessons",
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
