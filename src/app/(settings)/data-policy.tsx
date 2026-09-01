import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useLanguage } from "../../services/LanguageContext";

export default function DataPolicyScreen() {
  const { t } = useLanguage();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.lastUpdated}>{t("dataPolicy.lastUpdated")}</Text>

      <Text style={styles.paragraph}>{t("dataPolicy.intro")}</Text>

      <Text style={styles.sectionTitle}>{t("dataPolicy.s1Title")}</Text>
      <Text style={styles.paragraph}>{t("dataPolicy.s1Intro")}</Text>
      <View style={styles.bulletList}>
        <Text style={styles.bullet}>• {t("dataPolicy.s1b1")}</Text>
        <Text style={styles.bullet}>• {t("dataPolicy.s1b2")}</Text>
        <Text style={styles.bullet}>• {t("dataPolicy.s1b3")}</Text>
        <Text style={styles.bullet}>• {t("dataPolicy.s1b4")}</Text>
        <Text style={styles.bullet}>• {t("dataPolicy.s1b5")}</Text>
      </View>

      <Text style={styles.sectionTitle}>{t("dataPolicy.s2Title")}</Text>
      <Text style={styles.paragraph}>{t("dataPolicy.s2Intro")}</Text>
      <View style={styles.bulletList}>
        <Text style={styles.bullet}>• {t("dataPolicy.s2b1")}</Text>
        <Text style={styles.bullet}>• {t("dataPolicy.s2b2")}</Text>
        <Text style={styles.bullet}>• {t("dataPolicy.s2b3")}</Text>
        <Text style={styles.bullet}>• {t("dataPolicy.s2b4")}</Text>
        <Text style={styles.bullet}>• {t("dataPolicy.s2b5")}</Text>
      </View>

      <Text style={styles.sectionTitle}>{t("dataPolicy.s3Title")}</Text>
      <Text style={styles.paragraph}>{t("dataPolicy.s3Intro")}</Text>
      <View style={styles.bulletList}>
        <Text style={styles.bullet}>• {t("dataPolicy.s3b1")}</Text>
        <Text style={styles.bullet}>• {t("dataPolicy.s3b2")}</Text>
        <Text style={styles.bullet}>• {t("dataPolicy.s3b3")}</Text>
      </View>

      <Text style={styles.sectionTitle}>{t("dataPolicy.s4Title")}</Text>
      <Text style={styles.paragraph}>{t("dataPolicy.s4Text")}</Text>

      <Text style={styles.sectionTitle}>{t("dataPolicy.s5Title")}</Text>
      <Text style={styles.paragraph}>{t("dataPolicy.s5Intro")}</Text>
      <View style={styles.bulletList}>
        <Text style={styles.bullet}>• {t("dataPolicy.s5b1")}</Text>
        <Text style={styles.bullet}>• {t("dataPolicy.s5b2")}</Text>
        <Text style={styles.bullet}>• {t("dataPolicy.s5b3")}</Text>
        <Text style={styles.bullet}>• {t("dataPolicy.s5b4")}</Text>
        <Text style={styles.bullet}>• {t("dataPolicy.s5b5")}</Text>
      </View>

      <Text style={styles.sectionTitle}>{t("dataPolicy.s6Title")}</Text>
      <Text style={styles.paragraph}>{t("dataPolicy.s6Text")}</Text>
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
