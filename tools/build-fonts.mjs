// Convert the supplied variable TTFs in "brand assets" to WOFF2 in assets/fonts.
//   node tools/build-fonts.mjs
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import ttf2woff2 from 'ttf2woff2'

const SRC = 'brand assets/Inter,Space_Grotesk'
const OUT = 'assets/fonts'

const jobs = [
  [`${SRC}/Inter/Inter-VariableFont_opsz,wght.ttf`, 'Inter-Variable.woff2'],
  [`${SRC}/Space_Grotesk/SpaceGrotesk-VariableFont_wght.ttf`, 'SpaceGrotesk-Variable.woff2'],
]

mkdirSync(OUT, { recursive: true })

for (const [from, to] of jobs) {
  const woff2 = ttf2woff2(readFileSync(from))
  writeFileSync(`${OUT}/${to}`, woff2)
  console.log(`${to}  ${(woff2.length / 1024).toFixed(0)} KB`)
}
