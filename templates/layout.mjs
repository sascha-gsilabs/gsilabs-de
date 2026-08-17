// Page shell: head, header, footer. Everything here reads from content/site.yml,
// so navigation and company details exist in exactly one place.
import { marked } from 'marked'

export const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

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

/** Markdown to HTML, block level. */
export const md = (s = '') => delimiters(unwrapFigures(marked.parse(String(s).trim())))

/** Markdown to HTML without the wrapping paragraph, for headings and labels. */
export const mdInline = (s = '') => delimiters(marked.parseInline(String(s).trim()))

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

const isActive = (href, path) => href === path || (href !== '/' && path.startsWith(href + '/'))

function header(site, path, mode) {
  const menus = site.nav
    .map((group, i) => {
      const id = `menu-${group.label.toLowerCase()}`
      const open = group.items.some((item) => isActive(item.href, path))
      const links = group.items
        .map(
          (item) =>
            `<li><a href="${item.href}"${isActive(item.href, path) ? ' aria-current="page"' : ''}>${esc(item.label)}</a></li>`
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
    <a class="brand" href="/" aria-label="${esc(site.company.name)}, home">
      <img class="brand__night" src="/assets/logo/logo-night.svg" alt="${esc(site.company.name)}" width="92" height="42">
      <img class="brand__day" src="/assets/logo/logo-day.svg" alt="" width="92" height="42" aria-hidden="true">
    </a>

    <nav class="nav" id="site-nav" aria-label="Main">
      <ul class="nav__list">
${menus}
      </ul>

      <!-- Only rendered inside the mobile sheet, where the header CTA is hidden. -->
      <div class="nav__foot">
        <a class="btn btn--solid" href="${site.cta.href}">${esc(site.cta.label)}</a>
        <dl class="nav__contact">
          <dt class="label">Email</dt>
          <dd><a href="mailto:${site.company.email}">${esc(site.company.email)}</a></dd>
          <dt class="label">Phone</dt>
          <dd><a href="tel:${site.company.phoneHref}">${esc(site.company.phone)}</a></dd>
        </dl>
      </div>
    </nav>

    <a class="btn btn--solid head__cta" href="${site.cta.href}">${esc(site.cta.label)}</a>

    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">
      <span data-toggle-label>Menu</span>
    </button>
  </div>
</header>`
}

function footer(site) {
  const columns = site.nav
    .map((group) => {
      const id = `foot-${group.label.toLowerCase()}`
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
          <a href="${s.href}" rel="noopener" aria-label="${esc(site.company.name)} on ${esc(s.label)}">
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
          <dt class="label">Email</dt>
          <dd><a href="mailto:${site.company.email}">${esc(site.company.email)}</a></dd>
          <dt class="label">Phone</dt>
          <dd><a href="tel:${site.company.phoneHref}">${esc(site.company.phone)}</a></dd>
        </dl>
      </div>

${columns}
    </div>

    <div class="site-foot__base">
      <p class="small">© ${esc(site.company.legalName)}</p>

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
 * @param {object} o.site        parsed site.yml
 */
export function layout({ title, description, path, content, headMode = 'paper', site }) {
  const fullTitle = title === site.seo.titleSuffix ? title : `${title} | ${site.seo.titleSuffix}`
  const desc = description || site.seo.defaultDescription
  const canonical = site.seo.origin + (path === '/' ? '/' : path)

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canonical}">

<meta property="og:type" content="website">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:url" content="${canonical}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${site.seo.origin}${site.seo.socialImage}">
<meta name="twitter:card" content="summary_large_image">

<link rel="icon" href="/assets/logo/icon-day.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
<meta name="theme-color" content="#ffffff">

<link rel="preload" href="/assets/fonts/SpaceGrotesk-Variable.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/Inter-Variable.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/site.css">
</head>

<body>
<a class="skip" href="#main">Skip to content</a>

${header(site, path, headMode)}

<main id="main">
${content}
</main>

${footer(site)}

<script src="/assets/js/site.js" defer></script>
</body>
</html>
`
}
