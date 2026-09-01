import Ionicons from "@react-native-vector-icons/ionicons";
import { router } from "expo-router";
import { useState } from "react";
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useLanguage } from "../../services/LanguageContext";
import type { TranslationKey } from "../../services/translations";
import { Colors } from "../../theme/colors";

type Status = "Needs action" | "Under review" | "Approved" | "Declined";
type Service = "LPO Financing" | "Asset Financing" | "Overdraft";
type TabKey = "all" | "needs-action" | "under-review" | "approved" | "declined";

interface Application {
  id: string;
  ref: string;
  date: string;
  service: Service;
  status: Status;
  amount: number;
  provider: string;
  serviceRoute: string;
  note?: string;
}

const APPLICATIONS: Application[] = [
  {
    id: "1",
    ref: "LPO-2026-0142",
    date: "12 Aug 2026",
    service: "LPO Financing",
    status: "Needs action",
    amount: 450000,
    provider: "Family Bank",
    serviceRoute: "/(financing)/lpo",
    note: "LPO document is blurry and unreadable. Please upload a clearer scanned copy.",
  },
  {
    id: "2",
    ref: "AF-2026-0089",
    date: "10 Aug 2026",
    service: "Asset Financing",
    status: "Under review",
    amount: 1850000,
    provider: "Co-operative Bank",
    serviceRoute: "/(financing)/assetFin",
  },
  {
    id: "3",
    ref: "OD-2026-0031",
    date: "08 Aug 2026",
    service: "Overdraft",
    status: "Approved",
    amount: 300000,
    provider: "NCBA Bank",
    serviceRoute: "/(financing)/overdraft",
  },
  {
    id: "4",
    ref: "AF-2026-0077",
    date: "01 Aug 2026",
    service: "Asset Financing",
    status: "Declined",
    amount: 2500000,
    provider: "Stanbic Bank",
    serviceRoute: "/(financing)/assetFin",
  },
  {
    id: "5",
    ref: "LPO-2026-0135",
    date: "05 Aug 2026",
    service: "LPO Financing",
    status: "Approved",
    amount: 720000,
    provider: "Equity Bank",
    serviceRoute: "/(financing)/lpo",
  },
];

const TABS: { key: TabKey; labelKey: TranslationKey }[] = [
  { key: "all", labelKey: "applications.all" },
  { key: "needs-action", labelKey: "applications.needsAction" },
  { key: "under-review", labelKey: "applications.underReview" },
  { key: "approved", labelKey: "applications.approved" },
  { key: "declined", labelKey: "applications.declined" },
];

const STATUS_STYLES: Record<Status, { bg: string; fg: string }> = {
  "Needs action": { bg: "#DBEAFE", fg: "#1D4ED8" },
  "Under review": { bg: "#FEF3C7", fg: "#B45309" },
  Approved: { bg: "#D1FAE5", fg: "#047857" },
  Declined: { bg: "#FEE2E2", fg: "#B91C1C" },
};

const COLUMNS = [
  { key: "application", labelKey: "applications.application", width: 150 },
  { key: "date", labelKey: "applications.date", width: 100 },
  { key: "service", labelKey: "applications.service", width: 140 },
  { key: "status", labelKey: "applications.status", width: 170 },
  { key: "amount", labelKey: "applications.amount", width: 118 },
  { key: "provider", labelKey: "applications.provider", width: 135 },
  { key: "action", labelKey: "applications.action", width: 112 },
] as const;

const TOTAL_WIDTH = COLUMNS.reduce((sum, column) => sum + column.width, 0);

export default function MyApplicationsScreen() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [selected, setSelected] = useState<Application | null>(null);

  const statusLabel = (s: Status): string => {
    switch (s) {
      case "Needs action":
        return t("applications.needsAction");
      case "Under review":
        return t("applications.underReview");
      case "Approved":
        return t("applications.approved");
      case "Declined":
        return t("applications.declined");
    }
  };

  const filtered = APPLICATIONS.filter((application) => {
    switch (activeTab) {
      case "needs-action":
        return application.status === "Needs action";
      case "under-review":
        return application.status === "Under review";
      case "approved":
        return application.status === "Approved";
      case "declined":
        return application.status === "Declined";
      default:
        return true;
    }
  });

  const renderAction = (application: Application) => {
    switch (application.status) {
      case "Needs action":
        return (
          <TouchableOpacity
            style={styles.resolveButton}
            activeOpacity={0.7}
            onPress={() => router.push(application.serviceRoute as any)}
          >
            <Text style={styles.resolveButtonText}>
              {t("applications.resolve")}
            </Text>
          </TouchableOpacity>
        );
      case "Under review":
        return (
          <View style={styles.reviewButton}>
            <Ionicons name="hourglass-outline" size={12} color="#B45309" />
            <Text style={styles.reviewButtonText}>
              {t("applications.underReview")}
            </Text>
          </View>
        );
      case "Approved":
        return (
          <TouchableOpacity
            style={styles.viewButton}
            activeOpacity={0.7}
            onPress={() => setSelected(application)}
          >
            <Text style={styles.viewButtonText}>{t("applications.view")}</Text>
          </TouchableOpacity>
        );
      case "Declined":
        return (
          <TouchableOpacity
            style={styles.reapplyButton}
            activeOpacity={0.7}
            onPress={() => router.push(application.serviceRoute as any)}
          >
            <Text style={styles.reapplyButtonText}>
              {t("applications.reapply")}
            </Text>
          </TouchableOpacity>
        );
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Header ── */}
      {/* <Text style={styles.title}>My applications</Text> */}
      <Text style={styles.subtitle}>{t("applications.subtitle")}</Text>

      {/* ── Tabs ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabBarScroll}
        contentContainerStyle={styles.tabBarContainer}
      >
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            activeOpacity={0.7}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.key && styles.tabTextActive,
              ]}
            >
              {t(tab.labelKey)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ── Table ── */}
      <View style={styles.tableCard}>
        <ScrollView horizontal showsHorizontalScrollIndicator>
          <View style={{ width: TOTAL_WIDTH }}>
            {/* Header row */}
            <View style={styles.tableHeaderRow}>
              {COLUMNS.map((column) => (
                <View key={column.key} style={{ width: column.width }}>
                  <Text style={styles.tableHeaderText}>
                    {t(column.labelKey)}
                  </Text>
                </View>
              ))}
            </View>

            {/* Data rows */}
            {filtered.length === 0 ? (
              <View style={styles.emptyRow}>
                <Text style={styles.emptyText}>{t("applications.empty")}</Text>
              </View>
            ) : (
              filtered.map((application, index) => (
                <View
                  key={application.id}
                  style={[
                    styles.tableRow,
                    index === filtered.length - 1 && styles.tableRowLast,
                  ]}
                >
                  <View style={{ width: COLUMNS[0].width }}>
                    <Text style={styles.cellRef}>{application.ref}</Text>
                  </View>
                  <View style={{ width: COLUMNS[1].width }}>
                    <Text style={styles.cellText}>{application.date}</Text>
                  </View>
                  <View style={{ width: COLUMNS[2].width }}>
                    <Text style={styles.cellText}>{application.service}</Text>
                  </View>
                  <View style={{ width: COLUMNS[3].width }}>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor: STATUS_STYLES[application.status].bg,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          { color: STATUS_STYLES[application.status].fg },
                        ]}
                      >
                        {statusLabel(application.status)}
                      </Text>
                    </View>
                    {application.note ? (
                      <Text style={styles.statusNote}>{application.note}</Text>
                    ) : null}
                  </View>
                  <View style={{ width: COLUMNS[4].width }}>
                    <Text style={styles.cellText}>
                      KES {application.amount.toLocaleString()}
                    </Text>
                  </View>
                  <View style={{ width: COLUMNS[5].width }}>
                    <Text style={styles.cellText}>{application.provider}</Text>
                  </View>
                  <View style={{ width: COLUMNS[6].width }}>
                    {renderAction(application)}
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </View>

      {/* ── Application details sheet ── */}
      <Modal
        visible={selected !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelected(null)}
      >
        {selected && (
          <View style={styles.modalContainer}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={() => setSelected(null)}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={24} color="#111827" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>{t("applications.details")}</Text>
              <View style={styles.modalHeaderSpacer} />
            </View>

            {/* Body */}
            <ScrollView
              style={styles.modalBody}
              contentContainerStyle={styles.modalBodyContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.modalRefRow}>
                <Text style={styles.modalRef}>{selected.ref}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: STATUS_STYLES[selected.status].bg },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      { color: STATUS_STYLES[selected.status].fg },
                    ]}
                  >
                    {statusLabel(selected.status)}
                  </Text>
                </View>
              </View>

              <View style={styles.modalDetails}>
                <View style={styles.modalDetailRow}>
                  <Ionicons
                    name="layers-outline"
                    size={18}
                    color={Colors.brand}
                  />
                  <View style={styles.modalDetailText}>
                    <Text style={styles.modalDetailLabel}>
                      {t("applications.service")}
                    </Text>
                    <Text style={styles.modalDetailValue}>
                      {selected.service}
                    </Text>
                  </View>
                </View>
                <View style={styles.modalDetailRow}>
                  <Ionicons
                    name="calendar-outline"
                    size={18}
                    color={Colors.brand}
                  />
                  <View style={styles.modalDetailText}>
                    <Text style={styles.modalDetailLabel}>
                      {t("applications.dateApplied")}
                    </Text>
                    <Text style={styles.modalDetailValue}>{selected.date}</Text>
                  </View>
                </View>
                <View style={styles.modalDetailRow}>
                  <Ionicons
                    name="cash-outline"
                    size={18}
                    color={Colors.brand}
                  />
                  <View style={styles.modalDetailText}>
                    <Text style={styles.modalDetailLabel}>
                      {t("applications.amount")}
                    </Text>
                    <Text style={styles.modalDetailValue}>
                      KES {selected.amount.toLocaleString()}
                    </Text>
                  </View>
                </View>
                <View
                  style={[styles.modalDetailRow, styles.modalDetailRowLast]}
                >
                  <Ionicons
                    name="business-outline"
                    size={18}
                    color={Colors.brand}
                  />
                  <View style={styles.modalDetailText}>
                    <Text style={styles.modalDetailLabel}>
                      {t("applications.provider")}
                    </Text>
                    <Text style={styles.modalDetailValue}>
                      {selected.provider}
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>

            {/* Footer */}
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalCloseButton}
                activeOpacity={0.7}
                onPress={() => setSelected(null)}
              >
                <Text style={styles.modalCloseText}>{t("common.done")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
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
  tabBarScroll: {
    marginBottom: 18,
  },
  tabBarContainer: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    padding: 4,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
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

  // ── Table ──
  tableCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    overflow: "hidden",
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#F9FAFB",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  tableHeaderText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  tableRowLast: {
    borderBottomWidth: 0,
  },
  cellRef: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
  },
  cellText: {
    fontSize: 13,
    color: "#4B5563",
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  viewButton: {
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#F3EFFF",
  },
  viewButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.brand,
  },
  resolveButton: {
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#DBEAFE",
  },
  resolveButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1D4ED8",
  },
  reapplyButton: {
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  reapplyButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111827",
  },
  reviewButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: "#FEF3C7",
  },
  reviewButtonText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#B45309",
  },
  statusNote: {
    marginTop: 6,
    fontSize: 11,
    lineHeight: 15,
    color: "#6B7280",
  },
  emptyRow: {
    paddingVertical: 32,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 13,
    color: "#9CA3AF",
  },

  // ── Details sheet ──
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  modalHeaderSpacer: {
    width: 24,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#111827",
  },
  modalBody: {
    flex: 1,
  },
  modalBodyContent: {
    padding: 20,
  },
  modalRefRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  modalRef: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.brand,
  },
  modalDetails: {
    backgroundColor: "#F9FAFB",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    paddingHorizontal: 16,
  },
  modalDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  modalDetailRowLast: {
    borderBottomWidth: 0,
  },
  modalDetailText: {
    flex: 1,
  },
  modalDetailLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 2,
  },
  modalDetailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  modalFooter: {
    padding: 20,
    paddingBottom: 36,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  modalCloseButton: {
    backgroundColor: Colors.brand,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
  },
  modalCloseText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
