export function createTimerStateFromSettings(settings) {
  return {
    mode: "focus",
    status: "idle",
    remainingSeconds: settings.focusMinutes * 60,
    currentRound: 1,
    totalRounds: 8,
  };
}

export function getModeDurationSeconds(settings, mode) {
  return mode === "focus"
    ? settings.focusMinutes * 60
    : settings.breakMinutes * 60;
}

export function resetTimerStateForCurrentMode(timerState, settings) {
  return {
    ...timerState,
    status: "idle",
    remainingSeconds: getModeDurationSeconds(settings, timerState.mode),
  };
}
