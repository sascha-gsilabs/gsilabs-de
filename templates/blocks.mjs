// Section renderers. A content file lists its sections under `blocks:`, each
// with a `type` that maps to one function here, so pages are composed from data
// rather than hand written markup.
import { ARROW, esc, join, md, mdInline, paras } from './layout.mjs'

/**
 * Every direct child of a band's grid gets the scroll reveal class and a small
 * stagger. Children are always emitted at four spaces of indentation, which is
 * what distinguishes them from nested markup.
 */
function revealChildren(inner) {
  let n = 0
  return inner.replace(/^( {4}<[a-z]+ )(class="|)/gm, (_, open, cls) => {
    const delay = n++ * 90
    const style = delay ? ` style="--reveal-delay:${delay}ms"` : ''
    return cls
      ? `${open.trimEnd()}${style} class="reveal `
      : `${open.trimEnd()}${style} class="reveal" `
  })
}

/** Band wrapper. tone: 'paper' | 'void'. */
const band = (inner, { tone = 'paper', id, className = '', label, reveal = true } = {}) =>
  `<section class="band${tone === 'void' ? ' band--void' : ''}${className ? ' ' + className : ''}"${
    id ? ` id="${id}"` : ''
  }${label ? ` aria-labelledby="${label}"` : ''}>
  <div class="wrap grid">
${reveal ? revealChildren(inner) : inner}
  </div>
</section>`

/**
 * Band options every block shares: tone, an optional anchor id, and flushTop for
 * sections that should read as a continuation of the one above them.
 */
const bandOpts = (b, defaultTone = 'paper') => ({
  tone: b.tone ?? defaultTone,
  id: b.id,
  className: b.flushTop ? 'band--flush-top' : '',
})

const eyebrow = (text) => (text ? `<p class="label eyebrow">${esc(text)}</p>` : '')

const button = (cta, variant = 'solid') =>
  cta
    ? `<a class="btn btn--${variant}" href="${cta.href}">${esc(cta.label)}${variant === 'outline' ? ARROW : ''}</a>`
    : ''

const photo = (img, { className = '', sizes = '' } = {}) =>
  img
    ? `<img class="photo${className ? ' ' + className : ''}" src="${img.src}" alt="${esc(img.alt ?? '')}"${
        img.width ? ` width="${img.width}"` : ''
      }${img.height ? ` height="${img.height}"` : ''}${sizes ? ` sizes="${sizes}"` : ''} loading="lazy" decoding="async">`
    : ''

/* ---------------------------------------------------------------- heroes --- */

const heroVideo = (b, ctx) => `<section class="band band--void band--flush hero" aria-labelledby="hero-title" data-head-over>
    <video class="hero__video" data-hero-video
           poster="${b.poster}"
           width="1600" height="900"
           muted loop playsinline preload="none" aria-hidden="true">
      <source data-src="${b.video}" type="video/mp4">
    </video>
    <div class="hero__scrim" aria-hidden="true"></div>
    <div class="hero__field" aria-hidden="true"></div>

    <div class="wrap hero__wrap">
      <div class="hero__stage">
        <h1 class="hero__title hero__title--a" id="hero-title">
${b.titleTop.map((l, i) => `          <span class="hero__line" style="--enter-delay:${120 + i * 100}ms">${esc(l)}</span>`).join('\n')}
          <span class="vh">${esc(b.titleBottom.join(' '))}</span>
        </h1>

        <p class="hero__title hero__title--b" aria-hidden="true">
${b.titleBottom.map((l, i) => `          <span class="hero__line" style="--enter-delay:${340 + i * 100}ms">${esc(l)}</span>`).join('\n')}
        </p>

        <div class="hero__support" style="--enter-delay:580ms">
          <p>${mdInline(b.lede)}</p>
          ${button(b.cta, 'outline')}
        </div>
      </div>
    </div>
  </section>`

/** Light page hero: headline left, support copy and CTA below it, media right. */
const hero = (b) => `<section class="band page-hero" aria-labelledby="page-title">
  <div class="wrap grid">
    <div class="page-hero__head">
      ${eyebrow(b.eyebrow)}
      <h1 class="page-hero__title" id="page-title">${mdInline(b.title)}</h1>
    </div>
    <div class="page-hero__aside">
      ${b.lede ? `<p class="lede">${mdInline(b.lede)}</p>` : ''}
      ${button(b.cta)}
    </div>
${b.image ? `    <figure class="page-hero__media">${photo(b.image)}</figure>` : ''}
  </div>
</section>`

/* ------------------------------------------------------------ statements --- */

const points = (list) =>
  list
    ? `      <ul class="points">
${list.map((p) => `        <li>${mdInline(p)}</li>`).join('\n')}
      </ul>`
    : ''

const statement = (b) =>
  band(
    join([
      `    <div class="statement${b.wide ? ' statement--wide' : ''}${b.points ? ' statement--split' : ''}">
      ${eyebrow(b.eyebrow)}
      <h2 class="statement__title">${mdInline(b.title)}</h2>
      ${b.body ? `<div class="statement__body">${paras(b.body, 'lede')}</div>` : ''}
      ${button(b.cta)}
    </div>`,
      b.points ? `    <div class="statement__points">\n${points(b.points)}\n    </div>` : '',
    ]),
    bandOpts(b)
  )

/** A statement over a full width image, used for the dark feature bands. */
const showcase = (b) =>
  band(
    join([
      `    <div class="showcase__head">
      ${eyebrow(b.eyebrow)}
      <h2 class="showcase__title">${mdInline(b.title)}</h2>
      ${b.body ? `<div class="showcase__body">${paras(b.body)}</div>` : ''}
    </div>`,
      b.image ? `    <figure class="showcase__media">${photo(b.image)}</figure>` : '',
    ]),
    bandOpts(b, 'void')
  )

/* ----------------------------------------------------------------- lists --- */

/** Label plus copy rows, as on the homepage capability list. */
const definitions = (b) =>
  band(
    join([
      `    <div class="deflist">
      ${eyebrow(b.eyebrow)}
      ${b.title ? `<h2 class="statement__title deflist__title">${mdInline(b.title)}</h2>` : ''}
      ${b.lede ? `<p class="lede deflist__lede">${mdInline(b.lede)}</p>` : ''}
      <dl class="cap__list">
${b.items
  .map(
    (item) => `        <div class="cap__row">
          <dt class="label">${esc(item.label)}</dt>
          <dd>${mdInline(item.body)}</dd>
        </div>`
  )
  .join('\n')}
      </dl>
    </div>`,
      b.image ? `    <figure class="deflist__media">${photo(b.image)}</figure>` : '',
      b.quote ? quoteCard(b.quote) : '',
    ]),
    bandOpts(b)
  )

const quoteCard = (q) => `    <figure class="quote-card">
      <div>
        <blockquote>${mdInline(q.text)}</blockquote>
        <figcaption>
          <div class="quote-card__name">${esc(q.name)}</div>
          <div class="small">${esc(q.role)}</div>
        </figcaption>
      </div>
      ${q.logo ? `<img class="quote-card__logo" src="${q.logo.src}" alt="${esc(q.logo.alt)}" width="${q.logo.width}" height="${q.logo.height}" loading="lazy" decoding="async">` : ''}
    </figure>`

/** Big numbers with a label beside them. */
const metrics = (b) =>
  band(
    join([
      b.title || b.eyebrow
        ? `    <div class="metrics__head">
      ${eyebrow(b.eyebrow)}
      ${b.title ? `<h2 class="metrics__statement">${mdInline(b.title)}</h2>` : ''}
    </div>`
        : '',
      `    <dl class="metrics__list">
${b.items
  .map(
    (item) => `      <div class="metric">
        <dt class="metric__value">${esc(item.value)}</dt>
        <dd class="metric__label">${mdInline(item.label)}</dd>
      </div>`
  )
  .join('\n')}
    </dl>`,
      b.note ? `    <p class="small metrics__note">${mdInline(b.note)}</p>` : '',
    ]),
    bandOpts(b)
  )

/** The same numbers as tiles, used on the solution pages. */
const metricTiles = (b) =>
  band(
    join([
      b.title
        ? `    <div class="statement statement--split">
      ${eyebrow(b.eyebrow)}
      <h2 class="statement__title">${mdInline(b.title)}</h2>
      ${b.body ? `<div class="statement__body">${paras(b.body, 'lede')}</div>` : ''}
    </div>`
        : '',
      `    <dl class="tile-metrics">
${b.items
  .map(
    (item) => `      <div class="tile-metric">
        <dt class="tile-metric__value">${esc(item.value)}</dt>
        <dd class="label tile-metric__label">${esc(item.label)}</dd>
      </div>`
  )
  .join('\n')}
    </dl>`,
      b.note ? `    <p class="small tile-metrics__note">${mdInline(b.note)}</p>` : '',
    ]),
    bandOpts(b)
  )

/** Numbered stages. Numbering is only used where the content is a real sequence. */
const stages = (b) =>
  band(
    join([
      `    <div class="process__head">
      ${eyebrow(b.eyebrow)}
      ${b.title ? `<h2 class="display" id="${b.id ?? 'stages'}-title">${mdInline(b.title)}</h2>` : ''}
      ${b.lede ? `<p class="lede process__lede">${mdInline(b.lede)}</p>` : ''}
    </div>`,
      `    <ol class="process__list">
${b.items
  .map(
    (item) => `      <li class="stage">
        <p class="label stage__index">${esc(item.step ?? '')}</p>
        <h3 class="title stage__title">${mdInline(item.title)}</h3>
        ${paras(item.body)}
      </li>`
  )
  .join('\n')}
    </ol>`,
    ]),
    bandOpts(b)
  )

/** Equal columns of prose under one heading. */
const pillars = (b) =>
  band(
    join([
      `    <div class="pillars__head">
      ${eyebrow(b.eyebrow)}
      ${b.title ? `<h2 class="${b.tone === 'void' ? 'display' : 'statement__title'}" id="pillars-title">${mdInline(b.title)}</h2>` : ''}
      ${b.lede ? `<div class="pillars__lede">${paras(b.lede, 'lede')}</div>` : ''}
    </div>`,
      `    <div class="pillars">
${b.items
  .map(
    (item) => `      <article class="pillar">
        <h3 class="title pillar__title">${mdInline(item.title)}</h3>
        ${paras(item.body)}
      </article>`
  )
  .join('\n')}
    </div>`,
      b.note ? `    <p class="small pillars__note">${mdInline(b.note)}</p>` : '',
    ]),
    bandOpts(b, 'void')
  )

/** People, with a portrait, a role and a direct email. */
const team = (b) =>
  band(
    join([
      `    <div class="pillars__head">
      ${eyebrow(b.eyebrow)}
      ${b.title ? `<h2 class="display" id="team-title">${mdInline(b.title)}</h2>` : ''}
    </div>`,
      `    <ul class="team">
${b.items
  .map(
    (p) => `      <li class="member">
        <div class="member__portrait">${photo(p.image)}</div>
        <h3 class="title member__name">${esc(p.name)}</h3>
        <p class="label member__role">${esc(p.role)}</p>
        <p class="small"><a class="link" href="mailto:${p.email}">${esc(p.email)}</a></p>
      </li>`
  )
  .join('\n')}
    </ul>`,
    ]),
    bandOpts(b)
  )

/* ------------------------------------------------------------------ tabs --- */

const featureTabs = (b) => {
  const tabs = b.items
    .map(
      (item, i) => `        <button class="tabs__tab" type="button" role="tab" id="tab-${i}"
          aria-selected="${i === 0}" aria-controls="panel-${i}" tabindex="${i === 0 ? 0 : -1}">
          <span>${esc(item.label)}</span>
          ${ARROW}
        </button>`
    )
    .join('\n')

  const panels = b.items
    .map(
      (item, i) => `      <div class="tabs__panel" role="tabpanel" id="panel-${i}" aria-labelledby="tab-${i}"${
        i === 0 ? '' : ' hidden'
      }>
        <figure class="tabs__media">${photo(item.image)}</figure>
        <div class="tabs__copy">
          <p class="lede">${mdInline(item.body)}</p>
          <ul class="tabs__points">
${item.points.map((p) => `            <li>${mdInline(p)}</li>`).join('\n')}
          </ul>
        </div>
      </div>`
    )
    .join('\n')

  return band(
    join([
      `    <div class="statement statement--wide tabs__head">
      ${eyebrow(b.eyebrow)}
      <h2 class="statement__title">${mdInline(b.title)}</h2>
    </div>`,
      `    <div class="tabs" data-tabs>
      <div class="tabs__list" role="tablist" aria-label="${esc(b.title)}">
${tabs}
      </div>
${panels}
    </div>`,
    ]),
    bandOpts(b)
  )
}

/* ------------------------------------------------------------------- faq --- */

const faq = (b) =>
  band(
    join([
      `    <div class="faq__head">
      ${eyebrow(b.eyebrow)}
      ${b.title ? `<h2 class="statement__title">${mdInline(b.title)}</h2>` : ''}
      ${b.note ? `<p class="body faq__note">${mdInline(b.note)}</p>` : ''}
      ${button(b.cta, b.tone === 'void' ? 'outline' : 'solid')}
    </div>`,
      `    <div class="faq">
${b.items
  .map(
    (item) => `      <details class="faq__item">
        <summary class="faq__q">
          <span>${mdInline(item.q)}</span>
          <span class="faq__sign" aria-hidden="true"></span>
        </summary>
        <div class="faq__a">${paras(item.a)}</div>
      </details>`
  )
  .join('\n')}
    </div>`,
    ]),
    bandOpts(b)
  )

/* ----------------------------------------------------------------- quote --- */

const pullQuote = (b) =>
  band(
    `    <figure class="pull">
      ${b.eyebrow ? `<p class="label eyebrow" id="pull-title">${esc(b.eyebrow)}</p>` : ''}
      <blockquote>${mdInline(b.text)}</blockquote>
      <figcaption class="pull__by">
        ${b.logo ? `<img class="pull__logo" src="${b.logo.src}" alt="${esc(b.logo.alt)}" width="${b.logo.width}" height="${b.logo.height}" loading="lazy" decoding="async">` : ''}
        <span>
          <span class="pull__name">${esc(b.name)}</span><br>
          <span class="small">${esc(b.role)}</span>
        </span>
      </figcaption>
    </figure>`,
    bandOpts(b, 'void')
  )

/* ------------------------------------------------------------------ news --- */

export const insightCard = (item, { className = '' } = {}) => `        <li class="card${className ? ' ' + className : ''}">
          <div class="card__media">${photo(item.cardImage ?? item.image)}</div>
          <div class="card__meta">
            <span class="label">${esc(item.kindLabel)}</span>
            <time class="label" datetime="${item.date}">${esc(item.dateLabel)}</time>
          </div>
          <h3 class="card__title"><a class="card__link" href="${item.href}">${esc(item.title)}</a></h3>
        </li>`

const news = (b, ctx) => {
  const items = (b.items ?? ctx.insights.slice(0, b.limit ?? 3)).map((i) =>
    typeof i === 'string' ? ctx.bySlug[i] : i
  )
  return band(
    join([
      `    <div class="news__head">
      ${eyebrow(b.eyebrow)}
      <h2 class="display" id="news-title">${mdInline(b.title ?? 'Latest News')}</h2>
    </div>`,
      b.allHref
        ? `    <a class="link news__all" href="${b.allHref}">All insights${ARROW}</a>`
        : '',
      `    <ul class="news__list${items.length === 2 ? ' news__list--pair' : ''}">
${items.filter(Boolean).map((i) => insightCard(i)).join('\n')}
    </ul>`,
    ]),
    bandOpts(b)
  )
}

/* -------------------------------------------------------------- listings --- */

const insightIndex = (b, ctx) => {
  const items = ctx.insights.filter((i) => !b.kind || i.kind === b.kind)
  const filters = (b.filters ?? [])
    .map(
      (f) =>
        `        <a class="chip${f.href === b.self ? ' is-current' : ''}" href="${f.href}"${
          f.href === b.self ? ' aria-current="page"' : ''
        }>${esc(f.label)}</a>`
    )
    .join('\n')

  return band(
    join([
      filters
        ? `    <div class="insight-filters">
      <span class="label">${esc(b.filterLabel ?? 'Browse by category:')}</span>
      <div class="chips">
${filters}
      </div>
    </div>`
        : '',
      `    <ul class="news__list insight-grid">
${items.map((i) => insightCard(i)).join('\n')}
    </ul>`,
      items.length ? '' : `    <p class="lede">Nothing published in this category yet.</p>`,
    ]),
    bandOpts(b)
  )
}

const jobList = (b, ctx) =>
  band(
    join([
      `    <div class="statement statement--split">
      ${eyebrow(b.eyebrow)}
      ${b.title ? `<h2 class="statement__title">${mdInline(b.title)}</h2>` : ''}
      ${b.body ? `<div class="statement__body">${paras(b.body, 'lede')}</div>` : ''}
      ${button(b.cta)}
    </div>`,
      ctx.jobs.length
        ? `    <ul class="joblist">
${ctx.jobs
  .map(
    (job) => `      <li class="joblist__item">
        <a class="joblist__link" href="${job.href}">
          <span class="joblist__role">
            <span class="title">${esc(job.title)}</span>
            <span class="label joblist__meta">${esc(job.employment)} <span class="label__sep">//</span> ${esc(job.location)}</span>
          </span>
          <span class="joblist__go">${ARROW}</span>
        </a>
      </li>`
  )
  .join('\n')}
    </ul>`
        : `    <p class="lede">No open roles right now. Reach out anyway, the right person matters more than the right job title.</p>`,
    ]),
    bandOpts(b)
  )

/* ----------------------------------------------------------------- prose --- */

const prose = (b) =>
  band(
    `    <div class="prose">
      ${eyebrow(b.eyebrow)}
      ${b.title ? `<h2 class="statement__title prose__title">${mdInline(b.title)}</h2>` : ''}
      ${md(b.body)}
    </div>`,
    bandOpts(b)
  )

/** Closing call to action. */
const closer = (b) =>
  band(
    `    <div class="closer">
      ${eyebrow(b.eyebrow)}
      <h2 class="closer__title">${mdInline(b.title)}</h2>
      ${b.body ? `<div class="closer__body">${paras(b.body, 'lede')}</div>` : ''}
      <div class="closer__actions">
        ${button(b.cta)}
        ${b.secondary ? `<a class="link" href="${b.secondary.href}">${esc(b.secondary.label)}${ARROW}</a>` : ''}
      </div>
    </div>`,
    bandOpts(b, 'void')
  )

/** Contact details laid out as a definition grid, for the get started page. */
const contact = (b, ctx) =>
  band(
    join([
      `    <div class="statement statement--split">
      ${eyebrow(b.eyebrow)}
      ${b.title ? `<h2 class="statement__title">${mdInline(b.title)}</h2>` : ''}
      ${b.body ? `<div class="statement__body">${paras(b.body, 'lede')}</div>` : ''}
    </div>`,
      `    <dl class="contact-grid">
      <div class="contact-grid__item">
        <dt class="label">Email</dt>
        <dd><a class="link" href="mailto:${ctx.site.company.email}">${esc(ctx.site.company.email)}</a></dd>
      </div>
      <div class="contact-grid__item">
        <dt class="label">Phone</dt>
        <dd><a class="link" href="tel:${ctx.site.company.phoneHref}">${esc(ctx.site.company.phone)}</a></dd>
      </div>
      <div class="contact-grid__item">
        <dt class="label">Office</dt>
        <dd>${esc(ctx.site.company.street)}<br>${esc(ctx.site.company.postcode)} ${esc(ctx.site.company.city)}</dd>
      </div>
    </dl>`,
    ]),
    bandOpts(b)
  )

export const BLOCKS = {
  heroVideo,
  hero,
  team,
  statement,
  showcase,
  definitions,
  metrics,
  metricTiles,
  stages,
  pillars,
  featureTabs,
  faq,
  pullQuote,
  news,
  insightIndex,
  jobList,
  prose,
  closer,
  contact,
}

export function renderBlocks(blocks = [], ctx) {
  return blocks
    .map((b) => {
      const fn = BLOCKS[b.type]
      if (!fn) throw new Error(`unknown block type: ${b.type}`)
      return fn(b, ctx)
    })
    .join('\n\n')
}
