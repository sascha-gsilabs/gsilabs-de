// The word and claim rules for the Baukosten KI landing page, as a check.
//
//   node tools/test-briefing.mjs        (or: npm run test:briefing)
//
// assets/briefings/261009_Briefing Landingpage gsilabs_V00.md lists a forbidden
// vocabulary and a set of statements that must not appear, and some of them are
// legal rather than editorial: "HOAI-konforme Honorare" is a claim about the law
// that the HOAI 2021 does not support, and a percentage of accuracy without a
// documented comparison against settled costs is an advertising claim nobody
// can stand behind. A briefing nobody rereads does not catch those. This does.
//
// It runs against the built HTML rather than the content files, because
// translations.txt writes German copy back into content/de/ and a word can
// arrive that way without anyone opening the page file.
//
// Only the page body is read. The header and footer are site furniture: the
// Insights menu and the Lösungen menu are the site's own navigation, and the
// briefing governs what this page says, not what the site is called.
import { readFileSync } from 'node:fs'

const PAGES = ['solutions/baukosten-ki/index.html', 'de/solutions/baukosten-ki/index.html']

/* Section 2 of the briefing, "Verbotener Wortschatz", plus the forbidden
   statements from the same section. */
const FORBIDDEN = [
  'revolutionär', 'innovativ', 'disruptiv', 'ganzheitlich', 'smart', 'Game Changer',
  'KI-Power', 'powered by', 'Rocket', 'in der heutigen',
  'Features', 'Insights', 'Lösungen',
  'exakt', 'centgenau', 'garantiert', '100 Prozent', '100 percent',
  'HOAI-konform', 'HOAI compliant', 'verbindliche Honorare',
  'Baukosten AI', 'Build Cost',
]

/* The name: a space, never a hyphen, and never shortened. The hyphen is correct
   inside an address, so the e-mail and the domain are taken out first. */
const ADDRESSES = /(https?:\/\/|mailto:)?[\w.@-]*baukosten-ki\.de[\w/-]*/gi

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

let failed = 0

for (const page of PAGES) {
  const html = readFileSync(page, 'utf8')
  const body = (/<main[^>]*>([\s\S]*?)<\/main>/.exec(html) ?? ['', ''])[1]
  const text = body
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/g, ' ')
    .replace(ADDRESSES, ' ')
    .replace(/\s+/g, ' ')

  const found = FORBIDDEN.flatMap((word) => {
    const hits = text.match(new RegExp(escape(word), 'gi'))
    return hits ? [`${word} (${hits.length}x)`] : []
  })

  if (/Baukosten-KI/i.test(text)) found.push('"Baukosten-KI" with a hyphen outside an address')
  if (/\bBK\b/.test(text)) found.push('"BK" on its own, which sits too close to BKI')
  if (/\b\d{1,3}\s?(%|Prozent|percent)\b/i.test(text)) found.push('a percentage, which needs a documented comparison')

  if (found.length) {
    failed++
    console.log(`FAIL ${page}`)
    for (const f of found) console.log(`       ${f}`)
  } else {
    console.log(` ok  ${page}`)
  }
}

console.log(
  failed
    ? `\nbriefing: ${failed} page(s) with findings`
    : '\nbriefing: both pages keep to the word and claim rules'
)
process.exitCode = failed ? 1 : 0
