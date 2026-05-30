import {
  getModeDurationSeconds,
  resetTimerStateForCurrentMode,
} from "./timerState.js";

export function createTimerEngine({ settings, timerState, onSessionComplete }) {
  const notifySessionComplete =
    typeof onSessionComplete === "function" ? onSessionComplete : () => {};

  function start() {
    if (timerState.status === "running") {
      return timerState;
    }

    timerState.status = "running";
    return timerState;
  }

  function pause() {
    if (timerState.status !== "running") {
      return timerState;
    }

    timerState.status = "paused";
    return timerState;
  }

  function resume() {
    if (timerState.status !== "paused") {
      return timerState;
    }

    timerState.status = "running";
    return timerState;
  }

  function reset() {
    Object.assign(timerState, resetTimerStateForCurrentMode(timerState, settings));
    return timerState;
  }

  function tick(seconds = 1) {
    if (timerState.status !== "running") {
      return timerState;
    }

    if (seconds <= 0) {
      return timerState;
    }

    timerState.remainingSeconds = Math.max(0, timerState.remainingSeconds - seconds);

    if (timerState.remainingSeconds > 0) {
      return timerState;
    }

    const completedMode = timerState.mode;
    const completedRound = timerState.currentRound;

    if (completedMode === "focus") {
      timerState.mode = "break";
    } else {
      timerState.mode = "focus";
      timerState.currentRound = Math.min(
        timerState.totalRounds,
        timerState.currentRound + 1
      );
    }

    timerState.status = "idle";
    timerState.remainingSeconds = getModeDurationSeconds(settings, timerState.mode);

    notifySessionComplete({
      completedMode,
      completedRound,
      nextMode: timerState.mode,
      nextRemainingSeconds: timerState.remainingSeconds,
    });

    return timerState;
  }

  function getState() {
    return timerState;
  }

  return {
    start,
    pause,
    resume,
    reset,
    tick,
    getState,
  };
}
