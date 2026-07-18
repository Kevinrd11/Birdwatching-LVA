import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const species = [
  { id: 'momotus-coeruliceps', sci: 'Momotus coeruliceps', en: 'Blue-crowned motmot' },
  { id: 'pharomachrus-mocinno', sci: 'Pharomachrus mocinno', en: 'Resplendent quetzal' },
  { id: 'aulacorhynchus-prasinus', sci: 'Aulacorhynchus prasinus', en: 'Northern emerald toucanet' },
  { id: 'pteroglossus-torquatus', sci: 'Pteroglossus torquatus', en: 'Collared aracari' },
  { id: 'amazilia-tzacatl', sci: 'Amazilia tzacatl', en: 'Rufous-tailed hummingbird' },
  { id: 'campylopterus-hemileucurus', sci: 'Campylopterus hemileucurus', en: 'Violet sabrewing' },
  { id: 'thraupis-episcopus', sci: 'Thraupis episcopus', en: 'Blue-gray tanager' },
  { id: 'tangara-icterocephala', sci: 'Tangara icterocephala', en: 'Silver-throated tanager' },
  { id: 'melanerpes-formicivorus', sci: 'Melanerpes formicivorus', en: 'Acorn woodpecker' },
  { id: 'chamaepetes-unicolor', sci: 'Chamaepetes unicolor', en: 'Black guan' },
  { id: 'momotus-lessonii', sci: 'Momotus lessonii', en: "Lesson's motmot" },
  { id: 'turdus-grayi', sci: 'Turdus grayi', en: 'Clay-colored thrush' },
  { id: 'psarocolius-montezuma', sci: 'Psarocolius montezuma', en: 'Montezuma oropendola' },
  { id: 'tyrannus-melancholicus', sci: 'Tyrannus melancholicus', en: 'Tropical kingbird' },
  { id: 'chlorospingus-flavopectus', sci: 'Chlorospingus flavopectus', en: 'Common chlorospingus' },
];

const OUT_DIR = path.resolve('public/images/species');
const UA = 'LVA-Birdwatching-Checklist/1.0 (educational tourism site)';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getSummary(title) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
  const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json' } });
  if (!res.ok) return null;
  return res.json();
}

async function resolveImage(item) {
  for (const title of [item.sci, item.en]) {
    const data = await getSummary(title);
    // La imagen original siempre descarga bien; la redimensionamos luego con sips.
    const url = data?.originalimage?.source || data?.thumbnail?.source;
    if (url) return { url, via: title };
    await sleep(300);
  }
  return null;
}

async function download(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

await mkdir(OUT_DIR, { recursive: true });

const results = [];
for (const item of species) {
  try {
    const found = await resolveImage(item);
    if (!found) {
      results.push({ id: item.id, ok: false, reason: 'sin imagen' });
      continue;
    }
    const buffer = await download(found.url);
    const file = path.join(OUT_DIR, `${item.id}.jpg`);
    await writeFile(file, buffer);
    results.push({ id: item.id, ok: true, kb: Math.round(buffer.length / 1024), via: found.via });
  } catch (err) {
    results.push({ id: item.id, ok: false, reason: String(err.message || err) });
  }
  await sleep(400);
}

for (const r of results) {
  console.log(r.ok ? `OK   ${r.id}  (${r.kb} KB, vía "${r.via}")` : `FAIL ${r.id}  -> ${r.reason}`);
}
const okCount = results.filter((r) => r.ok).length;
console.log(`\n${okCount}/${species.length} imágenes descargadas`);
