# The Deniz Tree 🌳 — portfolio site

A hand-built portfolio: no frameworks, no build step, no dependencies.
Your CV as an interactive **tree data structure** — hover the branches, click the leaves.

## Run it

Just open `index.html` in a browser (double-click works), or:

```bash
cd portfolio
python3 -m http.server 8080   # → http://localhost:8080
```

## Edit the content

**Everything the site says lives in one file: [`js/content.js`](js/content.js).**
Each tree leaf is an item with `title`, `bullets`, `tags`, `links`, etc.

- Hide any item without deleting it: set `hidden: true`.
- Nudge a leaf's position on the tree: set `dx` / `dy` (stage pixels).
- The "about me" card (root node click) is the `about` object at the top.
- The hero strip (name, tagline, stat chips, buttons) is plain HTML in `index.html`.

## Deep links

- `?open=products` — opens a branch (`education`, `experience`, `products`, `projects`, `skills`, `beyond`)
- `?open=products&item=guild` — also opens that item's card

## Photo slots (drop a file in, it appears; missing files are skipped silently)

| File | Where it shows |
|---|---|
| `assets/img/me.jpg` | hero avatar (replaces the cartoon face) |
| `assets/img/romer-bee.jpg` | ROMER card photo strip |
| `assets/img/karate.jpg` | Karate card |
| `assets/img/sports.jpg` | Sports & Outdoors card |
| `assets/img/cycling.jpg` | Sports & Outdoors card (second photo) |
| `assets/img/ates.jpg` | Ateş's card |

To add more: put the file in `assets/img/` and add a `media` entry to the item in `js/content.js`.

## Deploy (GitHub Pages / Vercel / Netlify)

The folder is fully self-contained with relative paths — upload it as-is.
For GitHub Pages: push this folder to a repo, enable Pages on the repo root (or `/docs`).

## Files

```
index.html    hero + SVG icon sprite + noscript fallback
css/          base.css (tokens, hero) · tree.css (stage, animations) · panel.css (cards, mobile)
js/           content.js (ALL copy/data) · layout.js (tree math) · tree.js (desktop)
              panel.js (detail cards) · mobile.js (accordion) · main.js (boot)
assets/       fonts (bundled woff2) · img (project shots/logos) · cv (PDF)
```
