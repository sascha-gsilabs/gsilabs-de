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

// ffmpeg-static ships no ffprobe, so read the size off ffmpeg's own stream line.
// Given only -i, ffmpeg exits non zero by design, hence the catch.
function dimensions(file) {
  let out = ''
  try {
    execFileSync(ffmpeg, ['-hide_banner', '-i', file], { stdio: ['ignore', 'ignore', 'pipe'] })
  } catch (err) {
    out = String(err.stderr ?? '')
  }
  const hit = /Video:.*?[^\d](\d{2,5})x(\d{2,5})/.exec(out)
  return hit ? `${hit[1]}x${hit[2]}` : '?'
}

for (const { from, to } of logos) {
  copyFileSync(`.staging/logo/${from}`, `assets/logo/${to}`)
  console.log(`${to.padEnd(36)} ${(statSync(`assets/logo/${to}`).size / 1024).toFixed(0).padStart(5)} KB`)
}

let before = 0
let after = 0

// Some supplied images sit on a white sheet with the subject floating in the
// middle. Inside a frame that every image fills, those read as smaller than the
// rest, so `trim: true` cuts the sheet away first. The box is found by decoding a
// small grayscale copy and taking the extent of everything darker than near
// white, then mapped back onto the source dimensions.
function trimBox(file) {
  const N = 200
  const gray = execFileSync(
    ffmpeg,
    ['-hide_banner', '-loglevel', 'error', '-i', file, '-vf', `scale=${N}:${N}`, '-pix_fmt', 'gray', '-f', 'rawvideo', '-'],
    { maxBuffer: 1 << 26 }
  )
  let x0 = N, x1 = -1, y0 = N, y1 = -1
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      if (gray[y * N + x] >= 245) continue
      if (x < x0) x0 = x
      if (x > x1) x1 = x
      if (y < y0) y0 = y
      if (y > y1) y1 = y
    }
  }
  if (x1 < 0) return null
  // A little of the sheet is left standing, so the subject does not sit hard
  // against the frame edge.
  const pad = 0.01
  const l = Math.max(0, x0 / N - pad)
  const t = Math.max(0, y0 / N - pad)
  const r = Math.min(1, (x1 + 1) / N + pad)
  const b = Math.min(1, (y1 + 1) / N + pad)
  return `crop=iw*${(r - l).toFixed(4)}:ih*${(b - t).toFixed(4)}:iw*${l.toFixed(4)}:ih*${t.toFixed(4)}`
}

for (const { from, to, w, lossless, trim } of images) {
  // A path means a content folder in the repo, a bare name means .staging/img.
  const src = from.includes('/') ? from : `.staging/img/${from}`
  if (!existsSync(src)) {
    console.error(
      from.includes('/')
        ? `missing source: ${from}`
        : `missing in .staging: ${from}  (run node tools/stage-assets.mjs)`
    )
    process.exitCode = 1
    continue
  }

  // Never upscale: scale to w only when the source is wider. Any trim runs
  // first, so the width applies to what is left.
  const steps = trim ? [trimBox(src)].filter(Boolean) : []
  steps.push(`scale='min(${w},iw)':-2:flags=lanczos`)
  const scale = steps.join(',')
  const ext = extname(to).toLowerCase()
  const codec =
    ext === '.webp'
      ? lossless
        ? ['-c:v', 'libwebp', '-lossless', '1', '-compression_level', '6']
        : ['-c:v', 'libwebp', '-quality', '82', '-compression_level', '6']
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
  console.log(
    `${to.padEnd(36)} ${(statSync(`${OUT}/${to}`).size / 1024).toFixed(0).padStart(5)} KB  ${dimensions(`${OUT}/${to}`)}`
  )
}

console.log(
  `\n${(before / 1024 / 1024).toFixed(1)} MB of originals -> ${(after / 1024).toFixed(0)} KB shipped`
)
