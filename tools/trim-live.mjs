// Strip the shared header and footer out of the scraped page text so only the
// page's own copy is left. Writes *.body.txt next to the sources.
//   node tools/trim-live.mjs
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'

const DIR = '.staging/live'

// The header ends at the last nav label before page content starts; the footer
// begins at the office address.
const NAV = new Set(['GSI Labs', 'Solutions', 'Company', 'Services', 'Insights', 'Get Started'])
const FOOT = /^Rudi-Dutschke-Str/

for (const name of readdirSync(DIR).filter((n) => n.endsWith('.txt') && !n.endsWith('.body.txt'))) {
  const lines = readFileSync(`${DIR}/${name}`, 'utf8').split('\n')

  let start = 0
  while (start < lines.length && (NAV.has(lines[start]) || lines[start] === '')) start++

  let end = lines.findIndex((l) => FOOT.test(l))
  if (end === -1) end = lines.length

  const body = lines.slice(start, end)
  writeFileSync(`${DIR}/${name.replace(/\.txt$/, '.body.txt')}`, body.join('\n'))
  console.log(`${name.padEnd(44)} ${body.length} lines`)
}
