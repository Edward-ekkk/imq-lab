# IMQ Lab · CityUHK

Website for the Intelligent Manufacturing and Quality Engineering Lab, led by Prof. Rainers Yuquan Meng at City University of Hong Kong.

## GitHub Pages deployment

This repository is ready for a free **public** GitHub repository such as `imq-lab`.

1. Push these files to the repository's `main` branch.
2. In **Settings → Pages**, select **Deploy from a branch**.
3. Select **main** and **/docs**, then save.
4. Wait for the Pages deployment to complete. GitHub displays the actual published URL in Settings → Pages.

A project repository named `imq-lab` normally uses `https://YOUR-USERNAME.github.io/imq-lab/`. This is a URL pattern, not a deployed website. No custom domain or DNS changes are needed. All asset paths are relative, so project URLs are supported.

## Editing

- `docs/index.html`: lab introduction, research areas, people, contact and bilingual copy.
- `docs/publications.js`: 12 selected publications with authors, DOI and source record. Years and counts update automatically. Conference papers export as BibTeX `@inproceedings`; journal papers export as `@article`.
- `docs/styles.css`: desktop and mobile styling.
- `docs/app.js`: language switching, publication filters, citations and navigation.
- `docs/assets/`: favicon and supplied/verified portraits.
- `docs/.nojekyll`: serves the website as plain static files.

Preview locally by opening `docs/index.html` or running `python -m http.server 4174 --directory docs`.

## Content

The official lab name and three doctoral researchers were confirmed by the user. Biography and publication details were checked against university or publisher records. Each publication links to its DOI and source. The selected list includes work completed before the laboratory was established. The scientific surface drawing is a conceptual illustration, not measurement data.

Faculty profile: https://scholars.cityu.edu.hk/en/persons/yuqumeng/

GitHub Pages setup: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site

The repository contains no credentials, analytics, database or backend dependency.
