# ⚡ VOXORA QUANTUM (v3.0) — Cinematic Student Feedback & Intelligence Platform

An ultra-modern, cinematic **Student Feedback Platform and RESTful API** built with **Node.js**, **Express**, **SQLite**, and vanilla **3D Glassmorphism Web UI** in a striking **Purple, White, Obsidian Black, Cyber Cyan, Emerald Matrix, Hyper Solaris, and Glacial Void** aesthetic. 

Designed to be lightweight, lightning fast, and **100% Vercel Serverless Ready**.

---

## 🌌 Visual & Cinematic Features

- 🔮 **Holographic 3D Quantum Logo**: Multi-ring animated SVG with revolving cybernetic rings, laser dashes, glowing quantum energy crystal core, sonic frequency visualizer nodes, and interactive audio reaction.
- 🎨 **5 Cyberpunk & Neon Themes**:
  1. 💜 **Obsidian Purple**: Deep ultraviolet glow & obsidian space
  2. 💙 **Cyber Cyan**: Oceanic cyber-blue & deep sea navy
  3. 💚 **Emerald Matrix**: Bioluminescent emerald green & hacker dark
  4. ⚡ **Hyper Solaris**: Golden amber neon & molten copper
  5. ❄️ **Glacial Void**: Diamond ice white & cosmic black
- ✨ **Interactive 3D Particles Canvas**: Physics-driven floating particle mesh background responding in real time.
- 🎴 **3D Tilt Cards & Glassmorphism 2.0**: Specular lighting reflections, dynamic card perspective, and cursor follower glow aura.
- ⭐ **3D Crystal Star Rating Selector**: Animated 5-star experience rating with instant sentiment feedback badges.
- 🤖 **Real-time AI Sentiment Analyzer**: Live emotion classification (Positive, Constructive, Neutral) with confidence score as students type.
- 📊 **Real-time Live Analytics Matrix**:
  - Total submission counter with live trend indicators
  - Interactive SVG Satisfaction Donut Gauge & 5-star distribution percentage bars
  - Course leaderboard ranked by volume & ratings with 1-click filter activation
- 💬 **Live Feedbacks Wall**:
  - Real-time search, category filters, course filters, and multi-sort
  - Smart topic pills & tags (`#HandsOnLab`, `#ClearLectures`, `#ToughExams`, etc.)
  - **Helpful / Upvote Reaction System** (`👍 Helpful`)
  - **Faculty / Instructor Response Bubble**
  - **View Mode Toggle**: Switch between **3D Grid Cards** and **Compact Table View**
- 📥 **Multi-Format Export Suite**:
  - Instant CSV Report Download
  - Full JSON Dataset Stream
  - Print-Ready Visual Summary Report
- ⚡ **Interactive REST API Explorer**: Built-in developer console to test `GET`, `POST`, `PUT`, `DELETE`, `LIKE`, `REPLY`, `EXPORT`, and `HEALTH` endpoints directly with formatted JSON responses and copyable cURL commands.

---

## 📁 Project Structure

```text
Voxora/
├── api/
│   └── index.js                  # Vercel serverless entry point
├── public/                       # Frontend UI Assets
│   ├── css/
│   │   └── style.css             # 5 Themes, Glassmorphism 2.0 & Holographic CSS
│   ├── js/
│   │   └── app.js                # Canvas particles, 3D tilt, CRUD, Audio & API explorer
│   └── index.html                # Cinematic Dashboard, Forms & Feedbacks Wall
├── src/                          # Backend API & Server Logic
│   ├── config/
│   │   └── db.js                 # SQLite database, migrations & /tmp Vercel support
│   ├── controllers/
│   │   └── feedbackController.js # REST API controllers, export & analytics
│   ├── routes/
│   │   └── feedbackRoutes.js     # API Route definitions & reactions
│   ├── app.js                    # Express application & health telemetry
│   └── server.js                 # Local dev server
├── .env.example                  # Environment configuration template
├── .gitignore                    # Excludes node_modules, .env, .vercel
├── package.json                  # Dependencies & scripts
├── package-lock.json             # Locked dependency versions
├── vercel.json                   # Vercel serverless builds & routing
└── README.md                     # Documentation
```

---

## 🛠️ Local Installation & Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Local Server**:
   ```bash
   npm start
   # Or for auto-reload:
   npm run dev
   ```

3. Open **`http://localhost:3000`** in your browser.

---

## ⚡ REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/feedback` | Retrieve feedbacks (supports `search`, `courseCode`, `category`, `tag`, `sort`, `page`, `limit`) |
| `POST` | `/api/feedback` | Submit new feedback with rating, category & tags |
| `GET` | `/api/feedback/:id` | Get single feedback by ID |
| `PUT` | `/api/feedback/:id` | Update feedback record |
| `DELETE` | `/api/feedback/:id` | Delete feedback record |
| `POST` | `/api/feedback/:id/like` | Upvote / react helpful to feedback |
| `POST` | `/api/feedback/:id/reply` | Post instructor / faculty official response |
| `GET` | `/api/feedback/stats/summary` | Aggregate analytics, satisfaction score & distributions |
| `GET` | `/api/feedback/export/csv` | Stream CSV spreadsheet export |
| `GET` | `/api/feedback/export/json` | Stream full JSON dataset export |
| `GET` | `/api/health` | System status, database health & API telemetry |
