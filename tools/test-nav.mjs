// Regression test for the header menus: hover a trigger, walk the pointer down
// into the panel the way a user does, and confirm the menu is still open and the
// link actually navigates. Run against every language, since the German header is
// the same markup with different words in it, and a layout that fits one set of
// labels can still break on the other.
//   node tools/test-nav.mjs [http://localhost:3001]
import { existsSync } from 'node:fs'
import puppeteer from 'puppeteer-core'

const CHROME = [
  'C:/Users/sascha.avermiddig.GBCVN/.cache/puppeteer/chrome/win64-150.0.7871.24/chrome-win64/chrome.exe',
  'C:/Users/sascha.avermiddig.GBCVN/.cache/puppeteer/chrome/win64-149.0.7827.22/chrome-win64/chrome.exe',
].find(existsSync)

const BASE = (process.argv[2] ?? 'http://localhost:3001').replace(/\/$/, '')
const failures = []

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox'],
})

try {
  for (const home of ['', '/de'])
    for (const menu of ['solutions', 'company', 'services', 'insights']) {
    const page = await browser.newPage()
    await page.setViewport({ width: 1440, height: 900 })
    await page.goto(BASE + (home || '/'), { waitUntil: 'networkidle2' })
    await page.evaluate(() => document.fonts.ready)

    const trigger = await page.$(`[aria-controls="menu-${menu}"]`)
    const box = await trigger.boundingBox()

    // Hover the trigger.
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
    await new Promise((r) => setTimeout(r, 250))

    const openedOnHover = await page.$eval(`[aria-controls="menu-${menu}"]`, (el) =>
      el.closest('.nav__item').dataset.open === 'true'
    )
    if (!openedOnHover) failures.push(`${menu}: did not open on hover`)

    // Walk down through the gap into the panel, a few pixels at a time.
    const link = await page.$(`#menu-${menu} a`)
    const linkBox = await link.boundingBox()
    const steps = 6
    for (let i = 1; i <= steps; i++) {
      await page.mouse.move(
        box.x + box.width / 2 + ((linkBox.x + 20 - box.x - box.width / 2) * i) / steps,
        box.y + box.height / 2 + ((linkBox.y + linkBox.height / 2 - box.y - box.height / 2) * i) / steps
      )
      await new Promise((r) => setTimeout(r, 40))
    }
    await new Promise((r) => setTimeout(r, 150))

    const stillOpen = await page.$eval(`[aria-controls="menu-${menu}"]`, (el) =>
      el.closest('.nav__item').dataset.open === 'true'
    )
    const reachable = await page.$eval(`#menu-${menu} a`, (a) => {
      const r = a.getBoundingClientRect()
      const top = document.elementFromPoint(r.x + 20, r.y + r.height / 2)
      return a.contains(top) || top === a
    })

    if (!stillOpen) failures.push(`${menu}: closed while moving into the panel`)
    if (!reachable) failures.push(`${menu}: first link is not the topmost element at its own position`)

    if (stillOpen && reachable) {
      const href = await page.$eval(`#menu-${menu} a`, (a) => a.getAttribute('href'))
      await Promise.all([page.waitForNavigation({ waitUntil: 'domcontentloaded' }), link.click()])
      const landed = new URL(page.url()).pathname.replace(/\/$/, '')
      if (landed !== href) failures.push(`${menu}: clicking ${href} landed on ${landed}`)
      else console.log(` ok  ${(home || '/').padEnd(4)} ${menu.padEnd(10)} hover, cross the gap, click -> ${landed}`)
    } else {
      console.log(`FAIL ${home || '/'} ${menu}`)
    }

    await page.close()
  }
} finally {
  await browser.close()
}

if (failures.length) {
  console.log('\n' + failures.map((f) => '  ' + f).join('\n'))
  process.exitCode = 1
} else {
  console.log('\nall four menus reachable by mouse, in both languages')
}
