import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function TermsAndConditionsScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.lastUpdated}>Last updated: August 11, 2026</Text>

      <Text style={styles.paragraph}>
        Welcome to our Training Portal. By accessing or using our services, you
        agree to comply with the following terms and conditions. Please read
        them carefully before proceeding.
      </Text>

      <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
      <Text style={styles.paragraph}>
        By creating an account, accessing, or using any part of this platform,
        you acknowledge that you have read, understood, and agree to be bound by
        these Terms and Conditions. If you do not agree with any part of these
        terms, you must discontinue use of our services immediately.
      </Text>

      <Text style={styles.sectionTitle}>2. Eligibility</Text>
      <Text style={styles.paragraph}>
        You must be at least 18 years old to use our services. By using this
        platform, you represent and warrant that you meet the minimum age
        requirement and have the legal capacity to enter into a binding
        agreement.
      </Text>

      <Text style={styles.sectionTitle}>
        3. Account Registration and Security
      </Text>
      <Text style={styles.paragraph}>
        You are responsible for providing accurate, current, and complete
        information during the registration process. You must maintain and
        promptly update your account information to keep it accurate. You are
        solely responsible for maintaining the confidentiality of your login
        credentials and for all activities that occur under your account. You
        agree to notify us immediately of any unauthorized access or use of your
        account.
      </Text>

      <Text style={styles.sectionTitle}>
        4. User Conduct and Responsibilities
      </Text>
      <Text style={styles.paragraph}>
        You agree not to use our services for any unlawful, fraudulent, or
        unauthorized purpose. You shall not engage in any activity that
        interferes with or disrupts the platform, its servers, or networks. You
        may not upload, post, or transmit any content that is defamatory,
        obscene, harassing, or otherwise objectionable.
      </Text>

      <Text style={styles.sectionTitle}>5. Intellectual Property Rights</Text>
      <Text style={styles.paragraph}>
        All content, materials, logos, trademarks, and intellectual property
        displayed on this platform are owned by or licensed to us. You may not
        reproduce, distribute, modify, or create derivative works from any
        content without our express written permission. Unauthorized use of our
        intellectual property may result in legal action.
      </Text>

      <Text style={styles.sectionTitle}>6. Payment and Billing</Text>
      <Text style={styles.paragraph}>
        Certain services on this platform may require payment of fees. You agree
        to pay all applicable charges in accordance with the billing terms in
        effect at the time such fees become payable. All payments are
        non-refundable unless otherwise stated. We reserve the right to change
        our pricing at any time with reasonable notice.
      </Text>

      <Text style={styles.sectionTitle}>7. Privacy and Data Protection</Text>
      <Text style={styles.paragraph}>
        Your privacy is important to us. Our collection, use, and disclosure of
        personal information is governed by our Privacy Policy, which is
        incorporated into these Terms by reference. By using our services, you
        consent to the collection and use of your data as described in our
        Privacy Policy.
      </Text>

      <Text style={styles.sectionTitle}>8. Third-Party Services and Links</Text>
      <Text style={styles.paragraph}>
        Our platform may contain links to third-party websites, applications, or
        services that are not owned or controlled by us. We assume no
        responsibility for the content, privacy policies, or practices of any
        third-party sites. You access such third-party services at your own
        risk.
      </Text>

      <Text style={styles.sectionTitle}>9. Limitation of Liability</Text>
      <Text style={styles.paragraph}>
        To the fullest extent permitted by applicable law, we shall not be
        liable for any indirect, incidental, special, consequential, or punitive
        damages arising out of or in connection with your use of the platform.
        Our total liability for any claim shall not exceed the amount paid by
        you, if any, for the services during the twelve months preceding the
        claim.
      </Text>

      <Text style={styles.sectionTitle}>10. Disclaimers of Warranties</Text>
      <Text style={styles.paragraph}>
        The platform and all content, services, and features are provided on an
        "as is" and "as available" basis without warranties of any kind, either
        express or implied. We do not guarantee that the services will be
        uninterrupted, error-free, secure, or free from viruses or other harmful
        components.
      </Text>

      <Text style={styles.sectionTitle}>11. Termination</Text>
      <Text style={styles.paragraph}>
        We reserve the right to suspend or terminate your account and access to
        the platform at our sole discretion, without prior notice, for any
        violation of these Terms or for any other reason. Upon termination, your
        right to use the platform will cease immediately, and any data
        associated with your account may be deleted.
      </Text>

      <Text style={styles.sectionTitle}>12. Modifications to Terms</Text>
      <Text style={styles.paragraph}>
        We reserve the right to modify or update these Terms and Conditions at
        any time without prior notice. Any changes will be effective immediately
        upon posting. Your continued use of the platform after any modifications
        constitutes your acceptance of the revised terms. It is your
        responsibility to review these Terms periodically for updates.
      </Text>

      <Text style={styles.sectionTitle}>
        13. Governing Law and Dispute Resolution
      </Text>
      <Text style={styles.paragraph}>
        These Terms and Conditions shall be governed by and construed in
        accordance with the laws of the Republic of Kenya. Any disputes arising
        out of or in connection with these Terms shall first be attempted to be
        resolved through good-faith negotiations. If a resolution cannot be
        reached, the dispute shall be submitted to mediation or arbitration in
        accordance with applicable laws.
      </Text>

      <Text style={styles.sectionTitle}>14. Contact Information</Text>
      <Text style={styles.paragraph}>
        If you have any questions, concerns, or feedback regarding these Terms
        and Conditions, please contact us through the support channels provided
        on our platform. We are committed to addressing your inquiries in a
        timely manner.
      </Text>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          By continuing to use our services, you acknowledge that you have read,
          understood, and agreed to be bound by these Terms and Conditions. If
          you do not agree, please discontinue use of the platform immediately.
        </Text>
      </View>

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
  footer: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  footerText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    lineHeight: 22,
  },
  bottomSpacer: {
    height: 32,
  },
});
