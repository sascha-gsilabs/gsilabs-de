# gsilabs.de

Static rebuild of gsilabs.de, replacing the Framer site. All 25 pages are generated
from `content/` into plain HTML at the project root, so what is in the repo is exactly
what gets deployed. No framework ships to the browser: one stylesheet, one script,
self hosted fonts.

## Everyday commands

```
npm run build     # content/ -> HTML at the project root
npm run serve     # http://localhost:3000
npm run dev       # build, then serve
npm run audit     # crawl every page for broken links, errors, overflow
```

Edit a file under `content/`, run `npm run build`, reload. That is the whole loop.

## Content, the CMS part

Everything editable lives in `content/`. Files are Markdown with a YAML frontmatter
block, the same shape every static site generator uses, so no code is involved in
changing copy.

```
content/
  site.yml                     navigation, company details, social links, SEO defaults
  partials/
    why-partner.yml            a section reused verbatim by more than one page
  pages/                       one file per one off page, home.md included
  solutions/                   the six audience pages
  services/                    the three service pages
  insights/
    articles/                  one file per article
    projects/                  one file per reference project
  jobs/                        one file per open role
```

### Routes

| Content file | URL |
| --- | --- |
| `pages/home.md` | `/` |
| `pages/about.md` | `/about` |
| `solutions/precast-manufacturers.md` | `/solutions/precast-manufacturers` |
| `services/ai-workshop.md` | `/services/ai-workshop` |
| `insights/articles/<slug>.md` | `/insights/<slug>` |
| `insights/projects/<slug>.md` | `/insights/<slug>` |
| `jobs/<slug>.md` | `/careers/<slug>` |

A `route:` key in the frontmatter overrides the default, which is how
`pages/insights-articles.md` ends up at `/insights/articles`.

Every page is written to `<route>/index.html` so clean URLs work on any host without
rewrite rules. `sitemap.xml` and `robots.txt` are regenerated on every build.

### Adding an article, project or job

Drop a new `.md` file into the right folder. It appears automatically in the listings,
in the homepage news block, in "Keep reading" on other articles, and in the sitemap.
Nothing else needs editing.

Articles and projects need this frontmatter:

```yaml
---
title: What Timber Moisture Data Can Tell Us About Building Health
date: 2026-05-22            # drives ordering and the displayed date
author: Yuyang Peng
readTime: 4 min read
excerpt: One sentence deck, shown under the title.
description: The meta description.
image:     { src: /assets/img/cover-x.webp, alt: ..., width: 1600, height: 896 }
cardImage: { src: /assets/img/news-x.webp,  alt: ..., width: 900,  height: 504 }
facts:
  - { label: Written by, value: Yuyang Peng }
---

Markdown body. Use #### and ##### for section headings, matching the source articles.

![alt text](/assets/img/fig-x.webp "Figure 1: this becomes the caption")
```

Jobs need `title`, `employment`, `location`, `excerpt` and a Markdown body.

### Composed pages

Marketing pages list their sections under `blocks:`. Each block has a `type` that maps
to a renderer in `templates/blocks.mjs`:

`heroVideo` `hero` `statement` `showcase` `definitions` `metrics` `metricTiles`
`stages` `pillars` `team` `featureTabs` `faq` `pullQuote` `news` `insightIndex`
`jobList` `prose` `closer` `contact`

Common options on any block: `tone: void` for a black band, `id` for an anchor,
`flushTop: true` to read as a continuation of the section above.
`{ type: include, name: why-partner }` splices in a shared partial.

Two conveniences in the content itself: ` // ` surrounded by spaces becomes the styled
brand delimiter, and a Markdown image with a title becomes a captioned figure.

## Asset pipeline

The client's originals live in `brand assets/`, plus per article and per project folders
under `articles/` and `reference-projects/`. None of them are committed: together they
are over 200 MB of 6000px originals, manuscripts and a 19 MB master video.

```
npm run build:assets
```

runs four steps: stage the brand library into `.staging/` with web safe names, encode
the shipped images into `assets/img` and `assets/logo`, compress the hero video plus its
poster, and convert the supplied variable TTFs to WOFF2.

`tools/assets.config.mjs` is the single list of what ships and at what width. A `from`
with no slash is a name in `.staging/img`; a `from` with a slash is a path relative to
the project root, which is how the content folders are read. `lossless: true` is for flat
colour wordmarks, where lossy WebP fringes the letterforms. `build-images` prints the
encoded pixel size of every output so the `width` and `height` in the content can be
filled in truthfully.

Current total for `assets/`: about 6 MB, of which the hero video is 2.7 MB.

## Review tools

```
node screenshot.mjs http://localhost:3000/about label --width=390 --viewport
node tools/inspect.mjs http://localhost:3000/about 390 844
node tools/audit.mjs
```

`screenshot.mjs` writes to `temporary screenshots/`, auto numbered, never overwriting.

| Flag | Effect |
| --- | --- |
| `--width=` `--height=` | viewport size, default 1440x900 |
| `--viewport` | capture the viewport only instead of the full page |
| `--scroll=N` | scroll to N pixels before capturing |
| `--hover=SEL` / `--click=SEL` | drive an interactive state first, chain with ` >> ` |
| `--motion` | do not emulate reduced motion, so animations run |

Captures emulate `prefers-reduced-motion: reduce` by default, which makes them
deterministic rather than caught mid transition.

`tools/inspect.mjs` prints computed boxes, overflow offenders and failed requests for
one page. `tools/audit.mjs` crawls every page in the sitemap and reports broken
requests, console errors, dead internal links, missing or duplicated `h1`, and
horizontal overflow.

The `tools/scrape-live.mjs`, `tools/extract-live.mjs`, `tools/trim-live.mjs` and
`tools/compact-extract.mjs` scripts were used once to recover copy and structure from
the Framer site, including tab panels and FAQ answers that only existed after a click.
They are kept for reference and are not part of the build.

## Design system

Colors are locked to `brand assets/brand.md` and exposed as four custom properties:
`--paper` `#FFFFFF`, `--ink` `#1F271B`, `--mist` `#EBEBEB`, `--void` `#000000`. There is
no accent hue. Everything else is opacity on one of those four.

Sections are `.band`, and `.band--void` swaps a set of ground tokens (`--ground`,
`--on-ground`, `--line`, `--surface`) so components never need to know which ground they
sit on. Add a component using those tokens and it works on paper and on black without a
variant.

Type is Space Grotesk for display and for the uppercase utility labels, Inter for body
copy. The `//` delimiter comes from GSI Labs' own copy and is the only mark used between
label fragments.

The square dot raster is taken from the logo mark. It appears in the hero field and
nowhere else. Photography ships in its original colour; where type sits over an image,
the legibility scrim is a plain black gradient rather than an ink tint, so the photo
darkens without being pulled toward olive.

## Open points for the client

- **Privacy policy.** The text is reproduced from the Framer site and two of its
  statements stop being true at launch: hosting is no longer Framer, and Google Fonts are
  no longer loaded because both typefaces are self hosted. Both are flagged in a comment
  at the top of `content/pages/privacy.md` and need legal sign off.
- **Imprint.** The old page was a contact form, not a legal notice. The rebuild has a
  proper Impressum assembled from the company data in the footer. Please check the
  wording of the liability and copyright paragraphs.
- **Contact forms.** A static site cannot process a form without a backend. The
  Get Started and Imprint pages currently use direct email and phone links. Say the word
  and we wire up a form service.
- **Some imagery is a semantic match, not a confirmed one.** The solution and service
  page photography was picked from the brand library by subject. Where you have the
  intended image, send it and it is a one line change in `tools/assets.config.mjs`.
