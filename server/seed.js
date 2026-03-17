/**
 * Seed script — populates the last 14 days with sample data.
 * Run: node seed.js
 */
require('dotenv').config();
const db = require('./db');

function formatDate(d) {
  return d.toISOString().slice(0, 10);
}

function seedData() {
  const today = new Date();

  // Clear existing data
  db.exec('DELETE FROM goals');
  db.exec('DELETE FROM priorities');
  db.exec('DELETE FROM todos');
  db.exec('DELETE FROM notes');
  db.exec('DELETE FROM hydration');

  const goalTemplates = [
    'Ship the new feature and review PRs',
    'Focus on deep work — no meetings before noon',
    'Complete the quarterly planning document',
    'Refactor the authentication module',
    'Write blog post about best practices',
    'Prepare presentation for team meeting',
    'Finish code review backlog',
    'Set up CI/CD pipeline for the project',
    'Research new technologies for upcoming sprint',
    'Optimize database queries for performance',
    'Focus on learning and professional development',
    'Clear inbox and respond to pending requests',
    'Wrap up sprint tasks and update documentation',
    'Plan next week\'s objectives and priorities',
  ];

  const priorityTemplates = [
    ['Review Q1 roadmap', 'Deploy hotfix to production', 'Update API documentation'],
    ['Design new dashboard', 'Fix login bug', 'Write unit tests'],
    ['Sprint retrospective', 'Merge feature branch', 'Update dependencies'],
    ['Client meeting prep', 'Database migration', 'Code review'],
    ['Performance audit', 'Security patch', 'Team standup notes'],
    ['Deploy v2.0', 'User feedback analysis', 'Bug triage'],
    ['Onboarding docs', 'CI pipeline fix', 'API rate limiting'],
    ['Monitoring setup', 'Cache optimization', 'Error handling'],
    ['Load testing', 'Documentation update', 'Feature flag setup'],
    ['Release notes', 'Rollback plan', 'Smoke testing'],
    ['Architecture review', 'Tech debt cleanup', 'Mentoring session'],
    ['API versioning', 'Logging improvements', 'Analytics setup'],
    ['Mobile responsiveness', 'Accessibility audit', 'SEO optimization'],
    ['Backup verification', 'Disaster recovery plan', 'Compliance check'],
  ];

  const todoTemplates = [
    ['Buy groceries', 'Reply to emails', 'Schedule dentist appointment', 'Read chapter 5'],
    ['Water plants', 'Call insurance', 'Update resume', 'Gym session'],
    ['Clean desk', 'Backup photos', 'Order supplies', 'Walk 10k steps'],
    ['Laundry', 'Meal prep', 'Return package', 'Meditate 10 min'],
    ['Pay bills', 'Car wash', 'File receipts', 'Stretch break'],
  ];

  const noteTemplates = [
    ['Interesting article on system design — save for later', 'Meeting notes: agreed on new sprint timeline'],
    ['Idea: build a CLI tool for daily standup summaries'],
    ['Learned about CQRS pattern today — could help with our read-heavy service', 'Remember to check the new ESLint rules'],
    ['Quick thought: we should add rate limiting to the public API'],
    ['Book recommendation from colleague: "Designing Data-Intensive Applications"', 'New VS Code extension worth trying: Thunder Client'],
  ];

  const insertGoal = db.prepare('INSERT INTO goals (date, content) VALUES (?, ?)');
  const insertPriority = db.prepare('INSERT INTO priorities (date, title, completed, sort_order) VALUES (?, ?, ?, ?)');
  const insertTodo = db.prepare('INSERT INTO todos (date, title, completed) VALUES (?, ?, ?)');
  const insertNote = db.prepare('INSERT INTO notes (date, content) VALUES (?, ?)');
  const insertHydration = db.prepare('INSERT INTO hydration (date, glasses) VALUES (?, ?)');

  const transaction = db.transaction(() => {
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const date = formatDate(d);

      // Goal
      insertGoal.run(date, goalTemplates[i]);

      // Priorities (1-3 per day, some completed)
      const dayPriorities = priorityTemplates[i];
      dayPriorities.forEach((title, idx) => {
        const completed = i > 2 ? (Math.random() > 0.3 ? 1 : 0) : 0;
        insertPriority.run(date, title, completed, idx);
      });

      // Todos (2-4 per day)
      const dayTodos = todoTemplates[i % todoTemplates.length];
      dayTodos.forEach(title => {
        const completed = i > 2 ? (Math.random() > 0.4 ? 1 : 0) : 0;
        insertTodo.run(date, title, completed);
      });

      // Notes
      const dayNotes = noteTemplates[i % noteTemplates.length];
      dayNotes.forEach(content => {
        insertNote.run(date, content);
      });

      // Hydration (3-10 glasses)
      const glasses = Math.floor(Math.random() * 8) + 3;
      insertHydration.run(date, glasses);
    }
  });

  transaction();
  console.log('✅ Seed data inserted for the last 14 days.');
}

seedData();
