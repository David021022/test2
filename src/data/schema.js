export const SCHEMA_VERSION = 1;

export const STORAGE_KEY = "pomodoro.focus.appState";

export function createDefaultAppState() {
  return {
    schemaVersion: SCHEMA_VERSION,
    settings: {
      focusMinutes: 25,
      breakMinutes: 5,
      soundEnabled: true,
    },
    timer: {
      mode: "focus",
      status: "idle",
      remainingSeconds: 25 * 60,
      currentRound: 1,
      totalRounds: 8,
    },
    sessions: [],
    statsCache: null,
  };
}

export function isValidAppState(value) {
  if (!value || typeof value !== "object") {
    return false;
  }

  if (value.schemaVersion !== SCHEMA_VERSION) {
    return false;
  }

  if (!value.settings || !value.timer || !Array.isArray(value.sessions)) {
    return false;
  }

  return true;
}

export function getImportValidationError(payload) {
  if (!payload || typeof payload !== "object") {
    return "格式错误：文件内容不是有效 JSON 对象";
  }

  if (payload.schemaVersion !== SCHEMA_VERSION) {
    return "版本不支持：schemaVersion 不匹配";
  }

  if (!isValidAppState(payload.appState)) {
    return "格式错误：appState 结构不合法";
  }

  return null;
}
