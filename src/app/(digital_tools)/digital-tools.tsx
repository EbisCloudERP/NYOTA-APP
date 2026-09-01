import Ionicons from "@react-native-vector-icons/ionicons";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useFeedback } from "../../services/FeedbackContext";
import { useLanguage } from "../../services/LanguageContext";
import type { TranslationKey } from "../../services/translations";
import { Colors } from "../../theme/colors";

interface DigitalTool {
  icon: string;
  titleKey: TranslationKey;
  subtextKey: TranslationKey;
  checklistKeys: TranslationKey[];
}

const TOOLS: DigitalTool[] = [
  {
    icon: "chatbubble-ellipses-outline",
    titleKey: "digitalTools.bulkSms",
    subtextKey: "digitalTools.bulkSmsText",
    checklistKeys: [
      "digitalTools.checklist.instantDelivery",
      "digitalTools.checklist.personalized",
      "digitalTools.checklist.deliveryReports",
    ],
  },
  {
    icon: "calculator-outline",
    titleKey: "digitalTools.bookKeeping",
    subtextKey: "digitalTools.bookKeepingText",
    checklistKeys: [
      "digitalTools.checklist.trackTransactions",
      "digitalTools.checklist.invoices",
      "digitalTools.checklist.reports",
    ],
  },
  {
    icon: "storefront-outline",
    titleKey: "digitalTools.ecommerce",
    subtextKey: "digitalTools.ecommerceText",
    checklistKeys: [
      "digitalTools.checklist.shopify",
      "digitalTools.checklist.mpesa",
      "digitalTools.checklist.inventory",
    ],
  },
  {
    icon: "globe-outline",
    titleKey: "digitalTools.website",
    subtextKey: "digitalTools.websiteText",
    checklistKeys: [
      "digitalTools.checklist.responsive",
      "digitalTools.checklist.domain",
      "digitalTools.checklist.email",
    ],
  },
];

function ToolCard({ tool }: { tool: DigitalTool }) {
  const { showToast } = useFeedback();
  const { t } = useLanguage();

  const handleOnboard = () => {
    showToast(t("digitalTools.notAvailable"), "info");
  };

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={styles.cardIcon}>
          <Ionicons name={tool.icon as any} size={20} color={Colors.brand} />
        </View>
        <Text style={styles.cardTitle}>{t(tool.titleKey)}</Text>
      </View>

      {/* Subtext */}
      <Text style={styles.cardSubtext}>{t(tool.subtextKey)}</Text>

      {/* Checklist */}
      <Text style={styles.checklistLabel}>
        {t("digitalTools.whatsIncluded")}
      </Text>
      {tool.checklistKeys.map((itemKey) => (
        <View key={itemKey} style={styles.checklistItem}>
          <Ionicons name="checkmark-circle" size={16} color="#059669" />
          <Text style={styles.checklistText}>{t(itemKey)}</Text>
        </View>
      ))}

      {/* Onboard button */}
      <TouchableOpacity
        style={styles.onboardButton}
        activeOpacity={0.7}
        onPress={handleOnboard}
      >
        <Text style={styles.onboardButtonText}>
          {t("digitalTools.onboard")}
        </Text>
        <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

export default function DigitalToolsScreen() {
  const { t } = useLanguage();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.subtitle}>{t("digitalTools.subtitle")}</Text>

      {TOOLS.map((tool) => (
        <ToolCard key={tool.titleKey} tool={tool} />
      ))}

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
    paddingTop: 24,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 20,
  },

  // ── Card ──
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  cardIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F3EFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
  },
  cardSubtext: {
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 18,
    marginBottom: 14,
  },

  // ── Checklist ──
  checklistLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  checklistItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  checklistText: {
    flex: 1,
    fontSize: 12.5,
    color: "#374151",
    lineHeight: 18,
  },

  // ── Button ──
  onboardButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: Colors.brand,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 12,
  },
  onboardButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  bottomSpacer: {
    height: 24,
  },
});
