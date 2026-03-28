"use client";

import Image from "next/image";
import { useMemo } from "react";
import { useLang } from "@/context/LangContext";
import { type GrimoireSession } from "../types";
import { buildNightWakePlan } from "../nightPlanner";
import { getUnusedRoles, pickImpBluffs } from "../utils";
import { characterArtwork } from "@/data/characterArtwork";

interface Props {
  session: GrimoireSession;
  onUpdateSession: (updater: (prev: GrimoireSession) => GrimoireSession) => void;
}

function roleTone(type: string) {
  switch (type) {
    case "townsfolk":
      return { border: "rgba(201,168,76,0.25)", badge: "rgba(201,168,76,0.12)", text: "#f4ebd0" };
    case "outsider":
      return { border: "rgba(139,0,0,0.22)", badge: "rgba(139,0,0,0.12)", text: "#f1c8c8" };
    case "minion":
      return { border: "rgba(184,76,201,0.2)", badge: "rgba(184,76,201,0.12)", text: "#efd9f8" };
    case "demon":
      return { border: "rgba(244,67,54,0.22)", badge: "rgba(244,67,54,0.12)", text: "#ffdad6" };
    default:
      return { border: "rgba(100,100,100,0.18)", badge: "rgba(100,100,100,0.12)", text: "#e8dfd0" };
  }
}

const typeLabels: Record<string, { fr: string; en: string }> = {
  townsfolk: { fr: "Villageois", en: "Townsfolk" },
  outsider: { fr: "Étranger", en: "Outsider" },
  minion: { fr: "Sbire", en: "Minion" },
  demon: { fr: "Démon", en: "Demon" },
  traveller: { fr: "Voyageur", en: "Traveller" },
  fabled: { fr: "Fablé", en: "Fabled" },
};

export default function StorytellerPanel({ session, onUpdateSession }: Props) {
  const { t } = useLang();
  const wakePlan = useMemo(() => buildNightWakePlan(session), [session]);

  const showSecrets = session.ui.showSecrets;

  const unusedRoles = useMemo(
    () => getUnusedRoles(session.edition, session.setup.selectedCharacterIds),
    [session.edition, session.setup.selectedCharacterIds]
  );

  const selectedBluffs = useMemo(() => {
    const selected = new Set(session.ui.storyteller.impBluffIds);
    return unusedRoles.filter((role) => selected.has(role.id)).slice(0, 3);
  }, [session.ui.storyteller.impBluffIds, unusedRoles]);

  const toggleBluff = (roleId: string) => {
    onUpdateSession((prev) => {
      const current = prev.ui.storyteller.impBluffIds.filter((id) => unusedRoles.some((role) => role.id === id));
      const set = new Set(current);

      if (set.has(roleId)) {
        return {
          ...prev,
          ui: {
            ...prev.ui,
            storyteller: {
              ...prev.ui.storyteller,
              impBluffIds: current.filter((id) => id !== roleId),
            },
          },
        };
      }

      if (current.length >= 3) {
        return prev;
      }

      const nextIds = [...current, roleId];

      return {
        ...prev,
        ui: {
          ...prev.ui,
          storyteller: {
            ...prev.ui.storyteller,
            impBluffIds: nextIds,
          },
        },
      };
    });
  };

  const autoPickBluffs = () => {
    const picks = pickImpBluffs(session.edition, session.setup.selectedCharacterIds, 3).map((role) => role.id);

    onUpdateSession((prev) => ({
      ...prev,
      ui: {
        ...prev.ui,
        storyteller: {
          ...prev.ui.storyteller,
          impBluffIds: picks,
        },
      },
    }));
  };

  const clearBluffs = () => {
    onUpdateSession((prev) => ({
      ...prev,
      ui: {
        ...prev.ui,
        storyteller: {
          ...prev.ui.storyteller,
          impBluffIds: [],
        },
      },
    }));
  };

  const wakePlanLabel = wakePlan.isFirstNight
    ? t("Première nuit", "First night")
    : t(`Nuit ${wakePlan.nightNumber}`, `Night ${wakePlan.nightNumber}`);

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
            ▮ {t("Zone Conteur", "Storyteller Zone")}
          </h3>
          <p className="text-baskerville text-xs mt-1 max-w-xl min-w-0 break-words" style={{ color: "#8a7a6b" }}>
            {t(
              "Rôles hors partie et bluffs Imp à préparer avant de lancer le jeu.",
              "Unused roles and Imp bluffs to prepare before the game starts."
            )}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-end">
          <button
            type="button"
            onClick={autoPickBluffs}
            className="rounded-lg px-3 py-2 text-xs text-cinzel transition-all duration-150"
            style={{ background: "rgba(139,0,0,0.2)", border: "1px solid rgba(139,0,0,0.25)", color: "#f4ebd0" }}
          >
            {t("Tirer 3 bluffs", "Draw 3 bluffs")}
          </button>
          <button
            type="button"
            onClick={clearBluffs}
            className="rounded-lg px-3 py-2 text-xs text-cinzel transition-all duration-150"
            style={{ background: "rgba(20,8,13,0.45)", border: "1px solid rgba(100,100,100,0.18)", color: "#c9b891" }}
          >
            {t("Vider", "Clear")}
          </button>
        </div>
      </div>

      <div className="rounded-xl p-3" style={{ background: "rgba(10,5,6,0.35)", border: "1px solid rgba(201,168,76,0.1)" }}>
        <div className="flex items-center justify-between gap-2 mb-2.5 flex-wrap">
          <p className="text-cinzel text-xs uppercase tracking-widest" style={{ color: "#8a7a6b" }}>
            {t("Bluffs de l'Imp", "Imp bluffs")} · {selectedBluffs.length}/3
          </p>
          <p className="text-baskerville text-xs" style={{ color: "#6f655c" }}>
            {t("Clique pour cocher un rôle comme bluff.", "Click to tick a role as a bluff.")}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {selectedBluffs.length === 0 ? (
            <p className="text-baskerville text-sm" style={{ color: "#6f655c" }}>
              {t("Aucun bluff choisi pour l'instant.", "No bluff selected yet.")}
            </p>
          ) : (
            selectedBluffs.map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => toggleBluff(role.id)}
                className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs transition-all duration-150"
                style={{ background: "rgba(139,0,0,0.15)", border: "1px solid rgba(139,0,0,0.24)", color: "#f4ebd0" }}
              >
                <span aria-hidden="true">✓</span>
                <span>{t(role.nameFr, role.nameEn)}</span>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="rounded-xl p-3" style={{ background: "rgba(10,5,6,0.35)", border: "1px solid rgba(201,168,76,0.1)" }}>
        <div className="flex items-start justify-between gap-2 mb-2.5 flex-wrap">
          <div className="min-w-0">
            <p className="text-cinzel text-xs uppercase tracking-widest" style={{ color: "#8a7a6b" }}>
              {t("Ordre de réveil", "Wake order")}
            </p>
            <p className="text-baskerville text-xs mt-1" style={{ color: "#6f655c" }}>
              {t(
                `Proposition calculée pour ${wakePlanLabel}.`,
                `Computed proposal for ${wakePlanLabel}.`
              )}
            </p>
          </div>
          <span className="rounded-full px-2.5 py-1 text-[10px] uppercase tracking-widest" style={{ background: "rgba(139,0,0,0.16)", border: "1px solid rgba(139,0,0,0.22)", color: "#f4ebd0" }}>
            {wakePlan.steps.length}
          </span>
        </div>

        <div className="max-h-[22rem] overflow-y-auto pr-1 space-y-2" style={{ scrollbarWidth: "thin" }}>
          {wakePlan.steps.length === 0 ? (
            <p className="text-baskerville text-sm py-2" style={{ color: "#6f655c" }}>
              {t("Aucun réveil nocturne prévu pour cette nuit.", "No night wake is scheduled for this night.")}
            </p>
          ) : (
            wakePlan.steps.map((step) => {
              const isSkipped = step.status === "skipped";
              const iconSrc = step.characterId ? characterArtwork[step.characterId] : "";

              if (step.kind === "group") {
                return (
                  <div
                    key={step.id}
                    className="rounded-xl p-3 flex items-start gap-3"
                    style={{
                      background: "rgba(82,30,30,0.28)",
                      border: "1px solid rgba(244,67,54,0.18)",
                    }}
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full" style={{ background: "rgba(244,67,54,0.15)", border: "1px solid rgba(244,67,54,0.28)", color: "#ffb7b7" }}>
                      <span className="text-xs font-bold">!</span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-cinzel text-sm font-semibold" style={{ color: "#ffdfdf" }}>
                          {t("Réveil du camp du mal", "Evil team wake")}
                        </p>
                        <span className="rounded-full px-2 py-0.5 text-[10px] uppercase tracking-widest" style={{ background: "rgba(244,67,54,0.14)", border: "1px solid rgba(244,67,54,0.18)", color: "#ffb7b7" }}>
                          {t("Groupe", "Group")}
                        </span>
                      </div>

                      <p className="mt-1 text-baskerville text-xs leading-relaxed" style={{ color: "#ffb7b7" }}>
                        {t(step.actionFr, step.actionEn)}
                      </p>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={step.id}
                  className="rounded-xl p-2.5 flex items-start gap-3"
                  style={{
                    background: isSkipped ? "rgba(82,30,30,0.35)" : "rgba(20,8,13,0.45)",
                    border: `1px solid ${isSkipped ? "rgba(244,67,54,0.18)" : "rgba(139,0,0,0.15)"}`,
                  }}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold" style={{ background: "rgba(139,0,0,0.2)", border: "1px solid rgba(201,168,76,0.18)", color: "#f4ebd0" }}>
                    {step.seat}
                  </div>

                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl" style={{ background: "rgba(10,5,6,0.72)", border: "1px solid rgba(100,100,100,0.18)" }}>
                    {iconSrc ? (
                      <Image src={iconSrc} alt={step.characterNameEn ?? step.playerName} fill sizes="40px" className="object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[11px] font-bold uppercase" style={{ color: "#c9a84c" }}>
                        {step.playerName.slice(0, 2)}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-cinzel text-sm font-semibold truncate" style={{ color: isSkipped ? "#ffcdcd" : "#f4ebd0" }}>
                          {showSecrets ? step.playerName : t("Joueur secret", "Hidden player")}
                        </p>
                        <p className="text-baskerville text-xs truncate" style={{ color: "#8a7a6b" }}>
                          {showSecrets ? (step.characterNameFr && step.characterNameEn ? t(step.characterNameFr, step.characterNameEn) : "") : t("Rôle secret", "Hidden role")}
                        </p>
                      </div>

                      <span className="rounded-full px-2 py-0.5 text-[10px] uppercase tracking-widest" style={{ background: isSkipped ? "rgba(244,67,54,0.14)" : "rgba(201,168,76,0.12)", border: `1px solid ${isSkipped ? "rgba(244,67,54,0.18)" : "rgba(201,168,76,0.18)"}`, color: isSkipped ? "#ffb7b7" : "#f4ebd0" }}>
                        {isSkipped ? t("Ignoré", "Skipped") : t("À réveiller", "Wake")}
                      </span>
                    </div>

                    <div className="mt-1 space-y-1">
                      <p className="text-baskerville text-xs leading-relaxed" style={{ color: isSkipped ? "#ffb7b7" : "#c9b891" }}>
                        {t(step.actionFr, step.actionEn)}
                      </p>
                      {isSkipped && (
                        <p className="text-[11px] uppercase tracking-widest" style={{ color: "#ffb7b7" }}>
                          {t(step.skipFr, step.skipEn)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2 flex-wrap min-w-0">
          <p className="text-cinzel text-xs uppercase tracking-widest min-w-0 break-words" style={{ color: "#8a7a6b" }}>
            {t("Rôles non utilisés", "Unused roles")} · {unusedRoles.length}
          </p>
          <p className="text-baskerville text-xs" style={{ color: "#6f655c" }}>
            {t("Les rôles cochés ci-dessus servent de bluffs Imp.", "The roles ticked above are used as Imp bluffs.")}
          </p>
        </div>

        <div className="max-h-[26rem] overflow-y-auto pr-1 space-y-2" style={{ scrollbarWidth: "thin" }}>
          {unusedRoles.length === 0 ? (
            <p className="text-baskerville text-sm py-2" style={{ color: "#6f655c" }}>
              {t("Aucun rôle inutilisé dans cette édition.", "No unused roles in this edition.")}
            </p>
          ) : (
            unusedRoles.map((role) => {
              const selected = session.ui.storyteller.impBluffIds.includes(role.id);
              const tone = roleTone(role.type);
              const iconSrc = characterArtwork[role.id];

              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => toggleBluff(role.id)}
                  className="w-full rounded-xl p-2.5 text-left transition-all duration-150 hover:scale-[1.005]"
                  style={{
                    background: selected ? "rgba(139,0,0,0.18)" : "rgba(20,8,13,0.45)",
                    border: `1px solid ${selected ? "rgba(201,168,76,0.4)" : tone.border}`,
                  }}
                  aria-pressed={selected}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg" style={{ background: "rgba(10,5,6,0.7)" }}>
                      {iconSrc ? (
                        <Image src={iconSrc} alt={t(role.nameFr, role.nameEn)} fill className="object-cover" sizes="44px" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs font-bold uppercase" style={{ color: tone.text }}>
                          {role.nameEn.slice(0, 2)}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-cinzel text-sm font-semibold truncate" style={{ color: tone.text }}>
                          {t(role.nameFr, role.nameEn)}
                        </p>
                        <span
                          className="rounded-full px-2 py-0.5 text-[10px] uppercase tracking-widest"
                          style={{ background: tone.badge, color: tone.text }}
                        >
                          {t(typeLabels[role.type]?.fr ?? role.type, typeLabels[role.type]?.en ?? role.type)}
                        </span>
                      </div>
                      <p className="text-baskerville text-xs mt-1" style={{ color: "#8a7a6b", maxHeight: "2.4em", overflow: "hidden" }}>
                        {t(role.summaryFr, role.summary)}
                      </p>
                    </div>

                    <div
                      className="flex h-7 w-7 items-center justify-center rounded-full text-sm"
                      style={{
                        background: selected ? "rgba(201,168,76,0.16)" : "rgba(10,5,6,0.45)",
                        border: `1px solid ${selected ? "rgba(201,168,76,0.4)" : "rgba(100,100,100,0.18)"}`,
                        color: selected ? "#f4ebd0" : "#6f655c",
                      }}
                    >
                      {selected ? "✓" : ""}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}