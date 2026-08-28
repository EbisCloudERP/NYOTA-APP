import Ionicons from "@react-native-vector-icons/ionicons";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../services/AuthContext";
import { getEnrolledCourses, type CatalogueCourse } from "../../services/api";
import { Colors } from "../../theme/colors";

// ── Types ──────────────────────────────────────────────
interface Certificate {
  id: string;
  title: string;
  description: string;
  studentName: string;
  durationMinutes: number;
  completedDate: string;
  completedLessons: number;
  totalLessons: number;
  lessons: string[];
}

// ── Helpers ────────────────────────────────────────────
function formatDuration(minutes: number): string {
  if (!minutes) return "—";
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h} hours`;
}

const SERIF = Platform.OS === "ios" ? "Georgia" : "serif";
const SCRIPT = Platform.OS === "ios" ? "Snell Roundhand" : "cursive";

function formatCertificateDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ── Certificate detail modal ───────────────────────────
function CertificateModal({
  visible,
  cert,
  onClose,
}: {
  visible: boolean;
  cert: Certificate | null;
  onClose: () => void;
}) {
  if (!cert) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <ScrollView
        style={modalStyles.scrollView}
        contentContainerStyle={modalStyles.scrollContent}
      >
        {/* Close button */}
        <TouchableOpacity style={modalStyles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={24} color="#6B7280" />
        </TouchableOpacity>

        {/* ── Certificate ── */}
        <View style={modalStyles.certOuter}>
          {/* Header above the gold frame */}
          <View style={modalStyles.certHeaderRow}>
            <Text style={modalStyles.yourCertificateLabel}>
              Your Certificate:
            </Text>
            <Text style={modalStyles.certNumber}>{cert.id}</Text>
          </View>

          {/* Gold frame */}
          <View style={modalStyles.goldFrame}>
            <View style={modalStyles.certInner}>
              {/* Kenyan flag corner ribbons */}
              <Image
                source={require("../../../assets/images/cert_wavy_lines.png")}
                style={modalStyles.wavyTopRight}
                resizeMode="stretch"
              />
              <Image
                source={require("../../../assets/images/cert_wavy_lines.png")}
                style={modalStyles.wavyBottomLeft}
                resizeMode="stretch"
              />

              {/* Coat of arms */}
              <Image
                source={require("../../../assets/images/arms.png")}
                style={modalStyles.arms}
                resizeMode="contain"
              />

              <Text style={modalStyles.republicText}>REPUBLIC OF KENYA</Text>

              <Text style={modalStyles.ministryText}>
                MINISTRY OF COOPERATIVES AND MICRO, SMALL AND MEDIUM
              </Text>
              <Text style={modalStyles.ministryText}>
                ENTERPRISES DEVELOPMENT
              </Text>

              <Text style={modalStyles.programText}>
                NATIONAL YOUTH OPPORTUNITIES TOWARDS ADVANCEMENT
              </Text>

              <Image
                source={require("../../../assets/images/NYOTA.jpg")}
                style={modalStyles.nyotaLogo}
                resizeMode="contain"
              />

              <Text style={modalStyles.certificateTitle}>CERTIFICATE</Text>
              <Text style={modalStyles.ofCompletion}>OF COMPLETION</Text>

              <Text style={modalStyles.certifyLabel}>
                This is to certify that
              </Text>
              <Text style={modalStyles.studentName}>{cert.studentName}</Text>

              <Text style={modalStyles.completedTrainingLabel}>
                Has successfully completed the training for:
              </Text>
              <Text style={modalStyles.courseTitle}>
                {cert.title.toUpperCase()}
              </Text>

              <Text style={modalStyles.heldOn}>
                Held on {cert.completedDate}
              </Text>

              {/* Signatures */}
              <View style={modalStyles.signatureRow}>
                <View style={modalStyles.signatureCol}>
                  <View style={modalStyles.signatureLine} />
                  <Text style={modalStyles.signatureLabel}>DIRECTOR</Text>
                </View>
                <View style={modalStyles.signatureCol}>
                  <View style={modalStyles.signatureLine} />
                  <Text style={modalStyles.signatureLabel}>SIGNATURE</Text>
                </View>
                <View style={modalStyles.signatureCol}>
                  <View style={modalStyles.signatureLine} />
                  <Text style={modalStyles.signatureLabel}>DATE</Text>
                </View>
              </View>

              <Text style={modalStyles.disclaimer}>
                This is not an AGPO certificate
              </Text>
            </View>
          </View>
        </View>

        {/* Download button */}
        <TouchableOpacity
          style={modalStyles.downloadButton}
          activeOpacity={0.7}
        >
          <Ionicons name="download-outline" size={20} color={Colors.white} />
          <Text style={modalStyles.downloadButtonText}>
            Download Certificate
          </Text>
        </TouchableOpacity>

        {/* ── Completed course card ── */}
        <View style={modalStyles.courseCard}>
          <View style={modalStyles.courseCardHeader}>
            <View style={modalStyles.gradCapIcon}>
              <Ionicons name="school" size={22} color={Colors.brand} />
            </View>
            <View style={modalStyles.courseCardTitleRow}>
              <Text style={modalStyles.courseCardTitle}>{cert.title}</Text>
              <Text style={modalStyles.courseCardSubtitle}>
                Completed course
              </Text>
            </View>
          </View>

          {cert.description ? (
            <Text style={modalStyles.courseDescription}>
              {cert.description}
            </Text>
          ) : null}

          {/* Lesson badges */}
          {cert.lessons.length > 0 && (
            <>
              <Text style={modalStyles.lessonsLabel}>Lessons completed</Text>
              <View style={modalStyles.lessonsRow}>
                {cert.lessons.map((lesson, i) => (
                  <View key={i} style={modalStyles.lessonBadge}>
                    <Text style={modalStyles.lessonBadgeText}>{lesson}</Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>

        {/* ── What's next card ── */}
        <View style={modalStyles.whatNextCard}>
          <Text style={modalStyles.whatNextTitle}>What's next?</Text>
          <Text style={modalStyles.whatNextSubtitle}>
            Continue your learning journey or explore more courses.
          </Text>

          <TouchableOpacity
            style={modalStyles.whatNextButton}
            activeOpacity={0.7}
            onPress={() => {
              onClose();
              router.push("/(lessons)/lessons");
            }}
          >
            <Ionicons name="book-outline" size={18} color={Colors.white} />
            <Text style={modalStyles.whatNextButtonText}>Browse lessons</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={modalStyles.whatNextOutlineButton}
            activeOpacity={0.7}
            onPress={() => {
              onClose();
              router.push("/(app)/home");
            }}
          >
            <Ionicons name="home-outline" size={18} color={Colors.brand} />
            <Text style={modalStyles.whatNextOutlineButtonText}>
              Go to home
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Modal>
  );
}

// ── Main screen ────────────────────────────────────────
export default function CertificatesScreen() {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  const studentName =
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") || "Student";

  const toCertificate = (course: CatalogueCourse): Certificate => ({
    id: `DT-${new Date().getFullYear()}-${String(course.id).padStart(5, "0")}`,
    title: course.title,
    description: course.description,
    studentName,
    durationMinutes: course.duration_minutes,
    completedDate: formatCertificateDate(new Date()),
    completedLessons: course.completed_lessons ?? 0,
    totalLessons: course.total_lessons,
    lessons: (course.lessons ?? []).map((l) => l.title),
  });

  const loadData = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setRefreshing(true);
      try {
        const res = await getEnrolledCourses();
        const passed = (res.data ?? []).filter(
          (c) =>
            c.total_lessons > 0 &&
            (c.completed_lessons ?? 0) >= c.total_lessons,
        );
        setCertificates(passed.map(toCertificate));
      } catch {
        // failed to load certificates — keep current state
      } finally {
        setLoading(false);
        if (isRefresh) setRefreshing(false);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [studentName],
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = useCallback(() => {
    loadData(true);
  }, [loadData]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.brand} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {/* Title */}
      <Text style={styles.subtitle}>
        View and download your earned certificates
      </Text>

      {/* Certificate cards */}
      {certificates.map((cert) => (
        <View key={cert.id} style={styles.card}>
          {/* Header row */}
          <View style={styles.cardHeader}>
            <View style={styles.checkIcon}>
              <Ionicons name="checkmark-circle" size={28} color="#10B981" />
            </View>
            <View style={styles.cardHeaderText}>
              <Text style={styles.certName}>{cert.title}</Text>
              <Text style={styles.certId}>{cert.id}</Text>
            </View>
          </View>

          {/* Details */}
          <View style={styles.cardBody}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Lessons completed</Text>
              <Text style={styles.detailValue}>
                {cert.completedLessons}/{cert.totalLessons}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Duration</Text>
              <Text style={styles.detailValue}>
                {formatDuration(cert.durationMinutes)}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Certificate ID</Text>
              <Text style={styles.detailValueMono}>{cert.id}</Text>
            </View>
          </View>

          {/* View certificate link */}
          <TouchableOpacity
            style={styles.viewLink}
            activeOpacity={0.7}
            onPress={() => setSelectedCert(cert)}
          >
            <Ionicons name="eye-outline" size={16} color={Colors.brand} />
            <Text style={styles.viewLinkText}>View certificate</Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* Empty state */}
      {!loading && certificates.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="ribbon-outline" size={48} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>No certificates yet</Text>
          <Text style={styles.emptySubtitle}>
            Complete a course to earn your first certificate.
          </Text>
        </View>
      )}

      {/* Share achievements info */}
      {certificates.length > 0 && (
        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <Ionicons
              name="share-social-outline"
              size={22}
              color={Colors.brand}
            />
          </View>
          <View style={styles.infoText}>
            <Text style={styles.infoTitle}>Share your achievements</Text>
            <Text style={styles.infoSub}>
              Let your network know about your skills. Share your certificates
              on LinkedIn, Twitter, or download them as PDF to include in your
              professional portfolio.
            </Text>
          </View>
        </View>
      )}

      {/* Modal */}
      <CertificateModal
        visible={selectedCert !== null}
        cert={selectedCert}
        onClose={() => setSelectedCert(null)}
      />
    </ScrollView>
  );
}

// ── List styles ────────────────────────────────────────
const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 48,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.white,
  },

  // Title / subtitle
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 20,
  },

  // Certificate card
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  checkIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#ECFDF5",
    alignItems: "center",
    justifyContent: "center",
  },
  cardHeaderText: {
    flex: 1,
  },
  certName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  certId: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 1,
  },

  // Card body
  cardBody: {
    gap: 8,
    marginBottom: 14,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 13,
    color: "#6B7280",
  },
  detailValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },
  detailValueMono: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6B7280",
    fontFamily: "monospace",
  },

  // View link
  viewLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#F5F3FF",
  },
  viewLinkText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.brand,
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

  // Info card
  infoCard: {
    backgroundColor: "#FFFBEB",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#FDE68A",
    padding: 16,
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FEF3C7",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  infoText: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#92400E",
    marginBottom: 4,
  },
  infoSub: {
    fontSize: 13,
    color: "#A16207",
    lineHeight: 19,
  },
});

// ── Modal styles ───────────────────────────────────────
const modalStyles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 48,
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 4,
    marginBottom: 12,
  },

  // ── Certificate (full layout) ──
  certOuter: {
    marginBottom: 16,
  },
  certHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 8,
  },
  yourCertificateLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  certNumber: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    fontFamily: "monospace",
  },
  goldFrame: {
    borderWidth: 6,
    borderColor: "#C9A227",
    borderRadius: 4,
    backgroundColor: "#FFFDF5",
    padding: 6,
  },
  certInner: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#C9A227",
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 18,
    alignItems: "center",
    overflow: "hidden",
  },

  // Kenyan flag corner ribbons
  wavyTopRight: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 140,
    height: 49,
  },
  wavyBottomLeft: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 140,
    height: 49,
    transform: [{ rotate: "180deg" }],
  },

  arms: {
    width: 64,
    height: 64,
    marginBottom: 6,
  },
  republicText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1E3A8A",
    letterSpacing: 2,
    textAlign: "center",
  },
  ministryText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1E3A8A",
    textAlign: "center",
    lineHeight: 16,
    marginTop: 2,
  },
  programText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1E3A8A",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 8,
  },

  nyotaLogo: {
    width: 120,
    height: 77,
    marginBottom: 6,
  },
  certificateTitle: {
    fontFamily: SERIF,
    fontSize: 30,
    fontWeight: "700",
    color: "#A67C00",
    letterSpacing: 4,
    textAlign: "center",
  },
  ofCompletion: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E3A8A",
    letterSpacing: 8,
    textAlign: "center",
    marginTop: 2,
    marginBottom: 14,
  },

  certifyLabel: {
    fontFamily: SERIF,
    fontSize: 14,
    color: "#111827",
    marginBottom: 4,
  },
  studentName: {
    fontFamily: SCRIPT,
    fontSize: 30,
    color: "#111827",
    textAlign: "center",
    marginBottom: 4,
  },
  completedTrainingLabel: {
    fontFamily: SERIF,
    fontSize: 13,
    color: "#374151",
    textAlign: "center",
    marginBottom: 4,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E3A8A",
    textAlign: "center",
    marginBottom: 6,
  },
  heldOn: {
    fontFamily: SERIF,
    fontSize: 13,
    color: "#374151",
    marginBottom: 16,
  },

  // Signatures
  signatureRow: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 12,
    gap: 12,
  },
  signatureCol: {
    flex: 1,
    alignItems: "center",
  },
  signatureLine: {
    width: "100%",
    borderBottomWidth: 1,
    borderStyle: "dotted",
    borderColor: "#6B7280",
    marginBottom: 4,
  },
  signatureLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: 1,
  },
  disclaimer: {
    fontSize: 11,
    fontStyle: "italic",
    color: "#B91C1C",
    textAlign: "center",
  },

  // Download button
  downloadButton: {
    width: "100%",
    backgroundColor: Colors.brand,
    borderRadius: 12,
    paddingVertical: 15,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  downloadButtonText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: "600",
  },

  // ── Completed course card ──
  courseCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
    marginBottom: 16,
  },
  courseCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  gradCapIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#EDE9FE",
    alignItems: "center",
    justifyContent: "center",
  },
  courseCardTitleRow: {
    flex: 1,
  },
  courseCardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  courseCardSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 1,
  },
  courseDescription: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 19,
    marginBottom: 14,
  },

  // Lessons
  lessonsLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  lessonsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  lessonBadge: {
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  lessonBadgeText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#065F46",
  },

  // ── What's next card ──
  whatNextCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
  },
  whatNextTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  whatNextSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 16,
    lineHeight: 18,
  },
  whatNextButton: {
    backgroundColor: Colors.brand,
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 10,
  },
  whatNextButtonText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: "600",
  },
  whatNextOutlineButton: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.brand,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  whatNextOutlineButtonText: {
    color: Colors.brand,
    fontSize: 15,
    fontWeight: "600",
  },
});
