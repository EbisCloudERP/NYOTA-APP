import { router, useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Colors } from "../../theme/colors";

function parseArray(raw: string | string[] | undefined): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function ResultsScreen() {
  const params = useLocalSearchParams<{
    learningPaths: string;
    categories: string;
    tags: string;
    sections: string;
    level: string;
  }>();

  const learningPaths = useMemo(() => parseArray(params.learningPaths), [params.learningPaths]);
  const categories = useMemo(() => parseArray(params.categories), [params.categories]);
  const tags = useMemo(() => parseArray(params.tags), [params.tags]);
  const sections = useMemo(() => parseArray(params.sections), [params.sections]);
  const level = params.level ?? "";

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Congratulations!</Text>
        <Text style={styles.subtitle}>
          Based on your profile, here is what you are eligible for.
        </Text>

        {learningPaths.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Learning Paths</Text>
            <View style={styles.tagRow}>
              {learningPaths.map((p, i) => (
                <View key={i} style={styles.tag}>
                  <Text style={styles.tagText}>{p.replace(/_/g, " ")}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {level ? (
          <>
            <Text style={styles.sectionTitle}>Your Level</Text>
            <View style={styles.tagRow}>
              <View style={[styles.tag, styles.tagHighlight]}>
                <Text style={[styles.tagText, styles.tagTextHighlight]}>{level.toUpperCase()}</Text>
              </View>
            </View>
          </>
        ) : null}

        {categories.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Matched Categories</Text>
            <View style={styles.tagRow}>
              {categories.map((c, i) => (
                <View key={i} style={styles.tag}>
                  <Text style={styles.tagText}>{c.replace(/-/g, " ")}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {tags.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Your Tags</Text>
            <View style={styles.tagRow}>
              {tags.map((t, i) => (
                <View key={i} style={[styles.tag, styles.tagSmall]}>
                  <Text style={[styles.tagText, styles.tagTextSmall]}>{t.replace(/-/g, " ")}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {sections.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Recommended For You</Text>
            <View style={styles.cardsList}>
              {sections.map((s, i) => (
                <View key={i} style={styles.courseCard}>
                  <View style={styles.courseIcon}>
                    <Text style={styles.courseIconText}>📘</Text>
                  </View>
                  <Text style={styles.courseName}>{s.replace(/_/g, " ")}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            Your profile has been personalized. You can update it anytime from the
            dashboard.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.bottomFixed}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => router.replace("/login")}
        >
          <Text style={styles.continueButtonText}>Proceed to Login</Text>
        </TouchableOpacity>
        <Text style={styles.footer}>You can update your profile anytime from the dashboard</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  scrollContent: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 20 },
  title: { fontSize: 22, fontWeight: "700", color: "#1F2937", marginBottom: 6 },
  subtitle: {
    fontSize: 15, color: "#6B7280", marginBottom: 24, lineHeight: 21,
  },
  sectionTitle: {
    fontSize: 14, fontWeight: "700", color: "#374151",
    textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10, marginTop: 8,
  },
  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  tag: {
    backgroundColor: "#F5F3FF", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6,
  },
  tagHighlight: { backgroundColor: Colors.brand },
  tagText: {
    fontSize: 13, fontWeight: "600", color: Colors.brand, textTransform: "capitalize",
  },
  tagTextHighlight: { color: "#FFFFFF" },
  tagSmall: { paddingHorizontal: 10, paddingVertical: 4 },
  tagTextSmall: { fontSize: 12 },
  cardsList: { gap: 10, marginBottom: 16 },
  courseCard: {
    flexDirection: "row", alignItems: "center", paddingVertical: 14, paddingHorizontal: 16,
    borderRadius: 12, borderWidth: 1, borderColor: "#E5E7EB", backgroundColor: "#F9FAFB",
  },
  courseIcon: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: "#EDE9FE",
    alignItems: "center", justifyContent: "center", marginRight: 12,
  },
  courseIconText: { fontSize: 16 },
  courseName: { flex: 1, fontSize: 14, fontWeight: "500", color: "#1F2937", textTransform: "capitalize" },
  infoCard: {
    backgroundColor: "#F0FDF4", borderRadius: 12, padding: 16, marginBottom: 12,
  },
  infoText: { fontSize: 14, color: "#166534", lineHeight: 21 },
  bottomFixed: {
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40,
    borderTopWidth: 1, borderTopColor: "#F3F4F6", backgroundColor: "#FFFFFF",
  },
  continueButton: {
    width: "100%", height: 50, backgroundColor: Colors.brand, borderRadius: 12,
    alignItems: "center", justifyContent: "center", marginBottom: 12,
  },
  continueButtonText: { fontSize: 16, fontWeight: "600", color: "#FFFFFF" },
  footer: { fontSize: 12, color: "#9CA3AF", textAlign: "center" },
});
