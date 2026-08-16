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

// Initialize database schema and migrate columns
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS feedbacks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_name TEXT NOT NULL,
      course_code TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
      comments TEXT,
      category TEXT DEFAULT 'General',
      tags TEXT DEFAULT '[]',
      likes_count INTEGER DEFAULT 0,
      instructor_reply TEXT,
      semester TEXT DEFAULT 'Spring 2026',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating feedbacks table:', err.message);
    } else {
      console.log('Feedbacks table ready.');

      // Safely perform column migrations for existing databases
      const columnsToAdd = [
        { name: 'category', def: 'TEXT DEFAULT "General"' },
        { name: 'tags', def: 'TEXT DEFAULT "[]"' },
        { name: 'likes_count', def: 'INTEGER DEFAULT 0' },
        { name: 'instructor_reply', def: 'TEXT' },
        { name: 'semester', def: 'TEXT DEFAULT "Spring 2026"' }
      ];

      columnsToAdd.forEach(col => {
        db.run(`ALTER TABLE feedbacks ADD COLUMN ${col.name} ${col.def}`, () => {
          // Ignore error if column already exists
        });
      });

      // Check if table is empty and insert rich sample reviews
      db.get(`SELECT COUNT(*) as count FROM feedbacks`, (countErr, row) => {
        if (!countErr && row && row.count === 0) {
          const stmt = db.prepare(`
            INSERT INTO feedbacks (student_name, course_code, rating, comments, category, tags, likes_count, instructor_reply, semester, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `);

          const sampleFeedbacks = [
            [
              "Aarav Sharma",
              "AI402",
              5,
              "The neural network visualizer and hands-on LLM projects were truly mind-blowing! Outstanding explanations by Professor Roy.",
              "Lab Experience",
              JSON.stringify(["#HandsOnLab", "#Engaging", "#NeuralNets"]),
              14,
              "Thank you Aarav! Excited to see your final generative AI capstone project next week.",
              "Spring 2026",
              "2026-08-14 10:15:00"
            ],
            [
              "Priya Patel",
              "CS101",
              5,
              "Crystal clear concepts in Data Structures and Algorithms. The interactive live coding assignments and discord office hours were super helpful.",
              "Lecture Quality",
              JSON.stringify(["#ClearLectures", "#GreatFeedback", "#DSA"]),
              19,
              "Great work mastering binary trees early in the course!",
              "Spring 2026",
              "2026-08-15 14:30:00"
            ],
            [
              "Rohan Mehta",
              "WEB301",
              4,
              "Loved building fullstack React & Express apps! Would love a couple more lectures dedicated to Kubernetes and microservices deployment.",
              "Course Material",
              JSON.stringify(["#Fullstack", "#HandsOnLab"]),
              8,
              null,
              "Spring 2026",
              "2026-08-15 16:45:00"
            ],
            [
              "Ananya Iyer",
              "UX102",
              5,
              "Figma workshops, design systems, and user empathy micro-sessions made this course my absolute favorite this semester! Highly recommended.",
              "Lab Experience",
              JSON.stringify(["#DesignSystems", "#Engaging", "#FigmaMastery"]),
              23,
              "Your accessibility-focused prototype was one of the highest rated in the class.",
              "Spring 2026",
              "2026-08-16 09:20:00"
            ],
            [
              "Vikram Malhotra",
              "DS200",
              4,
              "Very comprehensive coverage of statistical models, clean EDA, and pandas. Interactive Jupyter notebooks in labs were top notch.",
              "Course Material",
              JSON.stringify(["#DataScience", "#Python", "#ClearLectures"]),
              6,
              null,
              "Spring 2026",
              "2026-08-16 11:00:00"
            ],
            [
              "Zoya Khan",
              "CYBER204",
              5,
              "Hands down the best ethical hacking and penetration testing lab. The simulated capture-the-flag challenge was intense and educational!",
              "Lab Experience",
              JSON.stringify(["#CTF", "#HandsOnLab", "#CyberSec"]),
              11,
              "Kudos on winning the CTF speed round!",
              "Spring 2026",
              "2026-08-16 13:40:00"
            ]
          ];

          sampleFeedbacks.forEach(f => stmt.run(f));
          stmt.finalize();
          console.log('Seeded sample feedbacks with extended metadata into database.');
        }
      });
    }
  });
});

module.exports = db;
