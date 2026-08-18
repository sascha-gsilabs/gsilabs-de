// Static dev server for the gsilabs.de rebuild.
// Serves the project root at http://localhost:3001 with byte range support
// so the hero video seeks correctly.
//
//   node serve.mjs
//
import { createReadStream, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, normalize, sep } from 'node:path'

const ROOT = process.cwd()
const PORT = Number(process.env.PORT) || 3001

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.jfif': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
}

function resolve(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0].split('#')[0])
  const safe = normalize(decoded).replace(/^(\.\.[/\\])+/, '')
  let file = join(ROOT, safe)
  if (!file.startsWith(ROOT + sep) && file !== ROOT) return null

  // Directory, or extensionless pretty URL, both map to an index/sibling html.
  const candidates = []
  if (decoded.endsWith('/')) {
    candidates.push(join(file, 'index.html'))
  } else if (!extname(file)) {
    candidates.push(file + '.html', join(file, 'index.html'))
  } else {
    candidates.push(file)
  }

  for (const candidate of candidates) {
    try {
      if (statSync(candidate).isFile()) return candidate
    } catch {}
  }
  return null
}

createServer((req, res) => {
  const file = resolve(req.url || '/')

  if (!file) {
    res.writeHead(404, { 'content-type': MIME['.html'] })
    res.end('<h1>404</h1><p>Not found: ' + (req.url || '') + '</p>')
    return
  }

  const { size } = statSync(file)
  const type = MIME[extname(file).toLowerCase()] || 'application/octet-stream'
  const range = req.headers.range

  if (range) {
    const match = /bytes=(\d*)-(\d*)/.exec(range)
    const start = match[1] ? Number(match[1]) : 0
    const end = match[2] ? Number(match[2]) : size - 1
    res.writeHead(206, {
      'content-type': type,
      'content-range': `bytes ${start}-${end}/${size}`,
      'accept-ranges': 'bytes',
      'content-length': end - start + 1,
      'cache-control': 'no-store',
    })
    createReadStream(file, { start, end }).pipe(res)
    return
  }

  res.writeHead(200 , {
    'content-type': type,
    'content-length': size,
    'accept-ranges': 'bytes',
    'cache-control': 'no-store',
  })
  createReadStream(file).pipe(res)
}).listen(PORT, () => {
  console.log(`serving ${ROOT} on http://localhost:${PORT}`)
})
