// Visit every generated page and report broken requests, console errors, missing
// headings, horizontal overflow and dead internal links.
//   node tools/audit.mjs [http://localhost:3001]
import { existsSync, readFileSync } from 'node:fs'
import puppeteer from 'puppeteer-core'

const CHROME = [
  'C:/Users/sascha.avermiddig.GBCVN/.cache/puppeteer/chrome/win64-150.0.7871.24/chrome-win64/chrome.exe',
  'C:/Users/sascha.avermiddig.GBCVN/.cache/puppeteer/chrome/win64-149.0.7827.22/chrome-win64/chrome.exe',
].find(existsSync)

const BASE = (process.argv[2] ?? 'http://localhost:3001').replace(/\/$/, '')

const routes = [...readFileSync('sitemap.xml', 'utf8').matchAll(/<loc>(.*?)<\/loc>/g)]
  .map((m) => new URL(m[1]).pathname)
  .map((r) => (r === '/' ? '/' : r.replace(/\/$/, '')))

const known = new Set(routes)
const problems = []

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
})

try {
  for (const route of routes) {
    const page = await browser.newPage()
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
    await page.setViewport({ width: 1440, height: 900 })

    const found = []
    page.on('console', (m) => m.type() === 'error' && found.push(`console: ${m.text()}`))
    page.on('pageerror', (e) => found.push(`pageerror: ${e.message}`))
    page.on('requestfailed', (r) => found.push(`requestfailed: ${r.url()}`))
    page.on('response', (r) => r.status() >= 400 && found.push(`http ${r.status()}: ${r.url()}`))

    await page.goto(BASE + route, { waitUntil: 'networkidle2', timeout: 60000 })
    await page.evaluate(() => {
      document.querySelectorAll('img[loading="lazy"]').forEach((i) => (i.loading = 'eager'))
    })
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += innerHeight * 0.9) {
        scrollTo({ top: y, behavior: 'instant' })
        await new Promise((r) => setTimeout(r, 60))
      }
    })
    await page
      .waitForFunction(() => [...document.images].every((i) => i.complete), { timeout: 20000 })
      .catch(() => found.push('images did not all load'))

    const info = await page.evaluate(() => ({
      h1: document.querySelectorAll('h1').length,
      title: document.title,
      links: [...document.querySelectorAll('a[href^="/"]')].map((a) => a.getAttribute('href')),
      overflow: [...document.querySelectorAll('body *')]
        .filter((el) => el.getBoundingClientRect().right > innerWidth + 1)
        .slice(0, 4)
        .map((el) => `${el.tagName.toLowerCase()}.${el.className || '-'}`),
      emptyHeadings: [...document.querySelectorAll('h1,h2,h3')].filter((h) => !h.textContent.trim())
        .length,
      height: document.documentElement.scrollHeight,
    }))

    if (info.h1 !== 1) found.push(`h1 count is ${info.h1}`)
    if (info.emptyHeadings) found.push(`${info.emptyHeadings} empty heading(s)`)
    if (info.overflow.length) found.push(`overflow: ${info.overflow.join(', ')}`)
    for (const href of new Set(info.links)) {
      const clean = href.split('#')[0].replace(/\/$/, '') || '/'
      if (!known.has(clean)) found.push(`dead link: ${href}`)
    }

    console.log(
      `${found.length ? 'FAIL' : ' ok '} ${route.padEnd(46)} ${String(info.height).padStart(5)}px  ${info.title}`
    )
    found.forEach((f) => console.log(`        ${f}`))
    if (found.length) problems.push(route)
    await page.close()
  }
} finally {
  await browser.close()
}

console.log(
  problems.length
    ? `\n${problems.length} of ${routes.length} pages have findings`
    : `\nall ${routes.length} pages clean`
)
