import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function LanguageSelector() {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.langButton}>
        <Text style={styles.langText}>🌐 EN</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-end",
    marginBottom: 16,
  },
  langButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  langText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#374151",
  },
});
