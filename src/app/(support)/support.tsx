import Ionicons from "@react-native-vector-icons/ionicons";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Linking,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import NewTicketModal from "../../components/NewTicketModal";
import TicketPreviewModal from "../../components/TicketPreviewModal";
import {
    createFeedbackTicket,
    getFeedbackTickets,
    type FeedbackTicket,
} from "../../services/api";
import { useAuth } from "../../services/AuthContext";
import { useFeedback } from "../../services/FeedbackContext";
import { Colors } from "../../theme/colors";

// ── Helpers ──
const priorityColor = (p: string): string => {
  switch (p.toLowerCase()) {
    case "urgent":
    case "critical":
      return "#DC2626";
    case "high":
      return "#EA580C";
    case "medium":
      return "#CA8A04";
    case "low":
      return "#16A34A";
    default:
      return "#6B7280";
  }
};

const statusColor = (s: string): string => {
  switch (s.toLowerCase()) {
    case "open":
      return "#2563EB";
    case "in_progress":
    case "ongoing":
      return "#9333EA";
    case "resolved":
      return "#16A34A";
    case "closed":
      return "#6B7280";
    default:
      return "#6B7280";
  }
};

const priorityLabel = (p: string): string =>
  p.charAt(0).toUpperCase() + p.slice(1).toLowerCase();

const statusLabel = (s: string): string => {
  switch (s.toLowerCase()) {
    case "in_progress":
    case "ongoing":
      return "In Progress";
    case "open":
      return "Open";
    case "resolved":
      return "Resolved";
    case "closed":
      return "Closed";
    default:
      return s;
  }
};

const categoryLabel = (c: string): string =>
  c
    .replace(/_/g, " ")
    .replace(/\b\w/g, (ch) => ch.toUpperCase());

const formatDate = (value: string): string => {
  const d = new Date(value.replace(" ", "T"));
  if (Number.isNaN(d.getTime())) return value.slice(0, 10);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// ── Component ──
export default function SupportScreen() {
  const { user } = useAuth();
  const { showToast } = useFeedback();
  const [tickets, setTickets] = useState<FeedbackTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [creating, setCreating] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);

  const loadTickets = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setRefreshing(true);
      try {
        const uuid = user?.uuid ?? "";
        if (!uuid) return;
        const res = await getFeedbackTickets(uuid);
        const raw = (res as { data?: unknown })?.data;
        const list: FeedbackTicket[] = Array.isArray(raw)
          ? (raw as FeedbackTicket[])
          : raw && typeof raw === "object" && Array.isArray((raw as { data?: unknown }).data)
            ? ((raw as { data: FeedbackTicket[] }).data)
            : [];
        setTickets(list);
      } catch (e) {
        showToast(
          e instanceof Error ? e.message : "Failed to load tickets.",
          "error",
        );
      } finally {
        setLoading(false);
        if (isRefresh) setRefreshing(false);
      }
    },
    [user?.uuid, showToast],
  );

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const handleRefresh = useCallback(() => {
    loadTickets(true);
  }, [loadTickets]);

  const categories = useMemo(
    () =>
      Array.from(
        new Set((tickets ?? []).map((t) => t.category).filter(Boolean)),
      ),
    [tickets],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (tickets ?? []).filter((t) => {
      if (
        q &&
        !`${t.subject} ${t.ticket_number}`.toLowerCase().includes(q)
      ) {
        return false;
      }
      if (categoryFilter !== "all" && t.category !== categoryFilter) {
        return false;
      }
      if (statusFilter !== "all" && t.status.toLowerCase() !== statusFilter) {
        return false;
      }
      if (priorityFilter !== "all" && t.priority.toLowerCase() !== priorityFilter) {
        return false;
      }
      return true;
    });
  }, [tickets, search, categoryFilter, statusFilter, priorityFilter]);

  const handleCall = () => Linking.openURL("tel:+254700000000");
  const handleEmail = () => Linking.openURL("mailto:support@nyota.com");
  const handleWhatsApp = () => Linking.openURL("https://wa.me/254700000000");

  const handleCreateTicket = async (ticket: {
    subject: string;
    category: string;
    priority: string;
    description: string;
  }) => {
    setShowNewTicket(false);
    setCreating(true);
    try {
      await createFeedbackTicket({
        subject: ticket.subject,
        category: ticket.category,
        description: ticket.description,
        priority: ticket.priority,
      });
      showToast("Ticket created successfully.", "success");
      loadTickets();
    } catch (e) {
      showToast(
        e instanceof Error ? e.message : "Failed to create ticket.",
        "error",
      );
    } finally {
      setCreating(false);
    }
  };

  const renderTicket = ({ item }: { item: FeedbackTicket }) => (
    <TouchableOpacity
      style={styles.ticketRow}
      activeOpacity={0.7}
      onPress={() => setSelectedTicketId(item.id)}
    >
      <Text style={[styles.cell, styles.cellId]}>{item.ticket_number}</Text>
      <Text style={[styles.cell, styles.cellSubject]} numberOfLines={2}>
        {item.subject}
      </Text>
      <Text style={[styles.cell, styles.cellModule]}>{categoryLabel(item.category)}</Text>
      <View style={styles.cellBadge}>
        <View
          style={[
            styles.badge,
            { backgroundColor: priorityColor(item.priority) + "1A" },
          ]}
        >
          <View
            style={[
              styles.badgeDot,
              { backgroundColor: priorityColor(item.priority) },
            ]}
          />
          <Text
            style={[styles.badgeText, { color: priorityColor(item.priority) }]}
          >
            {priorityLabel(item.priority)}
          </Text>
        </View>
      </View>
      <View style={styles.cellBadge}>
        <View
          style={[
            styles.badge,
            { backgroundColor: statusColor(item.status) + "1A" },
          ]}
        >
          <View
            style={[
              styles.badgeDot,
              { backgroundColor: statusColor(item.status) },
            ]}
          />
          <Text style={[styles.badgeText, { color: statusColor(item.status) }]}>
            {statusLabel(item.status)}
          </Text>
        </View>
      </View>
      <Text style={[styles.cell, styles.cellDate]}>{formatDate(item.created_at)}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.brand} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderTicket}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListHeaderComponent={
          <View>
            {/* ── Title & Subtitle ── */}
            <Text style={styles.subtitle}>
              Get in touch with our support team for assistance
            </Text>

            {/* ── Contact buttons ── */}
            <View style={styles.contactRow}>
              <TouchableOpacity
                style={styles.contactBtn}
                activeOpacity={0.7}
                onPress={handleCall}
              >
                <Ionicons name="call-outline" size={20} color={Colors.brand} />
                <Text style={styles.contactBtnText}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.contactBtn}
                activeOpacity={0.7}
                onPress={handleEmail}
              >
                <Ionicons name="mail-outline" size={20} color={Colors.brand} />
                <Text style={styles.contactBtnText}>Email</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.contactBtn}
                activeOpacity={0.7}
                onPress={handleWhatsApp}
              >
                <Ionicons name="logo-whatsapp" size={20} color={Colors.brand} />
                <Text style={styles.contactBtnText}>WhatsApp</Text>
              </TouchableOpacity>
            </View>

            {/* ── Search & Filters ── */}
            <View style={styles.searchRow}>
              <View style={styles.searchInputWrapper}>
                <Ionicons
                  name="search-outline"
                  size={18}
                  color="#9CA3AF"
                  style={styles.searchIcon}
                />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search tickets..."
                  placeholderTextColor="#9CA3AF"
                  value={search}
                  onChangeText={setSearch}
                />
              </View>
            </View>

            <View style={styles.filtersRow}>
              <FilterChip
                options={["all", ...categories]}
                selected={categoryFilter}
                onSelect={setCategoryFilter}
                displayLabel={(v) =>
                  v === "all" ? "All Categories" : categoryLabel(v)
                }
              />
              <FilterChip
                options={["all", "open", "in_progress", "resolved", "closed"]}
                selected={statusFilter}
                onSelect={setStatusFilter}
                displayLabel={(v) => (v === "all" ? "All Status" : statusLabel(v))}
              />
              <FilterChip
                options={["all", "urgent", "high", "medium", "low"]}
                selected={priorityFilter}
                onSelect={setPriorityFilter}
                displayLabel={(v) =>
                  v === "all" ? "All Priority" : priorityLabel(v)
                }
              />
            </View>

            {/* ── New Ticket Button ── */}
            <TouchableOpacity
              style={styles.newTicketBtn}
              activeOpacity={0.7}
              onPress={() => setShowNewTicket(true)}
              disabled={creating}
            >
              {creating ? (
                <ActivityIndicator color={Colors.white} size="small" />
              ) : (
                <Ionicons
                  name="add-circle-outline"
                  size={20}
                  color={Colors.white}
                />
              )}
              <Text style={styles.newTicketText}>
                {creating ? "Creating..." : "New ticket"}
              </Text>
            </TouchableOpacity>

            {/* ── Table header ── */}
            <View style={styles.tableHeader}>
              <Text style={[styles.headerCell, styles.cellId]}>#</Text>
              <Text style={[styles.headerCell, styles.cellSubject]}>
                Subject
              </Text>
              <Text style={[styles.headerCell, styles.cellModule]}>Category</Text>
              <Text style={[styles.headerCell, styles.cellBadge]}>
                Priority
              </Text>
              <Text style={[styles.headerCell, styles.cellBadge]}>Status</Text>
              <Text style={[styles.headerCell, styles.cellDate]}>Date</Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="ticket-outline" size={48} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No tickets found</Text>
            <Text style={styles.emptySubtitle}>
              Create a new ticket to get help from our team.
            </Text>
          </View>
        }
      />
      <NewTicketModal
        visible={showNewTicket}
        onClose={() => setShowNewTicket(false)}
        onSubmit={handleCreateTicket}
      />
      <TicketPreviewModal
        visible={selectedTicketId !== null}
        ticketId={selectedTicketId}
        onClose={() => setSelectedTicketId(null)}
      />
    </View>
  );
}

// ── Filter Chip Component ──
function FilterChip({
  options,
  selected,
  onSelect,
  displayLabel,
}: {
  options: string[];
  selected: string;
  onSelect: (v: string) => void;
  displayLabel?: (v: string) => string;
}) {
  const [open, setOpen] = useState(false);
  const fmt = displayLabel ?? ((v: string) => v);

  return (
    <View style={styles.filterWrapper}>
      <TouchableOpacity
        style={styles.filterChip}
        activeOpacity={0.7}
        onPress={() => setOpen(!open)}
      >
        <Text style={styles.filterChipText} numberOfLines={1}>
          {fmt(selected)}
        </Text>
        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          size={14}
          color="#6B7280"
        />
      </TouchableOpacity>
      {open && (
        <View style={styles.filterDropdown}>
          {options.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[
                styles.filterOption,
                selected === opt && styles.filterOptionSelected,
              ]}
              activeOpacity={0.7}
              onPress={() => {
                onSelect(opt);
                setOpen(false);
              }}
            >
              <Text
                style={[
                  styles.filterOptionText,
                  selected === opt && styles.filterOptionTextSelected,
                ]}
              >
                {fmt(opt)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

// ── Styles ──
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.white,
  },

  // Title & subtitle
  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    marginTop: 16,
    marginBottom: 20,
  },

  // Contact buttons
  contactRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
  },
  contactBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.brand + "0D",
    borderWidth: 1,
    borderColor: Colors.brand + "1A",
  },
  contactBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.brand,
  },

  // Search
  searchRow: {
    marginBottom: 12,
  },
  searchInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 46,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#111827",
  },

  // Filters
  filtersRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
    zIndex: 10,
  },
  filterWrapper: {
    flex: 1,
    position: "relative",
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
    gap: 4,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#374151",
    flex: 1,
  },
  filterDropdown: {
    position: "absolute",
    top: 46,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 20,
  },
  filterOption: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  filterOptionSelected: {
    backgroundColor: Colors.brand + "0D",
  },
  filterOptionText: {
    fontSize: 13,
    color: "#374151",
  },
  filterOptionTextSelected: {
    color: Colors.brand,
    fontWeight: "600",
  },

  // New ticket button
  newTicketBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.brand,
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 20,
  },
  newTicketText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.white,
  },

  // Table header
  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 4,
  },
  headerCell: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  // Ticket row
  ticketRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    overflow: "visible",
  },

  // Cells
  cell: {
    fontSize: 13,
    color: "#374151",
  },
  cellId: {
    width: 68,
    fontWeight: "600",
    color: Colors.brand,
    fontSize: 12,
  },
  cellSubject: {
    flex: 1.5,
    fontWeight: "500",
    paddingRight: 4,
  },
  cellModule: {
    flex: 0.9,
    fontSize: 12,
    color: "#6B7280",
    paddingRight: 4,
  },
  cellBadge: {
    flex: 1.3,
    alignItems: "flex-start",
    overflow: "visible",
  },
  cellDate: {
    width: 72,
    fontSize: 11,
    color: "#9CA3AF",
    textAlign: "right",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    gap: 5,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
  },

  // Empty state
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
});
