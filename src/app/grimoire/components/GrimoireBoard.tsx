"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLang } from "@/context/LangContext";
import { isMobileBuild } from "@/config/buildMode";
import { allCharacters, editionMeta, type Character } from "@/data/characters";
import { glossaryIconMap } from "@/data/glossary";
import { type GrimoireSession, type PlayerEntry, type TokenKind, type PlayerState } from "../types";
import PlayerTable from "./PlayerTable";
import PhaseControls from "./PhaseControls";
import JournalPanel from "./JournalPanel";
import IconLegend, { type IconLegendItem } from "@/components/IconLegend";
import RoleModal from "./RoleModal";
import StorytellerPanel from "./StorytellerPanel";

interface Props {
  session: GrimoireSession;
  onUpdateSession: (updater: (prev: GrimoireSession) => GrimoireSession) => void;
  onReset: () => void;
}

interface ToastItem {
  id: string;
  message: string;
  tone: "info" | "warning" | "success";
}

const tokenLabels: Record<TokenKind, { fr: string; en: string }> = {
  poisoned: { fr: "empoisonné", en: "poisoned" },
  drunk: { fr: "ivre", en: "drunk" },
  protected: { fr: "protégé", en: "protected" },
  "night-kill": { fr: "tué la nuit", en: "night-killed" },
  custom: { fr: "personnalisé", en: "custom" },
};

const makeId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;

export default function GrimoireBoard({ session, onUpdateSession, onReset }: Props) {
  const { t } = useLang();
  const meta = editionMeta[session.edition];
  const [activeRole, setActiveRole] = useState<Character | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const toastTimers = useRef<Record<string, number>>({});

  const legendItems: IconLegendItem[] = useMemo(
    () => [
      {
        labelFr: "Vivant",
        labelEn: "Alive",
        descriptionFr: "Le joueur est en jeu, il peut voter et utiliser ses capacités.",
        descriptionEn: "The player is still in play and can vote or use their ability.",
        color: "#4caf50",
        icon: glossaryIconMap.alive,
      },
      {
        labelFr: "Mort",
        labelEn: "Dead",
        descriptionFr: "Le joueur a été éliminé mais reste visible dans le Grimoire.",
        descriptionEn: "The player has died but remains visible in the Grimoire.",
        color: "#666",
        icon: glossaryIconMap.dead,
      },
      {
        labelFr: "Exécuté",
        labelEn: "Executed",
        descriptionFr: "Mort pendant la journée à la suite d'un vote.",
        descriptionEn: "Killed during the day as the result of a vote.",
        color: "#8B0000",
        icon: glossaryIconMap.executed,
      },
      {
        labelFr: "Empoisonné",
        labelEn: "Poisoned",
        descriptionFr: "La capacité du joueur est altérée tant que le jeton reste actif.",
        descriptionEn: "The player's ability is altered while the token remains active.",
        color: "#9c27b0",
        icon: { src: "/assets/botc/wiki.bloodontheclocktower.com/Icon_poisoner-fd3059039e.png", alt: "Poisoned" },
      },
      {
        labelFr: "Ivre",
        labelEn: "Drunk",
        descriptionFr: "Le joueur reçoit de fausses informations sans le savoir.",
        descriptionEn: "The player receives false information without knowing it.",
        color: "#ff9800",
        icon: { src: "/assets/botc/wiki.bloodontheclocktower.com/Icon_drunk-5ea4cf9d12.png", alt: "Drunk" },
      },
      {
        labelFr: "Protégé",
        labelEn: "Protected",
        descriptionFr: "Le joueur bénéficie d'une protection temporaire.",
        descriptionEn: "The player currently benefits from protection.",
        color: "#4caf50",
        icon: { src: "/assets/botc/wiki.bloodontheclocktower.com/Icon_sentinel-e475588cec.png", alt: "Protected" },
      },
      {
        labelFr: "Tué la nuit",
        labelEn: "Night Kill",
        descriptionFr: "Le joueur est éliminé par une action nocturne.",
        descriptionEn: "The player was killed by a night action.",
        color: "#f44336",
        icon: { src: "/assets/botc/couteau.png", alt: "Night Kill" },
      },
    ],
    []
  );

  useEffect(() => {
    return () => {
      Object.values(toastTimers.current).forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  const pushToast = (message: string, tone: ToastItem["tone"] = "info") => {
    const id = makeId();
    setToasts((prev) => [...prev, { id, message, tone }]);
    toastTimers.current[id] = window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
      delete toastTimers.current[id];
    }, 4200);
  };

  const dismissToast = (id: string) => {
    const timer = toastTimers.current[id];
    if (timer) {
      window.clearTimeout(timer);
      delete toastTimers.current[id];
    }
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const scrollToJournal = () => {
    document.getElementById("grimoire-journal")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const addJournalEntry = (message: string, phase: "night" | "day", meta?: Record<string, unknown>, tone: ToastItem["tone"] = "info") => {
    onUpdateSession((prev) => ({
      ...prev,
      journal: [
        ...prev.journal,
        {
          id: makeId(),
          at: new Date().toISOString(),
          phase,
          message,
          meta,
        },
      ],
    }));
    pushToast(message, tone);
  };

  const handleUpdatePlayer = (id: string, updates: Partial<PlayerEntry>) => {
    onUpdateSession((prev) => ({
      ...prev,
      players: prev.players.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }));
  };

  const handleToggleToken = (id: string, token: TokenKind) => {
    const player = session.players.find((entry) => entry.id === id);
    if (!player) return;

    const character = allCharacters.find((entry) => entry.id === player.characterId);
    const phase = session.ui.currentPhase === "night" ? "night" : "day";
    const isActive = player.tokens.includes(token);
    const tokenLabel = tokenLabels[token];
    const roleSuffix = character && session.ui.showSecrets ? ` (${t(character.nameFr, character.nameEn)})` : "";
    const message = isActive
      ? t(
          `${player.name}${roleSuffix} n'a plus le jeton ${tokenLabel.fr}.`,
          `${player.name}${roleSuffix} no longer has the ${tokenLabel.en} token.`
        )
      : t(
          `${player.name}${roleSuffix} reçoit le jeton ${tokenLabel.fr}.`,
          `${player.name}${roleSuffix} gains the ${tokenLabel.en} token.`
        );

    onUpdateSession((prev) => ({
      ...prev,
      players: prev.players.map((entry) => {
        if (entry.id !== id) return entry;
        const has = entry.tokens.includes(token);
        return { ...entry, tokens: has ? entry.tokens.filter((item) => item !== token) : [...entry.tokens, token] };
      }),
      journal: [
        ...prev.journal,
        {
          id: makeId(),
          at: new Date().toISOString(),
          phase,
          message,
          meta: { kind: "token", playerId: id, token, active: !isActive },
        },
      ],
    }));

    pushToast(message, token === "poisoned" || token === "drunk" ? "warning" : "info");
  };

  const handleSetState = (id: string, state: PlayerState) => {
    const player = session.players.find((entry) => entry.id === id);
    if (!player) return;

    const character = allCharacters.find((entry) => entry.id === player.characterId);
    const phase = session.ui.currentPhase === "night" ? "night" : "day";
    const roleSuffix = character && session.ui.showSecrets ? ` (${t(character.nameFr, character.nameEn)})` : "";
    const message =
      state === "dead"
        ? t(`${player.name} est mort(e)${roleSuffix}.`, `${player.name} died${roleSuffix}.`)
        : state === "executed"
          ? t(`${player.name} a été exécuté(e)${roleSuffix}.`, `${player.name} was executed${roleSuffix}.`)
          : t(`${player.name} est vivant(e)${roleSuffix}.`, `${player.name} is alive${roleSuffix}.`);

    onUpdateSession((prev) => ({
      ...prev,
      players: prev.players.map((entry) => (entry.id === id ? { ...entry, state } : entry)),
      journal: [
        ...prev.journal,
        {
          id: makeId(),
          at: new Date().toISOString(),
          phase,
          message,
          meta: { kind: "state", playerId: id, state },
        },
      ],
    }));

    pushToast(message, state === "executed" ? "warning" : "info");
  };

  const handleShuffle = () => {
    onUpdateSession((prev) => {
      const charIds = [...prev.setup.selectedCharacterIds];
      for (let i = charIds.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [charIds[i], charIds[j]] = [charIds[j], charIds[i]];
      }

      return {
        ...prev,
        players: prev.players.map((entry, index) => ({
          ...entry,
          characterId: charIds[index] || entry.characterId,
        })),
        setup: { ...prev.setup, selectedCharacterIds: charIds },
      };
    });
  };

  const handleAdvancePhase = () => {
    onUpdateSession((prev) => {
      const { currentPhase, dayNumber, nightNumber } = prev.ui;
      let next = prev.ui;

      if (currentPhase === "night") {
        next = { ...next, currentPhase: "day", dayNumber: dayNumber + 1 };
      } else if (currentPhase === "day") {
        next = { ...next, currentPhase: "night", nightNumber: nightNumber + 1 };
      } else if (currentPhase === "setup") {
        next = { ...next, currentPhase: "night" };
      }

      const phaseLabel =
        next.currentPhase === "night"
          ? `🌙 ${t("Nuit", "Night")} ${next.nightNumber}`
          : `☀️ ${t("Jour", "Day")} ${next.dayNumber}`;

      const message = `${t("Phase :", "Phase:")} ${phaseLabel}`;

      return {
        ...prev,
        ui: next,
        journal: [
          ...prev.journal,
          {
            id: makeId(),
            at: new Date().toISOString(),
            phase: next.currentPhase === "night" ? ("night" as const) : ("day" as const),
            message,
            meta: { kind: "phase", phase: next.currentPhase },
          },
        ],
      };
    });

    const phaseLabel = session.ui.currentPhase === "night" ? `🌙 ${t("Nuit", "Night")} ${session.ui.nightNumber}` : `☀️ ${t("Jour", "Day")} ${session.ui.dayNumber}`;
    pushToast(`${t("Phase :", "Phase:")} ${phaseLabel}`, "info");
  };

  const handleToggleSecrets = () => {
    onUpdateSession((prev) => ({
      ...prev,
      ui: { ...prev.ui, showSecrets: !prev.ui.showSecrets },
    }));
  };

  const handleEndGame = () => {
    const message = `🏁 ${t("Fin de partie", "Game Over")}`;
    onUpdateSession((prev) => ({
      ...prev,
      ui: { ...prev.ui, currentPhase: "end" },
      journal: [
        ...prev.journal,
        {
          id: makeId(),
          at: new Date().toISOString(),
          phase: "day" as const,
          message,
          meta: { kind: "game-over" },
        },
      ],
    }));
    pushToast(message, "warning");
  };

  const handleAddJournalEntry = (message: string) => {
    const phase = session.ui.currentPhase === "night" ? "night" : "day";
    addJournalEntry(message, phase as "night" | "day", { kind: "manual" }, "info");
  };

  const aliveCount = session.players.filter((player) => player.state === "alive").length;
  const deadCount = session.players.filter((player) => player.state !== "alive").length;

  return (
    <div className={`${isMobileBuild ? "space-y-5" : "space-y-6"} overflow-x-hidden min-w-0`}>
      <div
        className="rounded-xl p-4 flex items-center justify-between gap-4 flex-wrap"
        style={{
          background: "rgba(20,8,13,0.5)",
          border: "1px solid rgba(139,0,0,0.15)",
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{meta.icon}</span>
          <div>
            <p className="text-cinzel text-xs uppercase tracking-widest" style={{ color: "#8a7a6b" }}>
              {session.name}
            </p>
            <p className="text-cinzel font-bold text-sm" style={{ color: "#f4ebd0" }}>
              {t(meta.nameFr, meta.nameEn)}
            </p>
            <p className="text-baskerville text-xs" style={{ color: "#8a7a6b" }}>
              {t(`${aliveCount} vivants · ${deadCount} morts`, `${aliveCount} alive · ${deadCount} dead`)}
            </p>
          </div>
        </div>
        <button
          onClick={onReset}
          className="px-3 py-1.5 rounded-lg text-cinzel text-xs transition-all duration-200"
          style={{
            background: "rgba(20,8,13,0.5)",
            border: "1px solid rgba(100,100,100,0.2)",
            color: "#8a7a6b",
          }}
        >
          {t("Nouvelle partie", "New Game")}
        </button>
      </div>

      <div className="space-y-5 min-w-0">
        <PhaseControls
          phase={session.ui.currentPhase}
          dayNumber={session.ui.dayNumber}
          nightNumber={session.ui.nightNumber}
          showSecrets={session.ui.showSecrets}
          onAdvancePhase={handleAdvancePhase}
          onToggleSecrets={handleToggleSecrets}
          onEndGame={handleEndGame}
        />

        <PlayerTable
          players={session.players}
          showSecrets={session.ui.showSecrets}
          onUpdatePlayer={handleUpdatePlayer}
          onToggleToken={handleToggleToken}
          onSetState={handleSetState}
          onShuffle={handleShuffle}
          onOpenRole={(characterId) => setActiveRole(allCharacters.find((character) => character.id === characterId) ?? null)}
        />

        <StorytellerPanel session={session} onUpdateSession={onUpdateSession} />

        <div className="space-y-5 min-w-0">
          <JournalPanel
            panelId="grimoire-journal"
            entries={session.journal}
            currentPhase={session.ui.currentPhase}
            onAddEntry={handleAddJournalEntry}
          />

          <IconLegend titleFr="Légende des icônes" titleEn="Icon Legend" items={legendItems} />
        </div>
      </div>

      {activeRole && <RoleModal character={activeRole} onClose={() => setActiveRole(null)} />}

      <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+6.25rem)] inset-x-0 z-[75] flex justify-center px-4 pointer-events-none">
        <div className="flex w-full max-w-md flex-col gap-2">
        {toasts.map((toast) => (
          <button
            key={toast.id}
            type="button"
            onClick={() => {
              dismissToast(toast.id);
              scrollToJournal();
            }}
            className="pointer-events-auto rounded-2xl border px-4 py-3 text-left shadow-2xl backdrop-blur-sm transition-all duration-200 hover:scale-[1.01]"
            style={{
              background: toast.tone === "warning" ? "rgba(82, 30, 30, 0.96)" : "rgba(20,8,13,0.96)",
              borderColor: toast.tone === "warning" ? "rgba(201,168,76,0.25)" : "rgba(139,0,0,0.18)",
            }}
            aria-label={t("Aller au journal", "Go to journal")}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: toast.tone === "warning" ? "#c9a84c" : "#8B0000" }} />
              <p className="text-baskerville text-sm leading-relaxed" style={{ color: "#f4ebd0" }}>
                {toast.message}
              </p>
            </div>
          </button>
        ))}
        </div>
      </div>
    </div>
  );
}
