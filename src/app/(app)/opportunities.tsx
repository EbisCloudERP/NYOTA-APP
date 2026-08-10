import { StyleSheet, Text, View } from "react-native";

export default function OpportunitiesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Opportunities</Text>
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
