import { allCharacters, type Character } from "@/data/characters";
import { type GrimoireSession } from "./types";

export type NightWakeStatus = "ready" | "skipped";

export interface NightWakeStep {
  kind: "group" | "player";
  id: string;
  order: number;
  seat?: number;
  playerId?: string;
  playerName: string;
  characterId?: string;
  characterNameEn?: string;
  characterNameFr?: string;
  characterType?: Character["type"];
  status: NightWakeStatus;
  actionFr: string;
  actionEn: string;
  skipFr: string;
  skipEn: string;
}

export interface NightWakePlan {
  nightNumber: number;
  isFirstNight: boolean;
  steps: NightWakeStep[];
}

const typePriority: Record<Character["type"], number> = {
  townsfolk: 200,
  outsider: 250,
  minion: 100,
  demon: 50,
  traveller: 300,
  fabled: 400,
};

function getReferenceNightNumber(session: GrimoireSession): number {
  if (session.ui.currentPhase === "setup") return 1;
  if (session.ui.currentPhase === "night") return Math.max(1, session.ui.nightNumber);
  return Math.max(1, session.ui.nightNumber + 1);
}

function getAbilityText(character: Character): { fr: string; en: string } {
  return {
    fr: character.abilityFr?.trim() || character.ability.trim(),
    en: character.ability?.trim() || character.abilityFr.trim(),
  };
}

export function buildNightWakePlan(session: GrimoireSession): NightWakePlan {
  const nightNumber = getReferenceNightNumber(session);
  const isFirstNight = nightNumber === 1;
  const sortedPlayers = [...session.players].sort((a, b) => a.seat - b.seat || a.name.localeCompare(b.name));
  const evilPlayers = sortedPlayers.filter((player) => {
    const character = allCharacters.find((entry) => entry.id === player.characterId);
    return character?.type === "demon" || character?.type === "minion";
  });

  const steps: NightWakeStep[] = [];

  if (isFirstNight && evilPlayers.length > 0) {
    const minionPlayers = sortedPlayers.filter((player) => {
      const character = allCharacters.find((entry) => entry.id === player.characterId);
      return character?.type === "minion";
    });

    const demonPlayer = sortedPlayers.find((player) => {
      const character = allCharacters.find((entry) => entry.id === player.characterId);
      return character?.type === "demon";
    });

    if (minionPlayers.length > 0) {
      steps.push({
        kind: "group",
        id: `evil-minions-${nightNumber}`,
        order: 10,
        playerName: "Evil minions",
        status: "ready",
        actionFr:
          "Première nuit : réveillez d'abord les Sbires pour qu'ils identifient ensemble le Démon, puis replacez-les au sommeil.",
        actionEn:
          "First night: wake the Minions first so they identify the Demon together, then put the Minions back to sleep.",
        skipFr: "",
        skipEn: "",
      });
    }

    if (demonPlayer) {
      steps.push({
        kind: "group",
        id: `evil-demon-${nightNumber}`,
        order: 20,
        playerName: "Demon",
        status: "ready",
        actionFr:
          "Ensuite, réveillez le Démon, montrez-lui ses Sbires puis montrez-lui les 3 bluffs hors partie, puis remettez-le au sommeil.",
        actionEn:
          "Then wake the Demon, show it its Minions, then show it the 3 not-in-play bluffs, and finally put the Demon back to sleep.",
        skipFr: "",
        skipEn: "",
      });
    }
  }

  const playerSteps = sortedPlayers
    .flatMap((player) => {
      const character = allCharacters.find((entry) => entry.id === player.characterId);
      if (!character) return [];

      const shouldWake = isFirstNight
        ? Boolean(character.firstNight || ((character.type === "demon" || character.type === "minion") && character.otherNights))
        : Boolean(character.otherNights);
      if (!shouldWake) return [];

      const skipped = player.state !== "alive";
      const status: NightWakeStatus = skipped ? "skipped" : "ready";
      const ability = getAbilityText(character);

      return [
        {
          kind: "player" as const,
          id: `${player.id}-${nightNumber}`,
          order: (character.nightOrder ?? typePriority[character.type]) * 100 + player.seat,
          seat: player.seat,
          playerId: player.id,
          playerName: player.name,
          characterId: character.id,
          characterNameEn: character.nameEn,
          characterNameFr: character.nameFr,
          characterType: character.type,
          status,
          actionFr: ability.fr,
          actionEn: ability.en,
          skipFr: skipped ? "Ignorer: le joueur n'est plus vivant." : "",
          skipEn: skipped ? "Skip: the player is no longer alive." : "",
        },
      ];
    })
    .sort((a, b) => a.order - b.order || a.seat - b.seat);

  steps.push(...playerSteps);

  return {
    nightNumber,
    isFirstNight,
    steps,
  };
}
