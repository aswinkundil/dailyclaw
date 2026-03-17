# 🦞 DailyClaw

A full-stack daily planner to organize your day with goals, priorities, todos, notes, and hydration tracking. Built with React, Express, and SQLite.

## Features

- **🎯 Goal for the Day** — Set and track your main daily objective
- **⭐ Top 3 Priorities** — Focus on what matters most (max 3 per day)
- **✅ Todos** — Unlimited task list with completion tracking
- **📝 Notes** — Free-form text entries for thoughts and ideas
- **💧 Hydration Tracker** — Log glasses of water with a visual progress bar
- **📊 Reports** — Weekly and monthly analytics with Chart.js visualizations
- **📅 Date Navigation** — Browse and add entries for any date (past or present)

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React 19, Vite, Redux Toolkit       |
| Backend  | Node.js, Express                    |
| Database | SQLite (via better-sqlite3)         |
| Charts   | Chart.js + react-chartjs-2          |
| Auth     | HTTP Basic Authentication           |

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node.js)

## Getting Started

### 1. Clone the repository

```bash
git clone <repo-url>
cd dailyclaw
```

### 2. Set up the backend

```bash
cd server
npm install
```

Optionally edit `.env` to change the default credentials:

```env
PORT=3001
AUTH_USER=admin
AUTH_PASS=planner123
```

Seed the database with 14 days of sample data:

```bash
npm run seed
```

Start the API server:

```bash
npm start
# Server running at http://localhost:3001
```

### 3. Set up the frontend

Open a **new terminal**:

```bash
cd client
npm install
npm run dev
# App running at http://localhost:5173
```

### 4. Open the app

Navigate to **http://localhost:5173** in your browser.

When prompted for authentication, use:
- **Username:** `admin`
- **Password:** `planner123`

## Project Structure

```
dailyclaw/
├── server/                  # Express backend
│   ├── index.js             # Server entry point
│   ├── db.js                # SQLite schema & connection
│   ├── auth.js              # Basic auth middleware
│   ├── seed.js              # Sample data seeder
│   ├── .env                 # Environment config
│   └── routes/
│       ├── goals.js         # Goals CRUD
│       ├── priorities.js    # Priorities CRUD (max 3)
│       ├── todos.js         # Todos CRUD
│       ├── notes.js         # Notes CRUD
│       ├── hydration.js     # Hydration upsert
│       └── reports.js       # Weekly/monthly reports
├── client/                  # React + Vite frontend
│   ├── index.html
│   ├── vite.config.js       # Dev server + API proxy
│   └── src/
│       ├── main.jsx         # App entry point
│       ├── App.jsx          # Routes
│       ├── index.css        # Design system
│       ├── store/index.js   # Redux Toolkit store
│       ├── api/client.js    # Axios with auth
│       ├── components/      # UI components
│       └── pages/           # Dashboard & Reports
└── README.md
```

## API Endpoints

All endpoints require Basic Auth and return JSON.

| Method | Endpoint                      | Description                   |
|--------|-------------------------------|-------------------------------|
| GET    | `/api/goals?date=YYYY-MM-DD`  | Get goals for a date          |
| POST   | `/api/goals`                  | Create a goal                 |
| PUT    | `/api/goals/:id`              | Update a goal                 |
| DELETE | `/api/goals/:id`              | Delete a goal                 |
| GET    | `/api/priorities?date=...`    | Get priorities for a date     |
| POST   | `/api/priorities`             | Create a priority (max 3/day) |
| PUT    | `/api/priorities/:id`         | Update a priority             |
| DELETE | `/api/priorities/:id`         | Delete a priority             |
| GET    | `/api/todos?date=...`         | Get todos for a date          |
| POST   | `/api/todos`                  | Create a todo                 |
| PUT    | `/api/todos/:id`              | Update a todo                 |
| DELETE | `/api/todos/:id`              | Delete a todo                 |
| GET    | `/api/notes?date=...`         | Get notes for a date          |
| POST   | `/api/notes`                  | Create a note                 |
| PUT    | `/api/notes/:id`              | Update a note                 |
| DELETE | `/api/notes/:id`              | Delete a note                 |
| GET    | `/api/hydration?date=...`     | Get hydration for a date      |
| PUT    | `/api/hydration`              | Upsert hydration              |
| GET    | `/api/reports/weekly?date=..` | Weekly report                 |
| GET    | `/api/reports/monthly?date=.` | Monthly report                |

## License

MIT
