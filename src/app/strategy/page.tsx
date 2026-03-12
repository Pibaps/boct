"use client";

import { useState } from "react";
import { useLang } from "@/context/LangContext";
import { playerStrategy, type ContentSection } from "@/data/content";

const SIDE_COLORS = {
  good: { accent: "#2a5fa8", glow: "rgba(42,95,168,0.08)", badge: "rgba(42,95,168,0.2)", border: "rgba(42,95,168,0.3)" },
  evil: { accent: "#8B0000", glow: "rgba(139,0,0,0.08)", badge: "rgba(139,0,0,0.2)", border: "rgba(139,0,0,0.3)" },
};

function SubsectionCard({ sub }: { sub: ContentSection }) {
  const { t } = useLang();
  const [open, setOpen] = useState(false);

  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-200"
      style={{
        background: "rgba(20,8,13,0.4)",
        border: `1px solid ${open ? "rgba(201,168,76,0.2)" : "rgba(139,0,0,0.1)"}`,
      }}
    >
      <button
        className="w-full flex items-center justify-between gap-4 px-5 py-3.5 text-left"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="text-cinzel font-semibold text-sm" style={{ color: "#f4ebd0" }}>
          {t(sub.titleFr, sub.title)}
        </span>
        <span
          className="text-xs transition-transform duration-200 shrink-0"
          style={{ color: "#6b7a8d", transform: open ? "rotate(180deg)" : "rotate(0)" }}
        >
          ▾
        </span>
      </button>
      {open && (
        <div className="px-5 pb-4">
          <div className="h-px mb-3" style={{ background: "rgba(139,0,0,0.15)" }} />
          <p className="text-baskerville leading-relaxed text-sm" style={{ color: "#c9b891" }}>
            {t(sub.contentFr, sub.content)}
          </p>
        </div>
      )}
    </div>
  );
}

function StrategyPanel({
  section,
  colors,
}: {
  section: ContentSection;
  colors: (typeof SIDE_COLORS)["good"];
}) {
  const { t } = useLang();

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: `rgba(20,8,13,0.55)`,
        border: `1px solid ${colors.border}`,
        boxShadow: `0 0 40px ${colors.glow}`,
      }}
    >
      <div
        className="px-7 py-6 border-b"
        style={{
          background: `${colors.badge}`,
          borderColor: colors.border,
        }}
      >
        <h2 className="text-cinzel font-black text-xl" style={{ color: colors.accent }}>
          {t(section.titleFr, section.title)}
        </h2>
        <p className="text-baskerville mt-2 text-sm leading-relaxed" style={{ color: "#c9b891" }}>
          {t(section.contentFr, section.content)}
        </p>
      </div>

      {section.subsections && section.subsections.length > 0 && (
        <div className="px-7 py-6 space-y-3">
          {section.subsections.map((sub) => (
            <SubsectionCard key={sub.id} sub={sub} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function StrategyPage() {
  const { t } = useLang();
  const [activeTab, setActiveTab] = useState<"all" | "good" | "evil">("all");

  // Assume first half is Good, second half is Evil (or detect by title)
  const goodSections = playerStrategy.filter((s) =>
    s.id.includes("good") || s.title.toLowerCase().includes("good") || s.titleFr.toLowerCase().includes("bien") || s.titleFr.toLowerCase().includes("villageois") || s.titleFr.toLowerCase().includes("étranger")
  );
  const evilSections = playerStrategy.filter((s) =>
    s.id.includes("evil") || s.title.toLowerCase().includes("evil") || s.titleFr.toLowerCase().includes("mal") || s.titleFr.toLowerCase().includes("sbire") || s.titleFr.toLowerCase().includes("démon")
  );

  // Fallback: split by index if neither matched
  const goodList = goodSections.length > 0 ? goodSections : playerStrategy.slice(0, Math.ceil(playerStrategy.length / 2));
  const evilList = evilSections.length > 0 ? evilSections : playerStrategy.slice(Math.ceil(playerStrategy.length / 2));

  const visibleGood = activeTab === "evil" ? [] : goodList;
  const visibleEvil = activeTab === "good" ? [] : evilList;

  return (
    <div style={{ background: "#0a0506", minHeight: "100dvh" }}>
      {/* Header */}
      <div
        className="pt-32 pb-16 px-6 text-center relative overflow-hidden"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(42,95,168,0.05) 0%, transparent 50%), radial-gradient(ellipse at 50% 0%, rgba(139,0,0,0.05) 30%, transparent 70%)" }}
      >
        <p className="text-xs tracking-widest uppercase text-cinzel mb-4" style={{ color: "#8B0000" }}>
          {t("Tactiques", "Tactics")}
        </p>
        <h1
          className="text-cinzel font-black mb-4"
          style={{ fontSize: "clamp(2rem, 5vw, 4rem)", color: "#f4ebd0" }}
        >
          {t("Stratégie", "Strategy")}
        </h1>
        <p className="text-baskerville max-w-xl mx-auto" style={{ color: "#c9b891" }}>
          {t(
            "Conseils et tactiques pour jouer dans le camp des Gentils ou des Maléfiques — bluff, déduction et manipulation.",
            "Tips and tactics for playing on the Good or Evil side — bluffing, deduction, and manipulation."
          )}
        </p>

        {/* Side filter */}
        <div className="mt-8 inline-flex rounded-xl overflow-hidden" style={{ border: "1px solid rgba(139,0,0,0.2)" }}>
          {[
            { id: "all" as const, labelFr: "Les deux camps", labelEn: "Both sides" },
            { id: "good" as const, labelFr: "Gentils", labelEn: "Good" },
            { id: "evil" as const, labelFr: "Maléfiques", labelEn: "Evil" },
          ].map(({ id, labelFr, labelEn }, i) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className="px-5 py-2.5 text-cinzel text-xs tracking-widest uppercase transition-all duration-200"
              style={{
                background: activeTab === id ? "rgba(139,0,0,0.3)" : "rgba(20,8,13,0.6)",
                color:
                  activeTab === id
                    ? id === "good"
                      ? "#7fb3e8"
                      : id === "evil"
                      ? "#ff8080"
                      : "#f4ebd0"
                    : "#6b7a8d",
                borderRight: i < 2 ? "1px solid rgba(139,0,0,0.2)" : undefined,
              }}
            >
              {t(labelFr, labelEn)}
            </button>
          ))}
        </div>
      </div>

      {/* Dual-column layout */}
      <div className="px-6 pb-24">
        <div
          className={`max-w-6xl mx-auto ${
            activeTab === "all" ? "grid grid-cols-1 lg:grid-cols-2 gap-8" : "max-w-3xl mx-auto space-y-6"
          }`}
        >
          {/* Good column */}
          {visibleGood.length > 0 && (
            <div className="space-y-6">
              {activeTab === "all" && (
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-px flex-1" style={{ background: "rgba(42,95,168,0.2)" }} />
                  <span className="text-xs text-cinzel tracking-widest uppercase" style={{ color: "#2a5fa8" }}>
                    {t("Camp des Gentils", "Good Side")}
                  </span>
                  <div className="h-px flex-1" style={{ background: "rgba(42,95,168,0.2)" }} />
                </div>
              )}
              {visibleGood.map((section) => (
                <StrategyPanel key={section.id} section={section} colors={SIDE_COLORS.good} />
              ))}
            </div>
          )}

          {/* Evil column */}
          {visibleEvil.length > 0 && (
            <div className="space-y-6">
              {activeTab === "all" && (
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-px flex-1" style={{ background: "rgba(139,0,0,0.2)" }} />
                  <span className="text-xs text-cinzel tracking-widest uppercase" style={{ color: "#8B0000" }}>
                    {t("Camp des Maléfiques", "Evil Side")}
                  </span>
                  <div className="h-px flex-1" style={{ background: "rgba(139,0,0,0.2)" }} />
                </div>
              )}
              {visibleEvil.map((section) => (
                <StrategyPanel key={section.id} section={section} colors={SIDE_COLORS.evil} />
              ))}
            </div>
          )}

          {/* Fallback: if no categorization matched, show all */}
          {visibleGood.length === 0 && visibleEvil.length === 0 && (
            <div className="col-span-2 space-y-6">
              {playerStrategy.map((section) => (
                <StrategyPanel key={section.id} section={section} colors={SIDE_COLORS.good} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
