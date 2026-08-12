import { Stack } from "expo-router";

export default function QuizGroupLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="quiz"
        options={{
          headerShown: true,
          headerTitle: "Quiz",
          headerBackTitle: "Lesson",
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
