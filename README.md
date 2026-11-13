# BLOOM — 21-Day Excel Academy

> A high-performance, locally-runnable web application engineered for adult learners mastering Microsoft Excel from absolute zero to advanced modeling, PivotTables, Power Query, and executive dashboards in 21 days.

---

## Key Features

1. **21-Day Complete Excel Curriculum**:
   - Structured three-terrace progression: Week 1 (Foundations), Week 2 (Analysis), Week 3 (Advanced).
   - Dual tracks: Hindi and English per lesson, sourced from elite educators (WsCube Tech, Excel Superstar, My E-Lesson, Kevin Stratvert, Leila Gharani, Chandoo, freeCodeCamp).
   - Triple redundancy: Every lesson has 1 primary video ID + 2 verified backup video IDs with automatic runtime fallback on embedding restrictions (error 101/150).
   - Hands-on practice tasks with sample datasets, copy-to-clipboard, and verified outcomes.

2. **Focus Guardian (Webcam Vision Engine)**:
   - **MediaPipe Tasks Vision** (`FaceLandmarker` with facial transformation matrix and eye blink blendshapes): runs 100% locally in-browser via WASM / WebGL.
   - **TensorFlow.js + COCO-SSD**: detects cell phones in the frame every 2 seconds.
   - **10-Second Verdict Loop**: evaluates rolling focus signals:
     - **Gaze Deviation**: Head yaw/pitch > threshold or face absence for 2 consecutive verdicts pauses video and activates `"EYES ON THE SCREEN."`
     - **Phone Detected**: Score > 0.5 triggers instant pause and canonical modal: `"NO PHONES. Eyes on the screen. Focus for 1 hour."` Logs a strike (3 strikes = session void).
     - **Sleeping Detection**: Eye blink blendshapes closed > 3s pauses video with `"ASLEEP ON THE JOB?"`
     - **Tab Switch Detection**: Hidden tab > 3s in Lesson mode pauses with `"WHERE DID YOU GO?"` (Practice Mode allows switching freely to Excel).
     - **Resume Toast**: Auto-resumes smoothly with `"Back in focus. Resuming."`

3. **Habit Engine & The Rose Garden**:
   - **Streak System**: Requires daily focus minutes $\ge$ goal (default 60 min, configurable 40–90 min).
   - **Streak Shields**: 2 shields forgive missed days automatically.
   - **The Rose Garden**: 21-day interactive journey map where each completed day blooms a rose on an editorial terrace path.
   - **Milestones**: 3, 7, 14, and 21-day celebrations with pink & gold confetti.
   - **Graduation Certificate**: Day 21 unlocks a downloadable high-resolution (2400x1600) credential with gold seal and student conferral details.

4. **Design System — Editorial Coquette**:
   - Palette: Cream `#FFF8F4`, Rose `#C94F7C`, Blush `#F7B7C9`, Plum `#4A2545`, Champagne Gold `#D4AF37`.
   - Typography: Fraunces (editorial serif headings) + Outfit (clean geometric sans).
   - Themes: Editorial Rose (light) & Plum Night (dark), fully persisted.
   - Voice: Zero emojis, zero terms of endearment. Confident, sharp, minimal coach voice.

---

## Privacy Guarantee

- **Zero Camera Data Transmitted**: All vision inference (MediaPipe FaceLandmarker and TensorFlow COCO-SSD) runs **100% locally in your browser** using WebAssembly and WebGL.
- **No Backend / No Accounts**: All progress, streaks, badges, and preferences are stored exclusively in your browser's `localStorage` (`bloom_academy_v1`).
- Camera frames never leave your computer and are never recorded, saved, or uploaded.

---

## Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v22)
- npm 9+

### Installation & Local Run
```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Open in your browser
# Local URL: http://localhost:5173
```

> **Note on Webcam Permissions**: Modern browsers require either `http://localhost` or an `https://` origin to access webcam hardware via `navigator.mediaDevices.getUserMedia`.

---

## Build & Test Suite

```bash
# Run unit and engine test suite (119 automated assertions)
npm test

# Verify all 126 YouTube video IDs via YouTube oEmbed API
npm run verify-videos

# Compile TypeScript and bundle production assets with Vite
npm run build

# Preview production build locally
npm run preview
```

---

## How to Swap or Update Videos

All curriculum videos and practice assignments reside in [`src/data/curriculum.ts`](file:///Users/pranavvv/HASINI/src/data/curriculum.ts).

To update any video:
1. Open [`src/data/curriculum.ts`](file:///Users/pranavvv/HASINI/src/data/curriculum.ts).
2. Locate the day object (e.g., `day: 5`).
3. Update `videoId` or `backups`:
   ```ts
   hindi: {
     videoId: 'NEW_YOUTUBE_ID',
     backups: ['BACKUP_ID_1', 'BACKUP_ID_2'],
     channel: 'Creator Name',
     durationApprox: '35 min'
   }
   ```
4. Run `npm run verify-videos` to verify that all IDs are public and valid.

---

## Static Deployment (Vercel / Netlify)

Bloom is a fully static client-side single page app (SPA) with zero backend requirements.

### Deploying to Vercel
```bash
# Using Vercel CLI
npx vercel

# Or push your repository to GitHub and import it on vercel.com
# Framework Preset: Vite
# Build Command: npm run build
# Output Directory: dist
```

### Deploying to Netlify
```bash
# Using Netlify CLI
npx netlify deploy --prod --dir=dist
```

---

## License
MIT. Crafted for focused, disciplined spreadsheet mastery.

