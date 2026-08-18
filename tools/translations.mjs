// Every piece of text on the site, English beside German, in one editable file.
//
//   node tools/translations.mjs           write translations.txt
//   node tools/translations.mjs apply     read translations.txt back into content/de/
//
// The point is that a translation can be corrected without opening a content
// file and without knowing YAML. Edit the DE block, run `apply`, run the build.
//
// Only the German side is ever written back. English text in the file is there
// so a translation can be judged against the original, and editing it changes
// nothing: `content/` stays the canonical English site.
import { readFileSync, readdirSync, writeFileSync, statSync } from 'node:fs'
import YAML from 'yaml'

const OUT = 'translations.txt'
const EN_DIR = 'content'
const DE_DIR = 'content/de'

/* The file header. It is stripped when reading back, so it has to be a shape no
   line of copy can take. Markdown headings start with #, which rules those out. */
const HEADER = (file) => `=== DATEI: ${file} ===`
const IS_HEADER = /^=== DATEI: .+ ===$/
const IS_ENTRY = /^\[(.+?) \| (.+?)\]$/

/* Keys whose value configures something rather than saying something. An image
   path, a link target, a HubSpot id and a set of pixel dimensions are all text in
   the YAML sense and none of them are translatable. */
const SKIP_KEYS = new Set([
  // Layout and behaviour
  'src', 'href', 'width', 'height', 'ratio', 'focus', 'type', 'id', 'route', 'form',
  'limit', 'tone', 'layout', 'kind', 'self', 'flushTop', 'split', 'mediaLeft', 'plain',
  'banner', 'draft', 'allHref', 'icon', 'logo', 'video', 'poster', 'headMode',
  // Facts about a page that are not prose
  'date', 'posted', 'employmentType', 'author', 'name', 'slug', 'file',
  // site.yml: identity, addresses and account ids, the same in every language
  'languages', 'social', 'hubspot', 'seo.titleSuffix', 'seo.siteName', 'seo.origin',
  'seo.socialImage', 'seo.ogLocale', 'company.name', 'company.legalName',
  'company.street', 'company.postcode', 'company.city', 'company.email',
  'company.phone', 'company.phoneHref',
])

/* A value that is a path, a URL or an address rather than a sentence. */
const isSetting = (s) => /^(\/|https?:|mailto:|tel:|#|\{)/.test(s.trim())

/* ------------------------------------------------------------------ read --- */

/* Line endings are normalised on the way in and put back the way they were on the
   way out. A working copy checked out with CRLF would otherwise compare unequal
   against the LF text in translations.txt, and every file with a body would be
   rewritten by an apply that changed nothing. */
const LF = (s) => s.replace(/\r\n/g, '\n')

function splitDoc(raw) {
  const text = LF(raw)
  const m = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(text)
  const crlf = raw.includes('\r\n')
  return m
    ? { front: m[1], body: m[2].trim(), hasFront: true, crlf }
    : { front: text, body: '', hasFront: false, crlf }
}

/** Every translatable string in a parsed tree, with the path that reaches it. */
function collect(node, path, out) {
  if (Array.isArray(node)) {
    node.forEach((v, i) => collect(v, [...path, i], out))
  } else if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      const dotted = [...path, k].filter((p) => typeof p === 'string').join('.')
      if (SKIP_KEYS.has(k) || SKIP_KEYS.has(dotted)) continue
      collect(v, [...path, k], out)
    }
  } else if (typeof node === 'string' && node.trim() && !isSetting(node)) {
    out.push({ path, value: node.trim() })
  }
  return out
}

const at = (tree, path) => path.reduce((node, key) => (node == null ? undefined : node[key]), tree)

/** The German content files, paired with their English counterparts. */
function pairs() {
  const found = []
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const p = `${dir}/${entry.name}`
      if (entry.isDirectory()) walk(p)
      else if (/\.(md|yml)$/.test(entry.name)) found.push(p)
    }
  }
  walk(DE_DIR)

  /* site.yml first: it holds the navigation and every button label, which is what
     a reader sees on every page and therefore what is worth checking first. */
  const order = (f) => (f.endsWith('site.yml') ? 0 : 1)
  return found
    .sort((a, b) => order(a) - order(b) || (a < b ? -1 : 1))
    .map((de) => ({ de, en: EN_DIR + de.slice(DE_DIR.length), label: de.slice(DE_DIR.length + 1) }))
}

/* ---------------------------------------------------------------- export --- */

const PREAMBLE = `${'='.repeat(78)}
GSI Labs, alle Texte der Website. Englisch und Deutsch nebeneinander.

Erzeugt von tools/translations.mjs. Nicht von Hand umbenennen oder verschieben.

So arbeiten Sie damit:

  0. npm run translations
     Erzeugt diese Datei neu. Immer zuerst ausführen, damit Sie nicht auf einem
     alten Stand arbeiten.
  1. Ändern Sie den Text unter DE. Nur der wird zurückgeschrieben.
     Der Text unter EN steht zum Vergleich da, Änderungen daran bleiben folgenlos.
  2. npm run translations:apply
  3. npm run build

Die Zeile in eckigen Klammern über jedem Paar sagt, aus welcher Datei der Text
kommt und wo darin er steht. Bitte unverändert lassen, daran wird zugeordnet.

Mehrzeilige Texte dürfen Sie beliebig umbrechen, die Umbrüche werden beim
Zurückschreiben neu gesetzt. Leerzeilen innerhalb eines Textes trennen Absätze
und bleiben erhalten.

Ein leerer DE-Block wird übersprungen und nicht als leerer Text gespeichert.
${'='.repeat(78)}

`

function exportFile() {
  const out = [PREAMBLE]
  let entries = 0
  let missing = 0

  for (const { de, en, label } of pairs()) {
    const deDoc = splitDoc(readFileSync(de, 'utf8'))
    let enDoc
    try {
      enDoc = splitDoc(readFileSync(en, 'utf8'))
    } catch {
      console.log(`  no English counterpart for ${label}, skipped`)
      continue
    }

    const deTree = YAML.parse(deDoc.front) ?? {}
    const enTree = YAML.parse(enDoc.front) ?? {}
    const items = collect(deTree, [], [])
    if (deDoc.body) items.push({ path: ['body'], value: deDoc.body })

    if (!items.length) continue

    const block = [`\n${HEADER(label)}\n`]
    for (const item of items) {
      const enValue =
        item.path.length === 1 && item.path[0] === 'body'
          ? enDoc.body
          : at(enTree, item.path)
      if (typeof enValue !== 'string') missing++
      block.push(
        `[${label} | ${item.path.join('.')}]\nEN\n${
          typeof enValue === 'string' ? enValue.trim() : '(kein englisches Gegenstück)'
        }\nDE\n${item.value}\n`
      )
      entries++
    }
    out.push(block.join('\n'))
  }

  writeFileSync(OUT, out.join('\n'))
  console.log(`${OUT}: ${entries} Texte aus ${pairs().length} Dateien`)
  if (missing) console.log(`${missing} ohne englisches Gegenstück, im Text markiert`)
}

/* ----------------------------------------------------------------- apply --- */

function parseFile(text) {
  const lines = text.split(/\r?\n/)
  const entries = []
  let current = null
  let side = null

  const finish = () => {
    if (!current) return
    for (const key of ['en', 'de']) {
      while (current[key].length && !current[key][current[key].length - 1].trim()) current[key].pop()
      while (current[key].length && !current[key][0].trim()) current[key].shift()
    }
    entries.push({ ...current, en: current.en.join('\n'), de: current.de.join('\n') })
    current = null
  }

  for (const line of lines) {
    const m = IS_ENTRY.exec(line)
    if (m) {
      finish()
      current = { file: m[1], path: m[2], en: [], de: [] }
      side = null
      continue
    }
    if (!current) continue
    if (line === 'EN') { side = 'en'; continue }
    if (line === 'DE') { side = 'de'; continue }
    if (IS_HEADER.test(line)) continue
    if (side) current[side].push(line)
  }
  finish()
  return entries
}

function applyFile() {
  let text
  try {
    statSync(OUT)
    text = readFileSync(OUT, 'utf8')
  } catch {
    console.log(`${OUT} nicht gefunden. Erst 'node tools/translations.mjs' ausführen.`)
    process.exitCode = 1
    return
  }

  const entries = parseFile(text)
  if (!entries.length) {
    console.log(`${OUT} enthält keine Einträge. Nichts geändert.`)
    process.exitCode = 1
    return
  }

  const byFile = new Map()
  for (const entry of entries) {
    if (!byFile.has(entry.file)) byFile.set(entry.file, [])
    byFile.get(entry.file).push(entry)
  }

  let changedFiles = 0
  let changedValues = 0
  const problems = []

  for (const [label, items] of byFile) {
    const path = `${DE_DIR}/${label}`
    let raw
    try {
      raw = readFileSync(path, 'utf8')
    } catch {
      problems.push(`${label}: Datei gibt es nicht mehr`)
      continue
    }

    /* The English text in the file is a copy taken at export time. If it no longer
       matches the English site, the file is older than the content and applying it
       could put an outdated German text back over a newer one. Worth saying out
       loud, but not worth refusing: the German edit itself may well be the point. */
    let stale = 0
    try {
      const enDoc = splitDoc(readFileSync(`${EN_DIR}/${label}`, 'utf8'))
      const enTree = YAML.parse(enDoc.front) ?? {}
      for (const item of items) {
        const now =
          item.path === 'body'
            ? enDoc.body
            : at(enTree, item.path.split('.').map((k) => (/^\d+$/.test(k) ? Number(k) : k)))
        if (typeof now === 'string' && now.trim() !== item.en.trim()) stale++
      }
    } catch {
      /* No English counterpart is already reported by the export. */
    }
    if (stale)
      problems.push(
        `${label}: ${stale} englische Texte haben sich seit dem Export geändert. ` +
          `Besser erst neu exportieren.`
      )

    const { front, body, hasFront, crlf } = splitDoc(raw)
    const doc = YAML.parseDocument(front)
    let newBody = body
    let touched = 0

    for (const item of items) {
      if (!item.de.trim()) continue
      if (item.path === 'body') {
        if (item.de.trim() !== body.trim()) {
          newBody = item.de.trim()
          touched++
        }
        continue
      }
      /* Numeric path segments are list positions, and YAML needs them as numbers. */
      const keys = item.path.split('.').map((k) => (/^\d+$/.test(k) ? Number(k) : k))
      const before = doc.getIn(keys)
      if (before === undefined) {
        problems.push(`${label} | ${item.path}: gibt es in der Datei nicht mehr`)
        continue
      }
      if (String(before).trim() === item.de.trim()) continue
      doc.setIn(keys, item.de.trim())
      touched++
    }

    if (!touched) continue

    /* Only files with a real change are rewritten. Serialising re-wraps every
       folded block in the file, which is harmless but would otherwise put the
       whole German site into the diff for a one word correction. */
    const newFront = doc.toString({ lineWidth: 88 }).trimEnd()
    const out = hasFront ? `---\n${newFront}\n---\n\n${newBody}\n` : `${newFront}\n`
    writeFileSync(path, crlf ? out.replace(/\n/g, '\r\n') : out)
    changedFiles++
    changedValues += touched
    console.log(`  ${label}: ${touched} Text(e) geändert`)
  }

  for (const p of problems) console.log(`  ! ${p}`)
  console.log(
    changedValues
      ? `\n${changedValues} Texte in ${changedFiles} Dateien geschrieben. Jetzt 'npm run build'.`
      : '\nKeine Änderungen gefunden.'
  )
}

/* ------------------------------------------------------------------ main --- */

if (process.argv[2] === 'apply') applyFile()
else exportFile()
