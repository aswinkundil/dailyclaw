const express = require('express');
const router = express.Router();
const db = require('../db');

// GET hydration for a date
router.get('/', (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ error: 'date query parameter is required' });

  const hydration = db.prepare('SELECT * FROM hydration WHERE date = ?').get(date);
  res.json(hydration || { date, glasses: 0 });
});

// PUT upsert hydration for a date
router.put('/', (req, res) => {
  const { date, glasses } = req.body;
  if (!date) return res.status(400).json({ error: 'date is required' });
  if (glasses === undefined || glasses < 0) {
    return res.status(400).json({ error: 'glasses must be a non-negative number' });
  }

  const existing = db.prepare('SELECT * FROM hydration WHERE date = ?').get(date);

  if (existing) {
    db.prepare(
      "UPDATE hydration SET glasses = ?, updated_at = datetime('now') WHERE date = ?"
    ).run(glasses, date);
  } else {
    db.prepare(
      'INSERT INTO hydration (date, glasses) VALUES (?, ?)'
    ).run(date, glasses);
  }

  const hydration = db.prepare('SELECT * FROM hydration WHERE date = ?').get(date);
  res.json(hydration);
});

module.exports = router;
