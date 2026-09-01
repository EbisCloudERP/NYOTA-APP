import Ionicons from "@react-native-vector-icons/ionicons";
import { useState } from "react";
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useLanguage, type Language } from "../services/LanguageContext";
import type { TranslationKey } from "../services/translations";
import { Colors } from "../theme/colors";

const OPTIONS: { value: Language; labelKey: TranslationKey }[] = [
  { value: "en", labelKey: "lang.optionEnglish" },
  { value: "sw", labelKey: "lang.optionSwahili" },
];

interface LanguageSelectorProps {
  variant?: "pill" | "header";
}

export default function LanguageSelector({
  variant = "pill",
}: LanguageSelectorProps) {
  const { language, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);

  const handleSelect = async (value: Language) => {
    setOpen(false);
    await setLanguage(value);
  };

  return (
    <>
      {variant === "header" ? (
        <TouchableOpacity
          style={styles.headerButton}
          activeOpacity={0.7}
          onPress={() => setOpen(true)}
        >
          <Ionicons name="globe-outline" size={20} color="#374151" />
          <Text style={styles.badge}>{language.toUpperCase()}</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.pillButton}
            activeOpacity={0.7}
            onPress={() => setOpen(true)}
          >
            <Ionicons name="globe-outline" size={16} color="#374151" />
            <Text style={styles.pillText}>{language.toUpperCase()}</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={styles.card} onPress={() => {}}>
            <Text style={styles.title}>{t("common.selectLanguage")}</Text>
            {OPTIONS.map((option) => {
              const selected = language === option.value;
              return (
                <TouchableOpacity
                  key={option.value}
                  style={[styles.option, selected && styles.optionSelected]}
                  activeOpacity={0.7}
                  onPress={() => handleSelect(option.value)}
                >
                  <Text
                    style={[
                      styles.optionLabel,
                      selected && styles.optionLabelSelected,
                    ]}
                  >
                    {t(option.labelKey)}
                  </Text>
                  {selected && (
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color={Colors.brand}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-end",
    marginBottom: 16,
  },
  pillButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  pillText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#374151",
  },
  headerButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    fontSize: 8,
    fontWeight: "700",
    color: Colors.white,
    backgroundColor: Colors.brand,
    borderRadius: 4,
    paddingHorizontal: 2,
    overflow: "hidden",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 12,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  optionSelected: {
    backgroundColor: Colors.brand + "0D",
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  optionLabelSelected: {
    color: Colors.brand,
  },
});
