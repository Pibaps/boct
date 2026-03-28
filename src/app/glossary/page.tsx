"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useLang } from "@/context/LangContext";
import { isMobileBuild } from "@/config/buildMode";
import { glossary, glossaryByCategory, categoryLabels, type GlossaryTerm } from "@/data/glossary";
import IconLegend, { type IconLegendItem } from "@/components/IconLegend";

const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function TermCard({ term }: { term: GlossaryTerm }) {
  const { t, lang } = useLang();
  const [open, setOpen] = useState(false);

  const name = lang === "fr" ? term.termFr : term.term;
  const def = lang === "fr" ? term.definitionFr : term.definition;

  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-200"
      style={{
        background: "rgba(20,8,13,0.5)",
        border: `1px solid ${open ? "rgba(201,168,76,0.25)" : "rgba(139,0,0,0.12)"}`,
      }}
    >
      <button
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <div
            className="relative w-10 h-10 rounded-full shrink-0 overflow-hidden flex items-center justify-center p-1"
            style={{
              background: term.icon ? "rgba(20,8,13,0.7)" : "rgba(139,0,0,0.15)",
              border: `1px solid ${term.icon ? "rgba(201,168,76,0.2)" : "rgba(139,0,0,0.15)"}`,
              overflow: "visible",
            }}
          >
            {term.icon ? (
              <Image
                src={term.icon.src}
                alt={term.icon.alt}
                fill
                sizes={term.icon?.src?.includes("/coeur.png") ? "48px" : "32px"}
                className="object-contain"
                style={term.icon?.src?.includes("/coeur.png") ? { transform: "scale(1.5)", transformOrigin: "center" } : undefined}
              />
            ) : (
              <span className="text-cinzel text-xs" style={{ color: "#8B0000", fontWeight: 700 }}>
                {name[0]?.toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <span className="text-cinzel font-semibold" style={{ color: "#f4ebd0", fontSize: "0.95rem" }}>
              {name}
            </span>
            {term.term !== term.termFr && (
              <span className="ml-2 text-xs" style={{ color: "#6b7a8d" }}>
                {lang === "fr" ? term.term : term.termFr}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className="text-mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded"
            style={{
              background: "rgba(20,8,13,0.6)",
              border: "1px solid rgba(139,0,0,0.2)",
              color: "#6b7a8d",
            }}
          >
            {t(
              categoryLabels[term.category]?.fr ?? term.category,
              categoryLabels[term.category]?.en ?? term.category)}
          </span>
          <span
            className="text-sm transition-transform duration-200"
            style={{ color: "#6b7a8d", transform: open ? "rotate(180deg)" : "rotate(0)" }}
          >
            ▾
          </span>
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5">
          <div className="h-px mb-4" style={{ background: "rgba(139,0,0,0.2)" }} />
          <p className="text-baskerville leading-relaxed" style={{ color: "#c9b891", fontSize: "0.93rem" }}>
            {def}
          </p>
        </div>
      )}
    </div>
  );
}

export default function GlossaryPage() {
  const { t, lang } = useLang();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeLetter, setActiveLetter] = useState<string>("all");

  const iconLegendItems: IconLegendItem[] = useMemo(
    () =>
      glossary
        .filter((term) => term.icon)
        .map((term) => ({
          labelFr: term.termFr,
          labelEn: term.term,
          descriptionFr: term.definitionFr,
          descriptionEn: term.definition,
          color: "#c9a84c",
          icon: term.icon,
        }))
        .slice(0, 12),
    []
  );

  const filtered = useMemo(() => {
    return glossary.filter((term) => {
      const name = lang === "fr" ? term.termFr : term.term;
      const def = lang === "fr" ? term.definitionFr : term.definition;

      if (search && !name.toLowerCase().includes(search.toLowerCase()) && !def.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (activeCategory !== "all" && term.category !== activeCategory) {
        return false;
      }
      if (activeLetter !== "all" && !name.toUpperCase().startsWith(activeLetter)) {
        return false;
      }
      return true;
    });
  }, [search, activeCategory, activeLetter, lang]);

  const presentLetters = new Set(
    glossary.map((term) => (lang === "fr" ? term.termFr : term.term)[0]?.toUpperCase())
  );

  const categories = Object.keys(glossaryByCategory(glossary));

  return (
    <div style={{ background: "#0a0506", minHeight: "100dvh" }}>
      {/* Header */}
      <div
        className={`text-center relative overflow-hidden ${isMobileBuild ? "pt-24 pb-10 px-4" : "pt-32 pb-16 px-6"}`}
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.06) 0%, transparent 70%)" }}
      >
        <p className="text-xs tracking-widest uppercase text-cinzel mb-4" style={{ color: "#8B0000" }}>
          {t("Référence", "Reference")}
        </p>
        <h1
          className="text-cinzel font-black mb-4"
          style={{ fontSize: "clamp(2rem, 5vw, 4rem)", color: "#f4ebd0" }}
        >
          {t("Glossaire", "Glossary")}
        </h1>
        <p className="text-baskerville max-w-xl mx-auto" style={{ color: "#c9b891" }}>
          {t(
            "Tous les termes essentiels de Blood on the Clocktower, de l'état Empoisonné aux Voyageurs.",
            "All the essential terms in Blood on the Clocktower, from the Poisoned state to Travellers."
          )}
        </p>

        {/* Search */}
        <div className="mt-8 max-w-md mx-auto relative">
          <span
            className="absolute left-4 top-1/2 -translate-y-1/2 text-sm"
            style={{ color: "#6b7a8d" }}
          >
            ⌕
          </span>
          <input
            className={`w-full pl-10 pr-4 rounded-xl text-sm text-baskerville ${isMobileBuild ? "py-3.5" : "py-3"}`}
            style={{
              background: "rgba(20,8,13,0.7)",
              border: "1px solid rgba(201,168,76,0.15)",
              color: "#f4ebd0",
              outline: "none",
            }}
            placeholder={t("Rechercher un terme…", "Search a term…")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className={isMobileBuild ? "px-4 pb-28" : "px-6 pb-24"}>
        <div className="max-w-4xl mx-auto">
          {/* Category tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setActiveCategory("all")}
              className={`rounded-full text-cinzel text-xs tracking-widest uppercase transition-all duration-200 ${isMobileBuild ? "px-4 py-2.5 min-h-10" : "px-4 py-1.5"}`}
              style={{
                background: activeCategory === "all" ? "rgba(139,0,0,0.25)" : "rgba(20,8,13,0.5)",
                border: `1px solid ${activeCategory === "all" ? "rgba(139,0,0,0.5)" : "rgba(139,0,0,0.15)"}`,
                color: activeCategory === "all" ? "#f4ebd0" : "#6b7a8d",
              }}
            >
              {t("Tous", "All")}
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full text-cinzel text-xs tracking-widest uppercase transition-all duration-200 ${isMobileBuild ? "px-4 py-2.5 min-h-10" : "px-4 py-1.5"}`}
                style={{
                  background: activeCategory === cat ? "rgba(139,0,0,0.25)" : "rgba(20,8,13,0.5)",
                  border: `1px solid ${activeCategory === cat ? "rgba(139,0,0,0.5)" : "rgba(139,0,0,0.15)"}`,
                  color: activeCategory === cat ? "#f4ebd0" : "#6b7a8d",
                }}
              >
                {t(
                  categoryLabels[cat]?.fr ?? cat,
                  categoryLabels[cat]?.en ?? cat)}
              </button>
            ))}
          </div>

          {/* Alphabet bar */}
          <div className={`flex flex-wrap gap-1 mb-8 ${isMobileBuild ? "justify-center" : ""}`}>
            {!isMobileBuild && (
            <button
              onClick={() => setActiveLetter("all")}
              className="w-8 h-8 rounded text-cinzel text-xs font-bold transition-all duration-150"
              style={{
                background: activeLetter === "all" ? "rgba(139,0,0,0.3)" : "rgba(20,8,13,0.4)",
                border: `1px solid ${activeLetter === "all" ? "rgba(139,0,0,0.5)" : "rgba(139,0,0,0.1)"}`,
                color: activeLetter === "all" ? "#c9a84c" : "#6b7a8d",
              }}
            >
              #
            </button>
            )}
            {ALPHA.map((letter) => {
              const has = presentLetters.has(letter);
              if (isMobileBuild && !has) {
                return null;
              }
              return (
                <button
                  key={letter}
                  disabled={!has}
                  onClick={() => has && setActiveLetter(letter)}
                  className="w-8 h-8 rounded text-cinzel text-xs font-bold transition-all duration-150"
                  style={{
                    background:
                      activeLetter === letter
                        ? "rgba(139,0,0,0.3)"
                        : has
                        ? "rgba(20,8,13,0.4)"
                        : "transparent",
                    border: `1px solid ${
                      activeLetter === letter
                        ? "rgba(139,0,0,0.5)"
                        : has
                        ? "rgba(139,0,0,0.1)"
                        : "transparent"
                    }`,
                    color: activeLetter === letter ? "#c9a84c" : has ? "#f4ebd0" : "#2a1a1a",
                    cursor: has ? "pointer" : "default",
                  }}
                >
                  {letter}
                </button>
              );
            })}
          </div>

          {/* Results */}
          {filtered.length === 0 ? (
            <div className="text-center py-16" style={{ color: "#6b7a8d" }}>
              <p className="text-cinzel text-lg mb-2">{t("Aucun terme trouvé", "No terms found")}</p>
              <p className="text-sm">{t("Essayez une autre recherche.", "Try a different search.")}</p>
            </div>
          ) : (
            <>
              <p className="text-xs text-cinzel tracking-widest uppercase mb-4" style={{ color: "#6b7a8d" }}>
                {filtered.length} {t("terme(s)", "term(s)")}
              </p>
              <div className="space-y-3">
                {filtered.map((term) => (
                  <TermCard key={term.id} term={term} />
                ))}
              </div>
            </>
          )}

          <div className="mt-10">
            <IconLegend titleFr="Icônes du glossaire" titleEn="Glossary Icons" items={iconLegendItems} />
          </div>
        </div>
      </div>
    </div>
  );
}


