import Ionicons from "@react-native-vector-icons/ionicons";
import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from "react";
import {
    Animated,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Colors } from "../theme/colors";
import { useLanguage } from "./LanguageContext";

type ToastType = "success" | "error" | "info";

interface ConfirmOptions {
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
}

interface FeedbackValue {
  showToast: (message: string, type?: ToastType) => void;
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const FeedbackContext = createContext<FeedbackValue | undefined>(undefined);

const TOAST_META: Record<
  ToastType,
  { icon: string; bg: string; fg: string; border: string }
> = {
  success: {
    icon: "checkmark-circle",
    bg: "#ECFDF5",
    fg: "#065F46",
    border: "#A7F3D0",
  },
  error: {
    icon: "alert-circle",
    bg: "#FEF2F2",
    fg: "#991B1B",
    border: "#FECACA",
  },
  info: {
    icon: "information-circle",
    bg: "#F5F3FF",
    fg: Colors.brand,
    border: "#EDE9FE",
  },
};

interface ToastState {
  id: number;
  message: string;
  type: ToastType;
}

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const { t } = useLanguage();
  const [toast, setToast] = useState<ToastState | null>(null);
  const [confirmState, setConfirmState] = useState<
    (ConfirmOptions & { resolve: (value: boolean) => void }) | null
  >(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-24)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback(
    (message: string, type: ToastType = "info") => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setToast({ id: Date.now(), message, type });
      opacity.setValue(0);
      translateY.setValue(-24);
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
      timerRef.current = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: -24,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => setToast(null));
      }, 3200);
    },
    [opacity, translateY],
  );

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setConfirmState({ ...options, resolve });
    });
  }, []);

  const resolveConfirm = useCallback(
    (value: boolean) => {
      confirmState?.resolve(value);
      setConfirmState(null);
    },
    [confirmState],
  );

  const value = useMemo(() => ({ showToast, confirm }), [showToast, confirm]);

  const meta = toast ? TOAST_META[toast.type] : TOAST_META.info;

  return (
    <FeedbackContext.Provider value={value}>
      <>
        <View style={styles.root}>
          {children}
          {toast && (
            <Animated.View
              pointerEvents="none"
              style={[
                styles.toast,
                {
                  backgroundColor: meta.bg,
                  borderColor: meta.border,
                  opacity,
                  transform: [{ translateY }],
                },
              ]}
            >
              <Ionicons name={meta.icon as any} size={20} color={meta.fg} />
              <Text style={[styles.toastText, { color: meta.fg }]}>
                {toast.message}
              </Text>
            </Animated.View>
          )}
        </View>

        <Modal
          visible={confirmState !== null}
          transparent
          animationType="fade"
          onRequestClose={() => resolveConfirm(false)}
        >
          <View style={styles.overlay}>
            <View style={styles.confirmCard}>
              <View style={styles.confirmIconWrap}>
                <Ionicons
                  name={
                    confirmState?.destructive
                      ? "warning-outline"
                      : "help-circle-outline"
                  }
                  size={24}
                  color={confirmState?.destructive ? "#DC2626" : Colors.brand}
                />
              </View>
              <Text style={styles.confirmTitle}>{confirmState?.title}</Text>
              {confirmState?.message ? (
                <Text style={styles.confirmMessage}>
                  {confirmState.message}
                </Text>
              ) : null}
              <View style={styles.confirmActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  activeOpacity={0.7}
                  onPress={() => resolveConfirm(false)}
                >
                  <Text style={styles.cancelButtonText}>
                    {confirmState?.cancelText ?? t("common.cancel")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.confirmButton,
                    confirmState?.destructive &&
                      styles.confirmButtonDestructive,
                  ]}
                  activeOpacity={0.7}
                  onPress={() => resolveConfirm(true)}
                >
                  <Text style={styles.confirmButtonText}>
                    {confirmState?.confirmText ?? t("common.confirm")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </>
    </FeedbackContext.Provider>
  );
}

export function useFeedback() {
  const ctx = useContext(FeedbackContext);
  if (!ctx) throw new Error("useFeedback must be used within FeedbackProvider");
  return ctx;
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  toast: {
    position: "absolute",
    top: 60,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    zIndex: 1000,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  toastText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(17, 24, 39, 0.45)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  confirmCard: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 24,
    alignItems: "center",
  },
  confirmIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F5F3FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  confirmTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 6,
  },
  confirmMessage: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  confirmActions: {
    flexDirection: "row",
    gap: 10,
    alignSelf: "stretch",
  },
  cancelButton: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
  },
  confirmButton: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: Colors.brand,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButtonDestructive: {
    backgroundColor: "#DC2626",
  },
  confirmButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
