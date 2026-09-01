import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useLanguage } from "../../services/LanguageContext";

export default function TermsAndConditionsScreen() {
  const { t } = useLanguage();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.lastUpdated}>{t("terms.lastUpdated")}</Text>

      <Text style={styles.paragraph}>{t("terms.intro")}</Text>

      <Text style={styles.sectionTitle}>{t("terms.s1Title")}</Text>
      <Text style={styles.paragraph}>{t("terms.s1Text")}</Text>

      <Text style={styles.sectionTitle}>{t("terms.s2Title")}</Text>
      <Text style={styles.paragraph}>{t("terms.s2Text")}</Text>

      <Text style={styles.sectionTitle}>{t("terms.s3Title")}</Text>
      <Text style={styles.paragraph}>{t("terms.s3Text")}</Text>

      <Text style={styles.sectionTitle}>{t("terms.s4Title")}</Text>
      <Text style={styles.paragraph}>{t("terms.s4Text")}</Text>

      <Text style={styles.sectionTitle}>{t("terms.s5Title")}</Text>
      <Text style={styles.paragraph}>{t("terms.s5Text")}</Text>

      <Text style={styles.sectionTitle}>{t("terms.s6Title")}</Text>
      <Text style={styles.paragraph}>{t("terms.s6Text")}</Text>

      <Text style={styles.sectionTitle}>{t("terms.s7Title")}</Text>
      <Text style={styles.paragraph}>{t("terms.s7Text")}</Text>

      <Text style={styles.sectionTitle}>{t("terms.s8Title")}</Text>
      <Text style={styles.paragraph}>{t("terms.s8Text")}</Text>

      <Text style={styles.sectionTitle}>{t("terms.s9Title")}</Text>
      <Text style={styles.paragraph}>{t("terms.s9Text")}</Text>

      <Text style={styles.sectionTitle}>{t("terms.s10Title")}</Text>
      <Text style={styles.paragraph}>{t("terms.s10Text")}</Text>

      <Text style={styles.sectionTitle}>{t("terms.s11Title")}</Text>
      <Text style={styles.paragraph}>{t("terms.s11Text")}</Text>

      <Text style={styles.sectionTitle}>{t("terms.s12Title")}</Text>
      <Text style={styles.paragraph}>{t("terms.s12Text")}</Text>

      <Text style={styles.sectionTitle}>{t("terms.s13Title")}</Text>
      <Text style={styles.paragraph}>{t("terms.s13Text")}</Text>

      <Text style={styles.sectionTitle}>{t("terms.s14Title")}</Text>
      <Text style={styles.paragraph}>{t("terms.s14Text")}</Text>

      <View style={styles.footer}>
        <Text style={styles.footerText}>{t("terms.footer")}</Text>
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
