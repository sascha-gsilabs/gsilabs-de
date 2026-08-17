// Compress the client's 19 MB source hero video into the deliverable, and pull a
// poster frame out of it.
//   node tools/build-video.mjs [posterSeconds]
import { execFileSync } from 'node:child_process'
import { mkdirSync, statSync } from 'node:fs'
import ffmpeg from 'ffmpeg-static'
import { video } from './assets.config.mjs'

const posterAt = process.argv[2] ?? '2.0'

mkdirSync('assets/video', { recursive: true })
mkdirSync('assets/img', { recursive: true })

execFileSync(
  ffmpeg,
  ['-hide_banner', '-loglevel', 'error', '-y', '-i', video.from,
   '-an', '-vf', `scale=${video.width}:-2`,
   '-c:v', 'libx264', '-preset', 'slow', '-crf', String(video.crf),
   '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
   video.to],
  { stdio: 'inherit' }
)

execFileSync(
  ffmpeg,
  ['-hide_banner', '-loglevel', 'error', '-y', '-ss', posterAt, '-i', video.to,
   '-frames:v', '1', '-c:v', 'libwebp', '-quality', '82', video.poster],
  { stdio: 'inherit' }
)

console.log(`${video.to}      ${(statSync(video.to).size / 1024 / 1024).toFixed(2)} MB`)
console.log(`${video.poster}  ${(statSync(video.poster).size / 1024).toFixed(0)} KB`)
