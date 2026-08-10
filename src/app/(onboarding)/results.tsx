import { router, Stack } from "expo-router";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Colors } from "../../theme/colors";

const courses = [
  "Procurement Financing Guarantees",
  "Introduction to AGPO",
  "Public Procurement Kenya",
  "Business Formalization & Compliance",
  "Bid Preparation & Tender Documentation",
  "IFMIS & EGP Digital Procurement",
  "Contract Award Execution & Performance",
];

export default function ResultsScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Results" }} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text style={styles.title}>Congratulations 🎉</Text>
        <Text style={styles.subtitle}>
          Please review your information before continuing.
        </Text>

        {/* Section title */}
        <Text style={styles.sectionTitle}>Your eligibility status</Text>

        {/* Course Cards */}
        <View style={styles.cardsList}>
          {courses.map((course, index) => (
            <View key={index} style={styles.courseCard}>
              <View style={styles.courseIcon}>
                <Text style={styles.courseIconText}>📘</Text>
              </View>
              <Text style={styles.courseName}>{course}</Text>
            </View>
          ))}
        </View>

        {/* Info: Eligible */}
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            ✅{" "}
            <Text style={styles.boldText}>
              You are eligible for {courses.length} programs!
            </Text>
            {"\n"} Based on your profile, we've matched you with training
            programs that fit your goals and background.
          </Text>
        </View>

        {/* Info: Personalized */}
        <View style={styles.infoCardAlt}>
          <Text style={styles.infoTextAlt}>
            ⭐ <Text style={styles.boldText}>Personalized for you</Text>
            {"\n"}
            These programs are specifically selected based on your education
            level, employment status, and career goals.
          </Text>
        </View>
      </ScrollView>

      {/* Fixed Bottom */}
      <View style={styles.bottomFixed}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => router.replace("/home")}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
        <Text style={styles.footer}>
          You can update your profile anytime from the dashboard
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    marginBottom: 24,
    lineHeight: 21,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 14,
  },
  cardsList: {
    gap: 10,
    marginBottom: 24,
  },
  courseCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
  },
  courseIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#EDE9FE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  courseIconText: {
    fontSize: 16,
  },
  courseName: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: "#1F2937",
  },
  infoCard: {
    backgroundColor: "#F0FDF4",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: "#166534",
    lineHeight: 21,
  },
  infoCardAlt: {
    backgroundColor: "#FFF7ED",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  infoTextAlt: {
    fontSize: 14,
    color: "#9A3412",
    lineHeight: 21,
  },
  boldText: {
    fontWeight: "700",
  },
  bottomFixed: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    backgroundColor: "#FFFFFF",
  },
  continueButton: {
    width: "100%",
    height: 50,
    backgroundColor: Colors.brand,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  footer: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
  },
});
