import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const site = process.env.ASTRO_SITE ?? 'https://migo.fjbatresv.com';
const base = process.env.ASTRO_BASE ?? '/';
export default defineConfig({
  site,
  base,
  fonts: [
    { name: 'Quicksand', cssVariable: '--font-display', provider: fontProviders.google(), weights: [500, 600, 700], subsets: ['latin', 'latin-ext'], fallbacks: ['sans-serif'] },
    { name: 'Nunito Sans', cssVariable: '--font-body', provider: fontProviders.google(), weights: [400, 500, 600, 700, 800], subsets: ['latin', 'latin-ext'], fallbacks: ['sans-serif'] },
    { name: 'JetBrains Mono', cssVariable: '--font-mono', provider: fontProviders.google(), weights: [400, 500, 600], subsets: ['latin'], fallbacks: ['monospace'] },
  ],
  integrations: [sitemap({
    i18n: { defaultLocale: 'en', locales: { en: 'en', es: 'es' } },
    serialize(item) {
      const en = new URL(base, site).href;
      return item.url === en || item.url === new URL('es/', en).href
        ? { ...item, links: [...(item.links ?? []), { lang: 'x-default', url: en }] }
        : item;
    },
  })],
});
