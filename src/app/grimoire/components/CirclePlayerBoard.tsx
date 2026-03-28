"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLang } from "@/context/LangContext";
import { isMobileBuild } from "@/config/buildMode";
import { allCharacters } from "@/data/characters";
import { characterArtwork } from "@/data/characterArtwork";
import { type PlayerEntry } from "../types";

interface Props {
  players: PlayerEntry[];
  showSecrets: boolean;
  onMovePlayer: (playerId: string, direction: -1 | 1) => void;
}

function getStateTone(state: PlayerEntry["state"]) {
  switch (state) {
    case "alive":
      return { ring: "rgba(76,175,80,0.95)", glow: "rgba(76,175,80,0.12)", text: "#f4ebd0" };
    case "dead":
      return { ring: "rgba(220,72,72,0.95)", glow: "rgba(220,72,72,0.12)", text: "#e7d9d9" };
    case "executed":
      return { ring: "rgba(220,72,72,0.95)", glow: "rgba(220,72,72,0.12)", text: "#ffdfdf" };
    default:
      return { ring: "rgba(76,175,80,0.95)", glow: "rgba(76,175,80,0.12)", text: "#f4ebd0" };
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export default function CirclePlayerBoard({ players, showSecrets, onMovePlayer }: Props) {
  const { t } = useLang();
  const [editMode, setEditMode] = useState(false);
  const [boardSize, setBoardSize] = useState({ width: 0, height: 0 });
  const boardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = boardRef.current;
    if (!element) {
      return;
    }

    const updateSize = () => {
      const rect = element.getBoundingClientRect();
      setBoardSize({ width: rect.width, height: rect.height });
    };

    updateSize();

    const observer = new ResizeObserver(() => {
      updateSize();
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const sortedPlayers = useMemo(
    () => [...players].sort((a, b) => a.seat - b.seat || a.name.localeCompare(b.name)),
    [players]
  );

  const layout = useMemo(() => {
    const count = Math.max(sortedPlayers.length, 1);
    const usableDiameter = Math.max(0, Math.min(boardSize.width, boardSize.height)) || (isMobileBuild ? 340 : 720);
    const densityBand = count >= 13 ? "dense" : count >= 9 ? "medium" : "open";

    const tokenSize = clamp(
      Math.round(
        usableDiameter /
          (densityBand === "dense"
            ? isMobileBuild
              ? 9
              : 8.2
            : densityBand === "medium"
              ? isMobileBuild
                ? 7.8
                : 7.2
              : isMobileBuild
                ? 6.8
                : 6.2)
      ),
      isMobileBuild ? 32 : 46,
      isMobileBuild ? 48 : 78
    );

    const cardWidth = clamp(
      Math.round(tokenSize * (densityBand === "dense" ? (isMobileBuild ? 1.45 : 1.78) : isMobileBuild ? 1.62 : 1.92)),
      isMobileBuild ? 66 : 90,
      isMobileBuild ? 102 : 136
    );

    const buttonSize = tokenSize <= 38 ? 28 : 32;
    const labelHeight = tokenSize <= 38 ? 22 : 26;
    const controlReserve = editMode ? 8 + buttonSize : 0;
    const estimatedCardHeight = tokenSize + 8 + labelHeight + controlReserve;
    const outerPadding = isMobileBuild ? 12 : 16;
    const minOrbitRadius = Math.max(44, Math.round(tokenSize * 1.7));
    const maxOrbitRadius = Math.max(minOrbitRadius, Math.round(usableDiameter / 2 - tokenSize / 2 - outerPadding));
    const idealOrbitRadius = Math.round((usableDiameter - estimatedCardHeight) / 2 - outerPadding);

    const ellipseX = densityBand === "dense" ? 1.12 : densityBand === "medium" ? 1.08 : 1;
    const ellipseY = densityBand === "dense" ? 0.92 : densityBand === "medium" ? 0.95 : 1;
    const orbitRadiusBase = clamp(idealOrbitRadius, minOrbitRadius, Math.floor(maxOrbitRadius / ellipseX));

    const isRectLayout = count >= 10;
    const rectPadding = Math.max(outerPadding, Math.ceil(tokenSize * 0.75));
    const rectWidth = Math.max(0, Math.min(boardSize.width, boardSize.height) - rectPadding * 2);
    const rectHeightDesired = rectWidth * (count >= 13 ? 1.8 : 1.65);
    const rectHeight = Math.max(0, Math.min(boardSize.height - rectPadding * 2, rectHeightDesired));
    const rectTop = (boardSize.height - rectHeight) / 2;
    const rectLeft = (boardSize.width - rectWidth) / 2;

    return {
      tokenSize,
      imageSize: Math.max(24, tokenSize - (tokenSize <= 38 ? 4 : 6)),
      cardWidth,
      orbitRadiusX: orbitRadiusBase * ellipseX,
      orbitRadiusY: orbitRadiusBase * ellipseY,
      isRectLayout,
      rectTop,
      rectLeft,
      rectWidth,
      rectHeight,
      centerSize: clamp(Math.round(tokenSize * (count >= 13 ? 1.8 : 2.1)), 84, 160),
      nameTextSize: tokenSize <= 38 ? "text-[8px]" : tokenSize <= 44 ? "text-[9px]" : isMobileBuild ? "text-[9px]" : "text-[11px]",
      editorButtonSize: tokenSize <= 38 ? "h-7 w-7" : "h-8 w-8",
      nameMaxWidth: Math.max(48, cardWidth - 10),
      labelHeight,
      boardCenterX: boardSize.width / 2,
      boardCenterY: boardSize.height / 2,
    };
  }, [boardSize.height, boardSize.width, sortedPlayers.length, editMode]);

  const handleMove = (playerId: string, direction: -1 | 1) => {
    if (!editMode) return;
    onMovePlayer(playerId, direction);
  };

  return (
    <section
      className="rounded-xl p-3.5 md:p-4 space-y-3.5 overflow-x-hidden min-w-0"
      style={{
        background: "linear-gradient(180deg, rgba(20,8,13,0.72), rgba(10,5,6,0.62))",
        border: "1px solid rgba(139,0,0,0.16)",
      }}
    >
      <div className="flex items-start justify-between gap-3 flex-wrap min-w-0">
        <div className="min-w-0">
          <h3 className="text-cinzel font-bold text-sm tracking-widest uppercase" style={{ color: "#c9a84c" }}>
            ▮ {t("Vue cercle", "Circle view")}
          </h3>
          <p className="text-baskerville text-xs mt-1 max-w-xl min-w-0 break-words" style={{ color: "#8a7a6b" }}>
            {t(
              "Placez les joueurs autour du cercle pour garder le rythme de la partie et repérer plus vite les voisins.",
              "Place players around a circle to keep the pace of the game and read neighbours faster."
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setEditMode((prev) => !prev)}
          className="rounded-lg px-3 py-2 text-xs text-cinzel transition-all duration-150"
          style={{
            background: editMode ? "rgba(139,0,0,0.22)" : "rgba(20,8,13,0.45)",
            border: `1px solid ${editMode ? "rgba(201,168,76,0.35)" : "rgba(100,100,100,0.18)"}`,
            color: editMode ? "#f4ebd0" : "#c9b891",
          }}
        >
          {editMode ? t("Édition activée", "Edit on") : t("Édition désactivée", "Edit off")}
        </button>
      </div>

      <div className="rounded-2xl p-3 md:p-4" style={{ background: "rgba(10,5,6,0.42)", border: "1px solid rgba(201,168,76,0.1)" }}>
        <div
          ref={boardRef}
          className="relative mx-auto w-full max-w-5xl aspect-square min-h-[34rem] overflow-hidden rounded-[2rem]"
          style={{ background: "radial-gradient(circle at center, rgba(139,0,0,0.12), rgba(10,5,6,0.86) 64%)" }}
        >
          <div
            aria-hidden="true"
            className="absolute rounded-full"
            style={{
              left: `${layout.boardCenterX}px`,
              top: `${layout.boardCenterY}px`,
              width: `${layout.centerSize}px`,
              height: `${layout.centerSize}px`,
              transform: "translate(-50%, -50%)",
              background: "rgba(20,8,13,0.45)",
              border: "1px solid rgba(201,168,76,0.12)",
              boxShadow: "0 0 0 1px rgba(139,0,0,0.06), 0 18px 50px rgba(0,0,0,0.2)",
            }}
          />

          {sortedPlayers.map((player, index) => {
            const character = allCharacters.find((entry) => entry.id === player.characterId);
            const tone = getStateTone(player.state);
            let left: number;
            let top: number;

            if (layout.isRectLayout) {
              const count = sortedPlayers.length;
              const perimeter = 2 * (layout.rectWidth + layout.rectHeight);
              const distance = ((index + 0.5) / count) * perimeter;

              if (distance < layout.rectWidth) {
                left = layout.rectLeft + distance;
                top = layout.rectTop;
              } else if (distance < layout.rectWidth + layout.rectHeight) {
                left = layout.rectLeft + layout.rectWidth;
                top = layout.rectTop + (distance - layout.rectWidth);
              } else if (distance < layout.rectWidth + layout.rectHeight + layout.rectWidth) {
                left = layout.rectLeft + layout.rectWidth - (distance - layout.rectWidth - layout.rectHeight);
                top = layout.rectTop + layout.rectHeight;
              } else {
                left = layout.rectLeft;
                top = layout.rectTop + layout.rectHeight - (distance - layout.rectWidth - layout.rectHeight - layout.rectWidth);
              }
            } else {
              const angle = (index / Math.max(sortedPlayers.length, 1)) * Math.PI * 2 - Math.PI / 2;
              left = layout.boardCenterX + layout.orbitRadiusX * Math.cos(angle);
              top = layout.boardCenterY + layout.orbitRadiusY * Math.sin(angle);
            }

            return (
              <div
                key={player.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 text-center"
                style={{
                  left: `${left}px`,
                  top: `${top}px`,
                  width: `${layout.cardWidth}px`,
                }}
              >
                <button
                  type="button"
                  aria-label={t(`Déplacer ${player.name}`, `Move ${player.name}`)}
                  title={t(`Seat ${player.name}`, `Seat ${player.name}`)}
                  className="mx-auto block"
                  style={{ touchAction: "manipulation" }}
                >
                  <div
                    className={`mx-auto flex items-center justify-center overflow-hidden rounded-full transition-all duration-150`} 
                    style={{
                      width: `${layout.tokenSize}px`,
                      height: `${layout.tokenSize}px`,
                      background: "rgba(10,5,6,0.9)",
                      border: `2px solid ${tone.ring}`,
                      boxShadow: `0 0 0 1px rgba(0,0,0,0.16), 0 0 12px ${tone.glow}`,
                    }}
                  >
                    {showSecrets && character && characterArtwork[character.id] ? (
                      <Image src={characterArtwork[character.id]} alt={character.nameEn} width={layout.imageSize} height={layout.imageSize} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-lg font-bold" style={{ color: tone.text }}>
                        ?
                      </span>
                    )}
                  </div>
                </button>

                <div className="mt-2 flex justify-center">
                  <span
                    className={`inline-flex max-w-full items-center rounded-full px-2 py-1 font-semibold leading-[1.05] shadow-lg ${layout.nameTextSize}`}
                    style={{
                      background: "rgba(20,8,13,0.92)",
                      border: "1px solid rgba(201,168,76,0.18)",
                      color: "#f4ebd0",
                      wordBreak: "break-word",
                      maxWidth: `${layout.nameMaxWidth}px`,
                      minHeight: `${layout.labelHeight}px`,
                      whiteSpace: "normal",
                    }}
                  >
                    {player.name}
                  </span>
                </div>

                {editMode && (
                  <div className="mt-2 flex justify-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleMove(player.id, -1)}
                      className={`flex ${layout.editorButtonSize} items-center justify-center rounded-full text-xs transition-all duration-150`}
                      style={{ background: "rgba(139,0,0,0.18)", border: "1px solid rgba(201,168,76,0.18)", color: "#f4ebd0" }}
                      aria-label={t(`Déplacer ${player.name} vers le siège précédent`, `Move ${player.name} to the previous seat`)}
                    >
                      ◀
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMove(player.id, 1)}
                      className={`flex ${layout.editorButtonSize} items-center justify-center rounded-full text-xs transition-all duration-150`}
                      style={{ background: "rgba(139,0,0,0.18)", border: "1px solid rgba(201,168,76,0.18)", color: "#f4ebd0" }}
                      aria-label={t(`Déplacer ${player.name} vers le siège suivant`, `Move ${player.name} to the next seat`)}
                    >
                      ▶
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
