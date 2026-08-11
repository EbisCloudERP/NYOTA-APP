import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function DataPolicyScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.lastUpdated}>Last updated: August 11, 2026</Text>

      <Text style={styles.paragraph}>
        At Nyota, we take your privacy seriously. This Data Policy explains how
        we collect, use, store, and protect your personal information when you
        use our platform.
      </Text>

      <Text style={styles.sectionTitle}>1. Information We Collect</Text>
      <Text style={styles.paragraph}>
        We collect information that you provide directly to us, including but
        not limited to:
      </Text>
      <View style={styles.bulletList}>
        <Text style={styles.bullet}>
          • Personal identification details (name, email address, phone number,
          national ID)
        </Text>
        <Text style={styles.bullet}>
          • Business information (company name, registration details, KRA PIN)
        </Text>
        <Text style={styles.bullet}>
          • Profile data (profile picture, bio, preferences)
        </Text>
        <Text style={styles.bullet}>
          • Usage data (courses enrolled, certificates earned, webinar
          attendance)
        </Text>
        <Text style={styles.bullet}>
          • Device information (device type, operating system, IP address)
        </Text>
      </View>

      <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
      <Text style={styles.paragraph}>
        Your information helps us provide and improve our services:
      </Text>
      <View style={styles.bulletList}>
        <Text style={styles.bullet}>• To create and manage your account</Text>
        <Text style={styles.bullet}>
          • To deliver courses, webinars, and learning content
        </Text>
        <Text style={styles.bullet}>
          • To process applications for funding and opportunities
        </Text>
        <Text style={styles.bullet}>
          • To send notifications about updates, events, and relevant
          opportunities
        </Text>
        <Text style={styles.bullet}>
          • To comply with legal and regulatory requirements
        </Text>
      </View>

      <Text style={styles.sectionTitle}>3. Data Sharing</Text>
      <Text style={styles.paragraph}>
        We do not sell your personal data. We may share your information with:
      </Text>
      <View style={styles.bulletList}>
        <Text style={styles.bullet}>
          • Government agencies for funding and tender applications you initiate
        </Text>
        <Text style={styles.bullet}>
          • Partner banks and financial institutions for funding applications
        </Text>
        <Text style={styles.bullet}>
          • Service providers who assist us in platform operations
        </Text>
      </View>

      <Text style={styles.sectionTitle}>4. Data Storage & Security</Text>
      <Text style={styles.paragraph}>
        We implement industry-standard security measures to protect your data,
        including encryption, secure servers, and regular security audits. Your
        data is stored on secure servers located in Kenya, in compliance with
        the Data Protection Act, 2019.
      </Text>

      <Text style={styles.sectionTitle}>5. Your Rights</Text>
      <Text style={styles.paragraph}>
        Under the Kenya Data Protection Act, you have the right to:
      </Text>
      <View style={styles.bulletList}>
        <Text style={styles.bullet}>• Access your personal data</Text>
        <Text style={styles.bullet}>
          • Request correction of inaccurate data
        </Text>
        <Text style={styles.bullet}>• Request deletion of your data</Text>
        <Text style={styles.bullet}>
          • Object to or restrict processing of your data
        </Text>
        <Text style={styles.bullet}>• Withdraw consent at any time</Text>
      </View>

      <Text style={styles.sectionTitle}>6. Contact Us</Text>
      <Text style={styles.paragraph}>
        If you have questions about this Data Policy or wish to exercise your
        data rights, contact our Data Protection Officer at:
      </Text>
      <Text style={styles.contactInfo}>📧 privacy@nyota.go.ke</Text>
      <Text style={styles.contactInfo}>📞 +254 700 000 000</Text>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  lastUpdated: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginTop: 20,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 22,
    marginBottom: 8,
  },
  bulletList: {
    marginBottom: 8,
    gap: 6,
  },
  bullet: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 20,
    paddingLeft: 4,
  },
  contactInfo: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 22,
  },
  bottomSpacer: {
    height: 32,
  },
});
