import { Stack } from "expo-router";

export default function LessonsGroupLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="lessons"
        options={{
          headerShown: true,
          headerTitle: "Lessons",
          headerBackTitle: "My Learning",
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
