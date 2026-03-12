"use client";

import { createContext, useContext, useState, useCallback } from "react";

type Lang = "fr" | "en";

interface LangContextValue {
  lang: Lang;
  toggle: () => void;
  t: (fr: string, en: string) => string;
}

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("fr");

  const toggle = useCallback(() => {
    setLang((l) => (l === "fr" ? "en" : "fr"));
  }, []);

  const t = useCallback(
    (fr: string, en: string) => (lang === "fr" ? fr : en),
    [lang]
  );

  return (
    <LangContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}
