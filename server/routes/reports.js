const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * Helper: get the Monday and Sunday of the ISO week containing `dateStr`.
 */
function getWeekRange(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const day = d.getDay(); // 0=Sun,1=Mon,...6=Sat
  const diffToMon = day === 0 ? -6 : 1 - day;
  const monday = new Date(d);
  monday.setDate(d.getDate() + diffToMon);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return {
    start: monday.toISOString().slice(0, 10),
    end: sunday.toISOString().slice(0, 10),
  };
}

/**
 * Helper: get the first and last day of the month containing `dateStr`.
 */
function getMonthRange(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const start = new Date(d.getFullYear(), d.getMonth(), 1);
  const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  return {
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
  };
}

/**
 * Build daily breakdown and aggregate stats for a date range.
 */
function buildReport(startDate, endDate) {
  // Daily priority stats
  const priorityStats = db.prepare(`
    SELECT date,
      COUNT(*) as total,
      SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as completed
    FROM priorities WHERE date BETWEEN ? AND ?
    GROUP BY date ORDER BY date
  `).all(startDate, endDate);

  // Daily todo stats
  const todoStats = db.prepare(`
    SELECT date,
      COUNT(*) as total,
      SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as completed
    FROM todos WHERE date BETWEEN ? AND ?
    GROUP BY date ORDER BY date
  `).all(startDate, endDate);

  // Daily hydration
  const hydrationStats = db.prepare(`
    SELECT date, glasses FROM hydration
    WHERE date BETWEEN ? AND ?
    ORDER BY date
  `).all(startDate, endDate);

  // Daily notes count
  const noteStats = db.prepare(`
    SELECT date, COUNT(*) as count FROM notes
    WHERE date BETWEEN ? AND ?
    GROUP BY date ORDER BY date
  `).all(startDate, endDate);

  // Daily goals count
  const goalStats = db.prepare(`
    SELECT date, COUNT(*) as count FROM goals
    WHERE date BETWEEN ? AND ?
    GROUP BY date ORDER BY date
  `).all(startDate, endDate);

  // Build day-by-day map
  const days = {};
  const current = new Date(startDate + 'T00:00:00');
  const last = new Date(endDate + 'T00:00:00');
  while (current <= last) {
    const key = current.toISOString().slice(0, 10);
    days[key] = {
      date: key,
      priorities: { total: 0, completed: 0 },
      todos: { total: 0, completed: 0 },
      hydration: 0,
      notes: 0,
      goals: 0,
    };
    current.setDate(current.getDate() + 1);
  }

  for (const r of priorityStats) {
    if (days[r.date]) days[r.date].priorities = { total: r.total, completed: r.completed };
  }
  for (const r of todoStats) {
    if (days[r.date]) days[r.date].todos = { total: r.total, completed: r.completed };
  }
  for (const r of hydrationStats) {
    if (days[r.date]) days[r.date].hydration = r.glasses;
  }
  for (const r of noteStats) {
    if (days[r.date]) days[r.date].notes = r.count;
  }
  for (const r of goalStats) {
    if (days[r.date]) days[r.date].goals = r.count;
  }

  // Aggregate
  const dailyArray = Object.values(days);
  const totalPriorities = dailyArray.reduce((s, d) => s + d.priorities.total, 0);
  const completedPriorities = dailyArray.reduce((s, d) => s + d.priorities.completed, 0);
  const totalTodos = dailyArray.reduce((s, d) => s + d.todos.total, 0);
  const completedTodos = dailyArray.reduce((s, d) => s + d.todos.completed, 0);
  const totalHydration = dailyArray.reduce((s, d) => s + d.hydration, 0);
  const daysWithHydration = dailyArray.filter(d => d.hydration > 0).length;
  const totalNotes = dailyArray.reduce((s, d) => s + d.notes, 0);
  const totalGoals = dailyArray.reduce((s, d) => s + d.goals, 0);

  return {
    startDate,
    endDate,
    summary: {
      totalPriorities,
      completedPriorities,
      priorityCompletionRate: totalPriorities > 0
        ? Math.round((completedPriorities / totalPriorities) * 100)
        : 0,
      totalTodos,
      completedTodos,
      todoCompletionRate: totalTodos > 0
        ? Math.round((completedTodos / totalTodos) * 100)
        : 0,
      totalHydration,
      avgHydration: daysWithHydration > 0
        ? +(totalHydration / dailyArray.length).toFixed(1)
        : 0,
      totalNotes,
      totalGoals,
    },
    daily: dailyArray,
  };
}

// GET /api/reports/weekly?date=YYYY-MM-DD
router.get('/weekly', (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ error: 'date query parameter is required' });

  const { start, end } = getWeekRange(date);
  const report = buildReport(start, end);
  res.json({ type: 'weekly', ...report });
});

// GET /api/reports/monthly?date=YYYY-MM-DD
router.get('/monthly', (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ error: 'date query parameter is required' });

  const { start, end } = getMonthRange(date);
  const report = buildReport(start, end);
  res.json({ type: 'monthly', ...report });
});

module.exports = router;
