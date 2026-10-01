// The Allplan MCP product page: seven section types, in the order the page reads.
//
// They live here rather than in blocks.mjs because this page is the only thing
// that uses them, and because the page carries its own palette and sets
// everything in Inter. That theme is scoped under `main.mcp` in the stylesheet,
// which `pageClass: mcp` in the content file puts there. Header, footer,
// navigation and the consent banner sit outside <main> and are untouched.
//
// Both drawings are built from one isometric projection below. Their labels are
// HTML positioned over the drawing by percentage rather than <text> inside it: a
// label in the SVG scales with the viewBox, so it would be seven pixels tall on
// a phone, and a German word is longer than the English one it replaces and
// would run out of the frame. Percentages hold because the frame and the viewBox
// have the same aspect ratio.
import { ARROW, esc, join, mdInline, paras, t } from './layout.mjs'
import { revealChildren } from './blocks.mjs'

/* ------------------------------------------------------------ scaffolding --- */

/* The same band wrapper as the shared blocks, with `sand` as a third ground
   beside paper and void: this page alternates Concrete and Sand rather than
   paper and black. Children at four spaces of indentation get the scroll
   reveal, which is the convention revealChildren reads. */
const band = (inner, { ground = 'concrete', id, className = '', label } = {}) =>
  `<section class="band mcp-band mcp-band--${ground}${className ? ' ' + className : ''}"${
    id ? ` id="${id}"` : ''
  }${label ? ` aria-labelledby="${label}"` : ''}>
  <div class="wrap grid">
${revealChildren(inner)}
  </div>
</section>`

const heading = (text, id, className = 'mcp-h2') =>
  `<h2 class="${className}" id="${id}">${mdInline(text)}</h2>`

/**
 * Where a call to action points.
 *
 * `href` is an ordinary link. `form` names one of the shared HubSpot forms in
 * site.yml, which are whole forms hosted on HubSpot's own page rather than
 * embedded here: the page requests nothing from them until somebody follows the
 * link. A name with no link behind it yet resolves to nothing, and the button
 * is not rendered at all, because a control that goes nowhere is worse than no
 * control.
 */
const target = (cta, site) => (cta?.form ? site.hubspot?.shared?.[cta.form] || '' : cta?.href || '')

/* A shared form opens in its own tab. It is a different site, and it ends on a
   thank you page there, so the page the visitor was reading should still be
   behind it when they are done. */
const away = (href) =>
  /^https?:/.test(href) ? ' target="_blank" rel="noopener"' : ''

const solid = (cta, site) => {
  const href = target(cta, site)
  return href ? `<a class="btn btn--solid mcp-btn" href="${href}"${away(href)}>${esc(cta.label)}</a>` : ''
}

const quiet = (cta, site) => {
  const href = target(cta, site)
  return href
    ? `<a class="link mcp-link" href="${href}"${away(href)}>${esc(cta.label)}${ARROW}</a>`
    : ''
}

/* `{email}` in a content string becomes the address from site.yml. The slot is
   written into the sentence rather than the sentence cut in two, because German
   puts the address somewhere else than English does. */
const withEmail = (text, site) =>
  mdInline(text).replace(
    '{email}',
    `<a href="mailto:${site.company.email}">${esc(site.company.email)}</a>`
  )

/* ------------------------------------------------------------------- iso --- */

/* One projection for both drawings. x runs right and down, y runs left and down,
   z runs up, two to one, which is the projection a setting out drawing uses: a
   panel reads as a panel rather than as a perspective sketch. */
const P = (x, y, z = 0) => [(x - y) * 0.866, (x + y) * 0.5 - z]

const fmt = ([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`

/** Collects every point a drawing puts down, so the viewBox can be measured. */
function frame() {
  const seen = []
  return {
    poly(points, className) {
      seen.push(...points)
      return `<polygon class="${className}" points="${points.map(fmt).join(' ')}"/>`
    },
    line(a, b, className) {
      seen.push(a, b)
      return `<line class="${className}" x1="${a[0].toFixed(1)}" y1="${a[1].toFixed(
        1
      )}" x2="${b[0].toFixed(1)}" y2="${b[1].toFixed(1)}"/>`
    },
    /** Reserves room for a label that is not drawn inside the SVG. */
    room(point, halfWidth, halfHeight) {
      seen.push(
        [point[0] - halfWidth, point[1] - halfHeight],
        [point[0] + halfWidth, point[1] + halfHeight]
      )
    },
    /** The viewBox, plus where each HTML label sits as a percentage of it. */
    box(pad = 14) {
      const xs = seen.map((p) => p[0])
      const ys = seen.map((p) => p[1])
      const x = Math.min(...xs) - pad
      const y = Math.min(...ys) - pad
      const w = Math.max(...xs) + pad - x
      const h = Math.max(...ys) + pad - y
      return {
        viewBox: `${x.toFixed(1)} ${y.toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}`,
        at: (point) =>
          `left:${(((point[0] - x) / w) * 100).toFixed(2)}%;top:${(
            ((point[1] - y) / h) *
            100
          ).toFixed(2)}%`,
      }
    },
  }
}

/* The three faces this projection leaves visible on a box: the top, the long
   side facing the viewer and the end. The same three shading steps every time,
   so a green solid and a blue one still read as the same kind of object. */
function solidBox(f, [x0, x1], [y0, y1], [z0, z1], tone) {
  return [
    f.poly([P(x0, y1, z0), P(x1, y1, z0), P(x1, y1, z1), P(x0, y1, z1)], `iso__side iso--${tone}`),
    f.poly([P(x1, y0, z0), P(x1, y1, z0), P(x1, y1, z1), P(x1, y0, z1)], `iso__end iso--${tone}`),
    f.poly([P(x0, y0, z1), P(x1, y0, z1), P(x1, y1, z1), P(x0, y1, z1)], `iso__top iso--${tone}`),
  ].join('\n        ')
}

/* ------------------------------------------------------ the flow drawing --- */

/* Three plinths in a row: the assistant, Allplan MCP, and the model that is
   open. A dashed outline encloses the last two, which is the claim the sentence
   beside it makes in words. The element the answer is about is the blue box on
   the model plinth, the same blue as in the hero. */
function flowDrawing(art) {
  const f = frame()
  const D = 56
  const H = 12
  const seats = [0, 104, 208]
  const W = 80

  /* Drawn before the plinths, so they sit on top of it. Snug around the last
     two, because the line it draws is the claim the section makes in words. */
  const fence = f.poly([P(92, -18), P(306, -18), P(306, D + 18), P(92, D + 18)], 'iso__fence')

  const plinths = seats
    .map((x) => solidBox(f, [x, x + W], [0, D], [0, H], 'plate'))
    .join('\n        ')

  /* What stands on each plinth: one box for the assistant, an upright slab for
     the bridge, three elements for the model with the highlighted one in blue. */
  const onTop = [
    solidBox(f, [18, 58], [14, 42], [H, H + 24], 'mass'),
    solidBox(f, [138, 148], [8, 48], [H, H + 40], 'mass'),
    solidBox(f, [216, 232], [14, 42], [H, H + 20], 'mass'),
    solidBox(f, [238, 254], [14, 42], [H, H + 20], 'hot'),
    solidBox(f, [260, 276], [14, 42], [H, H + 20], 'mass'),
  ].join('\n        ')

  /* One arrow above the plinths on each side of the bridge, both of them double
     headed: the question goes out and the answer comes back over the same route,
     and the model is read and written over the other one. Blue stays on the
     element the answer is about, which is the one thing it means on this page. */
  const fly = H + 30
  const a = P(40, D / 2, fly)
  const b = P(144, D / 2, fly)
  const c = P(248, D / 2, fly)
  const shorten = (from, to, by) => {
    const dx = to[0] - from[0]
    const dy = to[1] - from[1]
    const len = Math.hypot(dx, dy)
    return [from[0] + (dx / len) * by, from[1] + (dy / len) * by]
  }

  const arrows = [
    f.line(shorten(a, b, 34), shorten(b, a, 34), 'iso__arrow iso__arrow--mass iso__arrow--both'),
    f.line(shorten(b, c, 34), shorten(c, b, 34), 'iso__arrow iso__arrow--mass iso__arrow--both'),
  ].join('\n        ')

  const tags = seats.map((x) => P(x + W / 2, D / 2, H + 58))
  /* Just under the low corner of the dashed outline, so the words name the line
     rather than sit on it. */
  const corner = P(306, D + 18)
  const note = [corner[0], corner[1] + 18]
  tags.forEach((p) => f.room(p, 58, 14))
  f.room(note, 62, 16)

  const view = f.box(14)
  const labels = [art.assistant, art.bridge, art.model]

  return `    <div class="mcp-art mcp-art--flow">
      <svg class="iso" viewBox="${view.viewBox}" role="img" aria-label="${esc(art.alt)}">
        <defs>
          <marker id="mcp-head-mass" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto">
            <path class="iso__head iso__head--mass" d="M0 0.5 7 4 0 7.5Z"/>
          </marker>
          <marker id="mcp-head-hot" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto">
            <path class="iso__head iso__head--hot" d="M0 0.5 7 4 0 7.5Z"/>
          </marker>
          <marker id="mcp-tail-mass" viewBox="0 0 8 8" refX="1" refY="4" markerWidth="5" markerHeight="5" orient="auto">
            <path class="iso__head iso__head--mass" d="M8 0.5 1 4 8 7.5Z"/>
          </marker>
        </defs>
        ${fence}
        ${plinths}
        ${onTop}
        ${arrows}
      </svg>
${labels
  .map(
    (label, i) =>
      `      <p class="mcp-art__tag" style="${view.at(
        tags[i]
      )}" aria-hidden="true">${esc(label)}</p>`
  )
  .join('\n')}
      <p class="mcp-art__note" style="${view.at(note)}" aria-hidden="true">${esc(art.boundary)}</p>
    </div>`
}

/* ----------------------------------------------------------------- icons --- */

/* One line icon per operation, each drawn from what the operation does rather
   than taken from a generic set: a frame being searched, a record being read,
   the same record with a value going into it, a solid being measured, a view
   being brought onto an element, an element being marked. */
const ICONS = {
  find: '<path d="M3 3h11v7"/><path d="M3 3v14h7"/><circle cx="15" cy="15" r="4.5"/><path d="M18.4 18.4 22 22"/>',
  read: '<path d="M4 3h16v18H4z"/><path d="M8 8h8M8 12h8M8 16h4"/>',
  write:
    '<path d="M4 3h9v18H4z"/><path d="M8 8h1M8 12h1M8 16h1"/><path d="M22 12h-7"/><path d="M18 8.5 21.5 12 18 15.5"/>',
  geometry: '<path d="M12 2.5 21 7v10l-9 4.5L3 17V7z"/><path d="M3 7l9 4.5L21 7M12 11.5v10"/>',
  zoom: '<path d="M2.5 7V2.5H7M17 2.5h4.5V7M21.5 17v4.5H17M7 21.5H2.5V17"/><path d="M9 9h6v6H9z"/>',
  highlight:
    '<path d="M8.5 8.5h7v7h-7z"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.2 5.2 7.4 7.4M16.6 16.6l2.2 2.2M18.8 5.2 16.6 7.4M7.4 16.6l-2.2 2.2"/>',
}

const icon = (name) => {
  const paths = ICONS[name]
  if (!paths)
    throw new Error(`unknown Allplan MCP icon: ${name}. Add it to ICONS in allplan-mcp.mjs`)
  return `<svg class="mcp-op__icon" viewBox="0 0 24 24" aria-hidden="true">${paths}</svg>`
}

/* ------------------------------------------------------------ the video --- */

const PLAY = `<svg class="mcp-video__mark" viewBox="0 0 12 12" aria-hidden="true">
            <path d="M2.5 1.5 10 6l-7.5 4.5z"/>
          </svg>`

/**
 * The product video, as a poster frame and a button that loads the player.
 *
 * A Vimeo iframe in the markup would call vimeo.com the moment the page does,
 * which puts a third party in front of every visitor including the ones who
 * came for the price. So what ships is the first frame, encoded into
 * `assets/img` from Vimeo's own CDN and served from this origin, and a button
 * that says what starting it does. The click is the visitor asking for it, and
 * `assets/js/site.js` builds the player from the attributes below.
 *
 * None of this reaches the consent banner. There is no choice to store, because
 * nothing runs until someone asks for it.
 *
 * The frame carries the video's own ratio, so it holds its place in the layout
 * before the poster has loaded and keeps it when the player takes over. The
 * control on top of it is the page's own solid button rather than a play glyph
 * floating on a scrim: the poster is a busy frame, and a black block is the one
 * shape that stays legible on any part of it.
 */
const video = (v) => `    <figure class="mcp-video">
      <div class="mcp-video__frame" style="--media-ratio:${esc(v.ratio)}">
        <button class="mcp-video__start" type="button"
                data-video="${esc(v.id)}"
                data-video-title="${esc(v.title)}"
                data-video-params="${esc(v.params ?? '')}">
          <img class="mcp-video__poster" src="${v.poster.src}" alt=""
               width="${v.poster.width}" height="${v.poster.height}" fetchpriority="high" decoding="async">
          <span class="mcp-video__face">
            <span class="mcp-video__chip">
              ${PLAY}
              ${esc(v.action)}
            </span>
          </span>
        </button>

        <!-- With the script off the button does nothing, because the script is
             what would have built the player. The poster stays, described this
             time, and the link goes where the video can be watched. -->
        <noscript>
          <img class="mcp-video__poster" src="${v.poster.src}" alt="${esc(v.poster.alt)}"
               width="${v.poster.width}" height="${v.poster.height}" decoding="async">
          <span class="mcp-video__face">
            <a class="mcp-video__chip" href="https://vimeo.com/${esc(v.id)}" rel="noopener">
              ${PLAY}
              ${esc(v.action)}
            </a>
          </span>
        </noscript>
      </div>
      <figcaption class="mcp-video__note">${esc(v.note)}</figcaption>
    </figure>`

/* -------------------------------------------------------------- sections --- */

/* 1. The hero. The headline and what it means on the left, the product video on
   the right. The exchange the video shows is not mocked up over it: section 4
   is where the questions are, in the words they are actually asked in. The
   button carries its own accessible name, so the poster behind it is marked
   decorative rather than read out on top of it. */
const mcpHero = (b) => `<section class="band mcp-band mcp-band--concrete mcp-hero" aria-labelledby="page-title">
  <div class="wrap grid">
    <div class="mcp-hero__head">
      <h1 class="mcp-h1" id="page-title">${mdInline(b.title)}</h1>
      <p class="mcp-hero__lede">${mdInline(b.lede)}</p>
      <div class="mcp-hero__actions">
        ${solid(b.cta, b.site)}
        ${quiet(b.link, b.site)}
      </div>
    </div>

    <div class="mcp-hero__aside">
${video(b.video)}
    </div>
  </div>
</section>`

/* 2. The problem, as three statements under one another rather than a paragraph.
   Each is one job done the long way round, and they are three of a kind rather
   than a sequence, so the list is unordered and the rules between them are what
   separates them. */
const mcpProblem = (b) =>
  band(
    join([
      `    <div class="mcp-problem__head">
      ${heading(b.title, 'mcp-problem-title')}
    </div>`,
      `    <ul class="mcp-problem__lines">
${b.lines.map((line) => `      <li>${mdInline(line)}</li>`).join('\n')}
    </ul>`,
    ]),
    { ground: 'sand', id: b.id, label: 'mcp-problem-title' }
  )

/* 3. How it works. Four steps, numbered because they are a sequence and the
   order is what the reader needs. The drawing carries the same steps as objects,
   and the line under it is the one claim the rest of the page rests on. */
const mcpSteps = (b) =>
  band(
    join([
      `    <div class="mcp-steps__head">
      ${heading(b.title, 'mcp-steps-title')}
    </div>`,
      `    <ol class="mcp-steps__list">
${b.steps
  .map(
    (step, i) => `      <li class="mcp-step">
        <span class="mcp-step__n">${String(i + 1).padStart(2, '0')}</span>
        <p class="mcp-step__body">${mdInline(step)}</p>
      </li>`
  )
  .join('\n')}
    </ol>`,
      flowDrawing(b.art),
      `    <p class="mcp-steps__note">${mdInline(b.note)}</p>`,
    ]),
    { ground: 'concrete', id: b.id, label: 'mcp-steps-title' }
  )

/* 4. Three exchanges, set as a transcript. The question is black and the answer
   sits on sand. It is the only pattern on the page that repeats, so it is the
   one a reader learns to recognise. */
const mcpExamples = (b) =>
  band(
    join([
      `    <div class="mcp-examples__head">
      ${heading(b.title, 'mcp-examples-title')}
    </div>`,
      `    <div class="mcp-examples__list">
${b.items
  .map(
    (item) => `      <div class="mcp-chat">
        <p class="mcp-chat__ask">${mdInline(item.q)}</p>
        <p class="mcp-chat__reply">${mdInline(item.a)}</p>
      </div>`
  )
  .join('\n')}
    </div>`,
    ]),
    { ground: 'concrete', id: b.id, label: 'mcp-examples-title' }
  )

/* 5. The six operations, one tile each. */
const mcpOperations = (b) =>
  band(
    join([
      `    <div class="mcp-ops__head">
      ${heading(b.title, 'mcp-ops-title')}
    </div>`,
      `    <ul class="mcp-ops">
${b.items
  .map(
    (item) => `      <li class="mcp-op">
        ${icon(item.icon)}
        <h3 class="mcp-h3">${mdInline(item.title)}</h3>
        <p class="mcp-op__body">${mdInline(item.body)}</p>
      </li>`
  )
  .join('\n')}
    </ul>`,
      `    <p class="mcp-ops__note">${mdInline(b.note)}</p>`,
    ]),
    { ground: 'sand', id: b.id, label: 'mcp-ops-title' }
  )

/* 6. Three tiers side by side, stacked on a phone. Lite carries the accent rule
   because it is the one that can be bought today, so the emphasis is a fact
   about the product rather than a recommendation.

   The forms are not on this page. Each button opens the one that belongs to it,
   hosted by HubSpot on its own page, so the pricing band asks nothing of a
   visitor who came to read the price. A tier whose form has no link yet carries
   no button: a control that goes nowhere is worse than no control. */
const mcpPricing = (b) =>
  band(
    join([
      `    <div class="mcp-price__head">
      ${heading(b.title, 'mcp-price-title')}
    </div>`,
      `    <ul class="mcp-tiers">
${b.tiers
  .map(
    (tier) => `      <li class="mcp-tier${tier.lead ? ' mcp-tier--lead' : ''}">
        <h3 class="mcp-tier__name">${esc(tier.name)}</h3>
        <p class="mcp-tier__price">${tier.price ? mdInline(tier.price) : ''}</p>
        <p class="mcp-tier__unit">${tier.unit ? mdInline(tier.unit) : ''}</p>
        <p class="mcp-tier__body">${mdInline(tier.body)}</p>
        ${solid(tier.cta, b.site)}
      </li>`
  )
  .join('\n')}
    </ul>`,
      `    <p class="mcp-price__note">${mdInline(b.note)}</p>`,
    ]),
    { ground: 'concrete', id: b.id, label: 'mcp-price-title' }
  )

/* 7. The license request, which is a button rather than a form. The form opens
   on HubSpot's own page, so the band is what it says and nothing else: the
   heading, what happens after you send it, the way to start, and how long the
   answer takes.

   If the link is ever missing the button is not rendered, and the copy offers
   the address instead. A closing section that asks for something has to leave a
   way to answer. */
const mcpLicense = (b) => {
  const button = solid(b.cta, b.site)

  return band(
    `    <div class="mcp-cta__head">
      ${heading(b.title, 'mcp-cta-title', 'mcp-h2 mcp-h2--lead')}
      ${b.body ? `<div class="mcp-cta__body">${paras(b.body, 'mcp-cta__line')}</div>` : ''}
      ${button ? '' : `<p class="mcp-cta__line">${withEmail(b.fallback, b.site)}</p>`}
      ${button ? `<div class="mcp-cta__actions">${button}</div>` : ''}
      <p class="mcp-cta__note">${mdInline(b.note)}</p>
    </div>`,
    { ground: 'sand', id: b.id, label: 'mcp-cta-title' }
  )
}

/* The block signature is (block, ctx), and every block with a button in it needs
   site.yml to resolve where that button points, so they take it off ctx here
   rather than each reading a second argument. */
const withSite = (fn) => (b, ctx) => fn({ ...b, site: ctx.site })

export const MCP_BLOCKS = {
  mcpHero: withSite(mcpHero),
  mcpProblem,
  mcpSteps,
  mcpExamples,
  mcpOperations,
  mcpPricing: withSite(mcpPricing),
  mcpLicense: withSite(mcpLicense),
}
