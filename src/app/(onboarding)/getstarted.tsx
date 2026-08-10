import { router } from "expo-router";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Colors } from "../../theme/colors";

export default function GetStartedScreen() {
  const bulletPoints = [
    "Access verified AGPO opportunities matched to your skills",
    "Unlock personalized training programs to build in-demand skills",
    "Become eligible for funding opportunities to support your projects and education",
    "Connect with a community of like-minded professionals and mentors",
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome */}
        <Text style={styles.welcome}>Welcome, Joab!</Text>
        <Text style={styles.welcomeSub}>Let's get your profile ready</Text>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            You're just a few steps away from accessing thousands of
            opportunities!{"\n\n"}
            Complete your profile to unlock job listings, training programs, and
            funding opportunities.
          </Text>
        </View>

        {/* Setup Checklist */}
        <Text style={styles.sectionTitle}>Setup Checklist</Text>

        <View style={styles.cardsRow}>
          {/* Eligibility Card */}
          <TouchableOpacity style={styles.card} activeOpacity={0.7}>
            <Text style={styles.cardTitle}>Eligibility & Context</Text>
            <Text style={styles.cardSub}>
              Verify your eligibility and provide context about your situation
            </Text>
            <View style={styles.cardFooter}>
              <Text style={styles.clockIcon}>⏱</Text>
              <Text style={styles.clockText}>3 min</Text>
            </View>
          </TouchableOpacity>

          {/* Courses Card */}
          <TouchableOpacity style={styles.card} activeOpacity={0.7}>
            <Text style={styles.cardTitle}>Courses Preview</Text>
            <Text style={styles.cardSub}>
              Explore available courses and their details
            </Text>
            <View style={styles.cardFooter}>
              <Text style={styles.clockIcon}>⏱</Text>
              <Text style={styles.clockText}>3 min</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Why Complete Section */}
        <Text style={styles.whyTitle}>🎯 Why Complete Your Profile?</Text>
        <View style={styles.bulletList}>
          {bulletPoints.map((point, index) => (
            <View key={index} style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>{point}</Text>
            </View>
          ))}
        </View>

        {/* Bottom spacing for fixed area */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Fixed Bottom */}
      <View style={styles.bottomFixed}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => router.push("/kyc")}
        >
          <Text style={styles.startButtonText}>Start</Text>
        </TouchableOpacity>
        <Text style={styles.footer}>© 2026 EbisCloud Solutions</Text>
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
  welcome: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  welcomeSub: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: "#F5F3FF",
    borderRadius: 14,
    padding: 18,
    marginBottom: 28,
  },
  infoText: {
    fontSize: 14,
    color: "#4C1D95",
    lineHeight: 21,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 14,
  },
  cardsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 28,
  },
  card: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 6,
  },
  cardSub: {
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 17,
    marginBottom: 14,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  clockIcon: {
    fontSize: 14,
  },
  clockText: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  whyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 12,
  },
  bulletList: {
    gap: 10,
  },
  bulletRow: {
    flexDirection: "row",
    gap: 8,
  },
  bullet: {
    fontSize: 14,
    color: Colors.brand,
    lineHeight: 20,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 20,
  },
  bottomFixed: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    backgroundColor: "#FFFFFF",
  },
  startButton: {
    width: "100%",
    height: 50,
    backgroundColor: Colors.brand,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  startButtonText: {
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
