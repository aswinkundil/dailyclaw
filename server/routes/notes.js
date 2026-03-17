const express = require('express');
const router = express.Router();
const db = require('../db');

// GET notes for a date
router.get('/', (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ error: 'date query parameter is required' });

  const notes = db.prepare('SELECT * FROM notes WHERE date = ? ORDER BY created_at ASC').all(date);
  res.json(notes);
});

// POST create a note
router.post('/', (req, res) => {
  const { date, content } = req.body;
  if (!date) return res.status(400).json({ error: 'date is required' });
  if (content === undefined) return res.status(400).json({ error: 'content is required' });

  const result = db.prepare(
    'INSERT INTO notes (date, content) VALUES (?, ?)'
  ).run(date, content);

  const note = db.prepare('SELECT * FROM notes WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(note);
});

// PUT update a note
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  if (content === undefined) return res.status(400).json({ error: 'content is required' });

  const existing = db.prepare('SELECT * FROM notes WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Note not found' });

  db.prepare(
    "UPDATE notes SET content = ?, updated_at = datetime('now') WHERE id = ?"
  ).run(content, id);

  const note = db.prepare('SELECT * FROM notes WHERE id = ?').get(id);
  res.json(note);
});

// DELETE a note
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const existing = db.prepare('SELECT * FROM notes WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Note not found' });

  db.prepare('DELETE FROM notes WHERE id = ?').run(id);
  res.json({ message: 'Note deleted' });
});

module.exports = router;
