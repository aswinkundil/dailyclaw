require('dotenv').config();
const express = require('express');
const cors = require('cors');
const basicAuth = require('./auth');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
}));
app.use(express.json());
app.use(basicAuth);

// Routes
app.use('/api/goals', require('./routes/goals'));
app.use('/api/priorities', require('./routes/priorities'));
app.use('/api/todos', require('./routes/todos'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/hydration', require('./routes/hydration'));
app.use('/api/reports', require('./routes/reports'));

// Health check (no auth)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`DailyClaw API running on http://localhost:${PORT}`);
});
