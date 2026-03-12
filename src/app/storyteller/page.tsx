"use client";

import { useState } from "react";
import { useLang } from "@/context/LangContext";
import { storytellerAdvice, type ContentSection } from "@/data/content";

function ArticleSection({ section, depth = 0 }: { section: ContentSection; depth?: number }) {
  const { t } = useLang();

  return (
    <div style={{ marginLeft: depth > 0 ? "1.5rem" : "0" }}>
      <h3
        className="text-cinzel font-bold mb-3"
        style={{
          fontSize: depth === 0 ? "1.1rem" : "0.95rem",
          color: depth === 0 ? "#c9a84c" : "#f4ebd0",
        }}
      >
        {t(section.titleFr, section.title)}
      </h3>
      <p className="text-baskerville leading-relaxed mb-4" style={{ color: "#c9b891", fontSize: "0.93rem" }}>
        {t(section.contentFr, section.content)}
      </p>
      {section.subsections?.map((sub) => (
        <ArticleSection key={sub.id} section={sub} depth={depth + 1} />
      ))}
    </div>
  );
}

function WizardStep({
  section,
  index,
  total,
  onNext,
  onPrev,
}: {
  section: ContentSection;
  index: number;
  total: number;
  onNext: () => void;
  onPrev: () => void;
}) {
  const { t } = useLang();

  return (
    <div
      className="rounded-2xl p-8"
      style={{
        background: "rgba(20,8,13,0.6)",
        border: "1px solid rgba(201,168,76,0.15)",
      }}
    >
      {/* Progress */}
      <div className="flex items-center gap-3 mb-8">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{
              background: i <= index ? "rgba(139,0,0,0.7)" : "rgba(139,0,0,0.15)",
            }}
          />
        ))}
      </div>

      <p className="text-xs text-cinzel tracking-widest uppercase mb-3" style={{ color: "#8B0000" }}>
        {t(`Étape ${index + 1} / ${total}`, `Step ${index + 1} / ${total}`)}
      </p>

      <h2 className="text-cinzel font-bold text-2xl mb-5" style={{ color: "#f4ebd0" }}>
        {t(section.titleFr, section.title)}
      </h2>

      <p className="text-baskerville leading-relaxed mb-8" style={{ color: "#c9b891", fontSize: "0.97rem" }}>
        {t(section.contentFr, section.content)}
      </p>

      {section.subsections && section.subsections.length > 0 && (
        <div className="space-y-4 mb-8">
          {section.subsections.map((sub) => (
            <div
              key={sub.id}
              className="rounded-xl p-4"
              style={{
                background: "rgba(20,8,13,0.4)",
                border: "1px solid rgba(139,0,0,0.12)",
              }}
            >
              <p className="text-cinzel text-sm font-semibold mb-2" style={{ color: "#c9a84c" }}>
                {t(sub.titleFr, sub.title)}
              </p>
              <p className="text-baskerville text-sm leading-relaxed" style={{ color: "#c9b891" }}>
                {t(sub.contentFr, sub.content)}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Nav buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={onPrev}
          disabled={index === 0}
          className="px-5 py-2.5 rounded-lg text-cinzel text-sm tracking-wide transition-all duration-200"
          style={{
            background: index === 0 ? "transparent" : "rgba(20,8,13,0.6)",
            border: `1px solid ${index === 0 ? "transparent" : "rgba(139,0,0,0.3)"}`,
            color: index === 0 ? "#2a1a1a" : "#c9b891",
            cursor: index === 0 ? "default" : "pointer",
          }}
        >
          ← {t("Précédent", "Previous")}
        </button>

        {index < total - 1 ? (
          <button
            onClick={onNext}
            className="px-6 py-2.5 rounded-lg text-cinzel text-sm tracking-wide transition-all duration-200"
            style={{
              background: "rgba(139,0,0,0.25)",
              border: "1px solid rgba(139,0,0,0.4)",
              color: "#f4ebd0",
            }}
          >
            {t("Suivant", "Next")} →
          </button>
        ) : (
          <div
            className="px-6 py-2.5 rounded-lg text-cinzel text-sm tracking-wide"
            style={{
              background: "rgba(201,168,76,0.1)",
              border: "1px solid rgba(201,168,76,0.3)",
              color: "#c9a84c",
            }}
          >
            ✓ {t("Terminé", "Complete")}
          </div>
        )}
      </div>
    </div>
  );
}

export default function StorytellerPage() {
  const { t } = useLang();
  const [mode, setMode] = useState<"wizard" | "article">("wizard");
  const [step, setStep] = useState(0);

  return (
    <div style={{ background: "#0a0506", minHeight: "100dvh" }}>
      {/* Header */}
      <div
        className="pt-32 pb-16 px-6 text-center relative overflow-hidden"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(139,0,0,0.07) 0%, transparent 70%)" }}
      >
        <p className="text-xs tracking-widest uppercase text-cinzel mb-4" style={{ color: "#8B0000" }}>
          {t("Guide du Conteur", "Storyteller Guide")}
        </p>
        <h1
          className="text-cinzel font-black mb-4"
          style={{ fontSize: "clamp(2rem, 5vw, 4rem)", color: "#f4ebd0" }}
        >
          {t("L'Art de Conter", "The Art of Storytelling")}
        </h1>
        <p className="text-baskerville max-w-xl mx-auto" style={{ color: "#c9b891" }}>
          {t(
            "Maîtrisez l'art de mener une partie de Blood on the Clocktower — de la préparation à la révélation finale.",
            "Master the art of running a game of Blood on the Clocktower — from setup to the final reveal."
          )}
        </p>

        {/* Mode toggle */}
        <div className="mt-8 inline-flex rounded-xl overflow-hidden" style={{ border: "1px solid rgba(139,0,0,0.2)" }}>
          {[
            { id: "wizard" as const, labelFr: "Pas à pas", labelEn: "Step by Step" },
            { id: "article" as const, labelFr: "Article", labelEn: "Article" },
          ].map(({ id, labelFr, labelEn }) => (
            <button
              key={id}
              onClick={() => setMode(id)}
              className="px-6 py-2.5 text-cinzel text-xs tracking-widest uppercase transition-all duration-200"
              style={{
                background: mode === id ? "rgba(139,0,0,0.3)" : "rgba(20,8,13,0.6)",
                color: mode === id ? "#f4ebd0" : "#6b7a8d",
                borderRight: id === "wizard" ? "1px solid rgba(139,0,0,0.2)" : undefined,
              }}
            >
              {t(labelFr, labelEn)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-24">
        <div className="max-w-3xl mx-auto">
          {mode === "wizard" ? (
            <WizardStep
              section={storytellerAdvice[step]}
              index={step}
              total={storytellerAdvice.length}
              onNext={() => setStep((s) => Math.min(s + 1, storytellerAdvice.length - 1))}
              onPrev={() => setStep((s) => Math.max(s - 1, 0))}
            />
          ) : (
            <div className="space-y-10">
              {storytellerAdvice.map((section, i) => (
                <div key={section.id}>
                  {i > 0 && (
                    <div className="h-px mb-10" style={{ background: "rgba(139,0,0,0.15)" }} />
                  )}
                  <ArticleSection section={section} />
                </div>
              ))}
            </div>
          )}

          {/* Section jumps (wizard mode) */}
          {mode === "wizard" && storytellerAdvice.length > 1 && (
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              {storytellerAdvice.map((section, i) => (
                <button
                  key={section.id}
                  onClick={() => setStep(i)}
                  className="w-8 h-8 rounded-full text-cinzel text-xs font-bold transition-all duration-150"
                  style={{
                    background: step === i ? "rgba(139,0,0,0.3)" : "rgba(20,8,13,0.5)",
                    border: `1px solid ${step === i ? "rgba(139,0,0,0.5)" : "rgba(139,0,0,0.15)"}`,
                    color: step === i ? "#c9a84c" : "#6b7a8d",
                  }}
                  title={t(section.titleFr, section.title)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
