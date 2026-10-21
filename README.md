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
- `docs/publications.html`: publication listing, filters and citation dialog.
- `docs/join.html`: prospective student and research assistant enquiries.
- `docs/contact.html`: address, email and contact details.
- `docs/publications.js`: 12 selected publications with authors, DOI and source record. Years and counts update automatically. Conference papers export as BibTeX `@inproceedings`; journal papers export as `@article`.
- `docs/styles.css`: desktop and mobile styling.
- `docs/app.js`: shared language switching and mobile menu, plus page-specific publication filters, citations and the home illustration. Language preferences persist across pages. Former home-page section links such as `#people` redirect to the corresponding page.
- `docs/assets/`: favicon and supplied/verified portraits.
- `docs/.nojekyll`: serves the website as plain static files.

Each HTML page contains its own navigation and footer. When changing the navigation or footer, update all six HTML files. Only the publications page loads `publications.js`.

Preview locally with `python -m http.server 4174 --directory docs`, then open `http://localhost:4174/`. Use the local server to test language persistence and page-to-page navigation.

## Content

The official lab name and three doctoral researchers were confirmed by the user. Biography and publication details were checked against university or publisher records. Each publication links to its DOI and source. The selected list includes work completed before the laboratory was established. The scientific surface drawing is a conceptual illustration, not measurement data.

Faculty profile: https://scholars.cityu.edu.hk/en/persons/yuqumeng/

GitHub Pages setup: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site

The repository contains no credentials, analytics, database or backend dependency.
