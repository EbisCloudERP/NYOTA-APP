import Ionicons from "@react-native-vector-icons/ionicons";
import { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { FAQ_MODULES, FAQ_TOTAL } from "../../services/faqs";
import { useLanguage } from "../../services/LanguageContext";
import { Colors } from "../../theme/colors";

const ALL_MODULES = "all";

const moduleShortTitle = (title: string): string => title.split(" — ")[0];

export default function FaqScreen() {
  const { t, language } = useLanguage();
  const [query, setQuery] = useState("");
  const [activeModule, setActiveModule] = useState(ALL_MODULES);
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  const search = query.trim().toLowerCase();
  const isSearching = search.length > 0;

  const visibleModules = useMemo(
    () =>
      FAQ_MODULES.map((module) => ({
        ...module,
        items: isSearching
          ? module.items.filter(
              (item) =>
                item[language].question.toLowerCase().includes(search) ||
                item[language].answer.toLowerCase().includes(search),
            )
          : module.items,
      })).filter(
        (module) =>
          module.items.length > 0 &&
          (activeModule === ALL_MODULES || module.id === activeModule),
      ),
    [isSearching, search, activeModule, language],
  );

  const resultCount = visibleModules.reduce(
    (total, module) => total + module.items.length,
    0,
  );

  const toggleItem = (id: string) =>
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.subtitle}>{t("faq.intro")}</Text>

      {/* Search */}
      <View style={styles.searchWrapper}>
        <Ionicons
          name="search-outline"
          size={18}
          color="#9CA3AF"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder={t("faq.searchPlaceholder")}
          placeholderTextColor="#9CA3AF"
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
          accessibilityLabel={t("faq.searchPlaceholder")}
        />
        {query.length > 0 ? (
          <TouchableOpacity
            onPress={() => setQuery("")}
            accessibilityRole="button"
            accessibilityLabel={t("faq.clearSearch")}
          >
            <Ionicons name="close-circle" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Module filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsRow}
      >
        <TouchableOpacity
          style={[
            styles.chip,
            activeModule === ALL_MODULES && styles.chipActive,
          ]}
          activeOpacity={0.7}
          onPress={() => setActiveModule(ALL_MODULES)}
          accessibilityRole="button"
          accessibilityState={{ selected: activeModule === ALL_MODULES }}
        >
          <Text
            style={[
              styles.chipText,
              activeModule === ALL_MODULES && styles.chipTextActive,
            ]}
          >
            {t("faq.allModules")}
          </Text>
        </TouchableOpacity>
        {FAQ_MODULES.map((module) => {
          const selected = activeModule === module.id;
          return (
            <TouchableOpacity
              key={module.id}
              style={[styles.chip, selected && styles.chipActive]}
              activeOpacity={0.7}
              onPress={() => setActiveModule(module.id)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
            >
              <Text style={[styles.chipText, selected && styles.chipTextActive]}>
                {moduleShortTitle(module.title[language])}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {(isSearching || activeModule !== ALL_MODULES) && (
        <Text style={styles.resultCount}>
          {t("faq.resultCount", { count: resultCount, total: FAQ_TOTAL })}
        </Text>
      )}

      {visibleModules.length === 0 ? (
        <Text style={styles.emptyText}>{t("faq.noResults")}</Text>
      ) : (
        visibleModules.map((module) => (
          <View key={module.id} style={styles.moduleCard}>
            <Text style={styles.moduleTitle}>{module.title[language]}</Text>
            {module.note ? (
              <Text style={styles.moduleNote}>{module.note[language]}</Text>
            ) : null}

            {module.items.map((item, index) => {
              const expanded = expandedIds.includes(item.id);
              const text = item[language];
              return (
                <View
                  key={item.id}
                  style={[
                    styles.item,
                    index === module.items.length - 1 && styles.itemLast,
                  ]}
                >
                  <TouchableOpacity
                    style={styles.questionRow}
                    activeOpacity={0.7}
                    onPress={() => toggleItem(item.id)}
                    accessibilityRole="button"
                    accessibilityState={{ expanded }}
                    accessibilityLabel={text.question}
                  >
                    <Text style={styles.questionText}>{text.question}</Text>
                    <Ionicons
                      name={expanded ? "chevron-up" : "chevron-down"}
                      size={18}
                      color={Colors.brand}
                    />
                  </TouchableOpacity>
                  {expanded ? (
                    <Text style={styles.answerText}>{text.answer}</Text>
                  ) : null}
                </View>
              );
            })}
          </View>
        ))
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
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 16,
  },

  // ── Search ──
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 46,
    marginBottom: 14,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#111827",
    padding: 0,
  },

  // ── Filters ──
  chipsRow: {
    gap: 8,
    paddingBottom: 16,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  chipActive: {
    backgroundColor: Colors.brand,
    borderColor: Colors.brand,
  },
  chipText: {
    fontSize: 12.5,
    fontWeight: "600",
    color: "#4B5563",
  },
  chipTextActive: {
    color: "#FFFFFF",
  },
  resultCount: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 24,
  },

  // ── Module card ──
  moduleCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
    paddingTop: 16,
    marginBottom: 14,
  },
  moduleTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    lineHeight: 20,
  },
  moduleNote: {
    fontSize: 11.5,
    color: "#9CA3AF",
    marginTop: 2,
    marginBottom: 6,
  },

  // ── Question / answer ──
  item: {
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  itemLast: {
    borderBottomWidth: 0,
  },
  questionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 14,
  },
  questionText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: "#1F2937",
    lineHeight: 19,
  },
  answerText: {
    fontSize: 12.5,
    color: "#4B5563",
    lineHeight: 19,
    paddingBottom: 14,
  },

  bottomSpacer: {
    height: 24,
  },
});
