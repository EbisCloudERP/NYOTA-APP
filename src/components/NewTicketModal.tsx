import Ionicons from "@react-native-vector-icons/ionicons";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useLanguage } from "../services/LanguageContext";
import { Colors } from "../theme/colors";

// ── Types ──
const CATEGORIES = [
  "bug",
  "feature_request",
  "general_inquiry",
  "technical_support",
  "billing",
  "other",
] as const;

const PRIORITIES = ["low", "medium", "high", "urgent"] as const;

type Category = (typeof CATEGORIES)[number];
type Priority = (typeof PRIORITIES)[number];

const categoryLabel = (c: string): string =>
  c.replace(/_/g, " ").replace(/\b\w/g, (ch) => ch.toUpperCase());

const priorityLabel = (p: string): string =>
  p.charAt(0).toUpperCase() + p.slice(1).toLowerCase();

interface NewTicketModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (ticket: {
    subject: string;
    category: Category;
    priority: Priority;
    description: string;
  }) => void;
}

// ── Dropdown Component ──
function Dropdown<T extends string>({
  value,
  options,
  placeholder,
  onSelect,
  formatLabel,
}: {
  value: T | "";
  options: readonly T[];
  placeholder: string;
  onSelect: (v: T) => void;
  formatLabel?: (v: string) => string;
}) {
  const [open, setOpen] = useState(false);
  const fmt = formatLabel ?? ((v: string) => v);

  return (
    <View style={dropdownStyles.wrapper}>
      <TouchableOpacity
        style={dropdownStyles.trigger}
        activeOpacity={0.7}
        onPress={() => setOpen(!open)}
      >
        <Text
          style={[
            dropdownStyles.triggerText,
            !value && dropdownStyles.placeholder,
          ]}
        >
          {value ? fmt(value) : placeholder}
        </Text>
        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          size={16}
          color="#9CA3AF"
        />
      </TouchableOpacity>
      {open && (
        <View style={dropdownStyles.menu}>
          <ScrollView nestedScrollEnabled>
            {options.map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[
                  dropdownStyles.option,
                  value === opt && dropdownStyles.optionSelected,
                ]}
                activeOpacity={0.7}
                onPress={() => {
                  onSelect(opt);
                  setOpen(false);
                }}
              >
                <Text
                  style={[
                    dropdownStyles.optionText,
                    value === opt && dropdownStyles.optionTextSelected,
                  ]}
                >
                  {fmt(opt)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const dropdownStyles = StyleSheet.create({
  wrapper: {
    position: "relative",
    zIndex: 10,
  },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 48,
  },
  triggerText: {
    fontSize: 15,
    color: "#111827",
  },
  placeholder: {
    color: "#9CA3AF",
  },
  menu: {
    position: "absolute",
    top: 52,
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
    maxHeight: 180,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  optionSelected: {
    backgroundColor: Colors.brand + "0D",
  },
  optionText: {
    fontSize: 14,
    color: "#374151",
  },
  optionTextSelected: {
    color: Colors.brand,
    fontWeight: "600",
  },
});

// ── Modal Component ──
export default function NewTicketModal({
  visible,
  onClose,
  onSubmit,
}: NewTicketModalProps) {
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [priority, setPriority] = useState<Priority | "">("");
  const [description, setDescription] = useState("");
  const { t } = useLanguage();

  const isFormValid =
    subject.trim() !== "" &&
    category !== "" &&
    priority !== "" &&
    description.trim() !== "";

  const handleSubmit = () => {
    if (!isFormValid) return;
    onSubmit({
      subject: subject.trim(),
      category: category as Category,
      priority: priority as Priority,
      description: description.trim(),
    });
    // Reset form
    setSubject("");
    setCategory("");
    setPriority("");
    setDescription("");
  };

  const handleClose = () => {
    setSubject("");
    setCategory("");
    setPriority("");
    setDescription("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} activeOpacity={0.7}>
            <Ionicons name="close" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t("newTicket.title")}</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* ── Form ── */}
        <ScrollView
          style={styles.form}
          contentContainerStyle={styles.formContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Subject */}
          <Text style={styles.label}>{t("newTicket.subject")}</Text>
          <TextInput
            style={styles.input}
            placeholder={t("newTicket.subjectPlaceholder")}
            placeholderTextColor="#9CA3AF"
            value={subject}
            onChangeText={setSubject}
          />

          {/* Category */}
          <Text style={styles.label}>{t("newTicket.category")}</Text>
          <Dropdown
            value={category}
            options={CATEGORIES}
            placeholder={t("newTicket.selectCategory")}
            onSelect={setCategory}
            formatLabel={categoryLabel}
          />

          {/* Priority */}
          <Text style={styles.label}>{t("newTicket.priority")}</Text>
          <Dropdown
            value={priority}
            options={PRIORITIES}
            placeholder={t("newTicket.selectPriority")}
            onSelect={setPriority}
            formatLabel={priorityLabel}
          />

          {/* Description */}
          <Text style={styles.label}>{t("newTicket.description")}</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder={t("newTicket.descriptionPlaceholder")}
            placeholderTextColor="#9CA3AF"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
        </ScrollView>

        {/* ── Submit Button ── */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.submitBtn, !isFormValid && styles.submitBtnDisabled]}
            activeOpacity={0.7}
            onPress={handleSubmit}
            disabled={!isFormValid}
          >
            <Text
              style={[
                styles.submitBtnText,
                !isFormValid && styles.submitBtnTextDisabled,
              ]}
            >
              {t("newTicket.submit")}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ── Styles ──
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#111827",
  },
  form: {
    flex: 1,
  },
  formContent: {
    padding: 20,
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#111827",
  },
  textArea: {
    minHeight: 120,
    paddingTop: 12,
  },
  footer: {
    padding: 20,
    paddingBottom: 36,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  submitBtn: {
    backgroundColor: Colors.brand,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
  },
  submitBtnDisabled: {
    backgroundColor: "#E5E7EB",
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.white,
  },
  submitBtnTextDisabled: {
    color: "#9CA3AF",
  },
});
