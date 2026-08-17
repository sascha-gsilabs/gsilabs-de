// Encode the shipped images listed in tools/assets.config.mjs from .staging
// into assets/img at their delivery size.
//   node tools/build-images.mjs
import { execFileSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync, statSync } from 'node:fs'
import { extname } from 'node:path'
import ffmpeg from 'ffmpeg-static'
import { images, logos } from './assets.config.mjs'

const OUT = 'assets/img'
mkdirSync(OUT, { recursive: true })
mkdirSync('assets/logo', { recursive: true })

for (const { from, to } of logos) {
  copyFileSync(`.staging/logo/${from}`, `assets/logo/${to}`)
  console.log(`${to.padEnd(36)} ${(statSync(`assets/logo/${to}`).size / 1024).toFixed(0).padStart(5)} KB`)
}

let before = 0
let after = 0

for (const { from, to, w } of images) {
  const src = `.staging/img/${from}`
  if (!existsSync(src)) {
    console.error(`missing in .staging: ${from}  (run node tools/stage-assets.mjs)`)
    process.exitCode = 1
    continue
  }

  // Never upscale: scale to w only when the source is wider.
  const scale = `scale='min(${w},iw)':-2:flags=lanczos`
  const ext = extname(to).toLowerCase()
  const codec =
    ext === '.webp'
      ? ['-c:v', 'libwebp', '-quality', '82', '-compression_level', '6']
      : ext === '.png'
        ? ['-c:v', 'png']
        : ['-c:v', 'mjpeg', '-q:v', '4']

  execFileSync(
    ffmpeg,
    ['-hide_banner', '-loglevel', 'error', '-y', '-i', src, '-vf', scale, ...codec, '-frames:v', '1', `${OUT}/${to}`],
    { stdio: 'inherit' }
  )

  before += statSync(src).size
  after += statSync(`${OUT}/${to}`).size
  console.log(`${to.padEnd(36)} ${(statSync(`${OUT}/${to}`).size / 1024).toFixed(0).padStart(5)} KB`)
}

console.log(
  `\n${(before / 1024 / 1024).toFixed(1)} MB of originals -> ${(after / 1024).toFixed(0)} KB shipped`
)
