"use client";

import { useState } from "react";
import { useLang } from "@/context/LangContext";
import { rules, setupGuide, type ContentSection } from "@/data/content";

function SectionBlock({ section, depth = 0 }: { section: ContentSection; depth?: number }) {
  const { t } = useLang();
  const [open, setOpen] = useState(true);

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: depth === 0 ? "rgba(20,8,13,0.5)" : "rgba(20,8,13,0.3)",
        border: depth === 0 ? "1px solid rgba(201,168,76,0.12)" : "1px solid rgba(139,0,0,0.12)",
        marginLeft: depth > 0 ? "1.5rem" : "0",
      }}
    >
      <button
        className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <h3
          className="text-cinzel font-semibold"
          style={{
            fontSize: depth === 0 ? "1.05rem" : "0.9rem",
            color: depth === 0 ? "#c9a84c" : "#f4ebd0",
          }}
        >
          {t(section.titleFr, section.title)}
        </h3>
        <span
          className="shrink-0 transition-transform duration-300 text-sm"
          style={{ color: "#6b7a8d", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          ▾
        </span>
      </button>

      {open && (
        <div className="px-6 pb-5">
          <div className="h-px mb-4" style={{ background: "rgba(139,0,0,0.2)" }} />
          <p className="text-baskerville leading-relaxed" style={{ color: "#c9b891", fontSize: "0.95rem" }}>
            {t(section.contentFr, section.content)}
          </p>

          {section.subsections?.map((sub) => (
            <div key={sub.id} className="mt-4">
              <SectionBlock section={sub} depth={depth + 1} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const playerCountRows = [
  { players: 5, townsfolk: 3, outsiders: 0, minions: 1, demons: 1 },
  { players: 6, townsfolk: 4, outsiders: 0, minions: 1, demons: 1 },
  { players: 7, townsfolk: 5, outsiders: 0, minions: 1, demons: 1 },
  { players: 8, townsfolk: 5, outsiders: 1, minions: 1, demons: 1 },
  { players: 9, townsfolk: 5, outsiders: 2, minions: 1, demons: 1 },
  { players: 10, townsfolk: 7, outsiders: 0, minions: 2, demons: 1 },
  { players: 11, townsfolk: 7, outsiders: 1, minions: 2, demons: 1 },
  { players: 12, townsfolk: 7, outsiders: 2, minions: 2, demons: 1 },
  { players: 13, townsfolk: 9, outsiders: 0, minions: 2, demons: 1 },
  { players: 14, townsfolk: 9, outsiders: 1, minions: 2, demons: 1 },
  { players: 15, townsfolk: 9, outsiders: 2, minions: 3, demons: 1 },
];

export default function RulesPage() {
  const { t } = useLang();
  const [tab, setTab] = useState<"rules" | "setup">("rules");

  return (
    <div style={{ background: "#0a0506", minHeight: "100dvh" }}>
      {/* Header */}
      <div
        className="pt-32 pb-16 px-6 text-center relative overflow-hidden"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.06) 0%, transparent 70%)" }}
      >
        <p className="text-xs tracking-widest uppercase text-cinzel mb-4" style={{ color: "#8B0000" }}>
          {t("Mécaniques", "Mechanics")}
        </p>
        <h1
          className="text-cinzel font-black mb-4"
          style={{ fontSize: "clamp(2rem, 5vw, 4rem)", color: "#f4ebd0" }}
        >
          {t("Règles du Jeu", "Game Rules")}
        </h1>
        <p className="text-baskerville max-w-xl mx-auto" style={{ color: "#c9b891" }}>
          {t(
            "Tout ce qu'il faut savoir pour jouer : la boucle de jeu, les conditions de victoire, les nominations et la mise en place.",
            "Everything you need to play: the game loop, win conditions, nominations, and setup."
          )}
        </p>
      </div>

      {/* Tabs */}
      <div className="px-6 pb-4">
        <div className="max-w-4xl mx-auto flex gap-2 justify-center">
          {[
            { id: "rules" as const, labelFr: "Règles", labelEn: "Rules" },
            { id: "setup" as const, labelFr: "Mise en Place", labelEn: "Setup" },
          ].map(({ id, labelFr, labelEn }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className="px-6 py-2.5 rounded-full text-cinzel text-xs tracking-widest uppercase transition-all duration-200"
              style={{
                background: tab === id ? "rgba(139,0,0,0.25)" : "rgba(20,8,13,0.5)",
                border: `1px solid ${tab === id ? "rgba(139,0,0,0.5)" : "rgba(139,0,0,0.15)"}`,
                color: tab === id ? "#f4ebd0" : "#6b7a8d",
              }}
            >
              {t(labelFr, labelEn)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-8 pb-24">
        <div className="max-w-4xl mx-auto space-y-4">
          {tab === "rules" && (
            <>
              {rules.map((section) => (
                <SectionBlock key={section.id} section={section} />
              ))}

              {/* Player count table */}
              <div
                className="rounded-xl overflow-hidden mt-8"
                style={{
                  background: "rgba(20,8,13,0.5)",
                  border: "1px solid rgba(201,168,76,0.12)",
                }}
              >
                <div className="px-6 py-4 border-b" style={{ borderColor: "rgba(201,168,76,0.12)" }}>
                  <h3 className="text-cinzel font-semibold text-base" style={{ color: "#c9a84c" }}>
                    {t("Composition par Nombre de Joueurs", "Composition by Player Count")}
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(139,0,0,0.2)" }}>
                        {[
                          t("Joueurs", "Players"),
                          t("Villageois", "Townsfolk"),
                          t("Étrangers", "Outsiders"),
                          t("Sbires", "Minions"),
                          t("Démons", "Demons"),
                        ].map((h) => (
                          <th
                            key={h}
                            className="text-cinzel text-xs tracking-widest uppercase py-3 px-4 text-left"
                            style={{ color: "#6b7a8d" }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {playerCountRows.map((row, i) => (
                        <tr
                          key={row.players}
                          style={{
                            borderBottom: "1px solid rgba(139,0,0,0.08)",
                            background: i % 2 === 0 ? "transparent" : "rgba(20,8,13,0.3)",
                          }}
                        >
                          <td className="py-2.5 px-4 text-cinzel font-bold" style={{ color: "#c9a84c" }}>
                            {row.players}
                          </td>
                          <td className="py-2.5 px-4" style={{ color: "#7fb3e8" }}>{row.townsfolk}</td>
                          <td className="py-2.5 px-4" style={{ color: "#6ba3d8" }}>{row.outsiders}</td>
                          <td className="py-2.5 px-4" style={{ color: "#e87777" }}>{row.minions}</td>
                          <td className="py-2.5 px-4" style={{ color: "#ff6b6b" }}>{row.demons}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {tab === "setup" && (
            <>
              <div className="mb-8">
                <h2 className="text-cinzel font-bold text-xl mb-2" style={{ color: "#f4ebd0" }}>
                  {t("Guide de Mise en Place", "Setup Guide")}
                </h2>
                <p style={{ color: "#6b7a8d", fontSize: "0.9rem" }}>
                  {t("Suivez ces étapes pour préparer une partie.", "Follow these steps to set up a game.")}
                </p>
              </div>

              {setupGuide.map((section, i) => (
                <div key={section.id} className="flex gap-5">
                  <div
                    className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-sm font-bold text-cinzel mt-1"
                    style={{
                      background: "rgba(139,0,0,0.2)",
                      border: "1px solid rgba(139,0,0,0.4)",
                      color: "#c9a84c",
                    }}
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <SectionBlock section={section} />
                    {i < setupGuide.length - 1 && (
                      <div className="ml-4 mt-1 w-0.5 h-4" style={{ background: "rgba(139,0,0,0.2)" }} />
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
