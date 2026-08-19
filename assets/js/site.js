/* GSI Labs / gsilabs.de
   Header state, navigation menus, scroll reveals. No dependencies. */

;(() => {
  'use strict'

  const head = document.querySelector('.site-head')
  const nav = document.querySelector('.nav')
  const navToggle = document.querySelector('.nav-toggle')
  const items = [...document.querySelectorAll('.nav__item[data-menu]')]
  const reduced = matchMedia('(prefers-reduced-motion: reduce)')
  const pointerFine = matchMedia('(hover: hover) and (pointer: fine)')

  /* --- header: transparent while a dark hero sits behind it, paper after -- */

  const overSection = document.querySelector('[data-head-over]')

  if (head && overSection && 'IntersectionObserver' in window) {
    // Shrink the observation root down to the header strip itself. While the
    // dark section still overlaps that strip, the header stays transparent.
    let observer

    const watch = () => {
      observer?.disconnect()
      observer = new IntersectionObserver(
        ([entry]) => (head.dataset.mode = entry.isIntersecting ? 'over' : 'paper'),
        { rootMargin: `0px 0px -${Math.max(0, innerHeight - head.offsetHeight)}px 0px`, threshold: 0 }
      )
      observer.observe(overSection)
    }

    watch()
    addEventListener('resize', watch, { passive: true })
  } else if (head) {
    head.dataset.mode = 'paper'
  }

  /* --- navigation menus --------------------------------------------------- */

  const closeAll = (except) => {
    items.forEach((item) => {
      if (item === except) return
      item.dataset.open = 'false'
      item.querySelector('.nav__trigger')?.setAttribute('aria-expanded', 'false')
    })
  }

  const setOpen = (item, open) => {
    item.dataset.open = String(open)
    item.querySelector('.nav__trigger')?.setAttribute('aria-expanded', String(open))
    if (open) closeAll(item)
  }

  items.forEach((item) => {
    const trigger = item.querySelector('.nav__trigger')
    if (!trigger) return

    const hoverDriven = () =>
      pointerFine.matches && !nav.classList.contains('is-open')

    trigger.addEventListener('click', () => {
      // A mouse click always arrives after the hover that already opened the
      // menu. Swallow that first click so the menu does not flash shut.
      if (item.dataset.hoverOpen === 'true') {
        delete item.dataset.hoverOpen
        return
      }
      setOpen(item, item.dataset.open !== 'true')
    })

    // Closing is delayed a little so a diagonal move from the trigger toward the
    // panel does not shut the menu on the way.
    let closeTimer

    item.addEventListener('pointerenter', (event) => {
      if (event.pointerType !== 'mouse' || !hoverDriven()) return
      clearTimeout(closeTimer)
      item.dataset.hoverOpen = 'true'
      setOpen(item, true)
    })
    item.addEventListener('pointerleave', (event) => {
      if (event.pointerType !== 'mouse' || !hoverDriven()) return
      clearTimeout(closeTimer)
      closeTimer = setTimeout(() => {
        delete item.dataset.hoverOpen
        setOpen(item, false)
      }, 220)
    })

    // Keyboard: leaving the group closes it.
    item.addEventListener('focusout', (event) => {
      if (!item.contains(event.relatedTarget)) setOpen(item, false)
    })
  })

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return
    const open = items.find((item) => item.dataset.open === 'true')
    if (open) {
      setOpen(open, false)
      open.querySelector('.nav__trigger')?.focus()
      return
    }
    if (nav?.classList.contains('is-open')) closeSheet()
  })

  document.addEventListener('pointerdown', (event) => {
    if (!event.target.closest('.nav__item')) closeAll(null)
  })

  /* --- mobile sheet ------------------------------------------------------- */

  function openSheet() {
    nav.classList.add('is-open')
    navToggle.setAttribute('aria-expanded', 'true')
    // Both labels come off the button, which is rendered in the page's language.
    navToggle.querySelector('[data-toggle-label]').textContent = navToggle.dataset.labelOpen
    head.dataset.sheet = 'open'
    document.body.style.overflow = 'hidden'
  }

  function closeSheet() {
    nav.classList.remove('is-open')
    navToggle.setAttribute('aria-expanded', 'false')
    navToggle.querySelector('[data-toggle-label]').textContent = navToggle.dataset.labelClosed
    delete head.dataset.sheet
    document.body.style.overflow = ''
    closeAll(null)
  }

  navToggle?.addEventListener('click', () => {
    nav.classList.contains('is-open') ? closeSheet() : openSheet()
  })

  matchMedia('(min-width: 901px)').addEventListener('change', (event) => {
    if (event.matches && nav?.classList.contains('is-open')) closeSheet()
  })

  /* --- scroll reveals ---------------------------------------------------- */

  const targets = [...document.querySelectorAll('.reveal')]

  if (reduced.matches || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-in'))
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-in')
          observer.unobserve(entry.target)
        })
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 }
    )
    targets.forEach((el) => observer.observe(el))
  }

  /* --- feature tabs ------------------------------------------------------ */

  document.querySelectorAll('[data-tabs]').forEach((group) => {
    const tabs = [...group.querySelectorAll('[role="tab"]')]
    const panels = [...group.querySelectorAll('[role="tabpanel"]')]

    const select = (index, { focus = false } = {}) => {
      tabs.forEach((tab, i) => {
        const on = i === index
        tab.setAttribute('aria-selected', String(on))
        tab.tabIndex = on ? 0 : -1
        panels[i].hidden = !on
      })
      if (focus) tabs[index].focus()
    }

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(i))
      tab.addEventListener('keydown', (event) => {
        const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[event.key]
        if (step) {
          event.preventDefault()
          select((i + step + tabs.length) % tabs.length, { focus: true })
          return
        }
        if (event.key === 'Home' || event.key === 'End') {
          event.preventDefault()
          select(event.key === 'Home' ? 0 : tabs.length - 1, { focus: true })
        }
      })
    })
  })

  /* --- hero video: only fetch it once the poster is on screen ------------ */

  const video = document.querySelector('[data-hero-video]')

  /* Someone on a metered or slow connection is the last person who should spend
     900 KB on wallpaper. Both signals are Chromium only and absent elsewhere,
     which is why the test is for an explicit yes rather than for a no. */
  const link = navigator.connection
  const frugal = link ? link.saveData === true || /^([23]g|slow-2g)$/.test(link.effectiveType || '') : false

  if (video && !reduced.matches && !frugal) {
    const load = () => {
      video.querySelectorAll('source[data-src]').forEach((source) => {
        source.src = source.dataset.src
        source.removeAttribute('data-src')
      })
      video.load()
      video.play().catch(() => {})
    }
    if ('requestIdleCallback' in window) requestIdleCallback(load, { timeout: 1500 })
    else addEventListener('load', load, { once: true })
  }

  /* --- consent, and the two services that wait behind it ------------------ */

  /* Google Analytics and Apollo both write to the visitor's device, so neither may
     load before the visitor has said yes. That is the whole point of this block:
     the ids sit in the markup, the scripts are built here and nowhere else, and
     nothing in the page head reaches either company on its own.

     The banner is server rendered on every page but starts hidden, so a returning
     visitor never sees it flash. Which means: with this script blocked, no banner
     and no tracking. Consistent, and the quiet state is the private one. */

  const banner = document.querySelector('[data-consent-banner]')

  if (banner) {
    const KEY = 'gsi-consent'
    /* Bump when the services change. Somebody who agreed to the old set has not
       agreed to the new one, so their stored answer stops counting and they are
       asked again. */
    const VERSION = 1

    const read = () => {
      try {
        const saved = JSON.parse(localStorage.getItem(KEY) || 'null')
        return saved && saved.v === VERSION ? saved : null
      } catch {
        // Private mode, or a hand edited value. Treat it as never asked.
        return null
      }
    }

    const write = (granted) => {
      try {
        localStorage.setItem(KEY, JSON.stringify({ v: VERSION, granted, at: new Date().toISOString() }))
      } catch {
        /* Nothing to do. Without storage the visitor is asked again next time,
           which is the safe way round. */
      }
    }

    let started = false

    const start = () => {
      if (started) return
      started = true

      const ga = banner.dataset.ga4
      if (ga) {
        window.dataLayer = window.dataLayer || []
        window.gtag = function () {
          window.dataLayer.push(arguments)
        }
        window.gtag('js', new Date())
        /* The privacy policy says the advertising features are off. This is one of
           the two places that promise is kept; the other is the account setting,
           and both have to say the same thing. */
        window.gtag('config', ga, {
          allow_google_signals: false,
          allow_ad_personalization_signals: false,
        })

        const tag = document.createElement('script')
        tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(ga)
        tag.async = true
        document.head.appendChild(tag)
      }

      const apollo = banner.dataset.apollo
      if (apollo) {
        const tag = document.createElement('script')
        /* The random query string is Apollo's own, from the snippet they publish.
           It defeats caching, which is wasteful, but it is their tracker and not
           the place to get clever. */
        tag.src =
          'https://assets.apollo.io/micro/website-tracker/tracker.iife.js?nocache=' +
          Math.random().toString(36).substring(7)
        tag.async = true
        tag.defer = true
        tag.onload = () => window.trackingFunctions?.onLoad({ appId: apollo })
        document.head.appendChild(tag)
      }
    }

    /* Withdrawing cannot unload a script that is already running, so the page is
       reloaded without it. What the services left behind goes first, otherwise the
       next visit is recognised as this same one and the withdrawal is only a word.

       Apollo keeps nothing in a cookie: its identifier is `apolloAnonId` in local
       storage, next to two working entries prefixed with the app id. Google is the
       other way round and writes `_ga` cookies. Measured against both trackers, and
       checked by tools/test-consent.mjs, so a change on their side shows up as a
       failing test rather than as a promise this page quietly stopped keeping. */
    const forget = () => {
      document.cookie.split(';').forEach((pair) => {
        const name = pair.split('=')[0].trim()
        if (!/^_ga/.test(name)) return
        // Both the bare host and the dot prefixed domain, because gtag writes there.
        document.cookie = name + '=; max-age=0; path=/'
        document.cookie = name + '=; max-age=0; path=/; domain=.' + location.hostname
      })

      const apollo = banner.dataset.apollo
      try {
        Object.keys(localStorage).forEach((key) => {
          if (key === 'apolloAnonId' || (apollo && key.startsWith(apollo + '_')))
            localStorage.removeItem(key)
        })
      } catch {
        /* No storage to clear. */
      }
    }

    banner.querySelectorAll('[data-consent]').forEach((button) => {
      button.addEventListener('click', () => {
        const granted = button.dataset.consent === 'accept'
        const had = read()?.granted === true
        write(granted)
        banner.hidden = true
        if (granted) start()
        else if (had) {
          forget()
          location.reload()
        }
      })
    })

    document.querySelectorAll('[data-consent-open]').forEach((control) => {
      control.addEventListener('click', () => {
        banner.hidden = false
        banner.querySelector('[data-consent]')?.focus()
      })
    })

    const decision = read()
    if (!decision) banner.hidden = false
    else if (decision.granted) start()
  }
})()
