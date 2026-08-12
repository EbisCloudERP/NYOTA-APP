import { Stack } from "expo-router";

export default function FinancingGroupLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="lpo"
        options={{
          headerShown: true,
          headerTitle: "LPO Financing",
          headerBackTitle: "Back",
          headerTintColor: "#4D2A7C",
          headerTitleStyle: {
            fontWeight: "700",
            color: "#111827",
          },
        }}
      />
      <Stack.Screen
        name="assetFin"
        options={{
          headerShown: true,
          headerTitle: "Asset Financing",
          headerBackTitle: "Back",
          headerTintColor: "#4D2A7C",
          headerTitleStyle: {
            fontWeight: "700",
            color: "#111827",
          },
        }}
      />
      <Stack.Screen
        name="overdraft"
        options={{
          headerShown: true,
          headerTitle: "Overdraft",
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
