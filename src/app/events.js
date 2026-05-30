export function createAppEvents() {
  const doneAudio = new Audio('/assets/sounds/timer-done.mp3');

  function handleSessionComplete({ soundEnabled }) {
    if (!soundEnabled) {
      return;
    }

    try {
      doneAudio.currentTime = 0;
      const playPromise = doneAudio.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
          // Do not block timer flow when audio playback fails.
        });
      }
    } catch {
      // Do not block timer flow when audio playback fails.
    }
  }

  return {
    handleSessionComplete,
  };
}
