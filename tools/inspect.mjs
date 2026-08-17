// Ad hoc DOM inspector for debugging layout during the rebuild.
//   node tools/inspect.mjs http://localhost:3000
import { existsSync } from 'node:fs'
import puppeteer from 'puppeteer-core'

const CHROME = [
  'C:/Users/sascha.avermiddig.GBCVN/.cache/puppeteer/chrome/win64-150.0.7871.24/chrome-win64/chrome.exe',
  'C:/Users/sascha.avermiddig.GBCVN/.cache/puppeteer/chrome/win64-149.0.7827.22/chrome-win64/chrome.exe',
].find(existsSync)

const url = process.argv[2] ?? 'http://localhost:3000'

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox'] })
try {
  const page = await browser.newPage()
  const errors = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message))
  page.on('requestfailed', (r) => errors.push('requestfailed: ' + r.url() + ' ' + r.failure()?.errorText))
  page.on('response', (r) => r.status() >= 400 && errors.push(`http ${r.status()}: ${r.url()}`))

  await page.setViewport({
    width: Number(process.argv[3] ?? 1440),
    height: Number(process.argv[4] ?? 900),
  })
  await page.goto(url, { waitUntil: 'networkidle2' })
  await page.evaluate(() => document.fonts.ready)

  const out = await page.evaluate(() => {
    const box = (sel) => {
      const el = document.querySelector(sel)
      if (!el) return `${sel}: MISSING`
      const r = el.getBoundingClientRect()
      const cs = getComputedStyle(el)
      return `${sel}: ${Math.round(r.width)}x${Math.round(r.height)} ar=${cs.aspectRatio} op=${cs.opacity} fs=${cs.fontSize} ff=${cs.fontFamily.split(',')[0]}`
    }
    return {
      sheets: [...document.styleSheets].map((s) => {
        try {
          return `${s.href?.split('/').pop() ?? 'inline'}: ${s.cssRules.length} rules`
        } catch (e) {
          return `${s.href}: BLOCKED`
        }
      }),
      docHeight: document.documentElement.scrollHeight,
      docWidth: document.documentElement.scrollWidth,
      overflowing: [...document.querySelectorAll('body *')]
        .filter((el) => el.getBoundingClientRect().right > innerWidth + 1)
        .slice(0, 8)
        .map((el) => `${el.tagName.toLowerCase()}.${el.className || '-'} right=${Math.round(el.getBoundingClientRect().right)}`),
      revealTotal: document.querySelectorAll('.reveal').length,
      revealIn: document.querySelectorAll('.reveal.is-in').length,
      headMode: document.querySelector('.site-head')?.dataset.mode,
      boxes: [
        box('.hero'),
        box('.hero__media'),
        box('.hero__line'),
        box('.cap__figure'),
        box('.cap__figure img'),
        box('.quote-card'),
        box('.metrics__list'),
        box('.process__list'),
        box('.news__list'),
        box('.raster-seam'),
      ],
      fonts: [...document.fonts].map((f) => `${f.family} ${f.weight} ${f.status}`),
    }
  })

  console.log(JSON.stringify(out, null, 2))
  if (errors.length) console.log('\n--- errors ---\n' + errors.join('\n'))
} finally {
  await browser.close()
}
