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
    navToggle.querySelector('[data-toggle-label]').textContent = 'Close'
    head.dataset.sheet = 'open'
    document.body.style.overflow = 'hidden'
  }

  function closeSheet() {
    nav.classList.remove('is-open')
    navToggle.setAttribute('aria-expanded', 'false')
    navToggle.querySelector('[data-toggle-label]').textContent = 'Menu'
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

  if (video && !reduced.matches) {
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
})()
