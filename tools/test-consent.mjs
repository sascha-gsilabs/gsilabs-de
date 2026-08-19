// Regression test for the consent banner and the two services behind it.
//   node tools/test-consent.mjs [http://localhost:3001]
//
// The thing being tested is a negative: that nothing reaches Google or Apollo
// before a visitor has agreed. A negative is exactly what review misses and what
// a refactor breaks silently, since the page looks identical either way. So the
// test watches the network rather than the markup.
//
// Every outbound request to a host other than the one under test is recorded and
// answered locally, so the run needs no internet and sends nothing to either
// company while checking that it would have.
import { existsSync } from 'node:fs'
import puppeteer from 'puppeteer-core'

const CHROME = [
  'C:/Users/sascha.avermiddig.GBCVN/.cache/puppeteer/chrome/win64-150.0.7871.24/chrome-win64/chrome.exe',
  'C:/Users/sascha.avermiddig.GBCVN/.cache/puppeteer/chrome/win64-149.0.7827.22/chrome-win64/chrome.exe',
].find(existsSync)

const BASE = (process.argv[2] ?? 'http://localhost:3001').replace(/\/$/, '')
const HOST = new URL(BASE).host
const TRACKERS = /(^|\.)(apollo\.io|googletagmanager\.com|google-analytics\.com)$/

const failures = []
const check = (name, ok, detail = '') => {
  if (!ok) failures.push(detail ? `${name}: ${detail}` : name)
  console.log(`${ok ? ' ok ' : 'FAIL'}  ${name}${!ok && detail ? `  ${detail}` : ''}`)
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox'],
})

/* One visitor, in a browser context of their own so the stored decision does not
   leak from one scenario into the next, and one recording of who they called.
   `calls` is emptied between steps so each assertion is about that step alone
   and not the whole session. */
async function open() {
  const context = await browser.createBrowserContext()
  const page = await context.newPage()
  const calls = []
  await page.setViewport({ width: 1440, height: 900 })
  await page.setRequestInterception(true)

  page.on('request', (request) => {
    const host = new URL(request.url()).host
    if (host === HOST) return request.continue()
    calls.push(request.url())
    // An empty script body, so an onload handler still runs and the page under
    // test behaves as if the tracker had answered.
    request.respond({ status: 200, contentType: 'application/javascript', body: '' })
  })

  const visit = async (path) => {
    await page.goto(BASE + path, { waitUntil: 'networkidle2' })
  }
  const shown = () => page.$eval('[data-consent-banner]', (el) => !el.hidden)
  const trackers = () => calls.filter((url) => TRACKERS.test(new URL(url).host))

  /* The band slides up over half a second, and until it has arrived its buttons
     are below the fold and cannot be clicked. Waiting for it to land is what a
     visitor does without thinking about it. */
  const reopen = async () => {
    await page.click('[data-consent-open]')
    await page.waitForFunction(() => {
      const el = document.querySelector('[data-consent-banner]')
      return el && !el.hidden && el.getBoundingClientRect().bottom <= innerHeight + 1
    })
  }

  return {
    page,
    calls,
    visit,
    shown,
    reopen,
    trackers,
    clear: () => calls.splice(0),
    close: () => context.close(),
  }
}

try {
  /* --- someone who has not decided ---------------------------------------- */
  {
    const s = await open()
    await s.visit('/')
    check('first visit shows the banner', await s.shown())
    check('first visit calls no tracker', s.trackers().length === 0, s.trackers().join(', '))

    /* Declining is the state the site ships in, so it gets the same scrutiny as
       accepting: no request now, and none after a reload either. */
    await s.page.click('[data-consent="decline"]')
    check('declining hides the banner', !(await s.shown()))
    check('declining calls no tracker', s.trackers().length === 0, s.trackers().join(', '))

    s.clear()
    await s.visit('/our-process')
    check('the refusal survives a page change', !(await s.shown()))
    check('and still calls no tracker', s.trackers().length === 0, s.trackers().join(', '))

    /* The way back in. Without it the policy's promise of a withdrawal that is as
       easy as the agreement is not kept. */
    await s.reopen()
    check('the footer link reopens the banner', await s.shown())
    await s.close()
  }

  /* --- someone who agrees -------------------------------------------------- */
  {
    const s = await open()
    await s.visit('/')

    /* Which services to expect is read off the page rather than written here, so
       filling in the measurement id in site.yml brings Google Analytics under
       test without anyone remembering to come back and add it. */
    const services = await s.page.$eval('[data-consent-banner]', (el) => [
      ...(el.dataset.apollo ? [['Apollo', 'apollo.io']] : []),
      ...(el.dataset.ga4 ? [['Google Analytics', 'googletagmanager.com']] : []),
    ])
    check('at least one service is configured', services.length > 0, 'site.yml has neither id')

    await s.page.click('[data-consent="accept"]')
    await s.page.waitForNetworkIdle({ idleTime: 500 }).catch(() => {})

    check('accepting hides the banner', !(await s.shown()))
    for (const [name, host] of services)
      check(
        `accepting loads ${name}`,
        s.trackers().some((url) => url.includes(host)),
        s.trackers().join(', ') || 'nothing was requested'
      )

    s.clear()
    await s.visit('/about')
    check('the agreement survives a page change', !(await s.shown()))
    for (const [name, host] of services)
      check(
        `and loads ${name} without asking again`,
        s.trackers().some((url) => url.includes(host))
      )

    /* Withdrawing cannot unload a running script, so the page reloads without it.
       What matters is the visit after that one, and what the trackers left behind.

       The identifiers are seeded by hand: the real Apollo script is answered locally
       in this run and never gets to write them, but the code that clears them is the
       claim the privacy policy makes and so it is the thing worth testing. */
    await s.page.evaluate((app) => {
      localStorage.setItem('apolloAnonId', 'seeded-for-the-test')
      if (app) localStorage.setItem(app + '_eventQueue', '[]')
      document.cookie = '_ga=seeded-for-the-test; path=/'
    }, await s.page.$eval('[data-consent-banner]', (el) => el.dataset.apollo || ''))

    await s.reopen()
    await Promise.all([
      s.page.waitForNavigation({ waitUntil: 'networkidle2' }),
      s.page.click('[data-consent="decline"]'),
    ])
    s.clear()
    await s.visit('/')
    check('withdrawing stops the tracker', s.trackers().length === 0, s.trackers().join(', '))
    check('and does not ask again', !(await s.shown()))

    const left = await s.page.evaluate(() => [
      ...Object.keys(localStorage).filter((k) => k !== 'gsi-consent'),
      ...document.cookie.split(';').map((c) => c.split('=')[0].trim()).filter(Boolean),
    ])
    check('and clears the identifiers they left behind', left.length === 0, left.join(', '))
    await s.close()
  }

  /* --- the German site ----------------------------------------------------- */
  {
    const s = await open()
    await s.visit('/de')
    const text = await s.page.$eval('[data-consent-banner]', (el) => el.textContent)
    check('the German banner is German', text.includes('Zustimmen') && text.includes('Ablehnen'), text.trim().slice(0, 60))
    const href = await s.page.$eval('.consent__more', (el) => new URL(el.href).pathname)
    check('and points at the German policy', href === '/de/privacy', href)
    await s.close()
  }
} finally {
  await browser.close()
}

console.log(failures.length ? `\n${failures.length} failed` : '\nconsent: all checks passed')
process.exit(failures.length ? 1 : 0)
