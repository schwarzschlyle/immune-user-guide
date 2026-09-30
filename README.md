# Immune User Guide (website)

A static website for the [Immune](https://github.com/schwarzschlyle/immune) user guide. It renders the guide's
Jupyter notebooks, with the outputs saved from a live run, as read-only pages: a sidebar lists every guide and the
sections of the one you are reading, and the header has the logo, a link to the repository and a light/dark toggle.

Built with React, TypeScript and Vite. There is no server: the notebooks are bundled at build time and the site runs
from any static host.

## Develop

Requires Node.js 20.19 or newer (22 recommended).

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check, then build into dist/
npm run preview    # serve dist/ locally
```

## Update the content

The pages come from `src/notebooks/`, a copy of `notebooks/user_guide/` in the Immune repository. After the guide
changes, copy it again and commit the result:

```bash
npm run sync                              # expects the repository at ../immune-ai
npm run sync -- /path/to/immune           # or give its location
```

The sidebar is built from the `## Guides` section of the guide's `README.md`, so a new notebook appears once it is
listed there.

## Deploy to GitHub Pages

`.github/workflows/deploy.yml` builds the site and publishes it on every push to `main`.

1. Push this directory to its own GitHub repository.
2. In the repository's **Settings → Pages**, set **Source** to **GitHub Actions**.
3. Push to `main` (or run the **Deploy** workflow by hand).

The site uses relative asset paths and hash-based URLs (`#/04_langchain/2.-Chains`), so it works at a project URL
such as `https://<user>.github.io/<repository>/` without extra configuration, and links to sections can be shared.

## Layout

| Path | Contents |
| --- | --- |
| `src/content.ts` | Loads the notebooks and derives the navigation from the guide's README |
| `src/routing.ts` | Hash routes, and resolution of links written inside the notebooks |
| `src/components/` | Header, sidebar, notebook, markdown and code cell rendering |
| `src/styles.css` | Light and dark themes, layout and syntax colors |
| `public/` | Logo (light and dark variants) and favicon |
| `scripts/sync-notebooks.mjs` | Copies the notebooks from the Immune repository |
