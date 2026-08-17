// One off: crawl the live Framer site and dump each page's visible text so the
// rebuild can reuse the real copy instead of inventing it. Writes into
// .staging/live/. Not part of the site build.
//   node tools/scrape-live.mjs
import { mkdirSync, writeFileSync } from 'node:fs'

const ORIGIN = 'https://www.gsilabs.de'
const OUT = '.staging/live'

const seeds = [
  '/',
  '/solutions/general-contractors',
  '/solutions/planning-design-offices',
  '/solutions/geotechnical-engineers',
  '/solutions/precast-manufacturers',
  '/solutions/product-manufacturers',
  '/solutions/real-estate-developers',
  '/services/ai-workshop',
  '/services/robotics-feasibility-study',
  '/services/dedicated-dev-team',
  '/about',
  '/our-process',
  '/careers',
  '/get-started',
  '/insights',
  '/insights/articles',
  '/insights/projects',
  '/imprint',
  '/privacy',
]

mkdirSync(OUT, { recursive: true })

const slug = (p) => (p === '/' ? 'home' : p.replace(/^\//, '').replace(/\//g, '__'))

function textOf(html) {
  let s = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
  // Keep a marker for headings so structure survives the strip.
  s = s.replace(/<(h[1-6])\b[^>]*>/gi, (_, t) => `\n[${t.toUpperCase()}] `)
  s = s.replace(/<\/(p|div|h[1-6]|li|section|tr|br)>/gi, '\n')
  s = s.replace(/<br\s*\/?>/gi, '\n')
  s = s.replace(/<[^>]+>/g, '')
  s = s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
  const lines = s
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !/^'\)/.test(l) && l !== "');opacity:1\">")
  // Framer renders each text node up to three times for its responsive
  // variants, so collapse immediate repeats.
  const out = []
  for (const l of lines) if (out[out.length - 1] !== l) out.push(l)
  return out.join('\n')
}

const internal = new Set(seeds)
const results = {}

async function grab(path) {
  const res = await fetch(ORIGIN + path, {
    headers: { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120 Safari/537.36' },
  })
  if (!res.ok) return { path, status: res.status }
  const html = await res.text()

  for (const m of html.matchAll(/href="(\/[^"#?]*)"/g)) {
    const href = m[1].replace(/\/$/, '')
    if (href && !href.startsWith('//') && !/\.(png|jpg|svg|css|js|ico|xml|txt)$/i.test(href)) {
      internal.add(href)
    }
  }

  writeFileSync(`${OUT}/${slug(path)}.txt`, textOf(html))
  return { path, status: res.status, bytes: html.length }
}

// Pass one: the seeds, which also harvests links to detail pages.
for (const path of seeds) results[path] = await grab(path)

// Pass two: anything new the seeds pointed at.
const extra = [...internal].filter((p) => !(p in results))
for (const path of extra) results[path] = await grab(path)

writeFileSync(`${OUT}/_index.json`, JSON.stringify(results, null, 2))

const ok = Object.values(results).filter((r) => r.status === 200).length
console.log(`${ok} of ${Object.keys(results).length} pages fetched into ${OUT}`)
console.log(
  Object.entries(results)
    .filter(([, r]) => r.status !== 200)
    .map(([p, r]) => `  ${r.status} ${p}`)
    .join('\n') || '  no failures'
)
