// One off: open each live page in a real browser, expand every accordion and
// click through every tab, then dump the text in visual top to bottom order.
// Framer positions blocks absolutely and renders tab panels client side, so
// neither DOM order nor the static HTML is enough.
//   node tools/extract-live.mjs [pathFilter]
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import puppeteer from 'puppeteer-core'

const CHROME = [
  'C:/Users/sascha.avermiddig.GBCVN/.cache/puppeteer/chrome/win64-150.0.7871.24/chrome-win64/chrome.exe',
  'C:/Users/sascha.avermiddig.GBCVN/.cache/puppeteer/chrome/win64-149.0.7827.22/chrome-win64/chrome.exe',
].find(existsSync)

const ORIGIN = 'https://www.gsilabs.de'
const OUT = '.staging/extract'

const paths = [
  '/solutions/general-contractors',
  '/solutions/planning-design-offices',
  '/solutions/geotechnical-engineers',
  '/solutions/precast-manufacturers',
  '/solutions/product-manufacturers',
  '/solutions/real-estate-developers',
  '/services/ai-workshop',
  '/services/robotics-feasibility-study',
  '/services/dedicated-dev-team',
  '/about',
  '/our-process',
  '/careers',
  '/get-started',
  '/insights',
  '/insights/articles',
  '/insights/projects',
  '/insights/timber-moisture-predictive-monitoring',
  '/insights/humanoid-robots-german-construction',
  '/insights/our-contribution-to-great-spaces',
  '/insights/peikko-allplan-toolbox',
  '/careers/software-project-manager',
  '/careers/general-manager',
  '/imprint',
  '/privacy',
]

const filter = process.argv[2]
const todo = filter ? paths.filter((p) => p.includes(filter)) : paths

mkdirSync(OUT, { recursive: true })

const slug = (p) => p.replace(/^\//, '').replace(/\//g, '__') || 'home'

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
})

// Reads text in visual order, tagging each line with its heading level and the
// x position so multi column blocks stay distinguishable.
const readVisual = () => {
  const skip = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT'])
  const out = []
  const walk = (node) => {
    for (const child of node.childNodes) {
      if (child.nodeType === 3) {
        const t = child.textContent.replace(/\s+/g, ' ').trim()
        if (!t) continue
        const el = child.parentElement
        if (!el || skip.has(el.tagName)) continue
        const cs = getComputedStyle(el)
        if (cs.visibility === 'hidden' || cs.display === 'none' || cs.opacity === '0') continue
        const r = el.getBoundingClientRect()
        if (r.width === 0 && r.height === 0) continue
        const tag = el.closest('h1,h2,h3,h4,h5,h6')?.tagName ?? ''
        out.push({
          y: Math.round(r.top + scrollY),
          x: Math.round(r.left),
          size: Math.round(parseFloat(cs.fontSize)),
          tag,
          text: t,
        })
      } else if (child.nodeType === 1 && !skip.has(child.tagName)) {
        walk(child)
      }
    }
  }
  walk(document.body)

  out.sort((a, b) => a.y - b.y || a.x - b.x)

  const lines = []
  for (const item of out) {
    const label = item.tag ? `[${item.tag}]` : `[${item.size}px]`
    const line = `${String(item.y).padStart(6)} ${label.padEnd(7)} ${item.text}`
    if (lines[lines.length - 1] !== line) lines.push(line)
  }
  return lines.join('\n')
}

try {
  for (const path of todo) {
    const page = await browser.newPage()
    await page.setViewport({ width: 1440, height: 1000 })
    await page.goto(ORIGIN + path, { waitUntil: 'networkidle2', timeout: 90000 })
    await page.evaluate(() => document.fonts.ready)

    // Scroll through so every lazy block mounts.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += innerHeight * 0.8) {
        scrollTo({ top: y, behavior: 'instant' })
        await new Promise((r) => setTimeout(r, 120))
      }
      scrollTo({ top: 0, behavior: 'instant' })
    })

    // Expand every collapsed disclosure, then capture. Tabs are captured one at
    // a time afterwards, since only one panel can be visible at once.
    const openedAll = await page.evaluate(async () => {
      const clickable = [...document.querySelectorAll('[aria-expanded="false"], details:not([open]) summary')]
      for (const el of clickable) {
        el.click?.()
        if (el.tagName === 'SUMMARY') el.parentElement.open = true
        await new Promise((r) => setTimeout(r, 90))
      }
      await new Promise((r) => setTimeout(r, 400))
      return clickable.length
    })

    const base = await page.evaluate(readVisual)
    let dump = `# ${path}\n# accordions opened: ${openedAll}\n\n` + base

    // Tab panels replace each other, so a full re dump per tab would repeat the
    // whole page. Keep only what a click actually revealed.
    const bare = (l) => l.replace(/^\s*\d+\s+\[[^\]]+\]\s*/, '')
    const seenText = new Set(base.split('\n').map(bare))

    // Framer tabs and FAQ rows are plain clickable text, not ARIA widgets.
    // Candidates are short labels sitting in a row (tabs) and anything phrased
    // as a question (FAQ). Anything inside a link or the site chrome is skipped,
    // otherwise the crawler navigates away instead of revealing a panel.
    // Any short leaf label, plus anything phrased as a question. Framer's tab
    // lists are sometimes a row and sometimes a column, so geometry is not a
    // reliable filter. Clicking a few inert labels costs nothing, because only
    // lines that were not on the page already get recorded.
    const labels = await page.evaluate(() => {
      const out = new Set()
      for (const el of document.querySelectorAll('p,div,span,button')) {
        const t = el.textContent?.replace(/\s+/g, ' ').trim() ?? ''
        if (!t || el.children.length || el.closest('a,header,footer,nav')) continue
        if (el.getBoundingClientRect().height === 0) continue
        if (t.length < 3) continue
        if (t.endsWith('?') ? t.length <= 140 : t.length <= 30) out.add(t)
      }
      return [...out]
    })

    const startUrl = page.url()

    for (const label of labels) {
      // Framer listens for pointer events, so a synthetic el.click() does
      // nothing. Scroll the label into view and click it with the real mouse.
      const box = await page.evaluate((text) => {
        const el = [...document.querySelectorAll('p,div,span,button')].find(
          (e) =>
            !e.children.length &&
            !e.closest('a,header,footer,nav') &&
            e.textContent?.replace(/\s+/g, ' ').trim() === text
        )
        if (!el) return null
        el.scrollIntoView({ block: 'center', behavior: 'instant' })
        const r = el.getBoundingClientRect()
        return r.width && r.height ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : null
      }, label)
      if (!box) continue

      await new Promise((r) => setTimeout(r, 120))
      await page.mouse.click(box.x, box.y)
      await new Promise((r) => setTimeout(r, 380))

      if (page.url() !== startUrl) {
        dump += `\n\n## navigated away on "${label}", stopping reveals`
        break
      }

      const fresh = (await page.evaluate(readVisual)).split('\n').filter((l) => !seenText.has(bare(l)))
      if (!fresh.length) continue
      fresh.forEach((l) => seenText.add(bare(l)))
      dump += `\n\n## revealed by "${label}"\n` + fresh.join('\n')
    }

    writeFileSync(`${OUT}/${slug(path)}.txt`, dump)
    console.log(`${path.padEnd(46)} ${dump.split('\n').length} lines`)
    await page.close()
  }
} finally {
  await browser.close()
}
