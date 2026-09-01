import Ionicons from "@react-native-vector-icons/ionicons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { WebView } from "react-native-webview";
import { getFundProviders, type FundProvider } from "../../services/api";
import { useFeedback } from "../../services/FeedbackContext";
import { useLanguage } from "../../services/LanguageContext";
import { Colors } from "../../theme/colors";

type Tab = "opportunities" | "funding";
type FundingView = null | "government" | "external";

type ApplyModalType = null | "government" | "external";

export default function OpportunitiesScreen() {
  const [activeTab, setActiveTab] = useState<Tab>("opportunities");
  const [fundingView, setFundingView] = useState<FundingView>(null);
  const [applyModalType, setApplyModalType] = useState<ApplyModalType>(null);
  const [providers, setProviders] = useState<FundProvider[]>([]);
  const [loadingProviders, setLoadingProviders] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<FundProvider | null>(
    null,
  );
  const { showToast } = useFeedback();
  const { t } = useLanguage();

  useEffect(() => {
    getFundProviders()
      .then((res) => setProviders(res.data ?? []))
      .catch((e) =>
        showToast(
          e instanceof Error ? e.message : t("opportunities.failedLoad"),
          "error",
        ),
      )
      .finally(() => setLoadingProviders(false));
  }, []);

  const governmentProviders = providers.filter((p) => p.type === "government");
  const bankProviders = providers.filter((p) => p.type === "bank");

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setFundingView(null);
  };

  const handleApplyNow = (
    type: "government" | "external",
    provider: FundProvider,
  ) => {
    setSelectedProvider(provider);
    setApplyModalType(type);
  };

  const handleModalNavigate = (route: "lpo" | "assetFin" | "overdraft") => {
    setApplyModalType(null);
    // Small delay so the modal dismiss animation finishes before pushing
    setTimeout(() => {
      router.push({
        pathname: `/(financing)/${route}`,
        params: {
          bankSlug: selectedProvider?.slug ?? "",
          bankName: selectedProvider?.name ?? "",
          providerType: selectedProvider?.type ?? "",
        },
      });
    }, 200);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      scrollEnabled={activeTab !== "opportunities"}
    >
      {/* ── Header ── */}
      <Text style={styles.title}>{t("opportunities.title")}</Text>
      <Text style={styles.subtitle}>{t("opportunities.subtitle")}</Text>

      {/* ── Tabs ── */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "opportunities" && styles.tabActive,
          ]}
          onPress={() => handleTabChange("opportunities")}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "opportunities" && styles.tabTextActive,
            ]}
          >
            {t("opportunities.tabOpportunities")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "funding" && styles.tabActive]}
          onPress={() => handleTabChange("funding")}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "funding" && styles.tabTextActive,
            ]}
          >
            {t("opportunities.tabFunding")}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── Opportunities Tab ── */}
      {activeTab === "opportunities" && (
        <>
          {/* Info card */}
          <View style={styles.infoCard}>
            <View style={styles.infoIconRow}>
              <View style={styles.infoIcon}>
                <Ionicons
                  name="information-circle-outline"
                  size={20}
                  color="#92400E"
                />
              </View>
              <Text style={styles.infoTitle}>
                {t("opportunities.beforeApply")}
              </Text>
            </View>
            <Text style={styles.infoText}>
              {t("opportunities.beforeApplyText")}
            </Text>
          </View>

          {/* e-GP WebView */}
          <View style={styles.webviewContainer}>
            <WebView
              source={{ uri: "https://egpkenya.go.ke/tender" }}
              style={styles.webview}
              startInLoadingState
              renderLoading={() => (
                <View style={styles.webviewLoading}>
                  <Text style={styles.webviewLoadingText}>
                    {t("opportunities.loadingPortal")}
                  </Text>
                </View>
              )}
            />
          </View>
        </>
      )}

      {/* ── Funding Tab ── */}
      {activeTab === "funding" && fundingView === null && (
        <>
          {/* Government Funding */}
          <TouchableOpacity
            style={styles.fundingCard}
            activeOpacity={0.7}
            onPress={() => setFundingView("government")}
          >
            <Image
              source={require("../../../assets/images/arms.png")}
              style={styles.fundingImage}
              resizeMode="contain"
            />
            <View style={styles.fundingContent}>
              <Text style={styles.fundingTitle}>
                {t("opportunities.governmentFunding")}
              </Text>
              <Text style={styles.fundingSubtext}>
                {t("opportunities.governmentFundingText")}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>

          {/* External (Banks) Funding */}
          <TouchableOpacity
            style={styles.fundingCard}
            activeOpacity={0.7}
            onPress={() => setFundingView("external")}
          >
            <Image
              source={require("../../../assets/images/arms.png")}
              style={styles.fundingImage}
              resizeMode="contain"
            />
            <View style={styles.fundingContent}>
              <Text style={styles.fundingTitle}>
                {t("opportunities.externalFunding")}
              </Text>
              <Text style={styles.fundingSubtext}>
                {t("opportunities.externalFundingText")}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        </>
      )}

      {/* ── Government Funding Sub-view ── */}
      {activeTab === "funding" && fundingView === "government" && (
        <>
          {/* Back button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setFundingView(null)}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={18} color={Colors.brand} />
            <Text style={styles.backButtonText}>
              {t("opportunities.backToFunding")}
            </Text>
          </TouchableOpacity>

          {/* Section header */}
          <Text style={styles.sectionTitle}>
            {t("opportunities.governmentOptions")}
          </Text>
          <Text style={styles.sectionSubtitle}>
            {t("opportunities.governmentOptionsSub")}
          </Text>

          {loadingProviders ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator color={Colors.brand} />
            </View>
          ) : (
            governmentProviders.map((provider) => (
              <View key={provider.id} style={styles.fundOptionCard}>
                <View style={styles.fundOptionHeader}>
                  <View style={styles.fundOptionIcon}>
                    <Ionicons
                      name="business-outline"
                      size={20}
                      color={Colors.brand}
                    />
                  </View>
                  <Text style={styles.fundOptionTitle}>{provider.name}</Text>
                </View>
                <Text style={styles.fundOptionSubtext}>
                  {provider.description ||
                    t("opportunities.governmentOpportunity")}
                </Text>
                <TouchableOpacity
                  style={styles.applyButton}
                  activeOpacity={0.7}
                  onPress={() => handleApplyNow("government", provider)}
                >
                  <Text style={styles.applyButtonText}>
                    {t("opportunities.applyNow")}
                  </Text>
                  <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </>
      )}

      {/* ── Apply Now Modal ── */}
      <Modal
        visible={applyModalType !== null}
        animationType="fade"
        transparent
        onRequestClose={() => setApplyModalType(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {t("opportunities.applyModalTitle")}
              </Text>
              <TouchableOpacity
                onPress={() => setApplyModalType(null)}
                activeOpacity={0.7}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Subtitle */}
            <Text style={styles.modalSubtitle}>
              {t("opportunities.applyModalSubtitle")}
            </Text>

            <ScrollView
              style={styles.modalScroll}
              showsVerticalScrollIndicator={false}
            >
              {/* LPO Financing */}
              <View style={styles.modalCard}>
                <View style={styles.modalCardHeader}>
                  <View style={styles.modalCardIcon}>
                    <Ionicons
                      name="document-text-outline"
                      size={22}
                      color={Colors.brand}
                    />
                  </View>
                  <View style={styles.modalCardTitleRow}>
                    <Text style={styles.modalCardTitle}>
                      {t("opportunities.lpoFinancing")}
                    </Text>
                  </View>
                </View>
                <Text style={styles.modalCardSubtext}>
                  {t("opportunities.lpoFinancingText")}
                </Text>
                <TouchableOpacity
                  style={styles.modalApplyButton}
                  activeOpacity={0.7}
                  onPress={() => handleModalNavigate("lpo")}
                >
                  <Text style={styles.modalApplyButtonText}>
                    {t("opportunities.applyNow")}
                  </Text>
                  <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              {/* Overdraft */}
              {applyModalType === "external" && (
                <View style={styles.modalCard}>
                  <View style={styles.modalCardHeader}>
                    <View style={styles.modalCardIcon}>
                      <Ionicons
                        name="wallet-outline"
                        size={22}
                        color={Colors.brand}
                      />
                    </View>
                    <View style={styles.modalCardTitleRow}>
                      <Text style={styles.modalCardTitle}>
                        {t("opportunities.overdraft")}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.modalCardSubtext}>
                    {t("opportunities.overdraftText")}
                  </Text>
                  <TouchableOpacity
                    style={styles.modalApplyButton}
                    activeOpacity={0.7}
                    onPress={() => handleModalNavigate("overdraft")}
                  >
                    <Text style={styles.modalApplyButtonText}>
                      {t("opportunities.applyNow")}
                    </Text>
                    <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              )}

              {/* Asset Financing */}
              {applyModalType === "external" && (
                <View style={styles.modalCard}>
                  <View style={styles.modalCardHeader}>
                    <View style={styles.modalCardIcon}>
                      <Ionicons
                        name="construct-outline"
                        size={22}
                        color={Colors.brand}
                      />
                    </View>
                    <View style={styles.modalCardTitleRow}>
                      <Text style={styles.modalCardTitle}>
                        {t("opportunities.assetFinancing")}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.modalCardSubtext}>
                    {t("opportunities.assetFinancingText")}
                  </Text>
                  <TouchableOpacity
                    style={styles.modalApplyButton}
                    activeOpacity={0.7}
                    onPress={() => handleModalNavigate("assetFin")}
                  >
                    <Text style={styles.modalApplyButtonText}>
                      {t("opportunities.applyNow")}
                    </Text>
                    <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ── External Funding Sub-view ── */}
      {activeTab === "funding" && fundingView === "external" && (
        <>
          {/* Back button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setFundingView(null)}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={18} color={Colors.brand} />
            <Text style={styles.backButtonText}>
              {t("opportunities.backToFunding")}
            </Text>
          </TouchableOpacity>

          {/* Section header */}
          <Text style={styles.sectionTitle}>
            {t("opportunities.externalOptions")}
          </Text>
          <Text style={styles.sectionSubtitle}>
            {t("opportunities.externalOptionsSub")}
          </Text>

          {loadingProviders ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator color={Colors.brand} />
            </View>
          ) : (
            bankProviders.map((provider) => (
              <View key={provider.id} style={styles.fundOptionCard}>
                <View style={styles.fundOptionHeader}>
                  <View style={styles.fundOptionIcon}>
                    <Ionicons
                      name="business-outline"
                      size={20}
                      color={Colors.brand}
                    />
                  </View>
                  <Text style={styles.fundOptionTitle}>{provider.name}</Text>
                </View>
                <Text style={styles.fundOptionSubtext}>
                  {provider.description || t("opportunities.bankOpportunity")}
                </Text>
                <TouchableOpacity
                  style={styles.applyButton}
                  activeOpacity={0.7}
                  onPress={() => handleApplyNow("external", provider)}
                >
                  <Text style={styles.applyButtonText}>
                    {t("opportunities.applyNow")}
                  </Text>
                  <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </>
      )}

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

  // ── Header ──
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 20,
  },

  // ── Tabs ──
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    padding: 4,
    marginBottom: 18,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#9CA3AF",
  },
  tabTextActive: {
    color: Colors.brand,
  },

  // ── Info card ──
  infoCard: {
    backgroundColor: "#FFFBEB",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#FDE68A",
    padding: 16,
    marginBottom: 24,
  },
  infoIconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  infoIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#FEF3C7",
    alignItems: "center",
    justifyContent: "center",
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#92400E",
  },
  infoText: {
    fontSize: 13,
    color: "#A16207",
    lineHeight: 19,
  },

  // ── e-GP button ──
  egpButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.brand,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignSelf: "center",
  },
  egpButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  // ── Funding cards ──
  fundingCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#F9FAFB",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
    marginBottom: 12,
    gap: 12,
  },
  fundingIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#F3EFFF",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  fundingImage: {
    width: 40,
    height: 40,
    borderRadius: 10,
    marginTop: 2,
  },
  fundingContent: {
    flex: 1,
  },
  fundingTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 6,
  },
  fundingSubtext: {
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 18,
  },

  // ── Sub-view: back button ──
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 18,
    alignSelf: "flex-start",
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.brand,
  },

  // ── Sub-view: section header ──
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 19,
    marginBottom: 18,
  },

  // ── Sub-view: fund option card ──
  fundOptionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
    marginBottom: 12,
  },
  loadingWrap: {
    alignItems: "center",
    paddingVertical: 32,
  },
  fundOptionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  fundOptionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F3EFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  fundOptionImage: {
    width: 36,
    height: 36,
    borderRadius: 10,
  },
  fundOptionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
  },
  fundOptionSubtext: {
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 18,
    marginBottom: 14,
  },
  applyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: Colors.brand,
    paddingVertical: 10,
    borderRadius: 10,
  },
  applyButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  // ── Apply Now Modal ──
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    width: "100%",
    maxWidth: 400,
    maxHeight: "80%",
  },
  modalScroll: {
    flexGrow: 0,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 18,
  },
  modalCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
    marginBottom: 10,
  },
  modalCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  modalCardIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#F3EFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  modalCardTitleRow: {
    flex: 1,
  },
  modalCardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  modalCardSubtext: {
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 18,
    marginBottom: 14,
  },
  modalApplyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: Colors.brand,
    paddingVertical: 11,
    borderRadius: 10,
  },
  modalApplyButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  // ── Empty / placeholder ──
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#9CA3AF",
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    color: "#D1D5DB",
    textAlign: "center",
  },

  // ── WebView ──
  webviewContainer: {
    height: 500,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 24,
  },
  webview: {
    flex: 1,
  },
  webviewLoading: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9FAFB",
  },
  webviewLoadingText: {
    fontSize: 14,
    color: "#6B7280",
  },

  // ── Bottom spacer ──
  bottomSpacer: {
    height: 24,
  },
});
