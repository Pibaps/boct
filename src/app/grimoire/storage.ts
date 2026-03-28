import { type GrimoireSession } from "./types";

const ACTIVE_SESSION_KEY = "botc-grimoire-v2-active";
const SESSIONS_KEY = "botc-grimoire-v2-sessions";
const LEGACY_STORAGE_KEY = "botc-grimoire-v1";
const LEGACY_BACKUP_STORAGE_KEY = "botc-grimoire-v1-backup";
const CURRENT_VERSION = 4;

export function loadGrimoire(): GrimoireSession | null {
  if (typeof window === "undefined") return null;

  try {
    const activeId = localStorage.getItem(ACTIVE_SESSION_KEY);
    if (activeId) {
      return loadGrimoireById(activeId);
    }

    const legacySession = readSession(localStorage.getItem(LEGACY_STORAGE_KEY)) ?? readSession(localStorage.getItem(LEGACY_BACKUP_STORAGE_KEY));
    if (legacySession) {
      saveGrimoire(legacySession);
      return legacySession;
    }

    return null;
  } catch {
    return null;
  }
}

export function saveGrimoire(state: GrimoireSession): void {
  if (typeof window === "undefined") return;

  try {
    const updated = normalizeSession({ ...state, updatedAt: new Date().toISOString() });
    const sessions = listGrimoireSessions().filter((session) => session.id !== updated.id);
    sessions.unshift(updated);

    localStorage.setItem(ACTIVE_SESSION_KEY, updated.id);
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));

    // Keep the legacy single-session keys populated for older app versions.
    localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(updated));
    localStorage.setItem(LEGACY_BACKUP_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to save grimoire:", e);
  }
}

export function clearGrimoire(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACTIVE_SESSION_KEY);
}

export function listGrimoireSessions(): GrimoireSession[] {
  if (typeof window === "undefined") return [];

  return readSessions(localStorage.getItem(SESSIONS_KEY)).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function loadGrimoireById(id: string): GrimoireSession | null {
  return listGrimoireSessions().find((session) => session.id === id) ?? null;
}

export function deleteGrimoireSession(id: string): void {
  if (typeof window === "undefined") return;

  try {
    const sessions = listGrimoireSessions().filter((session) => session.id !== id);
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));

    const activeId = localStorage.getItem(ACTIVE_SESSION_KEY);
    if (activeId === id) {
      if (sessions.length > 0) {
        localStorage.setItem(ACTIVE_SESSION_KEY, sessions[0].id);
      } else {
        localStorage.removeItem(ACTIVE_SESSION_KEY);
      }
    }
  } catch (e) {
    console.error("Failed to delete grimoire session:", e);
  }
}

export function renameGrimoireSession(id: string, name: string): GrimoireSession | null {
  if (typeof window === "undefined") return null;

  const trimmedName = name.trim();
  if (!trimmedName) return null;

  try {
    const sessions = listGrimoireSessions();
    const index = sessions.findIndex((session) => session.id === id);
    if (index === -1) return null;

    const updated = normalizeSession({
      ...sessions[index],
      name: trimmedName,
      updatedAt: new Date().toISOString(),
    });
    sessions[index] = updated;

    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));

    const activeId = localStorage.getItem(ACTIVE_SESSION_KEY);
    if (activeId === id) {
      localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(updated));
      localStorage.setItem(LEGACY_BACKUP_STORAGE_KEY, JSON.stringify(updated));
    }

    return updated;
  } catch (e) {
    console.error("Failed to rename grimoire session:", e);
    return null;
  }
}

function readSession(raw: string | null): GrimoireSession | null {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as GrimoireSession;
    if (typeof parsed?.version !== "number") return null;

    if (parsed.version < CURRENT_VERSION) {
      return migrate(parsed);
    }

    return normalizeSession(parsed);
  } catch {
    return null;
  }
}

function readSessions(raw: string | null): GrimoireSession[] {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed.map((item) => readSession(JSON.stringify(item))).filter((session): session is GrimoireSession => Boolean(session));
  } catch {
    return [];
  }
}

function migrate(old: GrimoireSession): GrimoireSession {
  const setup = old.setup as GrimoireSession["setup"] & {
    compositionMode?: "random" | "custom";
  };

  return normalizeSession({
    ...old,
    version: CURRENT_VERSION,
    name: old.name?.trim() || defaultSessionName(old.createdAt),
    setup: {
      ...(setup as GrimoireSession["setup"]),
      compositionMode: setup.compositionMode ?? "random",
    },
    ui: {
      ...old.ui,
      boardMode: old.ui?.boardMode ?? "table",
      storyteller: old.ui?.storyteller ?? { impBluffIds: [] },
    },
  });
}

function normalizeSession(session: GrimoireSession): GrimoireSession {
  return {
    ...session,
    version: CURRENT_VERSION,
    name: session.name?.trim() || defaultSessionName(session.createdAt),
    setup: {
      ...session.setup,
      compositionMode: session.setup.compositionMode ?? "random",
    },
    ui: {
      ...session.ui,
      boardMode: session.ui?.boardMode ?? "table",
      storyteller: session.ui?.storyteller ?? { impBluffIds: [] },
    },
  };
}

function defaultSessionName(createdAt: string): string {
  const date = new Date(createdAt);
  return `Partie ${date.toLocaleDateString()}`;
}