// Screenshot a localhost URL into ./temporary screenshots/
//
//   node screenshot.mjs http://localhost:3001
//   node screenshot.mjs http://localhost:3001 hero-fix
//   node screenshot.mjs http://localhost:3001 mobile --width=390 --height=844
//   node screenshot.mjs http://localhost:3001 above-fold --viewport
//
// Files are auto incremented and never overwritten.
import { existsSync, mkdirSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import puppeteer from 'puppeteer-core'

const CHROME = [
  'C:/Users/sascha.avermiddig.GBCVN/.cache/puppeteer/chrome/win64-150.0.7871.24/chrome-win64/chrome.exe',
  'C:/Users/sascha.avermiddig.GBCVN/.cache/puppeteer/chrome/win64-149.0.7827.22/chrome-win64/chrome.exe',
].find(existsSync)

const OUT_DIR = join(process.cwd(), 'temporary screenshots')

const args = process.argv.slice(2)
const flags = args.filter((a) => a.startsWith('--'))
const positional = args.filter((a) => !a.startsWith('--'))

const url = positional[0]
const label = positional[1]
const flag = (name, fallback) => {
  const hit = flags.find((f) => f.startsWith(`--${name}=`))
  return hit ? Number(hit.split('=')[1]) : fallback
}

if (!url) {
  console.error('usage: node screenshot.mjs <url> [label] [--width=1440] [--height=900] [--viewport]')
  process.exit(1)
}
if (!CHROME) {
  console.error('no cached chrome found under ~/.cache/puppeteer/chrome')
  process.exit(1)
}
if (!/^https?:\/\/(localhost|127\.0\.0\.1)/.test(url)) {
  console.warn('warning: not a localhost url. Serve the project with `node serve.mjs` first.')
}

mkdirSync(OUT_DIR, { recursive: true })

const used = readdirSync(OUT_DIR)
  .map((name) => /^screenshot-(\d+)/.exec(name))
  .filter(Boolean)
  .map((m) => Number(m[1]))
const next = used.length ? Math.max(...used) + 1 : 1
const file = join(OUT_DIR, `screenshot-${next}${label ? '-' + label : ''}.png`)

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--force-color-profile=srgb', '--hide-scrollbars'],
})

try {
  const page = await browser.newPage()
  // Reduced motion by default so captures are deterministic instead of caught
  // mid transition. Pass --motion to capture the animated state.
  if (!flags.includes('--motion')) {
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  }
  await page.setViewport({
    width: flag('width', 1440),
    height: flag('height', 900),
    deviceScaleFactor: 1,
  })
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 })
  // Let fonts settle and scroll reveals fire before capturing. Lazy images are
  // forced eager so a short viewport cannot leave one permanently unrequested.
  await page.evaluate(() => document.fonts.ready)
  await page.evaluate(() => {
    document.querySelectorAll('img[loading="lazy"]').forEach((img) => (img.loading = 'eager'))
  })
  await page.evaluate(async () => {
    // behavior: instant, otherwise the page's smooth scrolling is still gliding
    // when the capture fires.
    const step = window.innerHeight * 0.8
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo({ top: y, behavior: 'instant' })
      await new Promise((r) => setTimeout(r, 90))
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
    await new Promise((r) => setTimeout(r, 250))
  })
  // Lazy images are requested during the scroll pass, so wait them out.
  await page.waitForFunction(() => [...document.images].every((img) => img.complete), { timeout: 30000 })
  await new Promise((r) => setTimeout(r, 250))
  // --click / --hover to capture an interactive state such as an open menu.
  for (const [name, act] of [
    ['hover', (sel) => page.hover(sel)],
    ['click', (sel) => page.click(sel)],
  ]) {
    const hit = flags.find((f) => f.startsWith(`--${name}=`))
    if (!hit) continue
    // Multiple targets are separated by " >> " and applied in order, so a
    // sequence like opening the sheet then a submenu can be captured.
    for (const sel of hit.slice(name.length + 3).split(' >> ')) {
      await act(sel.trim())
      await new Promise((r) => setTimeout(r, 450))
    }
  }

  const scrollTo = flag('scroll', 0)
  if (scrollTo) {
    await page.evaluate((y) => window.scrollTo(0, y), scrollTo)
    await new Promise((r) => setTimeout(r, 400))
  }
  await page.screenshot({ path: file, fullPage: !flags.includes('--viewport') })
  console.log(file)
} finally {
  await browser.close()
}
