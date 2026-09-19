# prime-site

The download page for **PRIME — My Personal Operating System**.

Live at **https://priyanshusta.github.io/prime-site/**

PRIME is an Android day-planner built by a founder for his own day. It answers
two questions all day long: *what should I be doing now*, and *what must I not
forget*. Everything lives on the phone — no account, no cloud, no tracking.

## What is here

```
index.html     the page
styles.css     one stylesheet, no framework
main.js        scroll reveals, progress rail, the day-ring canvas
assets/        logo and real screenshots from the app
```

Three files and no build step, so GitHub Pages serves it as-is. Open
`index.html` to work on it, or run any static server:

```bash
python -m http.server 8000
```

## The APK

Builds are attached to [Releases](../../releases). The download buttons point
at `releases/latest/download/`, so publishing a new release updates the site
without touching a line of HTML.

## Licence

MIT — see [LICENSE](LICENSE). Provided as-is, with no warranty. Please test the
alarms on your own phone before relying on them for anything that matters.
