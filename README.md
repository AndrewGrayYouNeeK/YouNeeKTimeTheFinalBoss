# YouNeeK Time

A minimal, stylish world clock and time widget — YouNeeK branded.

## About

YouNeeK Time is a clean, dark-themed clock application with a custom YouNeeK design. Displays current time with elegant styling, configurable settings, and a widget mode for embedding or home screen use.

## Features

- **YouNeeK Clock** — Custom-designed clock face with YouNeeK branding
- **Widget Mode** — Compact embed-ready version for dashboards or home screens
- **Settings** — Configure display preferences and time zones
- **Dark Theme** — Deep black background with green accent glow

## Running Locally

```bash
git clone https://github.com/AndrewGrayYouNeeK/youneek-time.git
cd youneek-time
npm install
npm run dev
```

Then open http://localhost:5173.

The app is **fully local** — it runs entirely in your browser with no backend, no
account, and no environment variables. All preferences (custom clock face, hourly
frequency sound, and an optional local profile email) are stored in `localStorage`.
The live moon phase is computed on-device with [`suncalc`](https://github.com/mourner/suncalc).

## Built By

Andrew Gray — YouNeeK
