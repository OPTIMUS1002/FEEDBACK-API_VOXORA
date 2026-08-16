# ⚡ VOXORA (v3.0) — Student Voice & AI Intelligence Platform
*Premium Editorial Monochromatic Edition*

An ultra-modern, human-crafted **Student Feedback Platform and RESTful API** built with **Node.js**, **Express**, **SQLite**, and vanilla **Editorial Web UI** in a sophisticated **Monochromatic (Pure White, Soft Grey, Obsidian Dark, High Contrast)** aesthetic.

Designed to be lightweight, lightning fast, and **100% Vercel Serverless Ready**.

---

## 🎨 Visual & Editorial Features

- **Curated Monochromatic Palette & 4 Themes**:
  1. ⚪ **Editorial Light**: Crisp white canvas, soft grey card surfaces, charcoal typography, and subtle shadows.
  2. 🔘 **Soft Grey**: Sophisticated grey canvas with layered white cards, graphite text, and sculptural depth.
  3. ⚫ **Obsidian Dark**: Deep charcoal/black background, graphite surfaces, white typography, and silver borders.
  4. 🔳 **High Contrast**: Pure black and white with razor-sharp 1px borders and a stark magazine layout.
- ✨ **Layered Fluid Background Engine**: Dynamic procedural canvas with slow-moving organic contours, layered fluid artwork, and microscopic grain texture.
- 🏛️ **Floating Navigation**: Pill capsule with glassmorphism blur, animated sliding indicator, theme switcher, and faculty authentication.
- 📐 **Cinematic Hero Composition**: Asymmetric editorial layout with oversized typography (*“Empower Learning With Student Voice.”*), tactile magnetic buttons, and parallax sculpture centerpiece.
- 🤖 **Real-time AI Sentiment Analyzer**: Automated emotion and constructive evaluation with confidence scoring as students type.
- 📊 **Data Editorial Dashboard Matrix**:
  - Live submission counter with numerical animations
  - Interactive SVG Satisfaction Donut Gauge & 5-star distribution percentage bars
  - Course leaderboard ranked by volume & ratings with 1-click filter activation
- 💬 **Live Community Stream (Feedbacks Wall)**:
  - Real-time search, category filters, course filters, and multi-sort
  - Smart topic pills & tags (`#HandsOnLab`, `#ClearLectures`, `#ToughExams`, etc.)
  - **Helpful / Upvote Reaction System** (`👍 Helpful`)
  - **Faculty / Instructor Response Bubble**
  - **View Mode Toggle**: Switch between **Editorial Grid Cards** and **Compact Table View**
- 📥 **Multi-Format Export Suite**:
  - Instant CSV Report Download
  - Full JSON Dataset Stream
  - Print-Ready Visual Summary Report
- ⚡ **Interactive Developer REST Studio**: Built-in developer console to test `GET`, `POST`, `PUT`, `DELETE`, `LIKE`, `REPLY`, `EXPORT`, and `HEALTH` endpoints directly with formatted JSON responses and copyable cURL commands.

---

## 📁 Project Structure

```text
Voxora/
├── api/
│   └── index.js                  # Vercel serverless entry point
├── public/                       # Frontend UI Assets
│   ├── assets/                   # Monochromatic Fluid Artwork
│   ├── css/
│   │   └── style.css             # 4 Themes, Monochromatic Editorial CSS
│   ├── js/
│   │   └── app.js                # Fluid contour canvas, CRUD, Audio & API explorer
│   └── index.html                # Editorial Dashboard, Forms & Community Stream
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
