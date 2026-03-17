const express = require('express');
const router = express.Router();
const db = require('../db');

// GET goals for a date
router.get('/', (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ error: 'date query parameter is required' });

  const goals = db.prepare('SELECT * FROM goals WHERE date = ? ORDER BY created_at ASC').all(date);
  res.json(goals);
});

// POST create a goal
router.post('/', (req, res) => {
  const { date, content } = req.body;
  if (!date) return res.status(400).json({ error: 'date is required' });
  if (content === undefined) return res.status(400).json({ error: 'content is required' });

  const result = db.prepare(
    'INSERT INTO goals (date, content) VALUES (?, ?)'
  ).run(date, content);

  const goal = db.prepare('SELECT * FROM goals WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(goal);
});

// PUT update a goal
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  if (content === undefined) return res.status(400).json({ error: 'content is required' });

  const existing = db.prepare('SELECT * FROM goals WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Goal not found' });

  db.prepare(
    "UPDATE goals SET content = ?, updated_at = datetime('now') WHERE id = ?"
  ).run(content, id);

  const goal = db.prepare('SELECT * FROM goals WHERE id = ?').get(id);
  res.json(goal);
});

// DELETE a goal
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const existing = db.prepare('SELECT * FROM goals WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Goal not found' });

  db.prepare('DELETE FROM goals WHERE id = ?').run(id);
  res.json({ message: 'Goal deleted' });
});

module.exports = router;
