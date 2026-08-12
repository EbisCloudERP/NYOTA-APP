import { Stack } from "expo-router";

export default function LessonGroupLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="lesson"
        options={{
          headerShown: true,
          headerTitle: "Lesson",
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
