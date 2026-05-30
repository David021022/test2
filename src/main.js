import { createAppEvents } from "./app/events.js";
import { initRouter } from "./app/router.js";
import { exportAppState, importAppStateFromFile } from "./data/importExport.js";
import { appendSession, loadState, saveState } from "./data/storage.js";
import { applySettings } from "./settings/settingsService.js";
import { buildStatsSummary, createFocusSessionRecord } from "./stats/statsService.js";
import { createTimerEngine } from "./timer/timerEngine.js";
import { createDashboardView } from "./ui/dashboardView.js";
import { createDataView } from "./ui/dataView.js";
import { createSettingsView } from "./ui/settingsView.js";

const appState = loadState();
const appEvents = createAppEvents();
const dashboardView = createDashboardView();
const settingsView = createSettingsView();
const dataView = createDataView();

const timerEngine = createTimerEngine({
  settings: appState.settings,
  timerState: appState.timer,
  onSessionComplete: ({ completedMode, completedRound }) => {
    if (completedMode === "focus") {
      appendSession(
        appState,
        createFocusSessionRecord({
          endedAt: Date.now(),
          focusMinutes: appState.settings.focusMinutes,
          round: completedRound,
        })
      );
    }

    appEvents.handleSessionComplete({
      soundEnabled: appState.settings.soundEnabled,
    });
    saveState(appState);
    renderAll();
  },
});

let tickIntervalId = null;

function ensureTicking() {
  if (tickIntervalId !== null) {
    return;
  }

  tickIntervalId = window.setInterval(() => {
    timerEngine.tick(1);
    renderAll();
    saveState(appState);
  }, 1000);
}

function stopTicking() {
  if (tickIntervalId === null) {
    return;
  }

  window.clearInterval(tickIntervalId);
  tickIntervalId = null;
}

function renderDashboard() {
  const stats = buildStatsSummary({
    sessions: appState.sessions,
    now: Date.now(),
    dailyTargetMinutes: 240,
  });
  dashboardView.render(appState.timer, appState.settings, stats);
}

function renderSettings() {
  settingsView.render(appState.settings);
}

function renderAll() {
  renderDashboard();
  renderSettings();
}

function replaceAppStateInPlace(nextState) {
  appState.schemaVersion = nextState.schemaVersion;
  appState.settings = nextState.settings;
  appState.timer = nextState.timer;
  appState.sessions = nextState.sessions;
  appState.statsCache = nextState.statsCache ?? null;
}

function handleToggleTimer() {
  if (appState.timer.status === "running") {
    timerEngine.pause();
    stopTicking();
  } else if (appState.timer.status === "paused") {
    timerEngine.resume();
    ensureTicking();
  } else {
    timerEngine.start();
    ensureTicking();
  }

  renderDashboard();
  saveState(appState);
}

function handleResetTimer() {
  timerEngine.reset();
  stopTicking();
  renderDashboard();
  saveState(appState);
}

function handleSaveSettings(nextSettings) {
  applySettings(appState, nextSettings);
  renderAll();
  saveState(appState);
}

function handleExportData() {
  exportAppState(appState);
}

async function handleImportData(file) {
  const result = await importAppStateFromFile(file);
  if (!result.ok) {
    return result;
  }

  stopTicking();
  replaceAppStateInPlace(result.appState);
  saveState(appState);
  renderAll();

  return {
    ok: true,
    importedAt: result.importedAt,
  };
}

initRouter();

dashboardView.bindEvents({
  onToggle: handleToggleTimer,
  onReset: handleResetTimer,
});

settingsView.bindEvents({
  onSave: handleSaveSettings,
});

dataView.bindEvents({
  onExport: handleExportData,
  onImport: handleImportData,
});

renderAll();

window.addEventListener("beforeunload", () => {
  stopTicking();
  saveState(appState);
});
