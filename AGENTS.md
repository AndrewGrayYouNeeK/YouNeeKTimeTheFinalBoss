# AGENTS.md

## Cursor Cloud specific instructions

`YouNeeK Time` is a single React 18 + Vite 6 SPA (a dark-themed decimal-time clock). It is now **fully local / client-side** — all Base44 (BaaS) integrations have been removed. Package manager is npm. Standard scripts live in `package.json` (`dev`, `build`, `lint`, `typecheck`, `preview`).

### Running the app
- Dev server: `npm run dev` (Vite, serves on `http://localhost:5173`).
- Build: `npm run build` → `./dist`. Preview a built bundle with `npm run preview`.
- No backend, database, environment variables, or credentials are required. The app runs entirely in the browser.

### Architecture notes (non-obvious)
- The `@` import alias (`@/...` → `src/...`) is defined in `vite.config.js` under `resolve.alias`. It used to be provided by the removed `@base44/vite-plugin`; if you see "Rollup failed to resolve import '@/...'", that alias is the thing to check.
- "Auth" is local-only: `src/lib/AuthContext.jsx` stores an optional profile email in `localStorage` (key `localProfileEmail`) and stubs all loading/error states. There is no login/logout backend and no auth-gating — the app opens straight to the clock.
- The Live Moon Phase card computes phase/illumination client-side via the `suncalc` npm package (`src/lib/moonPhase.js`); moonrise/moonset are filled in only if the user grants geolocation.
- User preferences (custom clock-face image, hourly-frequency sound settings, profile email) are all persisted in `localStorage`. Settings → "Reset App Data" clears them.
- Local static assets live in `public/` (`favicon.svg`, `clock-face-default.svg`, the default clock-face center image).

### Lint / typecheck caveat
- `npm run lint` currently reports one pre-existing failure unrelated to setup: an unused `Smartphone` import in `src/components/BottomTab.jsx`. `npm run typecheck` also reports pre-existing JSX type errors in `src/pages/Settings.jsx`. Neither blocks `dev`/`build`.
