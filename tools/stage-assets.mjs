// Stage the client's raw brand assets into .staging/ with web safe, slugified
// filenames. .staging is not part of the site and is not committed. It exists so
// the originals can be browsed and picked from without 6000px JPEGs ending up in
// the deployed folder.
//
//   node tools/stage-assets.mjs
import { copyFileSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { extname, join } from 'node:path'

const SRC = 'brand assets'

const groups = [
  { from: `${SRC}/logos and icons`, to: '.staging/logo' },
  { from: `${SRC}/website images`, to: '.staging/img' },
]

function slug(name) {
  const ext = extname(name).toLowerCase()
  const base = name.slice(0, name.length - ext.length)
  const map = { ä: 'ae', ö: 'oe', ü: 'ue', Ä: 'ae', Ö: 'oe', Ü: 'ue', ß: 'ss' }
  const cleaned = base
    .split('')
    .map((ch) => map[ch] ?? ch)
    .join('')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return cleaned + (ext === '.jfif' || ext === '.jpeg' ? '.jpg' : ext)
}

const manifest = {}

for (const { from, to } of groups) {
  mkdirSync(to, { recursive: true })
  for (const name of readdirSync(from)) {
    const src = join(from, name)
    if (!statSync(src).isFile()) continue
    let target = slug(name)
    let n = 2
    while (manifest[`${to}/${target}`]) {
      const ext = extname(target)
      target = `${target.slice(0, -ext.length)}-${n++}${ext}`
    }
    copyFileSync(src, join(to, target))
    manifest[`${to}/${target}`] = `${from}/${name}`
  }
}

writeFileSync('.staging/manifest.json', JSON.stringify(manifest, null, 2))
console.log(`staged ${Object.keys(manifest).length} files`)
