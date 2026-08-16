const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Vercel serverless functions have a read-only filesystem except /tmp
const isVercel = Boolean(process.env.VERCEL);
const defaultDbPath = isVercel
  ? path.join('/tmp', 'feedback.db')
  : path.resolve(__dirname, '../../feedback.db');

const dbPath = process.env.DB_PATH || defaultDbPath;

// If on Vercel and local feedback.db exists, copy over to /tmp
if (isVercel) {
  const seedDb = path.resolve(__dirname, '../../feedback.db');
  if (fs.existsSync(seedDb) && !fs.existsSync(dbPath)) {
    try {
      fs.copyFileSync(seedDb, dbPath);
    } catch (err) {
      console.warn('Could not copy seed database:', err.message);
    }
  }
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
  }
});

// Initialize database schema and seed initial sample data
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS feedbacks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_name TEXT NOT NULL,
      course_code TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
      comments TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating feedbacks table:', err.message);
    } else {
      console.log('Feedbacks table ready.');

      // Check if table is empty and insert high quality sample reviews
      db.get(`SELECT COUNT(*) as count FROM feedbacks`, (countErr, row) => {
        if (!countErr && row && row.count === 0) {
          const stmt = db.prepare(`
            INSERT INTO feedbacks (student_name, course_code, rating, comments, created_at)
            VALUES (?, ?, ?, ?, ?)
          `);

          const sampleFeedbacks = [
            [
              "Aarav Sharma",
              "AI402",
              5,
              "The neural network visualizer and hands-on LLM projects were truly mind-blowing! Outstanding explanations by Professor Roy.",
              "2026-08-14 10:15:00"
            ],
            [
              "Priya Patel",
              "CS101",
              5,
              "Crystal clear concepts in Data Structures and Algorithms. The coding assignments were super engaging and well structured.",
              "2026-08-15 14:30:00"
            ],
            [
              "Rohan Mehta",
              "WEB301",
              4,
              "Loved building fullstack React & Express apps! Would love a couple more lectures dedicated to microservices deployment.",
              "2026-08-15 16:45:00"
            ],
            [
              "Ananya Iyer",
              "UX102",
              5,
              "Figma workshops, design systems, and user empathy sessions made this course my absolute favorite this semester!",
              "2026-08-16 09:20:00"
            ],
            [
              "Vikram Malhotra",
              "DS200",
              4,
              "Very comprehensive coverage of statistical models and pandas. Great interactive Jupyter notebooks provided in labs.",
              "2026-08-16 11:00:00"
            ]
          ];

          sampleFeedbacks.forEach(f => stmt.run(f));
          stmt.finalize();
          console.log('Seeded sample feedbacks into database.');
        }
      });
    }
  });
});

module.exports = db;
