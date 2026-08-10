import { StyleSheet, Text, View } from "react-native";

export default function MyLearningScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>My Learning</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  text: {
    fontSize: 18,
    color: "#9CA3AF",
  },
});
