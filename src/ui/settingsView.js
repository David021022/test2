export function createSettingsView() {
  const focusInput = document.querySelector('[data-role="settings-focus-minutes"]');
  const breakInput = document.querySelector('[data-role="settings-break-minutes"]');
  const soundInput = document.querySelector('[data-role="settings-sound-enabled"]');
  const saveBtn = document.querySelector('[data-role="settings-save"]');
  const soundToggle = soundInput.closest('.toggle');

  function render(settings) {
    focusInput.value = settings.focusMinutes;
    breakInput.value = settings.breakMinutes;
    soundInput.checked = settings.soundEnabled;
    soundToggle.classList.toggle('on', settings.soundEnabled);
  }

  function readForm() {
    return {
      focusMinutes: focusInput.value,
      breakMinutes: breakInput.value,
      soundEnabled: soundInput.checked,
    };
  }

  function bindEvents({ onSave }) {
    soundInput.addEventListener('change', () => {
      soundToggle.classList.toggle('on', soundInput.checked);
    });

    saveBtn.addEventListener('click', () => {
      onSave(readForm());
    });
  }

  return {
    render,
    bindEvents,
  };
}
