import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import { getLanguage, setLanguage as persistLanguage } from "./storage";

export type Language = "en" | "sw";

interface LanguageState {
  language: Language;
  setLanguage: (language: Language) => Promise<void>;
}

const LanguageContext = createContext<LanguageState | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    restoreLanguage();
  }, []);

  const restoreLanguage = async () => {
    try {
      const stored = await getLanguage();
      if (stored === "en" || stored === "sw") {
        setLanguageState(stored);
      }
    } catch {
      // fall back to default English
    }
  };

  const setLanguage = useCallback(async (next: Language) => {
    setLanguageState(next);
    await persistLanguage(next);
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
