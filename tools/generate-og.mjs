import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

await mkdir('public/assets', { recursive: true });
for (const [lang, title, sub] of [
  ['en', 'Payments, across borders.', 'A Migo Payments architecture case study'],
  ['es', 'Pagos, de principio a fin.', 'Caso de arquitectura · Migo Payments'],
]) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><defs><linearGradient id="g" x1="0" x2="1"><stop stop-color="#1155cc"/><stop offset=".55" stop-color="#7600ff"/><stop offset="1" stop-color="#00d0d2"/></linearGradient></defs><rect width="1200" height="630" fill="#f7f9fc"/><path d="M0 0h1200v16H0z" fill="url(#g)"/><circle cx="1010" cy="315" r="220" fill="#e8f2ff"/><circle cx="1010" cy="315" r="150" fill="none" stroke="url(#g)" stroke-width="4"/><circle cx="1010" cy="315" r="12" fill="#1155cc"/><circle cx="865" cy="315" r="12" fill="#0d73fe"/><circle cx="1160" cy="315" r="12" fill="#00bec1"/><path d="M865 315h295" stroke="url(#g)" stroke-width="4"/><text x="80" y="105" font-family="Arial,sans-serif" font-size="22" font-weight="700" letter-spacing="4" fill="#1155cc">MIGO PAYMENTS / CASE STUDY</text><text x="80" y="265" font-family="Arial,sans-serif" font-size="64" font-weight="700" fill="#202a36">${title}</text><text x="80" y="330" font-family="Arial,sans-serif" font-size="30" fill="#536273">${sub}</text><text x="80" y="535" font-family="Arial,sans-serif" font-size="20" fill="#536273">ARCHITECTURE · TECH LEADERSHIP · FINTECH</text><text x="80" y="580" font-family="Arial,sans-serif" font-size="17" fill="#1155cc">migo.fjbatresv.com</text></svg>`;
  await sharp(Buffer.from(svg)).png({ palette: true, quality: 90, effort: 10 }).toFile(`public/assets/og-migo-${lang}.png`);
}
