import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {
    getCourseRecommendations,
    type CourseRecommendations,
} from "../../services/api";
import { getUuid } from "../../services/storage";
import { Colors } from "../../theme/colors";

export default function ResultsScreen() {
  const { uuid: paramUuid } = useLocalSearchParams<{ uuid: string }>();
  const [uuid, setUuid] = useState<string>(paramUuid ?? "");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<CourseRecommendations | null>(null);

  useEffect(() => {
    if (uuid) return;
    getUuid().then((stored) => {
      if (stored) setUuid(stored);
    });
  }, [uuid]);

  const loadData = useCallback(async (isRefresh = false) => {
    if (!uuid) return;
    if (isRefresh) setRefreshing(true);
    try {
      const res = await getCourseRecommendations(uuid);
      setData(res.data);
    } catch {
      Alert.alert("Error", "Failed to load recommendations.");
    } finally {
      setLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  }, [uuid]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = useCallback(() => {
    loadData(true);
  }, [loadData]);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <Text style={styles.title}>Congratulations!</Text>
        <Text style={styles.subtitle}>
          Here are the courses we recommend based on your profile.
        </Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.brand} />
            <Text style={styles.loadingText}>Loading recommendations...</Text>
          </View>
        ) : (
          data?.homepage_sections?.map((section) => (
            <View key={section.key} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              {section.description ? (
                <Text style={styles.sectionDesc}>{section.description}</Text>
              ) : null}

              {section.courses?.length ? (
                section.courses.map((course) => (
                  <View key={course.id} style={styles.courseCard}>
                    <View style={styles.courseIcon}>
                      <Text style={styles.courseIconText}>📘</Text>
                    </View>
                    <View style={styles.courseBody}>
                      <Text style={styles.courseName}>{course.title}</Text>
                      {course.short_description ? (
                        <Text style={styles.courseDesc} numberOfLines={2}>
                          {course.short_description}
                        </Text>
                      ) : null}
                      <View style={styles.courseMeta}>
                        {course.level ? (
                          <View style={styles.metaTag}>
                            <Text style={styles.metaTagText}>{course.level}</Text>
                          </View>
                        ) : null}
                        {course.category ? (
                          <Text style={styles.metaText}>{course.category.name}</Text>
                        ) : null}
                      </View>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>No courses yet.</Text>
              )}
            </View>
          ))
        )}
      </ScrollView>

      <View style={styles.bottomFixed}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => router.replace("/home")}
        >
          <Text style={styles.continueButtonText}>Proceed to Dashboard</Text>
        </TouchableOpacity>
        <Text style={styles.footer}>
          You can update your profile anytime from the dashboard
        </Text>
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
  loadingContainer: { alignItems: "center", paddingVertical: 60 },
  loadingText: { marginTop: 14, fontSize: 14, color: "#9CA3AF" },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 16, fontWeight: "700", color: "#1F2937", marginBottom: 4,
  },
  sectionDesc: { fontSize: 13, color: "#6B7280", marginBottom: 12, lineHeight: 18 },
  courseCard: {
    flexDirection: "row", alignItems: "flex-start", paddingVertical: 14,
    paddingHorizontal: 16, borderRadius: 12, borderWidth: 1,
    borderColor: "#E5E7EB", backgroundColor: "#F9FAFB", marginBottom: 10,
  },
  courseIcon: {
    width: 40, height: 40, borderRadius: 10, backgroundColor: "#EDE9FE",
    alignItems: "center", justifyContent: "center", marginRight: 12,
  },
  courseIconText: { fontSize: 18 },
  courseBody: { flex: 1 },
  courseName: { fontSize: 14, fontWeight: "600", color: "#1F2937", lineHeight: 19 },
  courseDesc: { fontSize: 12, color: "#6B7280", marginTop: 4, lineHeight: 17 },
  courseMeta: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 8 },
  metaTag: {
    backgroundColor: "#F5F3FF", borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3,
  },
  metaTagText: { fontSize: 11, fontWeight: "600", color: Colors.brand, textTransform: "capitalize" },
  metaText: { fontSize: 12, color: "#6B7280" },
  emptyText: { fontSize: 13, color: "#9CA3AF" },
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
