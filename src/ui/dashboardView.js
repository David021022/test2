export function createDashboardView() {
  const modeEl = document.querySelector('[data-role="timer-mode"]');
  const remainingEl = document.querySelector('[data-role="timer-remaining"]');
  const roundEl = document.querySelector('[data-role="timer-round"]');
  const nextEl = document.querySelector('[data-role="timer-next"]');
  const toggleBtn = document.querySelector('[data-role="timer-toggle"]');
  const resetBtn = document.querySelector('[data-role="timer-reset"]');

  const todayPercentEl = document.querySelector('[data-role="stats-today-percent"]');
  const todayDurationEl = document.querySelector('[data-role="stats-today-duration"]');
  const todayCountEl = document.querySelector('[data-role="stats-today-count"]');
  const todayTargetEl = document.querySelector('[data-role="stats-today-target"]');
  const weekTotalEl = document.querySelector('[data-role="stats-week-total"]');
  const weekDayEls = document.querySelectorAll('[data-role="week-day"]');
  const slotBarEls = document.querySelectorAll('[data-role="slot-bar"]');
  const slotPeakEl = document.querySelector('[data-role="stats-slot-peak"]');

  function formatSeconds(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, '0');
    const seconds = Math.floor(totalSeconds % 60)
      .toString()
      .padStart(2, '0');

    return `${minutes}:${seconds}`;
  }

  function formatMinutes(minutes) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  }

  function render(timerState, settings, stats) {
    const isFocus = timerState.mode === 'focus';
    const nextMinutes = isFocus ? settings.breakMinutes : settings.focusMinutes;

    modeEl.textContent = isFocus ? '专注中' : '休息中';
    remainingEl.textContent = formatSeconds(timerState.remainingSeconds);
    roundEl.textContent = `第 ${timerState.currentRound}/${timerState.totalRounds} 个番茄`;
    nextEl.textContent = isFocus ? `${nextMinutes} 分钟休息` : `${nextMinutes} 分钟专注`;
    toggleBtn.textContent = timerState.status === 'running' ? '暂停' : '开始';

    todayPercentEl.textContent = `${stats.today.percent}%`;
    todayDurationEl.textContent = formatMinutes(stats.today.totalMinutes);
    todayCountEl.textContent = `${stats.today.count} 个番茄`;
    todayTargetEl.textContent = `${Math.floor(stats.today.targetMinutes / 60)}h`;

    weekDayEls.forEach((el) => {
      const day = el.dataset.weekday;
      const hours = stats.week.hoursByDay[day] || 0;
      el.textContent = `${hours.toFixed(1)}h`;
    });

    weekTotalEl.textContent = `周累计：${stats.week.totalHours.toFixed(1)}h`;

    slotBarEls.forEach((el) => {
      const hour = el.dataset.slotHour;
      const percent = stats.slot.percentByHour[hour] || 0;
      el.style.setProperty('--h', `${percent}%`);
    });

    slotPeakEl.textContent = `高峰时段：${stats.slot.peakLabel}`;
  }

  function bindEvents({ onToggle, onReset }) {
    toggleBtn.addEventListener('click', onToggle);
    resetBtn.addEventListener('click', onReset);
  }

  return {
    render,
    bindEvents,
  };
}
