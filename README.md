# Cut Phase Tracker

A personal nutrition, workout, and body composition tracker built for a structured 16-week fat loss phase. Features real-time Firebase sync for cross-device access.

## Features

- **Meal Logging** — Fixed meals, dropdown options, dinner builder (protein + carb + veggie), off-script with AI estimation
- **Workout Tracking** — Exercise logging with sets/reps/weight, auto-fill from last session, training volume calculations
- **Daily Ratings** — Energy, sleep, hunger, workout quality on 1-10 scales
- **Compliance Dashboard** — Streak counter, protein hit rate, workout completion percentage
- **Weekly Calorie Budget** — Running budget with remaining per-day average
- **Training Volume** — Per-exercise and per-session volume trends with charts
- **Progress Charts** — Weight trend with 3-point rolling average, all-time PRs, volume trends
- **Firebase Sync** — Real-time cross-device sync with localStorage fallback
- **Backup/Restore** — Export/import JSON data for backup

## Quick Start

```bash
npm install
npm run dev
```

## Firebase Setup (for cross-device sync)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Add project** → name it anything (e.g., "cut-tracker") → Create
3. In the project, go to **Build > Realtime Database** → **Create Database**
   - Choose your region
   - Start in **test mode** (you can lock it down later)
4. Go to **Project Settings** (gear icon) → **General** → scroll to **Your apps**
5. Click the **web icon** (`</>`) → Register app → Copy the config object
6. Create a `.env` file in the project root:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_APP_ID=your-app-id
```

7. Restart the dev server — the green dot in the header confirms Firebase is connected

> **Note:** Without Firebase configured, the app works fine in offline mode using localStorage only.

## Deploy to GitHub Pages

1. Create a GitHub repository named `cut-phase-tracker`
2. Push your code:

```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/YOUR_USERNAME/cut-phase-tracker.git
git push -u origin main
```

3. Install the deploy package:

```bash
npm install -D gh-pages
```

4. Add to `package.json` scripts:

```json
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"
```

5. Deploy:

```bash
npm run deploy
```

6. Go to **Settings > Pages** in your GitHub repo and set source to `gh-pages` branch
7. Your app will be live at `https://YOUR_USERNAME.github.io/cut-phase-tracker/`

> **Important:** For GitHub Pages deployment, add your Firebase env vars as [GitHub Actions secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets) or hardcode them in `src/storage.js` (safe for single-user apps since Firebase Realtime Database rules control access, not the API key).

## Data Transfer Between Devices

Even without Firebase, you can transfer data:
1. Open the app on Device A → tap 💾 → **Copy JSON to Clipboard**
2. Open the app on Device B → tap 💾 → paste into the import field → **Import & Restore**

## Tech Stack

- React + Vite
- Recharts for data visualization
- Firebase Realtime Database for sync
- Tailwind CSS for styling
- Deployed on GitHub Pages
