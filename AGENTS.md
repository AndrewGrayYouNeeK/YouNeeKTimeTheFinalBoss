# AGENTS.md

## Cursor Cloud specific instructions

`YouNeeK Time` is a single React 18 + Vite 6 SPA (a dark-themed decimal-time clock) built on the Base44 BaaS platform. Package manager is npm. Standard scripts live in `package.json` (`dev`, `build`, `lint`, `typecheck`, `preview`); the Base44 site config is in `base44/config.jsonc`.

### Running the app
- Dev server: `npm run dev` (Vite, serves on `http://localhost:5173`).
- The dev server sets `logLevel: 'error'` in `vite.config.js`, so Vite does NOT print its usual "Local: http://localhost:5173" banner. Absence of that banner is expected — confirm the server is up with `curl -sf http://localhost:5173/` instead.
- The log line `[base44] Proxy not enabled (VITE_BASE44_APP_BASE_URL not set)` on `dev`/`build` is expected and harmless when no Base44 backend env vars are configured.

### Backend / credentials (non-obvious)
- No Base44 credentials are required to run and test the core UI locally. The app calls the Base44 backend for app public settings on load, but an "unknown" failure (no `VITE_BASE44_APP_ID`/token, no proxy) falls through to rendering the main app anyway (see `src/lib/AuthContext.jsx` + `src/App.jsx`). So the decimal clock and the Settings page render and are interactive without any secrets.
- Client-side Settings (hourly frequency sound toggle, custom clock-face upload) persist in `localStorage` and work offline.
- Features that genuinely need a live Base44 backend + `VITE_BASE44_APP_ID` (+ access token, normally injected as URL query params by the Base44 host): email/password + Google login/register flows, the account email shown in Settings, delete-account, and the `getMoonPhase` Deno function powering the Live Moon Phase card. These degrade gracefully when unavailable.

### Lint / typecheck caveat
- `npm run lint` and `npm run typecheck` currently report pre-existing failures in committed code (e.g. an unused `Smartphone` import in `src/components/BottomTab.jsx`; JSX type errors in `src/pages/Settings.jsx`). These are not caused by environment setup — do not "fix" them as part of setup.
