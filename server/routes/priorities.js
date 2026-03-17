const express = require('express');
const router = express.Router();
const db = require('../db');

const MAX_PRIORITIES = 3;

// GET priorities for a date
router.get('/', (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ error: 'date query parameter is required' });

  const priorities = db.prepare(
    'SELECT * FROM priorities WHERE date = ? ORDER BY sort_order ASC'
  ).all(date);
  res.json(priorities);
});

// POST create a priority
router.post('/', (req, res) => {
  const { date, title } = req.body;
  if (!date) return res.status(400).json({ error: 'date is required' });
  if (!title || !title.trim()) return res.status(400).json({ error: 'title is required' });

  const count = db.prepare('SELECT COUNT(*) as count FROM priorities WHERE date = ?').get(date).count;
  if (count >= MAX_PRIORITIES) {
    return res.status(400).json({ error: `Maximum ${MAX_PRIORITIES} priorities allowed per day` });
  }

  const result = db.prepare(
    'INSERT INTO priorities (date, title, sort_order) VALUES (?, ?, ?)'
  ).run(date, title.trim(), count);

  const priority = db.prepare('SELECT * FROM priorities WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(priority);
});

// PUT update a priority
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, completed, sort_order } = req.body;

  const existing = db.prepare('SELECT * FROM priorities WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Priority not found' });

  const newTitle = title !== undefined ? title.trim() : existing.title;
  const newCompleted = completed !== undefined ? (completed ? 1 : 0) : existing.completed;
  const newSortOrder = sort_order !== undefined ? sort_order : existing.sort_order;

  if (title !== undefined && !newTitle) {
    return res.status(400).json({ error: 'title cannot be empty' });
  }

  db.prepare(
    "UPDATE priorities SET title = ?, completed = ?, sort_order = ?, updated_at = datetime('now') WHERE id = ?"
  ).run(newTitle, newCompleted, newSortOrder, id);

  const priority = db.prepare('SELECT * FROM priorities WHERE id = ?').get(id);
  res.json(priority);
});

// DELETE a priority
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const existing = db.prepare('SELECT * FROM priorities WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Priority not found' });

  db.prepare('DELETE FROM priorities WHERE id = ?').run(id);
  res.json({ message: 'Priority deleted' });
});

module.exports = router;
