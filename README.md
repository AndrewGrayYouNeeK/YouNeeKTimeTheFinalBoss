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

## Live Site

**https://youneektime.com**

The app deploys automatically to GitHub Pages on every push to `main`.

### Custom domain (Cloudflare DNS → GitHub Pages)

The domain `youneektime.com` is managed in Cloudflare. Add these DNS records in
**Cloudflare → youneektime.com → DNS → Records**:

| Type | Name | Content | Proxy |
|------|------|---------|-------|
| A | `@` | `185.199.108.153` | DNS only (grey cloud) |
| A | `@` | `185.199.109.153` | DNS only |
| A | `@` | `185.199.110.153` | DNS only |
| A | `@` | `185.199.111.153` | DNS only |
| CNAME | `www` | `andrewgrayyouneek.github.io` | DNS only |

Keep records **DNS only** (grey cloud, not proxied) while GitHub provisions its
SSL certificate. You can try enabling the Cloudflare proxy later, but DNS-only is
the most reliable setup with GitHub Pages.

Then in the repo **Settings → Pages**:

1. Set **Build and deployment** source to **GitHub Actions**
2. Under **Custom domain**, enter `youneektime.com`
3. After DNS propagates, enable **Enforce HTTPS**

The `public/CNAME` file in this repo keeps the domain configured across deploys.

## Built By

Andrew Gray — YouNeeK
