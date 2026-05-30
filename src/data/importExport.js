import { SCHEMA_VERSION, getImportValidationError } from "./schema.js";

export function buildExportPayload(appState) {
  return {
    schemaVersion: appState.schemaVersion,
    exportedAt: new Date().toISOString(),
    appState,
  };
}

export function downloadJsonFile(payload, filename) {
  const json = JSON.stringify(payload, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}

export function exportAppState(appState) {
  const payload = buildExportPayload(appState);
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `pomodoro-backup-${stamp}.json`;
  downloadJsonFile(payload, filename);
}

export async function importAppStateFromFile(file) {
  const text = await file.text();
  let parsed;

  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, error: "格式错误：JSON 解析失败" };
  }

  const validationError = getImportValidationError(parsed);
  if (validationError) {
    return { ok: false, error: validationError };
  }

  return {
    ok: true,
    importedAt: new Date().toISOString(),
    appState: parsed.appState,
    schemaVersion: SCHEMA_VERSION,
  };
}
