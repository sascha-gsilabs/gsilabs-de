// Cut the supplied variable TTFs in "brand assets" down to the characters this
// site can show, and write them to assets/fonts as WOFF2.
//   node tools/build-fonts.mjs
//
// Subsetting drops glyphs, not axes: the fonts stay variable afterwards and can
// still render every weight the design uses. What goes is the scripts nobody
// here writes in. See tools/fonts.config.mjs for where the cut is made and why.
import { mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import subsetFont from 'subset-font'
import { characters } from './fonts.config.mjs'

const SRC = 'brand assets/Inter,Space_Grotesk'
const OUT = 'assets/fonts'

const jobs = [
  [`${SRC}/Inter/Inter-VariableFont_opsz,wght.ttf`, 'Inter-Variable.woff2'],
  [`${SRC}/Space_Grotesk/SpaceGrotesk-VariableFont_wght.ttf`, 'SpaceGrotesk-Variable.woff2'],
]

mkdirSync(OUT, { recursive: true })

const kb = (n) => `${(n / 1024).toFixed(0)} KB`
const keep = characters()

for (const [from, to] of jobs) {
  let before = 0
  try {
    before = statSync(`${OUT}/${to}`).size
  } catch {
    /* First run. */
  }

  const woff2 = await subsetFont(readFileSync(from), keep, { targetFormat: 'woff2' })
  writeFileSync(`${OUT}/${to}`, woff2)

  console.log(
    `${to.padEnd(30)} ${kb(woff2.length).padStart(7)}` +
      (before ? `  (was ${kb(before)})` : '')
  )
}
