# Sociotechnical AI Lab (SAIL) — Website

Static website for the **Sociotechnical AI Lab (SAIL)** at the University of Arizona,
College of Information Science, directed by Dr. Lingyao Li.

Plain HTML/CSS/JS — no build step required to serve. Hosted on GitHub Pages.

## Structure
- `index.html` — Home
- `research.html` — Research (generated)
- `people.html` — People
- `news.html` — News (generated)
- `join.html` — Join Us
- `css/`, `js/`, `assets/` — styles, scripts, images

## Editing
- Most pages are edited directly in their `.html` files.
- `research.html` and `news.html` are **generated** by scripts kept with the source
  materials (outside this repo): `build_research.py` (from `Area*.xlsx` + paper figures)
  and `build_news.py` (from `News.xlsx`). Re-run those locally and copy the updated
  HTML here.

## Deploy (GitHub Pages)
This repo's contents are the site root. In **Settings → Pages**, set the source to
the `main` branch (root). The `.nojekyll` file makes Pages serve files as-is.
