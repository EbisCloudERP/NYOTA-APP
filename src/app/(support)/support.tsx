import Ionicons from "@react-native-vector-icons/ionicons";
import { useState } from "react";
import {
    FlatList,
    Linking,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import NewTicketModal from "../../components/NewTicketModal";
import TicketPreviewModal from "../../components/TicketPreviewModal";
import { Colors } from "../../theme/colors";

// ── Types ──
type FilterOption = "All Modules" | "All Status" | "All Priority";

interface Ticket {
  id: string;
  subject: string;
  module: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  status: "Open" | "Ongoing" | "Resolved" | "Closed";
  date: string;
}

// ── Dummy data ──
const dummyTickets: Ticket[] = [
  {
    id: "TKT-001",
    subject: "Unable to access course materials",
    module: "My Learning",
    priority: "High",
    status: "Open",
    date: "12 Aug 2026",
  },
  {
    id: "TKT-002",
    subject: "Payment not reflecting in account",
    module: "Billing",
    priority: "Critical",
    status: "Ongoing",
    date: "11 Aug 2026",
  },
  {
    id: "TKT-003",
    subject: "Webinar registration confirmation not received",
    module: "Webinars",
    priority: "Medium",
    status: "Open",
    date: "10 Aug 2026",
  },
  {
    id: "TKT-004",
    subject: "Profile picture upload failing",
    module: "Profile",
    priority: "Low",
    status: "Resolved",
    date: "09 Aug 2026",
  },
  {
    id: "TKT-005",
    subject: "Certificate download issue",
    module: "My Learning",
    priority: "Medium",
    status: "Closed",
    date: "08 Aug 2026",
  },
];

// ── Helpers ──
const priorityColor = (p: Ticket["priority"]): string => {
  switch (p) {
    case "Critical":
      return "#DC2626";
    case "High":
      return "#EA580C";
    case "Medium":
      return "#CA8A04";
    case "Low":
      return "#16A34A";
  }
};

const statusColor = (s: Ticket["status"]): string => {
  switch (s) {
    case "Open":
      return "#2563EB";
    case "Ongoing":
      return "#9333EA";
    case "Resolved":
      return "#16A34A";
    case "Closed":
      return "#6B7280";
  }
};

// ── Component ──
export default function SupportScreen() {
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("All Modules");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [priorityFilter, setPriorityFilter] = useState("All Priority");
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [previewTicket, setPreviewTicket] = useState<Ticket | null>(null);

  const handleCall = () => Linking.openURL("tel:+254700000000");
  const handleEmail = () => Linking.openURL("mailto:support@nyota.com");
  const handleWhatsApp = () => Linking.openURL("https://wa.me/254700000000");

  const renderTicket = ({ item }: { item: Ticket }) => (
    <TouchableOpacity
      style={styles.ticketRow}
      activeOpacity={0.7}
      onPress={() => setPreviewTicket(item)}
    >
      <Text style={[styles.cell, styles.cellId]}>{item.id}</Text>
      <Text style={[styles.cell, styles.cellSubject]} numberOfLines={2}>
        {item.subject}
      </Text>
      <Text style={[styles.cell, styles.cellModule]}>{item.module}</Text>
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
            {item.priority}
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
            {item.status}
          </Text>
        </View>
      </View>
      <Text style={[styles.cell, styles.cellDate]}>{item.date}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={dummyTickets}
        keyExtractor={(item) => item.id}
        renderItem={renderTicket}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            {/* ── Title & Subtitle ── */}
            {/* <Text style={styles.title}>Support</Text> */}
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
                label={moduleFilter}
                options={[
                  "All Modules",
                  "My Learning",
                  "Billing",
                  "Webinars",
                  "Profile",
                  "Authentication",
                  "Opportunities",
                ]}
                selected={moduleFilter}
                onSelect={setModuleFilter}
              />
              <FilterChip
                label={statusFilter}
                options={[
                  "All Status",
                  "Open",
                  "Ongoing",
                  "Resolved",
                  "Closed",
                ]}
                selected={statusFilter}
                onSelect={setStatusFilter}
              />
              <FilterChip
                label={priorityFilter}
                options={["All Priority", "Critical", "High", "Medium", "Low"]}
                selected={priorityFilter}
                onSelect={setPriorityFilter}
              />
            </View>

            {/* ── New Ticket Button ── */}
            <TouchableOpacity
              style={styles.newTicketBtn}
              activeOpacity={0.7}
              onPress={() => setShowNewTicket(true)}
            >
              <Ionicons
                name="add-circle-outline"
                size={20}
                color={Colors.white}
              />
              <Text style={styles.newTicketText}>New ticket</Text>
            </TouchableOpacity>

            {/* ── Table header ── */}
            <View style={styles.tableHeader}>
              <Text style={[styles.headerCell, styles.cellId]}>#</Text>
              <Text style={[styles.headerCell, styles.cellSubject]}>
                Subject
              </Text>
              <Text style={[styles.headerCell, styles.cellModule]}>M/DL</Text>
              <Text style={[styles.headerCell, styles.cellBadge]}>
                Priority
              </Text>
              <Text style={[styles.headerCell, styles.cellBadge]}>Status</Text>
              <Text style={[styles.headerCell, styles.cellDate]}>Date</Text>
            </View>
          </View>
        }
      />
      <NewTicketModal
        visible={showNewTicket}
        onClose={() => setShowNewTicket(false)}
        onSubmit={(ticket) => {
          setShowNewTicket(false);
          // TODO: submit ticket to API
          console.log("New ticket:", ticket);
        }}
      />
      <TicketPreviewModal
        visible={previewTicket !== null}
        ticket={previewTicket}
        onClose={() => setPreviewTicket(null)}
      />
    </View>
  );
}

// ── Filter Chip Component ──
function FilterChip({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string;
  options: string[];
  selected: string;
  onSelect: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.filterWrapper}>
      <TouchableOpacity
        style={styles.filterChip}
        activeOpacity={0.7}
        onPress={() => setOpen(!open)}
      >
        <Text style={styles.filterChipText} numberOfLines={1}>
          {selected}
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
                {opt}
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

  // Title & subtitle
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginTop: 24,
  },
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
});
