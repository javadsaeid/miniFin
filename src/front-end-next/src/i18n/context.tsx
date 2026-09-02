"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import en from "./en.json";
import fa from "./fa.json";

export type Locale = "en" | "fa";

const translations: Record<Locale, Record<string, any>> = { en, fa };

interface I18nContextType {
  locale: Locale;
  dir: "ltr" | "rtl";
  setLocale: (l: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

function getNestedValue(obj: any, path: string): string | undefined {
  return path.split(".").reduce((acc, part) => acc?.[part], obj);
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const saved = localStorage.getItem("minifin-locale") as Locale;
    if (saved && (saved === "en" || saved === "fa")) {
      setLocaleState(saved);
      document.documentElement.dir = saved === "fa" ? "rtl" : "ltr";
      document.documentElement.lang = saved;
    }
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("minifin-locale", l);
    document.documentElement.dir = l === "fa" ? "rtl" : "ltr";
    document.documentElement.lang = l;
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    let value: string | undefined = getNestedValue(translations[locale], key);
    if (value === undefined) {
      value = getNestedValue(translations.en, key);
    }
    if (value === undefined) {
      return key;
    }
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        value = value!.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
      });
    }
    return value;
  };

  return (
    <I18nContext.Provider value={{ locale, dir: locale === "fa" ? "rtl" : "ltr", setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useTranslation must be used within I18nProvider");
  }
  return ctx;
}
