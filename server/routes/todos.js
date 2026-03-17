const express = require('express');
const router = express.Router();
const db = require('../db');

// GET todos for a date
router.get('/', (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ error: 'date query parameter is required' });

  const todos = db.prepare('SELECT * FROM todos WHERE date = ? ORDER BY created_at ASC').all(date);
  res.json(todos);
});

// POST create a todo
router.post('/', (req, res) => {
  const { date, title } = req.body;
  if (!date) return res.status(400).json({ error: 'date is required' });
  if (!title || !title.trim()) return res.status(400).json({ error: 'title is required' });

  const result = db.prepare(
    'INSERT INTO todos (date, title) VALUES (?, ?)'
  ).run(date, title.trim());

  const todo = db.prepare('SELECT * FROM todos WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(todo);
});

// PUT update a todo
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  const existing = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Todo not found' });

  const newTitle = title !== undefined ? title.trim() : existing.title;
  const newCompleted = completed !== undefined ? (completed ? 1 : 0) : existing.completed;

  if (title !== undefined && !newTitle) {
    return res.status(400).json({ error: 'title cannot be empty' });
  }

  db.prepare(
    "UPDATE todos SET title = ?, completed = ?, updated_at = datetime('now') WHERE id = ?"
  ).run(newTitle, newCompleted, id);

  const todo = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
  res.json(todo);
});

// DELETE a todo
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const existing = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Todo not found' });

  db.prepare('DELETE FROM todos WHERE id = ?').run(id);
  res.json({ message: 'Todo deleted' });
});

module.exports = router;
