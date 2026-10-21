# IMQ Lab · CityUHK

Website for the Intelligent Manufacturing and Quality Engineering Lab, led by Prof. Rainers Yuquan Meng at City University of Hong Kong.

## GitHub Pages deployment

Live website: **https://edward-ekkk.github.io/imq-lab/**

This public repository publishes its `main` branch and `/docs` directory to GitHub Pages. Push a commit to update the live site.

1. Push these files to the repository's `main` branch.
2. In **Settings → Pages**, select **Deploy from a branch**.
3. Select **main** and **/docs**, then save.
4. Wait for the Pages deployment to complete. GitHub displays the actual published URL in Settings → Pages.

No custom domain or DNS changes are needed. All asset paths are relative, so the `/imq-lab/` project URL and direct links to individual pages are supported.

## Editing

- `docs/index.html`: lab introduction and links to the individual pages.
- `docs/research.html`: research directions.
- `docs/people.html`: principal investigator and doctoral researchers.
- `docs/people/*.html`: individual profiles with related news and university profile links.
- `docs/news.html`: news archive with topic and member filters.
- `docs/news/*.html`: individual news articles with event dates, related people and primary sources.
- `docs/publications.html`: publication listing, filters and citation dialog.
- `docs/join.html`: prospective student and research assistant enquiries.
- `docs/contact.html`: address, email and contact details.
- `docs/publications.js`: 12 selected publications with authors, DOI and source record. Years and counts update automatically. Conference papers export as BibTeX `@inproceedings`; journal papers export as `@article`.
- `docs/styles.css`: desktop and mobile styling.
- `docs/updates.css`: news and member page layouts, plus navigation for seven sections.
- `docs/app.js`: shared language switching and mobile menu, plus page-specific publication filters, citations and the home illustration. Language preferences persist across pages. Former home-page section links such as `#people` redirect to the corresponding page.
- `docs/assets/`: favicon and supplied/verified portraits.
- `docs/.nojekyll`: serves the website as plain static files.

Each HTML page contains static navigation and content. Only the publications page loads `publications.js`.

### Adding news or updating member profiles

Edit `content/updates.json`, then run `python scripts/build_updates.py` before committing. The script generates the News archive, individual articles, member profiles and the three latest stories on the home page. It also updates navigation on every top-level page. The existing contact page provides the shared header and footer for generated pages; retain its `<main id="main">` boundary. Article slugs are permanent URLs. Do not hand-edit generated articles or profiles.

Each story contains bilingual text, a category, related member IDs, an event/publication date and primary source links. Use only verified facts, preserve the source's date precision (for example `2025-01` for a journal issue), and avoid attributing work to students who are not named in the source. The initial five stories and four member profiles were checked against CityUHK Scholars on 21 October 2026. Portraits are used only when available; student profiles currently use initials.

The generated HTML works without JavaScript. JavaScript adds archive filtering and Chinese language switching; matching stories and counts remain consistent when switching languages.

Preview locally with `python -m http.server 4174 --directory docs`, then open `http://localhost:4174/`. Use the local server to test language persistence and page-to-page navigation.

## Content

The official lab name and three doctoral researchers were confirmed by the user. Biography and publication details were checked against university or publisher records. Each publication links to its DOI and source. The selected list includes work completed before the laboratory was established. The scientific surface drawing is a conceptual illustration, not measurement data.

Faculty profile: https://scholars.cityu.edu.hk/en/persons/yuqumeng/

GitHub Pages setup: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site

The repository contains no credentials, analytics, database or backend dependency.
