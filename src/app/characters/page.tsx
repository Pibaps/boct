"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import CharacterCard from "@/components/CharacterCard";
import { useLang } from "@/context/LangContext";
import { editionArtwork } from "@/data/characterArtwork";
import {
  allCharacters,
  charactersByEdition,
  editionMeta,
  type CharacterType,
  type Edition,
} from "@/data/characters";

type FilterEdition = Edition | "all";
type FilterType = CharacterType | "all";

export default function CharactersPage() {
  const { t } = useLang();
  const [filterEdition, setFilterEdition] = useState<FilterEdition>("all");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");

  const editions: { id: FilterEdition; labelFr: string; labelEn: string; icon: string }[] = [
    { id: "all", labelFr: "Toutes", labelEn: "All", icon: "✦" },
    { id: "trouble-brewing", labelFr: "Tumulte en Brasserie", labelEn: "Trouble Brewing", icon: "🍺" },
    { id: "bad-moon-rising", labelFr: "Mauvaise Lune", labelEn: "Bad Moon Rising", icon: "🌙" },
    { id: "sects-and-violets", labelFr: "Sectes et Violettes", labelEn: "Sects & Violets", icon: "🔮" },
  ];

  const types: { id: FilterType; labelFr: string; labelEn: string }[] = [
    { id: "all", labelFr: "Tous", labelEn: "All" },
    { id: "townsfolk", labelFr: "Villageois", labelEn: "Townsfolk" },
    { id: "outsider", labelFr: "Étrangers", labelEn: "Outsiders" },
    { id: "minion", labelFr: "Sbires", labelEn: "Minions" },
    { id: "demon", labelFr: "Démons", labelEn: "Demons" },
  ];

  const filtered = allCharacters.filter((c) => {
    if (filterEdition !== "all" && c.edition !== filterEdition) return false;
    if (filterType !== "all" && c.type !== filterType) return false;
    if (search) {
      const q = search.toLowerCase();
      if (
        !c.nameEn.toLowerCase().includes(q) &&
        !c.nameFr.toLowerCase().includes(q) &&
        !c.ability.toLowerCase().includes(q) &&
        !c.abilityFr.toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });

  return (
    <div style={{ background: "#0a0506", minHeight: "100dvh" }}>
      {/* Header */}
      <div
        className="pt-32 pb-16 px-6 text-center relative overflow-hidden"
        style={{
          background: "linear-gradient(180deg, rgba(139,0,0,0.08) 0%, transparent 100%)",
        }}
      >
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(139,0,0,0.12) 0%, transparent 60%)"
        }} />
        <div className="relative z-10">
          <p className="text-xs tracking-widest uppercase text-cinzel mb-4" style={{ color: "#8B0000" }}>
            {t("Guide Complet", "Complete Guide")}
          </p>
          <h1
            className="text-cinzel font-black mb-4"
            style={{ fontSize: "clamp(2rem, 5vw, 4rem)", color: "#f4ebd0" }}
          >
            {t("Personnages", "Characters")}
          </h1>
          <p className="text-baskerville max-w-xl mx-auto" style={{ color: "#c9b891" }}>
            {t(
              `${allCharacters.length} personnages répartis sur 3 éditions.`,
              `${allCharacters.length} characters across 3 editions.`
            )}
          </p>
        </div>
      </div>

      {/* Edition cards */}
      <div className="px-6 pb-8">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-4">
          {(["trouble-brewing", "bad-moon-rising", "sects-and-violets"] as Edition[]).map((edId) => {
            const ed = editionMeta[edId];
            const count = charactersByEdition[edId].length;
            return (
              <Link
                key={edId}
                href={`/characters/${edId}`}
                className="group flex items-center gap-4 p-4 rounded-xl transition-all duration-300 hover:scale-[1.02]"
                style={{
                  background: "rgba(20,8,13,0.5)",
                  border: `1px solid ${ed.color}35`,
                }}
              >
                {editionArtwork[edId] ? (
                  <Image
                    src={editionArtwork[edId]}
                    alt={t(ed.nameFr, ed.nameEn)}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-md object-cover"
                  />
                ) : (
                  <span className="text-3xl">{ed.icon}</span>
                )}
                <div>
                  <div className="text-cinzel font-semibold text-sm" style={{ color: ed.colorAccent }}>
                    {t(ed.nameFr, ed.nameEn)}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: "#6b7a8d" }}>
                    {count} {t("personnages", "characters")}
                  </div>
                </div>
                <span className="ml-auto transition-transform group-hover:translate-x-1 duration-200" style={{ color: ed.colorAccent }}>→</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div
        className="sticky top-16 z-30 px-6 py-4 border-b"
        style={{
          background: "rgba(10,5,6,0.92)",
          backdropFilter: "blur(12px)",
          borderColor: "rgba(139,0,0,0.2)",
        }}
      >
        <div className="max-w-6xl mx-auto space-y-3">
          {/* Search */}
          <input
            type="search"
            placeholder={t("Rechercher un personnage ou une capacité...", "Search characters or abilities...")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg px-4 py-2.5 text-sm outline-none transition-all duration-200"
            style={{
              background: "rgba(20,8,13,0.7)",
              border: "1px solid rgba(201,168,76,0.15)",
              color: "#f4ebd0",
            }}
          />

          {/* Filter row */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Edition filter */}
            <div className="flex flex-wrap gap-1.5">
              {editions.map(({ id, labelFr, labelEn, icon }) => (
                <button
                  key={id}
                  onClick={() => setFilterEdition(id)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-cinzel tracking-wide transition-all duration-200"
                  style={{
                    background: filterEdition === id ? "rgba(139,0,0,0.3)" : "rgba(20,8,13,0.5)",
                    border: `1px solid ${filterEdition === id ? "rgba(139,0,0,0.6)" : "rgba(139,0,0,0.15)"}`,
                    color: filterEdition === id ? "#f4ebd0" : "#6b7a8d",
                  }}
                >
                  {id !== "all" && editionArtwork[id] ? (
                    <Image
                      src={editionArtwork[id]}
                      alt={t(labelFr, labelEn)}
                      width={16}
                      height={16}
                      className="w-4 h-4 rounded-sm object-cover"
                    />
                  ) : (
                    <span>{icon}</span>
                  )}
                  <span className="hidden sm:inline">{t(labelFr, labelEn)}</span>
                </button>
              ))}
            </div>

            <div className="w-px h-4 shrink-0" style={{ background: "rgba(139,0,0,0.3)" }} />

            {/* Type filter */}
            <div className="flex flex-wrap gap-1.5">
              {types.map(({ id, labelFr, labelEn }) => (
                <button
                  key={id}
                  onClick={() => setFilterType(id)}
                  className="px-3 py-1 rounded-full text-xs font-medium text-cinzel tracking-wide transition-all duration-200"
                  style={{
                    background: filterType === id ? "rgba(201,168,76,0.15)" : "rgba(20,8,13,0.5)",
                    border: `1px solid ${filterType === id ? "rgba(201,168,76,0.4)" : "rgba(201,168,76,0.1)"}`,
                    color: filterType === id ? "#c9a84c" : "#6b7a8d",
                  }}
                >
                  {t(labelFr, labelEn)}
                </button>
              ))}
            </div>

            <div className="ml-auto flex gap-2">
              {(["grid", "list"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className="w-8 h-8 flex items-center justify-center rounded transition-all duration-200"
                  style={{
                    background: view === v ? "rgba(139,0,0,0.2)" : "transparent",
                    border: `1px solid ${view === v ? "rgba(139,0,0,0.4)" : "rgba(107,122,141,0.2)"}`,
                    color: view === v ? "#f4ebd0" : "#6b7a8d",
                  }}
                  aria-label={v === "grid" ? "Grid view" : "List view"}
                >
                  {v === "grid" ? "⊞" : "☰"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-xs mb-6" style={{ color: "#6b7a8d" }}>
            {filtered.length} {t("personnages affichés", "characters shown")}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-24" style={{ color: "#6b7a8d" }}>
              <div className="text-4xl mb-4">🔍</div>
              <p className="text-cinzel">
                {t("Aucun personnage trouvé.", "No characters found.")}
              </p>
            </div>
          ) : view === "grid" ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((char) => (
                <CharacterCard key={char.id} character={char} />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((char) => (
                <CharacterCard key={char.id} character={char} compact />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
