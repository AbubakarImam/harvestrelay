# HarvestRelay — Clickable Demo

**This is a hackathon concept demo only.** There are no real users, pilots,
partners, or results. Every screen displays a "Demo - sample data" badge,
and every farmer, agent, provider, village cluster and number in this demo
is fictional.

## What this is

HarvestRelay is a concept for a USSD/SMS service that lets smallholder
farmers of perishable crops (tomatoes, peppers) in the same village
cluster pool their harvests to share one truck or one cold room, paying
only their share of the cost. This demo is a static, clickable prototype
of the idea — plain HTML/CSS/JavaScript, no backend, no build step.

It has three views, all sharing one in-memory JavaScript state (resets on
page reload):

1. **Phone simulator** — walk through the USSD menu a farmer or village
   agent would dial on a basic phone (dial code → cluster → crop → crates
   → harvest week → truck/cold room → join pool → SMS updates → SMS
   receipt). Includes an English/Hausa language toggle.
2. **Agent dashboard** — open pools filling up, incoming provider quotes,
   and a one-tap "Accept quote" action.
3. **Provider page** — pools ready for a quote, a quote form (price +
   pickup day), and a list of that provider's bookings
   (pending/accepted/completed).

Completing the "join pool" step in the phone simulator immediately updates
the matching pool's progress bar on the Agent dashboard — that link is the
core interaction the demo is built to show off. Actions taken on the Agent
dashboard and Provider page likewise show up back in the phone simulator
when you tap "Check pool status."

## Running it locally

This is a static site, but it loads its sample data with `fetch()`, which
most browsers block for files opened directly from disk (`file://`). Serve
the folder instead:

```bash
cd demo
python3 -m http.server 8000
```

Then open <http://localhost:8000> in your browser.

(Any other static file server works too — e.g. `npx serve`, PHP's
`php -S localhost:8000`, etc.)

## Publishing free on GitHub Pages

1. Create a new, empty repository on GitHub (e.g. `harvestrelay-demo`).
2. From the root of this project (one level above `demo/`), push your
   existing local repo to it:
   ```bash
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```
3. On GitHub, go to the repo's **Settings → Pages**.
4. Under "Build and deployment", set **Source** to "Deploy from a branch".
5. Set **Branch** to `main` and the folder to `/demo` (if `/demo` isn't
   offered as an option, either move the contents of `demo/` to a `/docs`
   folder and select `/docs` instead, or set the folder to `/ (root)` and
   move `index.html`, `css/`, `js/`, and `data/` to the repo root).
6. Save. GitHub will publish the site at
   `https://<your-username>.github.io/<your-repo>/` within a minute or two.

No further configuration is needed — the demo has no server, no API keys,
and no environment variables.

## File structure

```
demo/
├── index.html              Single-page app shell (header, tabs, 3 views)
├── README.md                This file
├── css/
│   └── styles.css          All styling (mobile-first, green/earth palette)
├── js/
│   ├── util.js             Shared helpers (progress bars, status labels, etc.)
│   ├── store.js            In-memory shared state + all state-mutating actions
│   ├── i18n.js              English/Hausa strings for the USSD phone screens
│   ├── phone.js             Phone simulator view logic
│   ├── agent.js             Agent dashboard view logic
│   ├── provider.js          Provider page view logic
│   └── app.js               Tab navigation + app bootstrap
└── data/
    └── sample-data.json    All fictional sample data (farmers, agents,
                              providers, pools, quotes, thresholds)
```
