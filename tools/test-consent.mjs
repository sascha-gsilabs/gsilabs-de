// Regression test for the consent banner and the services behind its switches.
//   node tools/test-consent.mjs [http://localhost:3001]
//
// The thing being tested is a negative: that nothing reaches Apollo or Google
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

  const visit = (path) => page.goto(BASE + path, { waitUntil: 'networkidle2' })
  const shown = () => page.$eval('[data-consent-banner]', (el) => !el.hidden)
  const pane = () => page.$eval('[data-consent-banner]', (el) => el.dataset.pane)
  const trackers = () => calls.filter((url) => TRACKERS.test(new URL(url).host))

  /* The band slides up over half a second, and until it has arrived its controls
     are below the fold and cannot be clicked. Waiting for it to land is what a
     visitor does without thinking about it. */
  const settle = () =>
    page.waitForFunction(() => {
      const el = document.querySelector('[data-consent-banner]')
      return el && !el.hidden && el.getBoundingClientRect().bottom <= innerHeight + 1
    })

  const reopen = async () => {
    await page.click('[data-consent-open]')
    await settle()
  }

  /* "Accept all" and "Reject all" appear on both layers, so a plain selector would
     find the copy on the hidden one. Only the pane on show can be pressed, which
     is also true for the visitor. Clicking a button that reloads the page and one
     that does not look the same from here, so both are awaited the same way. */
  const press = async (action) => {
    let target = null
    for (const handle of await page.$$(`[data-consent="${action}"]`)) {
      if (await handle.evaluate((el) => el.offsetParent !== null)) {
        target = handle
        break
      }
    }
    if (!target) throw new Error(`no visible [data-consent="${action}"] to press`)

    const navigated = page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 3000 }).catch(() => null)
    await target.click()
    await navigated
    await page.waitForNetworkIdle({ idleTime: 400 }).catch(() => {})
  }

  return {
    page,
    calls,
    visit,
    shown,
    pane,
    settle,
    reopen,
    press,
    trackers,
    clear: () => calls.splice(0),
    close: () => context.close(),
  }
}

try {
  /* --- somebody who has not decided --------------------------------------- */
  {
    const s = await open()
    await s.visit('/')
    await s.settle()
    check('first visit shows the banner', await s.shown())
    check('and opens on the short notice', (await s.pane()) === 'notice', await s.pane())
    check('and calls no tracker', s.trackers().length === 0, s.trackers().join(', '))

    /* The short layer is deliberately free of company names and of the country the
       data goes to. Both belong one click deeper, and both are the kind of detail
       that creeps back into a summary during a rewrite, so the line is guarded
       here rather than left to whoever edits site.yml next. */
    const named = await s.page.$eval('.consent__notice', (el) => el.textContent)
    const leaks = [/apollo/i, /google/i, /zenleads/i, /\busa\b/i, /united states/i]
      .filter((pattern) => pattern.test(named))
      .map(String)
    check('the first layer names no vendor and no country', leaks.length === 0, leaks.join(', '))

    /* Refusing is the state the site ships in, so it gets the same scrutiny as
       agreeing: no request now, and none after a page change either. */
    await s.press('none')
    check('rejecting all hides the banner', !(await s.shown()))
    check('and calls no tracker', s.trackers().length === 0, s.trackers().join(', '))

    s.clear()
    await s.visit('/our-process')
    check('the refusal survives a page change', !(await s.shown()))
    check('and still calls no tracker', s.trackers().length === 0, s.trackers().join(', '))

    /* The way back in. Without it the policy's promise of a withdrawal as easy as
       the agreement is not kept. */
    await s.reopen()
    check('the footer link reopens the banner', await s.shown())
    check('straight into the switches', (await s.pane()) === 'panel', await s.pane())

    const locked = await s.page.$eval(
      '[data-consent-group="necessary"]',
      (el) => el.checked && el.disabled
    )
    check('what runs regardless is listed but locked', locked)
    await s.close()
  }

  /* --- somebody who accepts everything ------------------------------------ */
  {
    const s = await open()
    await s.visit('/')
    await s.settle()

    /* Which services to expect is read off the page rather than written here, so
       filling in a measurement id in site.yml brings Google Analytics under test
       without anyone remembering to come back and add it. */
    const services = await s.page.$$eval('[data-consent-group]', (boxes) =>
      boxes.flatMap((el) => [
        ...(el.dataset.apollo ? [['Apollo', 'apollo.io']] : []),
        ...(el.dataset.ga4 ? [['Google Analytics', 'googletagmanager.com']] : []),
      ])
    )
    check('at least one service is configured', services.length > 0, 'site.yml has no id')

    await s.press('all')
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
    await s.close()
  }

  /* --- somebody who picks ------------------------------------------------- */
  {
    const s = await open()
    await s.visit('/')
    await s.settle()

    const groups = await s.page.$$eval('[data-consent-group]:not([disabled])', (boxes) =>
      boxes.map((el) => el.dataset.consentGroup)
    )
    check('there is something to pick from', groups.length > 0)

    // Save with every switch left off. Same effect as rejecting, by another route.
    await s.page.click('[data-consent="open-panel"]')
    await s.press('save')
    check('saving an empty selection calls no tracker', s.trackers().length === 0, s.trackers().join(', '))

    // Now turn one on and save again.
    await s.reopen()
    await s.page.click(`[data-consent-group="${groups[0]}"]`)
    await s.press('save')
    check(
      `switching on "${groups[0]}" loads its service`,
      s.trackers().length > 0,
      'nothing was requested'
    )

    // Reopening has to show the switch as the visitor left it, not as it started.
    await s.reopen()
    const remembered = await s.page.$eval(`[data-consent-group="${groups[0]}"]`, (el) => el.checked)
    check('and the panel remembers it', remembered)

    /* Withdrawing cannot unload a running script, so the page reloads without it.
       What matters is the visit after that one, and what the trackers left behind.

       The identifiers are seeded by hand: the real scripts are answered locally in
       this run and never get to write them, but the code that clears them is the
       claim the privacy policy makes and so it is the thing worth testing. */
    await s.page.evaluate((app) => {
      localStorage.setItem('apolloAnonId', 'seeded-for-the-test')
      if (app) localStorage.setItem(app + '_eventQueue', '[]')
      document.cookie = '_ga=seeded-for-the-test; path=/'
    }, await s.page.$eval('[data-consent-group]:not([disabled])', (el) => el.dataset.apollo || ''))

    await s.press('none')
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
    await s.settle()
    const text = await s.page.$eval('[data-consent-banner]', (el) => el.textContent)
    check(
      'the German banner is German',
      ['Alle akzeptieren', 'Alle ablehnen', 'Notwendig', 'Immer aktiv'].every((w) => text.includes(w)),
      text.trim().slice(0, 80)
    )
    const href = await s.page.$eval('.consent__more', (el) => new URL(el.href).pathname)
    check('and points at the German policy', href === '/de/privacy', href)
    await s.close()
  }
} finally {
  await browser.close()
}

console.log(failures.length ? `\n${failures.length} failed` : '\nconsent: all checks passed')
process.exit(failures.length ? 1 : 0)
