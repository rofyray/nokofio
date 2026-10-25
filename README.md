# Nokofio

*Something small.* Nokofio is a waitlist site and clickable demo for an app where people in Ghana post real bills (ECG, water, school fees, hospital, rent) and people with money swipe right to pay one in full. The money goes straight to the biller, and every payment shows up on a public Paid Board.

This repo is the **prototype**: no real payments, and the bills and board entries are made-up demo data. The waitlist form is real (Tally).

## What's in here

```
site/            the deployable website (plain HTML, CSS and JS, no build step)
  index.html     landing page with the swipe demo
  board/         the Paid Board (public ledger), served at /board/
  css/           base.css (demo engine layout) + style.css (Paint & Paper design + motion)
  js/demo.js     swipe deck, bill details, MoMo pay sheet, walkthrough, Paid Board rows, popups
  js/board.js    renders the Paid Board and its filters
  js/motion.js   scroll reveals and motion (off when the visitor prefers reduced motion)
```

## Run it locally

Any static file server works. With Python:

```bash
python3 -m http.server 8080 --directory site
```

Then open http://localhost:8080.

## Deploy

The site is deployed on **Cloudflare Workers (static assets)** at https://nokofio.rofyone.workers.dev. `wrangler.toml` points Cloudflare at the `site/` folder, and there's no build step.

Deploy from your machine (Wrangler is already signed in):

```bash
npx wrangler deploy
```

To redeploy automatically on every push, open the `nokofio` Worker in the Cloudflare dashboard, go to *Settings → Build*, and connect this GitHub repo. Leave the build command empty and keep `npx wrangler deploy` as the deploy command.

`site/_headers` sets security and cache headers, `site/_redirects` sends old `/board.html` links to `/board/`, and `site/404.html` is the not-found page. Any other static host works too: serve the `site/` folder.

## Waitlist form

The **Join the waitlist**, **I need help** and **I get money** buttons open Tally form `VpLgaN` (https://tally.so/r/VpLgaN) as a popup. Each button passes `role` (`I need help` or `I get money`) and `ref` (where the sign-up came from, or `?ref=` from the page URL) as hidden fields. When `role` is set, the form skips its "Which side are you on?" question and shows only that side's questions.

## Editing content

- Demo bills, the anonymous nicknames and the Paid Board example rows: top of `site/js/demo.js` (`BILLS`, `ALIASES`, `BOARD`).
- Pidgin walkthrough captions and stamp words: the `Nokofio.initPage({...})` call at the bottom of each HTML page.
- Page copy: directly in `site/index.html` and `site/board/index.html`.
