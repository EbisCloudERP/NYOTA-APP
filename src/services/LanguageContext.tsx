import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import { getLanguage, setLanguage as persistLanguage } from "./storage";
import { translations, type TranslationKey } from "./translations";

export type Language = "en" | "sw";

type TranslateParams = Record<string, string | number>;

interface LanguageState {
  language: Language;
  setLanguage: (language: Language) => Promise<void>;
  t: (key: TranslationKey, params?: TranslateParams) => string;
}

const LanguageContext = createContext<LanguageState | undefined>(undefined);

const interpolate = (template: string, params?: TranslateParams): string => {
  if (!params) return template;
  return Object.keys(params).reduce(
    (result, key) =>
      result.replace(new RegExp(`\\{${key}\\}`, "g"), String(params[key])),
    template,
  );
};

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

  const t = useCallback(
    (key: TranslationKey, params?: TranslateParams) => {
      const template =
        translations[language][key] ?? translations.en[key] ?? key;
      return interpolate(template, params);
    },
    [language],
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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
