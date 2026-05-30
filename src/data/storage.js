import {
  STORAGE_KEY,
  createDefaultAppState,
  isValidAppState,
} from "./schema.js";

export function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    const defaultState = createDefaultAppState();
    saveState(defaultState);
    return defaultState;
  }

  try {
    const parsed = JSON.parse(raw);
    if (isValidAppState(parsed)) {
      return parsed;
    }
  } catch {
    // fall back to default state when stored JSON is invalid
  }

  const fallbackState = createDefaultAppState();
  saveState(fallbackState);
  return fallbackState;
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetState() {
  const nextState = createDefaultAppState();
  saveState(nextState);
  return nextState;
}

export function appendSession(state, sessionRecord) {
  state.sessions.push(sessionRecord);
  saveState(state);
}
