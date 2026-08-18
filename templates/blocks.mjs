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

/* `focus` moves the crop of an image that fills a frame taller or wider than
   itself. Only worth setting where the subject is off centre: a screenshot whose
   heading carries the meaning, or a diagram that reads from the top down. */
const photo = (img, { className = '', sizes = '' } = {}) =>
  img
    ? `<img class="photo${className ? ' ' + className : ''}" src="${img.src}" alt="${esc(img.alt ?? '')}"${
        img.width ? ` width="${img.width}"` : ''
      }${img.height ? ` height="${img.height}"` : ''}${
        img.focus ? ` style="object-position:${esc(img.focus)}"` : ''
      }${sizes ? ` sizes="${sizes}"` : ''} loading="lazy" decoding="async">`
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

/* The same full bleed frame as the video hero, with a still behind it instead.
   Used where a Company page opens on a photograph rather than on paper: the title
   sits top left, the sentence that explains it bottom right, both over the image.
   `title` is a list, one entry per line, because where it breaks is a decision
   rather than whatever the column width produces. */
const heroCover = (b) => `<section class="band band--void band--flush hero hero--cover" aria-labelledby="hero-title" data-head-over>
    <img class="hero__cover" src="${b.image.src}" alt="${esc(b.image.alt ?? '')}"${
  b.image.width ? ` width="${b.image.width}"` : ''
}${b.image.height ? ` height="${b.image.height}"` : ''} fetchpriority="high" decoding="async">
    <div class="hero__scrim" aria-hidden="true"></div>

    <div class="wrap hero__wrap">
      <div class="hero__stage">
        <h1 class="hero__title hero__title--a" id="hero-title">
${b.title.map((l, i) => `          <span class="hero__line" style="--enter-delay:${120 + i * 100}ms">${esc(l)}</span>`).join('\n')}
        </h1>

        <div class="hero__support" style="--enter-delay:${120 + b.title.length * 100 + 140}ms">
          ${b.lede ? `<p>${mdInline(b.lede)}</p>` : ''}
          ${button(b.cta, 'outline')}
        </div>
      </div>
    </div>
  </section>`

/** Light page hero: headline left, support copy and CTA below it, media right. */
/* `image.banner: true` puts the picture across the top, above the title, instead
   of in the column beside it. The figure still follows the heading in the markup:
   the picture is the page's backdrop, not what it leads with, and CSS puts it
   back on top. */
const hero = (b) => `<section class="band page-hero${
  b.lede || b.cta || b.image ? '' : ' page-hero--title-only'
}${b.image?.banner ? ' page-hero--banner' : ''}" aria-labelledby="page-title">
  <div class="wrap grid">
    <div class="page-hero__head">
      ${eyebrow(b.eyebrow)}
      <h1 class="page-hero__title" id="page-title">${mdInline(b.title)}</h1>
    </div>
${
      /* A page whose hero is the title alone, with the lede carried by the
         section below it, would otherwise get an empty aside still holding its
         top padding open. */
      b.lede || b.cta
        ? `    <div class="page-hero__aside">
      ${b.lede ? `<p class="lede">${mdInline(b.lede)}</p>` : ''}
      ${button(b.cta)}
    </div>`
        : ''
    }
${
  b.image
    ? `    <figure class="page-hero__media${
        b.image.ratio ? ' page-hero__media--ratio' : ''
      }"${b.image.ratio ? ` style="--media-ratio:${esc(b.image.ratio)}"` : ''}>${photo(b.image)}</figure>`
    : ''
}
  </div>
</section>`

/* ------------------------------------------------------------ statements --- */

const points = (list) =>
  list
    ? `      <ul class="points">
${list.map((p) => `        <li>${mdInline(p)}</li>`).join('\n')}
      </ul>`
    : ''

/* An `image` puts a picture in the right hand half and moves the copy into the
   left, which is how the process phases read. `split: true` adds the rule between
   the two, the same one the enquiry band uses. */
const statement = (b) =>
  band(
    join([
      `    <div class="statement${b.wide ? ' statement--wide' : ''}${
        b.points || b.image ? ' statement--split' : ''
      }">
      ${eyebrow(b.eyebrow)}
      <h2 class="statement__title">${mdInline(b.title)}</h2>
      ${b.body ? `<div class="statement__body">${paras(b.body, 'lede')}</div>` : ''}
      ${button(b.cta)}
    </div>`,
      b.points ? `    <div class="statement__points">\n${points(b.points)}\n    </div>` : '',
      b.image
        ? `    <figure class="statement__media">${photo(b.image, { sizes: '(max-width: 900px) 92vw, 46vw' })}</figure>`
        : '',
    ]),
    { ...bandOpts(b), className: (bandOpts(b).className + (b.split ? ' band--split' : '')).trim() }
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
/* Two figures beside the claim they back up, with an image running the height of
   both. Without an image the tiles take the right hand column instead. */
const metricTiles = (b) => {
  /* The image spans the rows beside it, so the stylesheet has to know how many
     there are: the tiles and a note, or the tiles alone. */
  const media = b.image ? ` band--metrics-media${b.note ? '' : ' band--metrics-media--short'}` : ''
  /* `split: true` draws the rule down the middle, for the bands that read as
     two halves rather than a column beside a picture. */
  const split = b.split ? ' band--split' : ''
  /* `mediaLeft: true` swaps the halves, for the bands whose picture leads. */
  const side = b.image && b.mediaLeft ? ' band--metrics-media-left' : ''

  return band(
    join([
      b.title || b.body
        ? `    <div class="statement statement--split">
      ${eyebrow(b.eyebrow)}
      ${b.title ? `<h2 class="statement__title">${mdInline(b.title)}</h2>` : ''}
      ${b.body ? `<div class="statement__body">${paras(b.body, 'lede')}</div>` : ''}
    </div>`
        : '',
      b.image
        ? `    <figure class="tile-metrics__media">${photo(b.image, { sizes: '(max-width: 900px) 92vw, 46vw' })}</figure>`
        : '',
      `    <dl class="tile-metrics${b.plain ? ' tile-metrics--plain' : ''}">
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
    { ...bandOpts(b), className: (bandOpts(b).className + media + split + side).trim() }
  )
}

/** Numbered stages. Numbering is only used where the content is a real sequence. */
const stages = (b) =>
  band(
    join([
      `    <div class="process__head">
      ${eyebrow(b.eyebrow)}
      ${b.title ? `<h2 class="display" id="${b.id ?? 'stages'}-title">${mdInline(b.title)}</h2>` : ''}
      ${b.lede ? `<p class="lede process__lede">${mdInline(b.lede)}</p>` : ''}
    </div>`,
      `    <ol class="process__list${b.layout === 'rows' ? ' process__list--rows' : ''}">
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
        <div class="member__body">
          <h3 class="title member__name">${esc(p.name)}</h3>
          <p class="label member__role">${esc(p.role)}</p>
          <p class="small"><a class="link" href="mailto:${p.email}">${esc(p.email)}</a></p>
        </div>
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
      ${b.image ? `<figure class="joblist__media">${photo(b.image, { sizes: '(max-width: 900px) 92vw, 30vw' })}</figure>` : ''}
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

/** Contact details as a definition grid, optionally under a picture. */
const contact = (b, ctx) =>
  band(
    join([
      `    <div class="statement statement--split">
      ${eyebrow(b.eyebrow)}
      ${b.title ? `<h2 class="statement__title">${mdInline(b.title)}</h2>` : ''}
      ${b.body ? `<div class="statement__body">${paras(b.body, 'lede')}</div>` : ''}
    </div>`,
      `    <div class="contact-side">
      ${
        b.image
          ? `<figure class="contact-side__media"${
              b.image.ratio ? ` style="--media-ratio:${esc(b.image.ratio)}"` : ''
            }>${photo(b.image, { sizes: '(max-width: 900px) 92vw, 46vw' })}</figure>`
          : ''
      }
      ${b.title2 ? `<h2 class="title contact-side__title">${mdInline(b.title2)}</h2>` : ''}
      <dl class="contact-grid${b.image ? ' contact-grid--inline' : ''}">
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
      </dl>
    </div>`,
    ]),
    { ...bandOpts(b), className: (bandOpts(b).className + (b.split ? ' band--split' : '')).trim() }
  )

/* -------------------------------------------------------------- hubspot --- */

/**
 * The HubSpot frame and the script that fills it, for one of the forms named in
 * site.yml. Exported because the job pages embed the application form outside
 * the block system.
 *
 * The loader renders into a cross origin iframe, so the fields inside are out of
 * this site's reach: only the frame around them is ours to style. The script
 * rides along with the frame rather than sitting in the page shell, so a page
 * only pays for HubSpot when it actually carries a form. Emitting it twice is
 * harmless: the second request is served from cache, and the loader picks up
 * every frame div on the page rather than only the first.
 */
export function formFrame(name, site) {
  const hs = site.hubspot ?? {}
  const id = hs.forms?.[name]
  if (!id) throw new Error(`unknown hubspot form: ${name}. Add it under hubspot.forms in site.yml`)
  return `<div class="hs-form-frame" data-region="${esc(hs.region)}" data-form-id="${esc(
    id
  )}" data-portal-id="${esc(hs.portalId)}"></div>
      <script src="https://js-${esc(hs.region)}.hsforms.net/forms/embed/${esc(hs.portalId)}.js" defer></script>`
}

/* The enquiry band: what we need from you on the left, the form to put it in on
   the right, split down the middle by a rule that runs the height of the band. */
const form = (b, ctx) =>
  band(
    join([
      `    <div class="form-intro">
      ${eyebrow(b.eyebrow)}
      ${b.title ? `<h2 class="statement__title">${mdInline(b.title)}</h2>` : ''}
      ${b.body ? `<div class="form-intro__body">${paras(b.body, 'lede')}</div>` : ''}
${points(b.points)}
      ${
        b.image
          ? `<figure class="form-intro__media"${
              b.image.ratio ? ` style="--media-ratio:${esc(b.image.ratio)}"` : ''
            }>${photo(b.image, { sizes: '(max-width: 900px) 92vw, 46vw' })}</figure>`
          : ''
      }
    </div>`,
      `    <div class="form-embed">
      ${formFrame(b.form, ctx.site)}
      <noscript>
        <p class="form-embed__note">The form needs JavaScript. Write to <a href="mailto:${
          ctx.site.company.email
        }">${esc(ctx.site.company.email)}</a> instead and you reach the same people.</p>
      </noscript>
      ${b.note ? `<p class="form-embed__note">${mdInline(b.note)}</p>` : ''}
    </div>`,
    ]),
    { ...bandOpts(b), className: `band--split ${b.flushTop ? 'band--flush-top' : ''}`.trim() }
  )

export const BLOCKS = {
  heroVideo,
  heroCover,
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
  form,
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
