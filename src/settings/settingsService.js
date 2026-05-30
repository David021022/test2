import { createTimerStateFromSettings } from "../timer/timerState.js";

export function sanitizeSettings(input) {
  const focusMinutes = Math.max(1, Math.floor(Number(input.focusMinutes) || 25));
  const breakMinutes = Math.max(1, Math.floor(Number(input.breakMinutes) || 5));

  return {
    focusMinutes,
    breakMinutes,
    soundEnabled: Boolean(input.soundEnabled),
  };
}

export function applySettings(appState, nextSettings) {
  const sanitized = sanitizeSettings(nextSettings);
  appState.settings = sanitized;

  if (appState.timer.status !== "running" && appState.timer.status !== "paused") {
    appState.timer = createTimerStateFromSettings(appState.settings);
  }

  return appState.settings;
}
