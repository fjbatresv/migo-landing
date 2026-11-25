# Migo Payments case study

An English/Spanish portfolio case study for the Migo Payments platform, presented as a historical snapshot. The backend description reflects the final version on 13 June 2022; work ran from November 2021 to June 2022.

## Local development

```sh
npm ci
npm run dev
npm run build
npm test
```

Astro serves `/` in English and `/es/` in Spanish. All page copy is in `src/data/landing.ts`. Only public case study links are included; the source repositories are private and are not linked.

## Publish on GitHub Pages

Set the repository variable `PAGES_CUSTOM_DOMAIN` to `migo.fjbatresv.com`. The workflow writes the custom domain into `dist/CNAME` at build time. In DNS, add `migo` as a CNAME to `fjbatresv.github.io`. In repository Settings → Pages, enable **Enforce HTTPS** after the certificate is ready. Add the domain property to Google Search Console and verify ownership.

Without the custom-domain variable, the workflow builds under the repository path for GitHub Pages.
