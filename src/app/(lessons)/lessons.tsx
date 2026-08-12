import { StyleSheet, Text, View } from "react-native";

export default function LessonsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lessons</Text>
      <Text style={styles.subtitle}>Course lessons will appear here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
});
