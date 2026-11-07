# وِرْدِي — Wird (Daily Quran & Dhikr PWA)

A lightweight, fully offline Progressive Web App for keeping your daily wird —
Quran verses and adhkar you read a set number of times each day.

**340 KB · no frameworks · no server · works completely offline once installed.**

## Features

- **Daily wird list** — each item has a target (e.g. Ayatul Kursi 40× daily),
  a progress bar, and automatic reset at midnight.
- **Your own Arabic text** — paste any surah, ayah, dua, or dhikr; each line
  renders as its own block in a mushaf-style reading view (Amiri typeface,
  adjustable text size).
- **Tap to count** — tap the big button *or the text itself* to count a reading.
  Every tap gives a soft chime and vibration. A lap timer shows how long each
  reading takes.
- **Auto-reading** — press ▶ and a smooth marker highlight sweeps through the
  text word by word (40–700 words/min, adjustable). When the highlight finishes
  the text, one reading is counted automatically and the cycle restarts until
  the daily target is done. Hold your finger on the text to pause; release to resume.
- **Screen stays awake** — while a wird is open the display is held on, so the
  phone never sleeps mid-ayah during auto-reading. The lock is dropped as soon
  as you leave the reading view. Requires an HTTPS (or `localhost`) origin.
- **Dark mode** — a moon button (home screen, top left, and on the reading
  screen next to Edit) switches the whole app to pure black with soft grey
  letters and dimmed gold, for reading at night. Press the sun to switch back.
  The choice is remembered and applied before the first paint, so the app never
  flashes cream on open. It does not follow the phone's own dark setting.
- **Your own recitation** — attach an MP3 to any wird (Edit → *Voice recording*).
  Press ▶ and the voice becomes the clock: the word marker is pinned to the
  audio's own position, so it follows the reciter instead of a fixed words/min.
  One reading is counted each time the audio finishes, and it loops until the
  daily target is done. A speed button beside ▶ cycles 0.5× – 2× and is
  remembered per wird. Audio is stored offline in IndexedDB, never uploaded.
- **Streaks & goals** — "Day 12 of 40 🌙" day-goals, streak tracking with
  editable starting streak, and a congrats screen (تَقَبَّلَ ٱللَّهُ مِنكُم)
  when you finish.
- **Daily reminders** — set a notification time per wird. Works while the app
  is open on any platform, and in the background on Android (installed PWA,
  periodic background sync). iOS does not allow scheduled notifications for
  web apps without a push server.
- **Free tap counter** — a separate stopwatch + counter tab for anything else.

## Install on your phone

1. Host this folder on any **HTTPS** server (see below).
2. Open the URL in Chrome (Android) or Safari (iPhone).
3. Choose **Add to Home Screen**. It opens full-screen and works offline.

## Hosting

Any static host works — there is no backend:

- **GitHub Pages** (free): repo → Settings → Pages → deploy from `main` branch.
- Netlify / Cloudflare Pages / Vercel (free): drag-and-drop the folder.
- Any web server (Apache/nginx): copy the folder into the web root.

All paths are relative, so it works from a subfolder too.

## Files

| File | Purpose |
|---|---|
| `index.html` | the whole app (UI + logic, vanilla JS) |
| `sw.js` | service worker: offline cache + reminder background sync |
| `manifest.webmanifest` | PWA manifest (installability) |
| `fonts/` | Amiri (Arabic + Latin), bundled for offline use |
| `icon-*.png`, `apple-touch-icon.png` | app icons (gold crescent on emerald) |

All data (your wirds, progress, streaks, settings) is stored locally on the
device — nothing is ever sent anywhere.
