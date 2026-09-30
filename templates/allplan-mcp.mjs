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
import { ARROW, esc, join, mdInline, paras } from './layout.mjs'
import { formFrame, hasForm, revealChildren } from './blocks.mjs'

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

const eyebrow = (text) => (text ? `<p class="mcp-label">${esc(text)}</p>` : '')

const heading = (text, id, className = 'mcp-h2') =>
  `<h2 class="${className}" id="${id}">${mdInline(text)}</h2>`

const solid = (cta) =>
  cta ? `<a class="btn btn--solid mcp-btn" href="${cta.href}">${esc(cta.label)}</a>` : ''

const quiet = (cta) =>
  cta ? `<a class="link mcp-link" href="${cta.href}">${esc(cta.label)}${ARROW}</a>` : ''

/* `{email}` in a content string becomes the address from site.yml. The slot is
   written into the sentence rather than the sentence cut in two, because German
   puts the address somewhere else than English does. */
const withEmail = (text, site) =>
  mdInline(text).replace(
    '{email}',
    `<a href="mailto:${site.company.email}">${esc(site.company.email)}</a>`
  )

/**
 * A HubSpot form, or a marked placeholder while its id is still missing.
 *
 * Both forms on this page are HubSpot embeds that do not exist yet. Naming them
 * in site.yml with an empty id is what lets the page render either way: the
 * placeholder says what belongs there and offers the address in the meantime,
 * and pasting the id under `hubspot.forms` swaps in the real form with no other
 * change. The loader script only reaches the page once a form is real, so this
 * page requests nothing from HubSpot until then.
 */
const formSlot = (slot, site) =>
  hasForm(slot.form, site)
    ? `      <div class="mcp-form">
        ${formFrame(slot.form, site)}
      </div>`
    : `      <!-- Placeholder. Paste the form id under hubspot.forms.${esc(
        slot.form
      )} in content/site.yml and the embed replaces this. -->
      <div class="mcp-slot">
        <p class="mcp-label mcp-slot__flag">${esc(slot.label)}</p>
        <p class="mcp-slot__title">${mdInline(slot.title)}</p>
        <p class="mcp-slot__body">${withEmail(slot.body, site)}</p>
${
  slot.fields
    ? `        <ul class="mcp-slot__fields">
${slot.fields.map((f) => `          <li>${esc(f)}</li>`).join('\n')}
        </ul>`
    : ''
}
      </div>`

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

/* ------------------------------------------------------ the wall drawing --- */

/* Seven precast panels set out in an L, the way a floor comes off a plan, with
   the one the answer is about in blue and the rest in the green that stands for
   the model everywhere on this page. Painters order: in this projection a box
   with a larger x plus y is in front, so the list is drawn in that order. */
const WALL = { l: 64, t: 16, h: 58, gap: 12 }

function wallDrawing(art) {
  const f = frame()
  const step = WALL.l + WALL.gap
  const hot = 3

  const panels = []
  for (let i = 0; i < 5; i++)
    panels.push({ x: [i * step, i * step + WALL.l], y: [0, WALL.t], hot: i === hot })
  for (let j = 0; j < 2; j++)
    panels.push({ x: [0, WALL.t], y: [34 + j * step, 34 + j * step + WALL.l], hot: false })

  panels.sort((a, b) => a.x[0] + a.y[0] - (b.x[0] + b.y[0]))

  const setout = [
    f.line(P(-14, WALL.t), P(5 * step - WALL.gap + 14, WALL.t), 'iso__setout'),
    f.line(P(WALL.t, 20), P(WALL.t, 34 + step + WALL.l + 14), 'iso__setout'),
  ].join('\n        ')

  const solids = panels
    .map((p) => solidBox(f, p.x, p.y, [0, WALL.h], p.hot ? 'hot' : 'mass'))
    .join('\n        ')

  /* The leader runs up from the middle of the highlighted panel's top face. The
     tag itself is HTML, so only the room it needs is reserved here. */
  const centre = P(hot * step + WALL.l / 2, WALL.t / 2, WALL.h)
  const tag = [centre[0], centre[1] - 46]
  const leader = f.line(centre, tag, 'iso__leader')
  f.room(tag, 52, 16)

  const view = f.box(16)

  return `    <div class="mcp-art">
      <svg class="iso" viewBox="${view.viewBox}" role="img" aria-label="${esc(art.alt)}">
        ${setout}
        ${solids}
        ${leader}
      </svg>
      <p class="mcp-art__tag" style="${view.at(tag)}" aria-hidden="true">${esc(art.marker)}</p>
    </div>`
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
      `      <p class="mcp-art__tag mcp-art__tag--plain" style="${view.at(
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

/* -------------------------------------------------------------- sections --- */

/* 1. The hero. The headline and what it means on the left, the drawing on the
   right with a short exchange above it. The blue panel in the drawing is the
   answer to the question in the bubble: the page shows what it does by doing it. */
const mcpHero = (b) => `<section class="band mcp-band mcp-band--concrete mcp-hero" aria-labelledby="page-title">
  <div class="wrap grid">
    <div class="mcp-hero__head">
      ${eyebrow(b.eyebrow)}
      <h1 class="mcp-h1" id="page-title">${mdInline(b.title)}</h1>
      <p class="mcp-hero__lede">${mdInline(b.lede)}</p>
      <div class="mcp-hero__actions">
        ${solid(b.cta)}
        ${quiet(b.link)}
      </div>
    </div>

    <div class="mcp-hero__aside">
      <div class="mcp-chat mcp-chat--hero">
        <p class="mcp-chat__ask">${mdInline(b.chat.question)}</p>
        <p class="mcp-chat__reply">${mdInline(b.chat.answer)}</p>
      </div>
${wallDrawing(b.art)}
    </div>
  </div>
</section>`

/* 2. The problem, as three statements under one another rather than a paragraph.
   They are a descent: the panel looks right, nothing warns you, and by the time
   it matters the check is too big to finish. The rules between them are that
   descent, which is why each line gets its own row. */
const mcpProblem = (b) =>
  band(
    join([
      `    <div class="mcp-problem__head">
      ${eyebrow(b.eyebrow)}
      ${heading(b.title, 'mcp-problem-title')}
    </div>`,
      `    <ol class="mcp-problem__lines">
${b.lines.map((line) => `      <li>${mdInline(line)}</li>`).join('\n')}
    </ol>`,
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
      ${eyebrow(b.eyebrow)}
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
      ${eyebrow(b.eyebrow)}
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
      ${eyebrow(b.eyebrow)}
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
   about the product rather than a recommendation. The waitlist form is a HubSpot
   embed that does not exist yet, so the Pro button points at the marked
   placeholder below the cards instead of at a form this page built itself. */
const mcpPricing = (b) =>
  band(
    join([
      `    <div class="mcp-price__head">
      ${eyebrow(b.eyebrow)}
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
        ${solid(tier.cta)}
      </li>`
  )
  .join('\n')}
    </ul>`,
      `    <div class="mcp-waitlist" id="${esc(b.waitlist.id)}">
${formSlot(b.waitlist, b.site)}
    </div>`,
      `    <p class="mcp-price__note">${mdInline(b.note)}</p>`,
    ]),
    { ground: 'concrete', id: b.id, label: 'mcp-price-title' }
  )

/* 7. The licence request. The heading and what happens after you send it on the
   left, the form on the right, which is the shape the enquiry band on Get
   Started uses: a visitor who has filled one recognises the other. */
const mcpLicence = (b) =>
  band(
    join([
      `    <div class="mcp-cta__head">
      ${eyebrow(b.eyebrow)}
      ${heading(b.title, 'mcp-cta-title', 'mcp-h2 mcp-h2--lead')}
      ${b.body ? `<div class="mcp-cta__body">${paras(b.body, 'mcp-cta__line')}</div>` : ''}
      <p class="mcp-cta__note">${mdInline(b.note)}</p>
    </div>`,
      `    <div class="mcp-cta__form">
${formSlot(b.slot, b.site)}
    </div>`,
    ]),
    { ground: 'sand', id: b.id, label: 'mcp-cta-title' }
  )

/* The block signature is (block, ctx), and the two with a form in them need
   site.yml for the HubSpot ids and the contact address, so they take it off ctx
   here rather than each reading a second argument. */
const withSite = (fn) => (b, ctx) => fn({ ...b, site: ctx.site })

export const MCP_BLOCKS = {
  mcpHero,
  mcpProblem,
  mcpSteps,
  mcpExamples,
  mcpOperations,
  mcpPricing: withSite(mcpPricing),
  mcpLicence: withSite(mcpLicence),
}
