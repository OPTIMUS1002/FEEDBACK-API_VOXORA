 VOXORA — Cinematic Student Feedback & Analytics Platform

An ultra-modern, cinematic **Student Feedback Platform and RESTful API** built with **Node.js**, **Express**, **SQLite**, and vanilla **3D Glassmorphism Web UI** in a striking **Purple, White, and Obsidian Black** aesthetic. 

Designed to be lightweight, lightning fast, and **100% Vercel Serverless Ready**.

---

 Visual & Cinematic Features

- Obsidian & Neon Purple Palette**: High-contrast, dark-mode design with glowing purple accents (`#9333ea`, `#d946ef`), crisp white highlights, and deep obsidian space background.
- Interactive 3D Particles Canvas**: Physics-driven floating particle mesh background responding in real time.
- 3D Tilt Cards**: Specular lighting reflections and dynamic card perspective tracking mouse coordinates.
- 3D Crystal Star Rating Selector**: Animated 5-star experience rating with instant sentiment feedback badges.
- Real-time Live Analytics Matrix**:
  - Live submission counters
  - 5-Star satisfaction distribution percentage bars
  - Course leaderboard ranked by volume & ratings
 - Interactive REST API Explorer**: Built-in developer console to test `GET`, `POST`, `PUT`, `DELETE` endpoints directly with formatted JSON responses and copyable cURL commands.
- 💬 **Live Feedbacks Wall**: Real-time search, course filters, sorting (highest rating, newest, oldest), and interactive Edit/Delete modals.

---

## 📁 Project Structure (Files for Vercel Deployment)

```text
Voxora/
├── api/
│   └── index.js                  # Vercel serverless entry point
├── public/                       # Frontend UI Assets
│   ├── css/
│   │   └── style.css             # Purple, White & Obsidian 3D CSS
│   ├── js/
│   │   └── app.js                # Canvas particles, 3D tilt, CRUD & API explorer
│   └── index.html                # Cinematic Dashboard & Feedbacks Wall
├── src/                          # Backend API & Server Logic
│   ├── config/
│   │   └── db.js                 # SQLite database & /tmp Vercel support
│   ├── controllers/
│   │   └── feedbackController.js # REST API controllers & analytics
│   ├── routes/
│   │   └── feedbackRoutes.js     # API Route definitions
│   ├── app.js                    # Express application
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

2. **Run Development Server** (with auto-reload):
   ```bash
   npm run dev
   ```

3. **Run Production Server**:
   ```bash
   npm start
   ```

Open **`http://localhost:3000`** in your browser to experience the cinematic UI.

---

## 🚀 Deploying to Vercel (Step-by-Step)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Deploy Voxora cinematic feedback app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

### Step 2: Import into Vercel
1. Go to [vercel.com](https://vercel.com) and click **"Add New..." -> "Project"**.
2. Select and **Import** your GitHub repository.
3. Keep default settings (Framework Preset: **Other**, Root Directory: `./`).
4. Click **Deploy**.

---

## 📖 REST API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/feedback` | Retrieve all student feedbacks (supports `?courseCode=`, `?minRating=`, `?search=`, `?sort=`) |
| `POST` | `/api/feedback` | Submit new student feedback |
| `GET` | `/api/feedback/:id` | Get single feedback details by ID |
| `PUT` | `/api/feedback/:id` | Update feedback rating, comments, student name, or course code |
| `DELETE` | `/api/feedback/:id` | Delete feedback entry |
| `GET` | `/api/feedback/stats/summary` | Get aggregated analytics, rating distribution, and course breakdown |

### Sample POST Request:
```bash
curl -X POST http://localhost:3000/api/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "studentName": "Alex Morgan",
    "courseCode": "AI402",
    "rating": 5,
    "comments": "Incredible neural network visualizers and hands-on exercises!"
  }'
```
