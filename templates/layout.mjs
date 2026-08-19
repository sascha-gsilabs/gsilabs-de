// Page shell: head, header, footer. Everything here reads from content/site.yml,
// so navigation and company details exist in exactly one place.
import { marked } from 'marked'

export const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/* Interface text the templates emit themselves, as opposed to text that comes
   out of a content file. Keys live under `ui` in site.yml, so the German build
   gets German buttons without a second code path. A missing key throws rather
   than falling back to the key name: an English word left on a German page is
   the exact failure this table exists to prevent. */
export const t = (site, key) => {
  const value = site.ui?.[key]
  if (value == null) throw new Error(`unknown ui string: ${key}. Add it under \`ui\` in site.yml`)
  return String(value).trim()
}

/* A sentence with a link inside it, written as one string with an {email} slot.
   Cutting it into a head and a tail instead would work in English and break in
   German, which puts the address elsewhere in the sentence. */
export const withEmail = (site, key) => {
  const address = site.company.email
  return esc(t(site, key)).replace('{email}', `<a href="mailto:${address}">${esc(address)}</a>`)
}

// GSI Labs' own copy uses " // " as a delimiter. Content files write it plainly
// and it is styled on the way out. Spaces are required on both sides so URLs are
// left alone.
const delimiters = (html) => html.replace(/ \/\/ /g, ' <span class="label__sep">//</span> ')

// Images in body copy become figures, and the markdown title becomes the caption:
//   ![alt text](/path.webp "Figure 1: the caption")
marked.use({
  renderer: {
    image({ href, title, text }) {
      return `<figure class="prose__figure"><img class="photo" src="${href}" alt="${esc(text)}" loading="lazy" decoding="async">${
        title ? `<figcaption class="small">${esc(title)}</figcaption>` : ''
      }</figure>`
    },
  },
})

// marked wraps a lone image in a paragraph, which would nest a figure inside a p.
const unwrapFigures = (html) =>
  html.replace(/<p>(\s*<figure[\s\S]*?<\/figure>\s*)<\/p>/g, '$1')

/* A list entry written as `- Some label: the rest` is a mapping to YAML, not the
   sentence it looks like, and String() would quietly render it as [object Object]
   on the page. Catching it here turns a typo that survives review into a failed
   build naming the value. */
function text(value) {
  if (value !== null && typeof value === 'object') {
    throw new Error(
      `expected text, got ${JSON.stringify(value)}. A colon in a list entry makes YAML ` +
        `read it as a key. Quote the whole entry or rewrite it without the colon.`
    )
  }
  return String(value)
}

/** Markdown to HTML, block level. */
export const md = (s = '') => delimiters(unwrapFigures(marked.parse(text(s).trim())))

/** Markdown to HTML without the wrapping paragraph, for headings and labels. */
export const mdInline = (s = '') => delimiters(marked.parseInline(text(s).trim()))

/** Joins an array of strings, dropping empties, so templates can use && freely. */
export const join = (parts) => parts.filter(Boolean).join('\n')

/** Renders a list of paragraphs from either a string or an array of strings. */
export const paras = (value, className = '') => {
  const list = Array.isArray(value) ? value : [value]
  return list
    .filter(Boolean)
    .map((p) => `<p${className ? ` class="${className}"` : ''}>${mdInline(p)}</p>`)
    .join('\n')
}

const ICONS = {
  linkedin:
    '<path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C21 8.65 22 10.9 22 14v7h-4v-6.2c0-1.5-.53-2.5-1.86-2.5-1.02 0-1.63.69-1.9 1.36-.1.24-.12.57-.12.9V21h-4V9Z"/>',
  youtube:
    '<path d="M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.76 1.77C5.75 19 12 19 12 19s6.25 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77C22 15.2 22 12 22 12s0-3.2-.4-4.8ZM10 15.2V8.8L15.5 12 10 15.2Z"/>',
}

const CHEVRON =
  '<svg class="nav__chev" viewBox="0 0 10 10" aria-hidden="true"><path d="M1 3.5 5 7l4-3.5" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>'

export const ARROW =
  '<svg class="btn__arrow" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 6h8M6.5 2.5 10 6l-3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>'

/* Whether a nav entry covers the current path, itself or as its parent. Used for
   the group trigger, so the section stays marked on a detail page that the nav
   does not list. The links inside a menu need the exact path instead: with the
   parent rule, /insights/projects marks both "Projects" and "All Insights", and
   the overview reads as permanently on. */
const isActive = (href, path) => href === path || (href !== '/' && path.startsWith(href + '/'))

/* The language switcher. Same open and close behaviour as the nav groups, since
   it is a .nav__item[data-menu] and the header script treats them all alike. The
   current language is a plain span: it is the state, not somewhere to go.

   `alternates` is where this page exists in each language, worked out by the
   build from the content files that are actually there. A language this page has
   no counterpart in points at that language's homepage instead of disappearing:
   someone who wants German should always be able to get to German, including
   from a page nobody has translated yet. */
function langSwitch(site, lang, alternates) {
  const languages = site.languages ?? []
  if (languages.length < 2) return ''

  const active = languages.find((l) => l.code === lang) ?? languages[0]
  const options = languages
    .map((l) => {
      if (l.code === active.code)
        return `<li><span class="nav__lang is-current" aria-current="true">${esc(l.label)}</span></li>`
      const href = alternates?.[l.code] ?? (l.prefix || '/')
      return `<li><a href="${href}" lang="${l.code}" hreflang="${l.code}">${esc(l.label)}</a></li>`
    })
    .join('\n          ')

  return `    <div class="nav__item nav__item--lang" data-menu data-open="false">
      <button class="nav__trigger nav__trigger--lang" type="button"
              aria-expanded="false" aria-controls="menu-language"
              aria-label="${esc(t(site, 'language'))}, ${esc(active.label)} ${esc(t(site, 'languageSelected'))}">
        <span aria-hidden="true">${esc(active.short)}</span>
        ${CHEVRON}
      </button>
      <div class="nav__menu nav__menu--lang" id="menu-language">
        <ul>
          ${options}
        </ul>
      </div>
    </div>
`
}

/* Where the brand mark leads. The root belongs to the first language, every
   other one lives under its prefix, so this is the one link in the shell that
   cannot simply be written as "/". */
const homeHref = (site, lang) => (site.languages ?? []).find((l) => l.code === lang)?.prefix || '/'

/* The switches the banner offers. A group with nothing configured behind it is
   dropped: an empty "Analytics" toggle that turns nothing on is worse than no
   toggle at all. `necessary` is declared in site.yml like the rest so that the
   panel lists it, which is the point of listing it: a visitor should be able to
   see what runs regardless, not just what they can refuse. */
const consentGroups = (site) =>
  (site.consent?.groups ?? []).filter((g) => g.required || g.apollo || g.ga4)

/* With nothing left to refuse there is nothing to ask, so no banner is rendered
   and no footer link offered. Removing the last service id from site.yml takes
   the whole apparatus off the site. */
const asksConsent = (site) => consentGroups(site).some((g) => !g.required)

const cap = (s) => s[0].toUpperCase() + s.slice(1)

/* One row of the panel: a switch, the group's name, and who is behind it. The
   vendor is named here rather than on the first layer, close enough to the switch
   that turning it on is a decision about a named company and not about the word
   "marketing". */
const consentGroup = (site, group) => {
  const on = group.required
  return `        <div class="consent-group">
          <label class="consent-group__row">
            <input class="consent-group__box" type="checkbox"${on ? ' checked disabled' : ''}
                   data-consent-group="${esc(group.id)}"${group.apollo ? ` data-apollo="${esc(group.apollo)}"` : ''}${
    group.ga4 ? ` data-ga4="${esc(group.ga4)}"` : ''
  }>
            <span class="consent-group__name">${esc(t(site, 'consent' + cap(group.id)))}</span>
            ${on ? `<span class="consent-group__always label">${esc(t(site, 'consentAlwaysOn'))}</span>` : ''}
          </label>
          <p class="small consent-group__body">${mdInline(t(site, 'consent' + cap(group.id) + 'Body'))}</p>
        </div>`
}

/* The consent notice. Rendered on every page but hidden, and shown by the script
   only when no decision is stored, so a returning visitor never sees it flash.
   With JavaScript off it stays hidden, which is the honest state: the services it
   asks about are loaded by that same script and would not run either.

   Two layers. The first names no vendor, says what happens, and offers the two
   answers plus a way into the detail. The second is the detail. That split is the
   ordinary shape of these things, and it works here because the second layer is
   one click away rather than a page away.

   Accept and reject are the same button at the same size on both layers. Equal
   prominence is not a style choice: a refusal that costs more than an agreement is
   not a decision anybody made freely, and the German supervisory authorities read
   it that way. */
function consent(site) {
  if (!asksConsent(site)) return ''

  const groups = consentGroups(site)
  const accept = `<button class="btn btn--solid" type="button" data-consent="all">${esc(
    t(site, 'consentAcceptAll')
  )}</button>`
  const reject = `<button class="btn btn--solid" type="button" data-consent="none">${esc(
    t(site, 'consentRejectAll')
  )}</button>`

  return `<div class="consent" id="consent" role="dialog" aria-labelledby="consent-title"
     data-consent-banner data-pane="notice" hidden>
  <div class="consent__inner">
    <section class="consent__notice" aria-labelledby="consent-title">
      <div class="consent__text">
        <h2 class="label" id="consent-title">${esc(t(site, 'consentTitle'))}</h2>
        <p class="small">${mdInline(t(site, 'consentBody'))}
          <a class="link consent__more" href="${site.consent.href}">${esc(t(site, 'consentMore'))}</a>
        </p>
      </div>
      <div class="consent__actions">
        <button class="btn btn--outline" type="button" data-consent="open-panel"
                aria-expanded="false" aria-controls="consent-panel">${esc(t(site, 'consentCustomise'))}</button>
        ${reject}
        ${accept}
      </div>
    </section>

    <section class="consent__panel" id="consent-panel" aria-labelledby="consent-panel-title">
      <h2 class="label" id="consent-panel-title">${esc(t(site, 'consentPanelTitle'))}</h2>
      <div class="consent__groups">
${join(groups.map((group) => consentGroup(site, group)))}
      </div>
      <div class="consent__actions">
        <button class="btn btn--solid" type="button" data-consent="save">${esc(t(site, 'consentSave'))}</button>
        ${reject}
        ${accept}
      </div>
    </section>
  </div>
</div>`
}

function header(site, path, mode, lang, alternates) {
  const menus = site.nav
    .map((group, i) => {
      const id = `menu-${group.id}`
      const open = group.items.some((item) => isActive(item.href, path))
      const links = group.items
        .map(
          (item) =>
            `<li><a href="${item.href}"${item.href === path ? ' aria-current="page"' : ''}>${esc(item.label)}</a></li>`
        )
        .join('\n              ')
      return `        <li class="nav__item" data-menu data-open="false">
          <button class="nav__trigger${open ? ' is-current' : ''}" type="button" aria-expanded="false" aria-controls="${id}">
            ${esc(group.label)}
            ${CHEVRON}
          </button>
          <div class="nav__menu" id="${id}">
            <ul>
              ${links}
            </ul>
          </div>
        </li>`
    })
    .join('\n\n')

  return `<header class="site-head" data-mode="${mode}">
  <div class="site-head__inner">
    <a class="brand" href="${homeHref(site, lang)}" aria-label="${esc(site.company.name)}, ${esc(t(site, 'home'))}">
      <img class="brand__night" src="/assets/logo/logo-night.svg" alt="${esc(site.company.name)}" width="92" height="42">
      <img class="brand__day" src="/assets/logo/logo-day.svg" alt="" width="92" height="42" aria-hidden="true">
    </a>

    <nav class="nav" id="site-nav" aria-label="${esc(t(site, 'mainNav'))}">
      <ul class="nav__list">
${menus}
      </ul>

      <!-- Only rendered inside the mobile sheet, where the header CTA is hidden. -->
      <div class="nav__foot">
        <a class="btn btn--solid" href="${site.cta.href}">${esc(site.cta.label)}</a>
        <dl class="nav__contact">
          <dt class="label">${esc(t(site, 'email'))}</dt>
          <dd><a href="mailto:${site.company.email}">${esc(site.company.email)}</a></dd>
          <dt class="label">${esc(t(site, 'phone'))}</dt>
          <dd><a href="tel:${site.company.phoneHref}">${esc(site.company.phone)}</a></dd>
        </dl>
      </div>
    </nav>

${langSwitch(site, lang, alternates)}
    <a class="btn btn--solid head__cta" href="${site.cta.href}">${esc(site.cta.label)}</a>

    <!-- Both labels travel with the button: the script swaps them on open and
         close, and reading them from here is what keeps the German site German. -->
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav"
            data-label-closed="${esc(t(site, 'menu'))}" data-label-open="${esc(t(site, 'close'))}">
      <span data-toggle-label>${esc(t(site, 'menu'))}</span>
    </button>
  </div>
</header>`
}

function footer(site) {
  const columns = site.nav
    .map((group) => {
      const id = `foot-${group.id}`
      const links = group.items
        .map((item) => `          <li><a href="${item.href}">${esc(item.label)}</a></li>`)
        .join('\n')
      return `      <nav class="foot-col" aria-labelledby="${id}">
        <h2 id="${id}">${esc(group.label)}</h2>
        <ul>
${links}
        </ul>
      </nav>`
    })
    .join('\n\n')

  const social = site.social
    .map(
      (s) => `        <li>
          <a href="${s.href}" rel="noopener" aria-label="${esc(site.company.name)} ${esc(t(site, 'socialOn'))} ${esc(s.label)}">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${ICONS[s.icon]}</svg>
          </a>
        </li>`
    )
    .join('\n')

  return `<footer class="site-foot">
  <div class="wrap">
    <div class="site-foot__main">
      <div class="foot-brand">
        <img class="foot-brand__logo" src="/assets/logo/logo-night.svg" alt="${esc(site.company.name)}" width="104" height="48">

        <address>
          ${esc(site.company.street)}<br>
          ${esc(site.company.postcode)} ${esc(site.company.city)}<br>
          ${esc(site.company.country)}
        </address>

        <dl>
          <dt class="label">${esc(t(site, 'email'))}</dt>
          <dd><a href="mailto:${site.company.email}">${esc(site.company.email)}</a></dd>
          <dt class="label">${esc(t(site, 'phone'))}</dt>
          <dd><a href="tel:${site.company.phoneHref}">${esc(site.company.phone)}</a></dd>
        </dl>
      </div>

${columns}
    </div>

    <div class="site-foot__base">
      <div class="site-foot__meta">
        <p class="small">© ${esc(site.company.legalName)}</p>
${
  asksConsent(site)
    ? `        <button class="link site-foot__consent" type="button" data-consent-open>${esc(
        t(site, 'consentSettings')
      )}</button>`
    : ''
}
      </div>

      <ul class="social">
${social}
      </ul>

      <p class="small site-foot__out">
        <a class="link" href="${site.outboundNote.href}" rel="noopener">${esc(site.outboundNote.label)}</a>
      </p>
    </div>

    <p class="site-foot__legal">${esc(site.company.legalLine)}</p>
  </div>
</footer>`
}

/**
 * @param {object} o
 * @param {string} o.title       document title, the suffix is appended
 * @param {string} o.description meta description
 * @param {string} o.path        canonical path, used for nav highlighting
 * @param {string} o.content     page body
 * @param {'over'|'paper'} o.headMode  header starts transparent over a dark hero
 * @param {object} o.site        parsed site.yml for this language
 * @param {string} o.lang        language code of this page
 * @param {Record<string,string>} o.alternates  this page's path in each language
 * @param {object[]} o.jsonLd    schema.org records to embed
 */
export function layout({
  title,
  description,
  path,
  content,
  headMode = 'paper',
  site,
  lang = 'en',
  alternates = {},
  jsonLd = [],
}) {
  const fullTitle = title === site.seo.titleSuffix ? title : `${title} | ${site.seo.titleSuffix}`
  const desc = description || site.seo.defaultDescription
  const url = (p) => site.seo.origin + (p === '/' ? '/' : p)
  const canonical = url(path)

  /* One <link rel="alternate"> per language this page exists in, plus x-default.
     Search engines need the set to agree with itself: every alternate has to list
     every other one, including itself, which is why this is built from the same
     map the switcher uses rather than assembled per page. x-default points at the
     English page, which is what someone with no matching language setting gets. */
  const hreflang = Object.entries(alternates)
    .map(([code, p]) => `<link rel="alternate" hreflang="${code}" href="${url(p)}">`)
    .concat(alternates.en ? [`<link rel="alternate" hreflang="x-default" href="${url(alternates.en)}">`] : [])
    .join('\n')

  const structured = jsonLd.length
    ? `\n<script type="application/ld+json">${JSON.stringify(
        jsonLd.length === 1 ? jsonLd[0] : jsonLd
      ).replace(/</g, '\u003c')}</script>`
    : ''

  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canonical}">
${hreflang}

<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.seo.siteName)}">
<meta property="og:locale" content="${esc(site.seo.ogLocale)}">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:url" content="${canonical}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${site.seo.origin}${site.seo.socialImage}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(fullTitle)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${site.seo.origin}${site.seo.socialImage}">${structured}

<link rel="icon" href="/assets/logo/icon-day.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
<meta name="theme-color" content="#ffffff">

<link rel="preload" href="/assets/fonts/SpaceGrotesk-Variable.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/Inter-Variable.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/site.css">
</head>

<body>
<a class="skip" href="#main">${esc(t(site, 'skipToContent'))}</a>
${consent(site)}

${header(site, path, headMode, lang, alternates)}

<main id="main">
${content}
</main>

${footer(site)}

<script src="/assets/js/site.js" defer></script>
</body>
</html>
`
}
