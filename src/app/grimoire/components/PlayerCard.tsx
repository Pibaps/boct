"use client";

import Image from "next/image";
import { useLang } from "@/context/LangContext";
import { isMobileBuild } from "@/config/buildMode";
import { type PlayerEntry, type TokenKind, type PlayerState } from "../types";
import { allCharacters } from "@/data/characters";
import { characterArtwork } from "@/data/characterArtwork";
import { glossaryIconMap } from "@/data/glossary";

interface Props {
  player: PlayerEntry;
  showSecret: boolean;
  onUpdateName: (name: string) => void;
  onToggleToken: (token: TokenKind) => void;
  onSetState: (state: PlayerState) => void;
  onUpdateNotes: (notes: string) => void;
  onOpenRole?: (characterId: string) => void;
}

const tokenInfo: Record<TokenKind, { icon: string; image?: string; key: string; color: string }> = {
  poisoned: {
    icon: "▲",
    image: "/assets/botc/wiki.bloodontheclocktower.com/Icon_poisoner-fd3059039e.png",
    key: "poisoned",
    color: "#9c27b0",
  },
  drunk: {
    icon: "◊",
    image: "/assets/botc/wiki.bloodontheclocktower.com/Icon_drunk-5ea4cf9d12.png",
    key: "drunk",
    color: "#ff9800",
  },
  protected: {
    icon: "◈",
    image: "/assets/botc/wiki.bloodontheclocktower.com/Icon_sentinel-e475588cec.png",
    key: "protected",
    color: "#4caf50",
  },
  "night-kill": {
    icon: "▬",
    image: "/assets/botc/couteau.png",
    key: "night-kill",
    color: "#f44336",
  },
  custom: { icon: "■", key: "custom", color: "#607d8b" },
};

const stateInfo: Record<PlayerState, { icon?: { src: string; alt: string }; fallback: string; key: string; color: string }> = {
  alive: {
    icon: glossaryIconMap.alive,
    fallback: "●",
    key: "alive",
    color: "#4caf50",
  },
  dead: {
    icon: glossaryIconMap.dead,
    fallback: "◯",
    key: "dead",
    color: "#666",
  },
  executed: {
    icon: glossaryIconMap.executed,
    fallback: "■",
    key: "executed",
    color: "#8B0000",
  },
};

export default function PlayerCard({
  player,
  showSecret,
  onUpdateName,
  onToggleToken,
  onSetState,
  onUpdateNotes,
  onOpenRole,
}: Props) {
  const { t } = useLang();
  const character = allCharacters.find((c) => c.id === player.characterId);
  const state = stateInfo[player.state];
  const stateIconSrc = state.icon?.src ?? "";
  const isHeartState = stateIconSrc.includes("/coeur.png");
  const isDead = player.state !== "alive";

  const stateLabels: Record<PlayerState, string> = {
    alive: t("Vivant", "Alive"),
    dead: t("Mort", "Dead"),
    executed: t("Exécuté(e)", "Executed"),
  };

  const tokenLabels: Record<string, string> = {
    poisoned: t("Empoisonné", "Poisoned"),
    drunk: t("Ivre", "Drunk"),
    protected: t("Protégé", "Protected"),
    "night-kill": t("Tué la nuit", "Night Kill"),
    custom: t("Personnalisé", "Custom"),
  };

  return (
    <div
      className={`rounded-xl transition-all duration-200 ${isMobileBuild ? "p-5" : "p-4"}`}
      style={{
        background: isDead ? "rgba(10,5,6,0.6)" : "rgba(20,8,13,0.5)",
        border: `1px solid ${isDead ? "rgba(100,100,100,0.15)" : "rgba(139,0,0,0.15)"}`,
        opacity: isDead ? 0.7 : 1,
      }}
    >
      {/* Header row */}
      <div className="flex items-center gap-3 mb-3 min-w-0">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-cinzel text-xs font-bold"
          style={{
            background: "rgba(139,0,0,0.2)",
            border: "1px solid rgba(139,0,0,0.3)",
            color: "#c9a84c",
          }}
        >
          {player.seat}
        </div>
        <input
          type="text"
          value={player.name}
          onChange={(e) => onUpdateName(e.target.value)}
          className={`min-w-0 flex-1 bg-transparent text-cinzel font-semibold outline-none ${isMobileBuild ? "text-base" : "text-sm"}`}
          style={{
            color: "#f4ebd0",
            borderBottom: "1px solid rgba(139,0,0,0.15)",
            padding: isMobileBuild ? "10px 6px" : "2px 4px",
          }}
        />
        <span
          className={
            isHeartState
              ? "relative h-12 w-12 rounded-full overflow-hidden flex items-center justify-center p-2"
              : "relative h-10 w-10 rounded-full overflow-hidden flex items-center justify-center p-1"
          }
          style={{ background: "rgba(20,8,13,0.45)", border: `1px solid ${state.color}55` }}
          title={player.state}
          aria-label={player.state}
        >
          {state.icon ? (
            <Image
              src={state.icon.src}
              alt={state.icon.alt}
              fill
              sizes={isHeartState ? "28px" : "36px"}
              className="object-contain"
            />
          ) : (
            <span className="text-sm" style={{ color: state.color }}>
              {state.fallback}
            </span>
          )}
        </span>
      </div>

      {/* Character (secret) */}
      {showSecret && character && (
        <button
          type="button"
          onClick={() => character && onOpenRole?.(character.id)}
          className="min-w-0 rounded-lg p-2 mb-3 flex items-center gap-3"
          style={{
            background: "rgba(139,0,0,0.08)",
            border: "1px solid rgba(139,0,0,0.1)",
            width: "100%",
            textAlign: "left",
          }}
        >
          <div
            className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center"
            style={{
              background: "rgba(20,8,13,0.4)",
              border: "1px solid rgba(139,0,0,0.1)",
            }}
          >
            {characterArtwork[character.id] ? (
              <Image
                src={characterArtwork[character.id]}
                alt={t(character.nameFr, character.nameEn)}
                width={40}
                height={40}
                className="object-cover"
              />
            ) : (
              <span className="text-xs" style={{ color: "#c9a84c" }}>
                {character.type === "townsfolk" ? "🏘️" : character.type === "outsider" ? "🌿" : character.type === "minion" ? "🗡️" : "👹"}
              </span>
            )}
          </div>
          <span className="min-w-0 flex-1 truncate text-cinzel text-xs font-semibold" style={{ color: "#f4ebd0" }}>
            {t(character.nameFr, character.nameEn)}
          </span>
        </button>
      )}

      {/* Tokens */}
      {showSecret && (
        <div className="flex flex-wrap gap-1 mb-3">
          {(Object.keys(tokenInfo) as TokenKind[])
            .filter((tk) => tk !== "custom")
            .map((tk) => {
              const info = tokenInfo[tk];
              const isActive = player.tokens.includes(tk);

              return (
                <button
                  key={tk}
                  onClick={() => onToggleToken(tk)}
                  className={`rounded-md transition-all duration-150 ${isMobileBuild ? "min-h-11 px-3 py-2 text-sm" : "px-2 py-1 text-xs"}`}
                  style={{
                    background: isActive ? `${info.color}22` : "rgba(20,8,13,0.4)",
                    border: `1px solid ${isActive ? info.color : "rgba(100,100,100,0.15)"}`,
                    color: isActive ? info.color : "#555",
                  }}
                  title={tokenLabels[info.key]}
                >
                  {info.image ? (
                    <Image
                      src={info.image}
                      alt={tokenLabels[info.key]}
                      width={18}
                      height={18}
                      className="inline-block"
                    />
                  ) : (
                    info.icon
                  )}
                </button>
              );
            })}
        </div>
      )}

      {/* State controls */}
      <div className="flex gap-1 mb-3">
        {(["alive", "dead", "executed"] as PlayerState[]).map((s) => {
          const info = stateInfo[s];
          const isActive = player.state === s;

          return (
            <button
              key={s}
              onClick={() => onSetState(s)}
              className={`flex-1 rounded-md text-cinzel transition-all duration-150 ${isMobileBuild ? "min-h-12 py-3 text-sm" : "py-1 text-xs"}`}
              style={{
                background: isActive ? "rgba(139,0,0,0.2)" : "rgba(20,8,13,0.3)",
                border: `1px solid ${isActive ? info.color : "rgba(100,100,100,0.1)"}`,
                color: isActive ? "#f4ebd0" : "#555",
              }}
            >
              <span className="inline-flex items-center gap-2">
                {info.icon ? (
                  <span
                    className={
                      info.icon.src.includes("/coeur.png")
                        ? "relative h-6 w-6 overflow-hidden rounded-full p-1"
                        : "relative h-5 w-5 overflow-hidden rounded-full p-0.5"
                    }
                  >
                    <Image
                      src={info.icon.src}
                      alt={info.icon.alt}
                      fill
                      sizes={info.icon.src.includes("/coeur.png") ? "22px" : "20px"}
                      className="object-contain"
                    />
                  </span>
                ) : (
                  <span>{info.fallback}</span>
                )}
                <span>{stateLabels[s]}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Notes */}
      {showSecret && (
        <textarea
          value={player.notes}
          onChange={(e) => onUpdateNotes(e.target.value)}
          placeholder={t("Notes...", "Notes...")}
          rows={2}
          className={`w-full rounded-lg resize-none outline-none ${isMobileBuild ? "p-3 text-sm" : "p-2 text-xs"}`}
          style={{
            background: "rgba(20,8,13,0.4)",
            border: "1px solid rgba(139,0,0,0.08)",
            color: "#c9b891",
          }}
        />
      )}
    </div>
  );
}
