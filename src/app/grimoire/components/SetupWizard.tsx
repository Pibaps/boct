"use client";

import { useState, useMemo } from "react";
import { useLang } from "@/context/LangContext";
import { type Edition, type ScriptModifier, type GrimoireSession, type GrimoireSessionSummary } from "../types";
import { buildScriptComposition, getAvailableModifiers, pickCharactersForScript, randomizePlayers, generateId, validateComposition, getCompositionFromSelection } from "../utils";
import { charactersByEdition } from "@/data/characters";
import SetupEditionCard from "./SetupEditionCard";
import SetupPlayerCount from "./SetupPlayerCount";
import SetupCompositionView from "./SetupCompositionView";
import SetupModifiers from "./SetupModifiers";
import SetupCharacterSelection from "./SetupCharacterSelection";

interface Props {
  onStart: (session: GrimoireSession) => void;
  history: GrimoireSessionSummary[];
  onResume: (sessionId: string) => void;
  onDelete: (sessionId: string) => void;
  onRename: (sessionId: string, name: string) => void;
}

export default function SetupWizard({ onStart, history, onResume, onDelete, onRename }: Props) {
  const { t } = useLang();
  const [edition, setEdition] = useState<Edition>("trouble-brewing");
  const [playerCount, setPlayerCount] = useState(7);
  const [activeModifiers, setActiveModifiers] = useState<ScriptModifier[]>([]);
  const [compositionMode, setCompositionMode] = useState<"random" | "custom">("random");
  const [selectedCharacterIds, setSelectedCharacterIds] = useState<string[]>([]);
  const [sessionName, setSessionName] = useState(`Partie ${new Date().toLocaleDateString()}`);

  const availableModifiers = useMemo(() => getAvailableModifiers(edition), [edition]);

  const expectedComposition = useMemo(
    () => buildScriptComposition(playerCount, activeModifiers),
    [playerCount, activeModifiers]
  );

  const composition = useMemo(() => {
    if (compositionMode === "custom" && selectedCharacterIds.length > 0) {
      return getCompositionFromSelection(selectedCharacterIds, edition);
    }

    // Random mode: use automatic composition
    return expectedComposition;
  }, [compositionMode, selectedCharacterIds, edition, expectedComposition]);

  // Validation
  const validation = useMemo(
    () => validateComposition(composition, playerCount, activeModifiers, t, compositionMode === "custom" ? expectedComposition : undefined),
    [composition, playerCount, activeModifiers, t, compositionMode, expectedComposition]
  );

  const canCreate = compositionMode === "random" || selectedCharacterIds.length === playerCount;

  // Reset modifiers when edition changes
  const handleEditionChange = (ed: Edition) => {
    setEdition(ed);
    setActiveModifiers([]);
    setSelectedCharacterIds([]);
  };

  const handleToggleModifier = (mod: ScriptModifier) => {
    setActiveModifiers((prev) =>
      prev.some((m) => m.id === mod.id)
        ? prev.filter((m) => m.id !== mod.id)
        : [...prev, mod]
    );
  };

  const handleCreate = () => {
    const characters =
      compositionMode === "custom" && selectedCharacterIds.length > 0
        ? charactersByEdition[edition].filter((c) => selectedCharacterIds.includes(c.id))
        : pickCharactersForScript(edition, composition);

    const players = randomizePlayers(characters, playerCount);
    const now = new Date().toISOString();

    const session: GrimoireSession = {
      version: 4,
      id: generateId(),
      name: sessionName.trim() || `Partie ${new Date().toLocaleDateString()}`,
      createdAt: now,
      updatedAt: now,
      edition,
      setup: {
        playerCount,
        script: composition,
        selectedCharacterIds: characters.map((c) => c.id),
        modifiers: activeModifiers,
        compositionMode,
      },
      players,
      journal: [],
      ui: {
        currentPhase: "night",
        showSecrets: true,
        boardMode: "table",
        dayNumber: 0,
        nightNumber: 1,
        storyteller: {
          impBluffIds: [],
        },
      },
    };

    onStart(session);
  };

  const handleRename = (sessionId: string, currentName: string) => {
    const nextName = window.prompt(t("Nouveau nom de partie", "New game name"), currentName);
    if (!nextName) return;
    onRename(sessionId, nextName);
  };

  return (
    <div
      className="rounded-2xl p-6 md:p-8 space-y-6 overflow-x-hidden"
      style={{
        background: "rgba(20,8,13,0.6)",
        border: "1px solid rgba(201,168,76,0.15)",
      }}
    >
      <div className="text-center mb-2">
        <h2 className="text-cinzel font-bold text-xl" style={{ color: "#f4ebd0" }}>
          {t("Nouvelle Partie", "New Game")}
        </h2>
        <p className="text-baskerville text-sm mt-1" style={{ color: "#8a7a6b" }}>
          {t("Configurez votre session de jeu", "Configure your game session")}
        </p>
      </div>

      <div className="space-y-2">
        <label className="block text-xs uppercase tracking-widest text-cinzel" style={{ color: "#c9a84c" }}>
          {t("Nom de la partie", "Game name")}
        </label>
        <input
          type="text"
          value={sessionName}
          onChange={(e) => setSessionName(e.target.value)}
          className="w-full rounded-xl px-4 py-3 text-baskerville outline-none"
          style={{
            background: "rgba(10,5,6,0.55)",
            border: "1px solid rgba(139,0,0,0.2)",
            color: "#f4ebd0",
          }}
          placeholder={t("Partie du soir", "Evening game")}
        />
      </div>

      <div className="rounded-2xl p-4 space-y-3" style={{ background: "rgba(10,5,6,0.45)", border: "1px solid rgba(201,168,76,0.12)" }}>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h3 className="text-cinzel text-sm font-bold uppercase tracking-widest" style={{ color: "#c9a84c" }}>
              {t("Historique des parties", "Game history")}
            </h3>
            <p className="text-baskerville text-xs mt-1" style={{ color: "#8a7a6b" }}>
              {t("Reprenez une partie, renommez-la ou supprimez-la.", "Resume, rename, or delete a game.")}
            </p>
          </div>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {history.length === 0 ? (
            <p className="text-baskerville text-sm py-2" style={{ color: "#6f655c" }}>
              {t("Aucune partie enregistrée pour le moment.", "No saved games yet.")}
            </p>
          ) : (
            history.map((game) => (
              <div
                key={game.id}
                className="rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                style={{ background: "rgba(20,8,13,0.55)", border: "1px solid rgba(139,0,0,0.15)" }}
              >
                <div className="min-w-0">
                  <p className="text-cinzel text-sm font-semibold truncate" style={{ color: "#f4ebd0" }}>
                    {game.name}
                  </p>
                  <p className="text-baskerville text-xs truncate" style={{ color: "#8a7a6b" }}>
                    {t(
                      `${game.playerCount} joueurs · ${new Date(game.updatedAt).toLocaleString()}`,
                      `${game.playerCount} players · ${new Date(game.updatedAt).toLocaleString()}`
                    )}
                  </p>
                </div>
                <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:justify-end shrink-0">
                  <button
                    type="button"
                    onClick={() => onResume(game.id)}
                    className="flex-1 rounded-lg px-3 py-2 text-xs text-cinzel transition-all duration-150 sm:flex-none"
                    style={{ background: "rgba(139,0,0,0.2)", border: "1px solid rgba(139,0,0,0.25)", color: "#f4ebd0" }}
                  >
                    {t("Reprendre", "Resume")}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRename(game.id, game.name)}
                    className="flex-1 rounded-lg px-3 py-2 text-xs text-cinzel transition-all duration-150 sm:flex-none"
                    style={{ background: "rgba(20,8,13,0.5)", border: "1px solid rgba(100,100,100,0.2)", color: "#c9b891" }}
                  >
                    {t("Renommer", "Rename")}
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(game.id)}
                    className="flex-1 rounded-lg px-3 py-2 text-xs text-cinzel transition-all duration-150 sm:flex-none"
                    style={{ background: "rgba(82,30,30,0.65)", border: "1px solid rgba(244,67,54,0.18)", color: "#ffb7b7" }}
                  >
                    {t("Supprimer", "Delete")}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <SetupEditionCard selected={edition} onSelect={handleEditionChange} />
      <SetupPlayerCount count={playerCount} onChange={setPlayerCount} />
      <SetupCompositionView composition={composition} />
      
      {/* Character Selection */}
      <SetupCharacterSelection
        edition={edition}
        playerCount={playerCount}
        expectedComposition={expectedComposition.totals}
        selectedCharacterIds={selectedCharacterIds}
        onSelectionChange={setSelectedCharacterIds}
        mode={compositionMode}
        onModeChange={setCompositionMode}
      />

      <SetupModifiers
        available={availableModifiers}
        active={activeModifiers}
        onToggle={handleToggleModifier}
      />

      {/* Validation Messages */}
      {!validation.valid && (
        <div
          className="rounded-lg p-3 space-y-2"
          style={{ background: "rgba(244,67,54,0.15)", border: "1px solid rgba(244,67,54,0.3)" }}
        >
          {validation.errors.map((error, i) => (
            <p key={i} className="text-baskerville text-sm" style={{ color: "#ff6b6b" }}>
              ⚠️ {error}
            </p>
          ))}
        </div>
      )}

      {validation.warnings.length > 0 && (
        <div
          className="rounded-lg p-3 space-y-2"
          style={{ background: "rgba(255,152,0,0.15)", border: "1px solid rgba(255,152,0,0.3)" }}
        >
          {validation.warnings.map((warning, i) => (
            <p key={i} className="text-baskerville text-sm" style={{ color: "#ffb74d" }}>
              ℹ️ {warning}
            </p>
          ))}
        </div>
      )}

      <button
        onClick={handleCreate}
        disabled={!canCreate || !validation.valid}
        className={`w-full py-3 rounded-xl text-cinzel font-bold tracking-wide transition-all duration-200 ${
          canCreate && validation.valid ? "hover:scale-[1.01] cursor-pointer" : "opacity-50 cursor-not-allowed"
        }`}
        style={{
          background: "linear-gradient(135deg, rgba(139,0,0,0.4), rgba(139,0,0,0.2))",
          border: "1px solid rgba(139,0,0,0.5)",
          color: "#f4ebd0",
          fontSize: "0.95rem",
        }}
      >
        ✦ {t("Créer la Partie", "Create Game")}
      </button>
    </div>
  );
}
