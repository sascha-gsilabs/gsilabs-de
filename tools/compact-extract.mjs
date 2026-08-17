// Strip the site chrome and the position column out of the browser extracts so
// each page's copy can be read in one pass. Writes *.md.txt next to the source.
//   node tools/compact-extract.mjs
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'

const DIR = '.staging/extract'

// Header, footer and card labels that appear on every page.
const CHROME = new Set([
  'GSI Labs', 'Solutions', 'Company', 'Services', 'Insights', 'Get Started', 'Menu',
  'For General Contractors', 'For Design Offices', 'For Geo Engineers',
  'For Precast Manufacturers', 'For Product Manufacturers', 'For Real Estate Developers',
  'About', 'Our Process', 'Careers', 'Imprint', 'Privacy',
  'AI workshop', 'Robotics Feasibility Study', 'Dedicated Dev Team',
  'Projects', 'Articles', 'All Insights',
  'Rudi-Dutschke-Str. 23', '10969 Berlin', 'Germany', 'Email', 'Phone',
  'info@gsilabs.de', '+49 30 75431568', '© GSI Software GmbH',
  'Explore more geotechnical solutions on piledesigner.io',
])

for (const name of readdirSync(DIR).filter((n) => n.endsWith('.txt') && !n.endsWith('.md.txt'))) {
  const out = []
  let dropping = false

  for (const raw of readFileSync(`${DIR}/${name}`, 'utf8').split('\n')) {
    if (raw.startsWith('#')) {
      out.push(raw)
      dropping = false
      continue
    }
    const m = /^\s*(\d+)\s+\[([^\]]+)\]\s*(.*)$/.exec(raw)
    if (!m) continue
    const [, , tag, text] = m
    if (!text) continue
    if (text.startsWith('GSI Software GmbH. Registered')) dropping = true
    if (dropping) continue
    if (CHROME.has(text)) continue
    out.push(`${tag === '' ? '' : `[${tag}] `}${text}`)
  }

  // Collapse duplicate consecutive lines left over from Framer's responsive copies.
  const lines = out.filter((l, i) => l !== out[i - 1])
  writeFileSync(`${DIR}/${name.replace(/\.txt$/, '.md.txt')}`, lines.join('\n'))
  console.log(`${name.padEnd(52)} ${lines.length} lines`)
}
