export function createDataView() {
  const exportBtn = document.querySelector('[data-role="data-export"]');
  const importBtn = document.querySelector('[data-role="data-import"]');
  const statusEl = document.querySelector('[data-role="data-status"]');

  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.json,application/json';
  fileInput.style.display = 'none';
  document.body.appendChild(fileInput);

  function setStatus(message) {
    statusEl.textContent = message;
  }

  function bindEvents({ onExport, onImport }) {
    exportBtn.addEventListener('click', () => {
      onExport();
      setStatus(`最近一次导出：成功（${new Date().toLocaleString()}）`);
    });

    importBtn.addEventListener('click', () => {
      fileInput.value = '';
      fileInput.click();
    });

    fileInput.addEventListener('change', async () => {
      const file = fileInput.files && fileInput.files[0];
      if (!file) {
        return;
      }

      const result = await onImport(file);
      if (result.ok) {
        setStatus(`最近一次导入：成功（${new Date(result.importedAt).toLocaleString()}）`);
      } else {
        setStatus(`导入失败：${result.error}`);
      }
    });
  }

  return {
    bindEvents,
    setStatus,
  };
}
