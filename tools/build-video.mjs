// Compress the client's 19 MB source hero video into the deliverables, and pull
// a poster frame out of it.
//   node tools/build-video.mjs [posterSeconds]
//
// Two encodes of the same nine seconds, AV1 and H.264. The browser downloads
// whichever it can play and only that one. tools/assets.config.mjs carries the
// settings and the measurements behind them.
//
// The AV1 pass is slow, minutes rather than seconds. That is the price of the
// format and it is paid once, here, not by every visitor.
import { execFileSync } from 'node:child_process'
import { mkdirSync, statSync } from 'node:fs'
import ffmpeg from 'ffmpeg-static'
import { video } from './assets.config.mjs'

const posterAt = process.argv[2] ?? '2.0'

mkdirSync('assets/video', { recursive: true })
mkdirSync('assets/img', { recursive: true })

/* `-cpu-used 6` is libaom's speed dial. Lower is smaller and much slower; at 6
   the file is within a few percent of what a full day of encoding would give. */
const settings = {
  av1: (crf) => ['-c:v', 'libaom-av1', '-crf', String(crf), '-b:v', '0', '-cpu-used', '6', '-row-mt', '1'],
  h264: (crf) => [
    '-c:v', 'libx264', '-preset', 'slow', '-crf', String(crf),
    '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
  ],
}

let first = null

for (const out of video.outputs) {
  const codec = settings[out.codec]
  if (!codec) throw new Error(`unknown codec: ${out.codec}. Add it in tools/build-video.mjs`)

  let before = 0
  try {
    before = statSync(out.to).size
  } catch {
    /* First run. */
  }

  execFileSync(
    ffmpeg,
    ['-hide_banner', '-loglevel', 'error', '-y', '-i', video.from,
     '-an', '-vf', `scale=${out.width}:-2`, ...codec(out.crf), out.to],
    { stdio: 'inherit' }
  )

  const size = statSync(out.to).size
  first ??= out.to
  console.log(
    `${out.to.padEnd(26)} ${out.codec.padEnd(5)} ${out.width}px crf${out.crf}  ` +
      `${(size / 1024).toFixed(0).padStart(5)} KB` +
      (before ? `  (was ${(before / 1024).toFixed(0)} KB)` : '')
  )
}

/* The poster comes from the source, not from an encode: it is the one frame a
   visitor sees before any video loads, and on a slow connection the only one. */
execFileSync(
  ffmpeg,
  ['-hide_banner', '-loglevel', 'error', '-y', '-ss', posterAt, '-i', video.from,
   '-frames:v', '1', '-vf', 'scale=1600:-2', '-c:v', 'libwebp', '-quality', '82', video.poster],
  { stdio: 'inherit' }
)

console.log(`${video.poster.padEnd(26)} ${(statSync(video.poster).size / 1024).toFixed(0).padStart(17)} KB`)
