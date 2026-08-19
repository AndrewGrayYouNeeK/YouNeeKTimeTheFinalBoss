# YouNeeK Time

A minimal, stylish world clock and time widget — YouNeeK branded.

## About

YouNeeK Time is a clean, dark-themed clock application with a custom YouNeeK design. Displays current time with elegant styling, configurable settings, and a widget mode for embedding or home screen use.

## Features

- **YouNeeK Clock** — Custom-designed clock face with YouNeeK branding
- **Widget Mode** — Compact embed-ready version for dashboards or home screens
- **Settings** — Configure display preferences and time zones
- **Dark Theme** — Deep black background with green accent glow
- **Apple Watch** — Native watchOS app + watch-face complications in `native/YouNeeKTime` (compact web face at `/watch`)

## Running Locally

```bash
git clone https://github.com/AndrewGrayYouNeeK/youneek-time.git
cd youneek-time
npm install
npm run dev
```

Then open http://localhost:5173.

## Apple Watch

WatchOS cannot load this React app. Open `native/YouNeeKTime/YouNeeKTime.xcodeproj` in Xcode, sign the three targets, and run **YouNeeKTime Watch App** on a Watch or simulator. See `native/YouNeeKTime/README.md`.

A compact browser face lives at `/watch` (for tiny viewports, not a real Watch install).

The app is **fully local** — it runs entirely in your browser with no backend, no
account, and no environment variables. All preferences (custom clock face, hourly
frequency sound, and an optional local profile email) are stored in `localStorage`.
The live moon phase is computed on-device with [`suncalc`](https://github.com/mourner/suncalc).

## Live Site

**https://youneektime.com**

The domain is a **Cloudflare Worker custom domain** on `youneektimethefinalboss`. Cloudflare creates those DNS records itself. Do **not** add GitHub Pages A records (`185.199.*`) — Cloudflare will ask you to delete them so the Worker can bind the hostname.

**Hello world on youneektime.com** means the Worker still has the dashboard starter script. A GitHub build that only *uploads a version* does not replace it.

Do this once in Cloudflare (this is the actual live switch):

1. Open **Workers & Pages → youneektimethefinalboss → Deployments**.
2. Open the newest Version (the one from the Git connect / `wrangler versions upload`).
3. Click **Promote** → **Production** at 100%.

After that, either:

- Set the Worker **Settings → Builds** production command to `npm run deploy` (not `wrangler versions upload`), **or**
- Add GitHub secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`. Pushes to `main` then run **Deploy Cloudflare Worker** (`wrangler deploy`).

## Built By

Andrew Gray — YouNeeK
