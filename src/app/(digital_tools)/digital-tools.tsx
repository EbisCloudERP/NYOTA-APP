import Ionicons from "@react-native-vector-icons/ionicons";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Colors } from "../../theme/colors";

interface DigitalTool {
  icon: string;
  title: string;
  subtext: string;
  checklist: string[];
}

const TOOLS: DigitalTool[] = [
  {
    icon: "chatbubble-ellipses-outline",
    title: "Bulk SMS",
    subtext:
      "Send thousands of personalized SMS messages to your customers at once. Perfect for promotions, alerts, reminders, and notifications.",
    checklist: [
      "Instant delivery to all networks",
      "Personalized messaging at scale",
      "Detailed delivery reports & analytics",
    ],
  },
  {
    icon: "calculator-outline",
    title: "Book Keeping",
    subtext:
      "Simplify your financial record-keeping. Track every transaction, manage invoices, and generate professional financial reports effortlessly.",
    checklist: [
      "Track every transaction effortlessly",
      "Manage invoices & payments",
      "Generate professional financial reports",
    ],
  },
  {
    icon: "storefront-outline",
    title: "E-commerce",
    subtext:
      "Launch and manage your online store with ease. We set up a Shopify-style storefront with product catalogs, payment gateways including M-Pesa, inventory management, and order tracking — all tailored to your brand.",
    checklist: [
      "Shopify-style storefront setup",
      "M-Pesa & card payment gateways",
      "Inventory & order tracking",
    ],
  },
  {
    icon: "globe-outline",
    title: "Website Builder",
    subtext:
      "Build your complete online presence. Get a stunning website, a professional domain name, and business email — all in one seamless package.",
    checklist: [
      "Stunning, responsive website",
      "Professional domain name",
      "Business email included",
    ],
  },
];

function ToolCard({ tool }: { tool: DigitalTool }) {
  const handleOnboard = () => {
    Alert.alert(
      "Coming soon",
      "This feature is not available in the app at the moment. Please visit our main website on your browser to get started.",
    );
  };

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={styles.cardIcon}>
          <Ionicons name={tool.icon} size={20} color={Colors.brand} />
        </View>
        <Text style={styles.cardTitle}>{tool.title}</Text>
      </View>

      {/* Subtext */}
      <Text style={styles.cardSubtext}>{tool.subtext}</Text>

      {/* Checklist */}
      <Text style={styles.checklistLabel}>What's included</Text>
      {tool.checklist.map((item) => (
        <View key={item} style={styles.checklistItem}>
          <Ionicons name="checkmark-circle" size={16} color="#059669" />
          <Text style={styles.checklistText}>{item}</Text>
        </View>
      ))}

      {/* Onboard button */}
      <TouchableOpacity
        style={styles.onboardButton}
        activeOpacity={0.7}
        onPress={handleOnboard}
      >
        <Text style={styles.onboardButtonText}>Onboard</Text>
        <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

export default function DigitalToolsScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.subtitle}>
        Explore and onboard to essential business tools and solutions to improve
        productivity, streamline workflows and access to market.
      </Text>

      {TOOLS.map((tool) => (
        <ToolCard key={tool.title} tool={tool} />
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
