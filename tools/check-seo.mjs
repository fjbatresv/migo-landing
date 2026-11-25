import { readFile, stat, readdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
const root=process.argv[2]??'dist';
const errors=[];
const must=(ok,msg)=>{if(!ok)errors.push(msg);};
const read=async p=>readFile(path.join(root,p),'utf8');
const pages=[['index.html','en'],['es/index.html','es']];
let sectionIds=[];
for(const [file,lang] of pages){
  const html=await read(file); const title=html.match(/<title>(.*?)<\/title>/s)?.[1]??''; const desc=html.match(/<meta name="description" content="(.*?)"/s)?.[1]??'';
  must(title.length>0&&title.length<=60,`${file}: title missing/over 60 (${title.length})`);must(desc.length>=70&&desc.length<=160,`${file}: description length ${desc.length}`);
  must(html.includes('rel="canonical" href="https://'),`${file}: canonical missing/relative`);must(/<link rel="preload"[^>]+as="font"/.test(html),`${file}: critical font preload missing`);must(['en','es','x-default'].every(l=>html.includes(`hreflang="${l}"`)),`${file}: hreflang incomplete`);
  must((html.match(/<h1\b/g)||[]).length===1,`${file}: expected one h1`);must(html.includes('application/ld+json')&&html.includes('TechArticle')&&html.includes('BreadcrumbList'),`${file}: JSON-LD incomplete`);
  const levels=[...html.matchAll(/<h([1-6])\b/g)].map(m=>Number(m[1]));must(levels.every((n,i)=>i===0||n<=levels[i-1]+1),`${file}: heading level skipped`);
  const imgs=[...html.matchAll(/<img\b[^>]*>/g)].map(m=>m[0]);must(imgs.every(i=>/\balt=/.test(i)&&/\bwidth=/.test(i)&&/\bheight=/.test(i)),`${file}: img missing alt/size`);
  must(html.includes('og:image:alt')&&html.includes('twitter:card')&&html.includes('summary_large_image'),`${file}: social metadata incomplete`);
  must(html.includes(lang==='es'?'og:locale" content="es_GT':'og:locale" content="en_US'),`${file}: wrong locale`);
  sectionIds.push([...html.matchAll(/<section\b[^>]*id="([^"]+)"/g)].map(m=>m[1]).sort().join(','));
}
must(sectionIds[0]===sectionIds[1],'section IDs differ by locale');
for(const lang of ['en','es']){const p=`assets/og-migo-${lang}.png`;const m=await sharp(path.join(root,p)).metadata();must(m.width===1200&&m.height===630,`${p}: dimensions ${m.width}x${m.height}`);must((await stat(path.join(root,p))).size<=100*1024,`${p}: exceeds 100 KB`);}
const robots=await read('robots.txt');must(/Sitemap: https:\/\//.test(robots),'robots.txt missing absolute sitemap');
const files=[];async function walk(dir){for(const e of await readdir(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())await walk(p);else if(e.name.endsWith('.html'))files.push(p);}}await walk(root);
const notFound=await read('404.html');must(notFound.includes('noindex')&&!notFound.includes('rel="canonical"'),'404 should be noindex and have no canonical');
for(const f of files){const html=await readFile(f,'utf8');if(f.endsWith('404.html'))continue;must((html.match(/<h1\b/g)||[]).length===1,`${f}: expected one h1`);}
if(errors.length){console.error(errors.map(e=>`❌ ${e}`).join('\n'));process.exit(1);}console.log('SEO checks passed: titles, descriptions, canonical, hreflang, JSON-LD, headings, images, locales, OG, sections, robots, 404.');
