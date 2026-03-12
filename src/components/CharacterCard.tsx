"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { Character, CharacterType } from "@/data/characters";
import { useLang } from "@/context/LangContext";
import { characterArtwork } from "@/data/characterArtwork";

const typeColors: Record<CharacterType, { bg: string; text: string; border: string }> = {
  townsfolk: {
    bg: "rgba(42,95,168,0.18)",
    text: "#7fb3e8",
    border: "rgba(42,95,168,0.35)",
  },
  outsider: {
    bg: "rgba(42,95,168,0.1)",
    text: "#6ba3d8",
    border: "rgba(42,95,168,0.22)",
  },
  minion: {
    bg: "rgba(139,0,0,0.2)",
    text: "#e87777",
    border: "rgba(139,0,0,0.38)",
  },
  demon: {
    bg: "rgba(139,0,0,0.33)",
    text: "#ff6b6b",
    border: "rgba(196,30,58,0.55)",
  },
  traveller: {
    bg: "rgba(107,63,160,0.2)",
    text: "#c4a3e8",
    border: "rgba(107,63,160,0.38)",
  },
  fabled: {
    bg: "rgba(46,125,50,0.2)",
    text: "#81c784",
    border: "rgba(46,125,50,0.38)",
  },
};

const typeLabels: Record<CharacterType, { fr: string; en: string }> = {
  townsfolk: { fr: "Villageois", en: "Townsfolk" },
  outsider: { fr: "Étranger", en: "Outsider" },
  minion: { fr: "Sbire", en: "Minion" },
  demon: { fr: "Démon", en: "Demon" },
  traveller: { fr: "Voyageur", en: "Traveller" },
  fabled: { fr: "Légendaire", en: "Fabled" },
};

interface CharacterCardProps {
  character: Character;
  compact?: boolean;
}

export default function CharacterCard({ character, compact = false }: CharacterCardProps) {
  const { lang } = useLang();
  const colors = typeColors[character.type];
  const label = typeLabels[character.type];
  const name = lang === "fr" ? character.nameFr : character.nameEn;
  const ability = lang === "fr" ? character.abilityFr : character.ability;
  const summary = lang === "fr" ? character.summaryFr : character.summary;
  const tokenImage = useMemo(() => characterArtwork[character.id] ?? null, [character.id]);
  const [imageErrored, setImageErrored] = useState(false);
  const showTokenImage = Boolean(tokenImage && !imageErrored);

  if (compact) {
    return (
      <div
        className="group flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 hover:scale-[1.02]"
        style={{
          background: "rgba(20,8,13,0.5)",
          border: `1px solid ${colors.border}`,
        }}
      >
        {/* Token circle */}
        <div
          className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-xs font-bold uppercase transition-all duration-300 group-hover:scale-110 overflow-hidden relative"
          style={{
            background: `radial-gradient(circle at 35% 35%, ${colors.bg}, rgba(10,5,6,0.9))`,
            border: `2px solid ${colors.border}`,
            boxShadow: `0 0 12px ${colors.bg}`,
            color: colors.text,
          }}
        >
          {showTokenImage ? (
            <Image
              src={tokenImage ?? ""}
              alt={name}
              fill
              sizes="40px"
              className="object-cover"
              onError={() => setImageErrored(true)}
            />
          ) : (
            name.slice(0, 2)
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-cinzel text-sm font-semibold tracking-wide"
              style={{ color: "#f4ebd0" }}
            >
              {name}
            </span>
            <span
              className="badge-type text-xs"
              style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}
            >
              {label[lang]}
            </span>
          </div>
          <p
            className="text-xs mt-1 line-clamp-2"
            style={{ color: "#9ca8b5" }}
          >
            {summary}
          </p>
        </div>
      </div>
    );
  }

  return (
    <article
      className="card-botc group flex flex-col"
      style={{
        background: "linear-gradient(145deg, rgba(20,8,13,0.95) 0%, rgba(10,5,6,0.98) 100%)",
        border: `1px solid ${colors.border}`,
      }}
      aria-label={name}
    >
      {/* Header */}
      <div
        className="px-5 pt-5 pb-4 border-b flex items-center gap-4"
        style={{ borderColor: colors.border }}
      >
        {/* Token */}
        <div
          className="w-14 h-14 shrink-0 rounded-full flex items-center justify-center text-lg font-bold uppercase transition-all duration-400 group-hover:scale-110 group-hover:rotate-3 overflow-hidden relative"
          style={{
            background: `radial-gradient(circle at 35% 35%, ${colors.bg}, rgba(10,5,6,0.9))`,
            border: `2px solid ${colors.border}`,
            boxShadow: `0 0 20px ${colors.bg}, 0 4px 12px rgba(0,0,0,0.5)`,
            color: colors.text,
            fontFamily: "var(--font-cinzel-var), serif",
          }}
        >
          {showTokenImage ? (
            <Image
              src={tokenImage ?? ""}
              alt={name}
              fill
              sizes="56px"
              className="object-cover"
              onError={() => setImageErrored(true)}
            />
          ) : (
            name.slice(0, 2)
          )}
        </div>

        <div className="flex-1">
          <h3
            className="text-cinzel font-bold text-base tracking-wide leading-tight"
            style={{ color: "#f4ebd0" }}
          >
            {name}
          </h3>
          <span
            className="badge-type inline-block mt-1.5"
            style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}
          >
            {label[lang]}
          </span>
        </div>
      </div>

      {/* Ability */}
      <div className="px-5 py-4 flex-1">
        <p className="ability-text">{ability}</p>
      </div>

      {/* Summary */}
      <div
        className="px-5 pb-5"
      >
        <p
          className="text-xs leading-relaxed"
          style={{ color: "#6b7a8d" }}
        >
          {summary}
        </p>
      </div>

      {/* Night indicator */}
      {(character.firstNight || character.otherNights) && (
        <div
          className="px-5 pb-4 flex gap-2"
        >
          {character.firstNight && (
            <span
              className="text-xs px-2 py-0.5 rounded"
              style={{
                background: "rgba(26,10,46,0.6)",
                color: "#9ca8b5",
                border: "1px solid rgba(107,122,141,0.2)",
              }}
            >
              {lang === "fr" ? "1ère nuit" : "1st night"}
            </span>
          )}
          {character.otherNights && (
            <span
              className="text-xs px-2 py-0.5 rounded"
              style={{
                background: "rgba(26,10,46,0.6)",
                color: "#9ca8b5",
                border: "1px solid rgba(107,122,141,0.2)",
              }}
            >
              {lang === "fr" ? "Autres nuits" : "Other nights"}
            </span>
          )}
        </div>
      )}
    </article>
  );
}
