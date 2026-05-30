export function createFocusSessionRecord({ endedAt, focusMinutes, round }) {
  const end = new Date(endedAt);
  const durationMinutes = focusMinutes;
  const start = new Date(end.getTime() - durationMinutes * 60 * 1000);

  return {
    mode: "focus",
    startedAt: start.toISOString(),
    endedAt: end.toISOString(),
    durationMinutes,
    round,
  };
}

function isSameLocalDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getWeekStart(date) {
  const start = new Date(date);
  const day = start.getDay();
  const distanceToMonday = day === 0 ? 6 : day - 1;
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - distanceToMonday);
  return start;
}

export function buildStatsSummary({ sessions, now, dailyTargetMinutes = 240 }) {
  const current = new Date(now);
  const weekStart = getWeekStart(current);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);

  const todaySessions = [];
  const weekMinutesByDay = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  const slotMinutesByHour = { 8: 0, 10: 0, 12: 0, 14: 0, 16: 0, 18: 0 };

  sessions.forEach((session) => {
    if (session.mode !== "focus") {
      return;
    }

    const endedAt = new Date(session.endedAt);
    if (isSameLocalDay(endedAt, current)) {
      todaySessions.push(session);
    }

    if (endedAt >= weekStart && endedAt < weekEnd) {
      weekMinutesByDay[endedAt.getDay()] += session.durationMinutes;
    }

    const hour = endedAt.getHours();
    const slotHour = hour < 9 ? 8 : hour < 11 ? 10 : hour < 13 ? 12 : hour < 15 ? 14 : hour < 17 ? 16 : 18;
    slotMinutesByHour[slotHour] += session.durationMinutes;
  });

  const todayMinutes = todaySessions.reduce((sum, s) => sum + s.durationMinutes, 0);
  const todayCount = todaySessions.length;
  const todayPercent = dailyTargetMinutes > 0
    ? Math.min(100, Math.round((todayMinutes / dailyTargetMinutes) * 100))
    : 0;

  const weekHoursByDay = Object.fromEntries(
    Object.entries(weekMinutesByDay).map(([k, minutes]) => [k, minutes / 60])
  );
  const weekTotalHours = Object.values(weekMinutesByDay).reduce((sum, minutes) => sum + minutes, 0) / 60;

  const maxSlotMinutes = Math.max(1, ...Object.values(slotMinutesByHour));
  const slotPercentByHour = Object.fromEntries(
    Object.entries(slotMinutesByHour).map(([hour, minutes]) => [
      hour,
      Math.round((minutes / maxSlotMinutes) * 100),
    ])
  );

  const peakHour = Object.entries(slotMinutesByHour).sort((a, b) => b[1] - a[1])[0][0];

  return {
    today: {
      totalMinutes: todayMinutes,
      count: todayCount,
      percent: todayPercent,
      targetMinutes: dailyTargetMinutes,
    },
    week: {
      hoursByDay: weekHoursByDay,
      totalHours: weekTotalHours,
    },
    slot: {
      percentByHour: slotPercentByHour,
      peakLabel: `${peakHour}:00 - ${String(Number(peakHour) + 2).padStart(2, "0")}:00`,
    },
  };
}
