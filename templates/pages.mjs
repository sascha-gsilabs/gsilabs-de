// Renderers for the two content types that are body text first: insight detail
// pages (articles and projects) and job detail pages.
import { ARROW, esc, join, md, mdInline, paras } from './layout.mjs'
import { insightCard } from './blocks.mjs'

export function insightPage(doc, ctx) {
  const related = ctx.insights.filter((i) => i.slug !== doc.slug).slice(0, 2)

  return join([
    `<article class="band band--flush article">
  <div class="wrap grid article__top">
    <div class="article__head">
      <p class="label article__kicker">
        <a href="${doc.kind === 'Projects' ? '/insights/projects' : '/insights/articles'}">${esc(doc.kindLabel)}</a>
        <span class="label__sep">//</span>
        <time datetime="${doc.date}">${esc(doc.dateLabel)}</time>
      </p>
      <h1 class="article__title" id="page-title">${mdInline(doc.title)}</h1>
      ${doc.excerpt ? `<p class="lede article__lede">${mdInline(doc.excerpt)}</p>` : ''}
    </div>

    <dl class="article__facts">
${(doc.facts ?? [])
  .map(
    (f) => `      <div class="article__fact">
        <dt class="label">${esc(f.label)}</dt>
        <dd>${mdInline(f.value)}</dd>
      </div>`
  )
  .join('\n')}
    </dl>
  </div>

  <div class="wrap">
    <figure class="article__cover">
      <img class="photo" src="${doc.image.src}" alt="${esc(doc.image.alt ?? '')}" width="${doc.image.width}" height="${doc.image.height}" decoding="async">
    </figure>
  </div>

  <div class="wrap grid">
    <div class="prose article__body">
${md(doc.body)}
    </div>
  </div>
</article>`,

    related.length
      ? `<section class="band" aria-labelledby="related-title">
  <div class="wrap grid">
    <div class="news__head">
      <h2 class="display" id="related-title">Keep reading</h2>
    </div>
    <a class="link news__all" href="/insights">All insights${ARROW}</a>
    <ul class="news__list news__list--pair">
${related.map((i) => insightCard(i)).join('\n')}
    </ul>
  </div>
</section>`
      : '',
  ])
}

export function jobPage(doc, ctx) {
  return join([
    `<article class="band band--flush job">
  <div class="wrap grid job__top">
    <div class="job__head">
      <p class="label article__kicker">
        <a href="/careers">Careers</a>
        <span class="label__sep">//</span>
        ${esc(doc.employment)}
      </p>
      <h1 class="article__title" id="page-title">${mdInline(doc.title)}</h1>
      ${doc.excerpt ? `<p class="lede article__lede">${mdInline(doc.excerpt)}</p>` : ''}
      <a class="btn btn--solid" href="mailto:${ctx.site.company.email}?subject=${encodeURIComponent(
        'Application: ' + doc.title
      )}">Apply by email</a>
    </div>

    <dl class="article__facts">
      <div class="article__fact">
        <dt class="label">Role</dt>
        <dd>${esc(doc.title)}</dd>
      </div>
      <div class="article__fact">
        <dt class="label">Employment</dt>
        <dd>${esc(doc.employment)}</dd>
      </div>
      <div class="article__fact">
        <dt class="label">Location</dt>
        <dd>${esc(doc.location)}</dd>
      </div>
${(doc.facts ?? [])
  .map(
    (f) => `      <div class="article__fact">
        <dt class="label">${esc(f.label)}</dt>
        <dd>${mdInline(f.value)}</dd>
      </div>`
  )
  .join('\n')}
    </dl>
  </div>

  <div class="wrap grid">
    <div class="prose article__body">
${md(doc.body)}
    </div>
  </div>
</article>`,

    `<section class="band band--void" aria-labelledby="apply-title">
  <div class="wrap grid">
    <div class="closer">
      <h2 class="closer__title" id="apply-title">Interested?</h2>
      <div class="closer__body">${paras([
        `Send your CV and a short note about what you want to work on to ${ctx.site.company.email}. No cover letter template needed.`,
      ])}</div>
      <div class="closer__actions">
        <a class="btn btn--solid" href="mailto:${ctx.site.company.email}?subject=${encodeURIComponent(
          'Application: ' + doc.title
        )}">Apply by email</a>
        <a class="link" href="/careers">See all roles${ARROW}</a>
      </div>
    </div>
  </div>
</section>`,
  ])
}
