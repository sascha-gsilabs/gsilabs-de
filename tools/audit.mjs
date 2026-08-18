// Visit every generated page and report broken requests, console errors, missing
// headings, horizontal overflow, dead internal links and the metadata a search
// engine reads: title and description length, duplicates across pages, the
// canonical, and whether the hreflang set on a page agrees with the sitemap.
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
const seen = []

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
      lang: document.documentElement.lang,
      description: document.querySelector('meta[name="description"]')?.content ?? '',
      canonical: document.querySelector('link[rel="canonical"]')?.href ?? '',
      alternates: [...document.querySelectorAll('link[rel="alternate"]')].map(
        (l) => l.hreflang + ' ' + new URL(l.href).pathname
      ),
      jsonLd: [...document.querySelectorAll('script[type="application/ld+json"]')].map(
        (el) => el.textContent
      ),
      links: [...document.querySelectorAll('a[href^="/"]')].map((a) => a.getAttribute('href')),
      overflow: [...document.querySelectorAll('body *')]
        .filter((el) => el.getBoundingClientRect().right > innerWidth + 1)
        .slice(0, 4)
        .map((el) => `${el.tagName.toLowerCase()}.${el.className || '-'}`),
      emptyHeadings: [...document.querySelectorAll('h1,h2,h3')].filter((h) => !h.textContent.trim())
        .length,
      height: document.documentElement.scrollHeight,
    }))

    /* Google truncates a title around 60 characters and a description around 160,
       and treats a page with neither as having said nothing about itself. The lower
       bounds catch the opposite failure, a title left as the bare page name. These
       are the ranges the copy is written to, not rules handed down by Google. */
    if (info.title.length < 15 || info.title.length > 70)
      found.push(`title is ${info.title.length} chars, wanted 15 to 70`)
    if (!info.description) found.push('no meta description')
    else if (info.description.length < 70 || info.description.length > 165)
      found.push(`description is ${info.description.length} chars, wanted 70 to 165`)
    if (new URL(info.canonical).pathname !== route) found.push(`canonical is ${info.canonical}`)
    if (!info.jsonLd.length) found.push('no JSON-LD')
    for (const raw of info.jsonLd) {
      try {
        JSON.parse(raw)
      } catch (e) {
        found.push(`JSON-LD does not parse: ${e.message}`)
      }
    }
    /* hreflang has to be reciprocal, so a translated page lists the whole set
       including itself, plus x-default. Fewer than that means a counterpart went
       missing without anyone noticing. */
    if (info.alternates.length && info.alternates.length < 3)
      found.push(`only ${info.alternates.length} hreflang link(s): ${info.alternates.join(', ')}`)

    seen.push({ route, lang: info.lang, title: info.title, description: info.description })

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

/* Two pages sharing a title or a description tell a search engine they are the
   same page, which is how a site ends up competing with itself. Compared within a
   language only: the same job title in English and German is one page in two
   translations, which is exactly what the hreflang links say. */
for (const field of ['title', 'description']) {
  const byValue = new Map()
  for (const page of seen) {
    if (!page[field]) continue
    const key = page.lang + ' ' + page[field]
    if (!byValue.has(key)) byValue.set(key, [])
    byValue.get(key).push(page.route)
  }
  for (const [key, pages] of byValue) {
    if (pages.length < 2) continue
    console.log(`FAIL duplicate ${field}: ${pages.join(', ')}`)
    console.log(`        ${key.slice(0, 90)}`)
    problems.push(...pages)
  }
}

console.log(
  problems.length
    ? `\n${new Set(problems).size} of ${routes.length} pages have findings`
    : `\nall ${routes.length} pages clean`
)
