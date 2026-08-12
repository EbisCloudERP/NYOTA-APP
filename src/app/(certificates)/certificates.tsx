import Ionicons from "@react-native-vector-icons/ionicons";
import { router } from "expo-router";
import { useState } from "react";
import {
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Colors } from "../../theme/colors";

// ── Types ──────────────────────────────────────────────
interface Certificate {
  id: string;
  name: string;
  courseName: string;
  courseDescription: string;
  studentName: string;
  instructor: string;
  duration: string;
  lessons: string[];
  issueDate: Date;
  expiryDate: Date;
}

// ── Dummy data ─────────────────────────────────────────
const CERTIFICATES: Certificate[] = [
  {
    id: "CERT-2026-001234",
    name: "Financial Planning Fundamentals",
    courseName: "Introduction to Financial Planning",
    courseDescription:
      "Master the core principles of financial planning including goal setting, budgeting, risk management, and investment strategies.",
    studentName: "Joab Ochieng",
    instructor: "Jane Muthoni",
    duration: "2 hours",
    lessons: [
      "Setting SMART Financial Goals",
      "Understanding Your Current Position",
      "Creating a Budget",
      "Building an Emergency Fund",
      "Risk Management & Insurance",
    ],
    issueDate: new Date("2026-08-10"),
    expiryDate: new Date("2028-08-10"),
  },
  {
    id: "CERT-2026-001289",
    name: "Public Procurement Basics",
    courseName: "Introduction to Public Procurement",
    courseDescription:
      "Learn the fundamentals of public procurement processes, AGPO requirements, tender documentation, and compliance standards.",
    studentName: "Joab Ochieng",
    instructor: "Peter Kimani",
    duration: "3 hours",
    lessons: [
      "Procurement Principles",
      "AGPO Registration Process",
      "Tender Document Preparation",
      "Bid Evaluation & Award",
      "Compliance & Ethics",
      "Contract Management",
    ],
    issueDate: new Date("2026-07-22"),
    expiryDate: new Date("2028-07-22"),
  },
];

// ── Helpers ────────────────────────────────────────────
function fmt(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
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

        {/* ── Congrats card ── */}
        <View style={modalStyles.congratsCard}>
          <View style={modalStyles.verifiedBadge}>
            <Ionicons name="shield-checkmark" size={14} color="#065F46" />
            <Text style={modalStyles.verifiedBadgeText}>
              Verified Certificate
            </Text>
          </View>

          <Image
            source={require("../../../assets/images/NYOTA.jpg")}
            style={modalStyles.nyotaImage}
            resizeMode="cover"
          />

          <Text style={modalStyles.congratsTitle}>Congratulations!</Text>
          <Text style={modalStyles.congratsSubtitle}>
            Your certificate is ready to download and share.
          </Text>
        </View>

        {/* ── Certificate card (with border) ── */}
        <View style={modalStyles.certCard}>
          {/* Nyota + Completion badge */}
          <Image
            source={require("../../../assets/images/NYOTA.jpg")}
            style={modalStyles.certNyotaImage}
            resizeMode="cover"
          />
          <View style={modalStyles.completionBadge}>
            <Ionicons name="shield-checkmark" size={16} color={Colors.brand} />
          </View>
          <Text style={modalStyles.completionTitle}>
            CERTIFICATE OF COMPLETION
          </Text>

          <View style={modalStyles.certDivider} />

          <Text style={modalStyles.awardedTo}>
            This certificate is awarded to
          </Text>
          <Text style={modalStyles.studentName}>{cert.studentName}</Text>

          <Text style={modalStyles.forCompleting}>
            for successfully completing
          </Text>
          <Text style={modalStyles.courseName}>{cert.courseName}</Text>

          {/* Certificate details */}
          <View style={modalStyles.metaRow}>
            <View style={modalStyles.metaItem}>
              <Ionicons name="calendar-outline" size={16} color="#6B7280" />
              <Text style={modalStyles.metaLabel}>Issued</Text>
              <Text style={modalStyles.metaValue}>{fmt(cert.issueDate)}</Text>
            </View>
            <View style={modalStyles.metaItem}>
              <Ionicons name="person-outline" size={16} color="#6B7280" />
              <Text style={modalStyles.metaLabel}>Instructor</Text>
              <Text style={modalStyles.metaValue}>{cert.instructor}</Text>
            </View>
            <View style={modalStyles.metaItem}>
              <Ionicons name="time-outline" size={16} color="#6B7280" />
              <Text style={modalStyles.metaLabel}>Duration</Text>
              <Text style={modalStyles.metaValue}>{cert.duration}</Text>
            </View>
          </View>

          {/* Certificate ID */}
          <View style={modalStyles.certIdContainer}>
            <Text style={modalStyles.certIdLabel}>Certificate ID</Text>
            <Text style={modalStyles.certIdValue}>{cert.id}</Text>
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
              <Text style={modalStyles.courseCardTitle}>{cert.courseName}</Text>
              <Text style={modalStyles.courseCardSubtitle}>
                Completed course
              </Text>
            </View>
          </View>

          <Text style={modalStyles.courseDescription}>
            {cert.courseDescription}
          </Text>

          {/* Lesson badges */}
          <Text style={modalStyles.lessonsLabel}>Lessons completed</Text>
          <View style={modalStyles.lessonsRow}>
            {cert.lessons.map((lesson, i) => (
              <View key={i} style={modalStyles.lessonBadge}>
                <Text style={modalStyles.lessonBadgeText}>{lesson}</Text>
              </View>
            ))}
          </View>

          <View style={modalStyles.completionDate}>
            <Ionicons name="calendar-outline" size={14} color="#6B7280" />
            <Text style={modalStyles.completionDateText}>
              Completed on {fmt(cert.issueDate)}
            </Text>
          </View>
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
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Title */}
      {/* <Text style={styles.title}>My Certificates</Text> */}
      <Text style={styles.subtitle}>
        View and download your earned certificates
      </Text>

      {/* Certificate cards */}
      {CERTIFICATES.map((cert) => (
        <View key={cert.id} style={styles.card}>
          {/* Header row */}
          <View style={styles.cardHeader}>
            <View style={styles.checkIcon}>
              <Ionicons name="checkmark-circle" size={28} color="#10B981" />
            </View>
            <View style={styles.cardHeaderText}>
              <Text style={styles.certName}>{cert.name}</Text>
              <Text style={styles.certId}>{cert.id}</Text>
            </View>
          </View>

          {/* Details */}
          <View style={styles.cardBody}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Course completed</Text>
              <Text style={styles.detailValue}>{cert.courseName}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Issue date</Text>
              <Text style={styles.detailValue}>{fmt(cert.issueDate)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Expiry date</Text>
              <Text style={styles.detailValue}>{fmt(cert.expiryDate)}</Text>
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

      {/* Share achievements info */}
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
            Let your network know about your skills. Share your certificates on
            LinkedIn, Twitter, or download them as PDF to include in your
            professional portfolio.
          </Text>
        </View>
      </View>

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

  // ── Congrats card ──
  congratsCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
  },
  certCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.brand,
    padding: 24,
    alignItems: "center",
    marginBottom: 16,
  },

  // Verified badge
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 10,
  },
  verifiedBadgeText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#065F46",
  },

  // Nyota image
  nyotaImage: {
    width: 150,
    height: 96,
    marginBottom: 8,
    borderRadius: 16,
  },

  // Congrats
  congratsTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.brand,
    marginBottom: 4,
  },
  congratsSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 0,
  },

  certDivider: {
    width: "80%",
    height: 1,
    backgroundColor: "#E5E7EB",
    marginBottom: 16,
  },

  // Cert Nyota + completion
  certNyotaImage: {
    width: 120,
    height: 80,
    marginBottom: 10,
    borderRadius: 14,
  },
  completionBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EDE9FE",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  completionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.brand,
    letterSpacing: 1.5,
    marginBottom: 12,
  },

  // Student / course
  awardedTo: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  studentName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  forCompleting: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  courseName: {
    fontSize: 17,
    fontWeight: "600",
    color: Colors.brand,
    textAlign: "center",
    marginBottom: 20,
  },

  // Meta info
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 16,
  },
  metaItem: {
    alignItems: "center",
    gap: 2,
  },
  metaLabel: {
    fontSize: 11,
    color: "#9CA3AF",
    textTransform: "uppercase",
    marginTop: 2,
  },
  metaValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },

  // Certificate ID
  certIdContainer: {
    alignItems: "center",
    backgroundColor: "#EDE9FE",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  certIdLabel: {
    fontSize: 11,
    color: "#7C3AED",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  certIdValue: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.brand,
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
    marginBottom: 14,
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

  // Completion date
  completionDate: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  completionDateText: {
    fontSize: 13,
    color: "#6B7280",
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
