# gsilabs.de

Static rebuild of gsilabs.de, replacing the Framer site. All 25 pages are generated
from `content/` into plain HTML at the project root, so what is in the repo is exactly
what gets deployed. No framework ships to the browser: one stylesheet, one script,
self hosted fonts.

## Everyday commands

```
npm run build     # content/ -> HTML at the project root
npm run serve     # http://localhost:3001
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
  site.yml                     navigation, languages, company details, social links, SEO defaults
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

Jobs need `title`, `employment`, `location`, `excerpt` and a Markdown body. The
application form is appended to every one of them, so nothing in the file asks
for it.

### Composed pages

Marketing pages list their sections under `blocks:`. Each block has a `type` that maps
to a renderer in `templates/blocks.mjs`:

`heroVideo` `hero` `statement` `showcase` `definitions` `metrics` `metricTiles`
`stages` `pillars` `team` `featureTabs` `faq` `pullQuote` `news` `insightIndex`
`jobList` `prose` `closer` `contact` `form`

Common options on any block: `tone: void` for a black band, `id` for an anchor,
`flushTop: true` to read as a continuation of the section above.
`{ type: include, name: why-partner }` splices in a shared partial.

### Forms

The site embeds two HubSpot forms. Both are declared once in `site.yml`, named
for the job they do so no page ever carries a UUID:

```yaml
hubspot:
  region: eu1
  portalId: "146150011"
  forms:
    enquiry: 16241ff4-56ee-42ce-a5b7-9967520290c5      # /get-started
    application: 13146800-d8a8-4ccd-9c2e-f409489abeaf  # the job pages
```

Replacing a form in HubSpot means pasting its new id there, once.

`form` is the enquiry band on Get Started: what we need from you on the left,
the form on the right, split by a rule down the middle.

```yaml
  - type: form
    body: The opening line, above the points.
    points:
      - One line per thing the reader gets.
    image: { src: /assets/img/get-started-workshop.webp, alt: ..., width: 1300, height: 976 }
    note: Small print under the form. Markdown links work.
    form: enquiry               # a key under hubspot.forms
```

`eyebrow` and `title` are available too, and `id` gives the band an anchor.

The application form is not a block: every job page ends with it, so `jobPage`
in `templates/pages.mjs` emits it directly. The button in the job header is an
anchor down to it rather than a link away from the page.

Both go through `formFrame()` in `templates/blocks.mjs`, which emits the frame
div and the loader script together. The script rides along with the frame rather
than sitting in the page shell, so a page only pays for HubSpot when it carries
a form.

**What can and cannot be styled.** HubSpot renders into a cross origin iframe.
`assets/css/site.css` can style the frame and whatever sits around it, and
cannot reach a single field inside. Field colours, fonts and corners are set in
HubSpot, under each form's own style settings.

**Why the min-heights exist.** The frame's height is whatever HubSpot posts back
to the page, and it posts zero on any origin it does not recognise, which would
leave the form invisible. `.hs-form-frame` carries a `min-height` as the floor
that keeps it on the page either way, measured against each form as it actually
renders:

| | beside the copy | stacked, under 480px |
| --- | --- | --- |
| enquiry, 5 fields | 34rem | 40rem |
| application, 5 fields, all required | 36rem | 40rem |

Add or remove a field and the matching number needs remeasuring, or the form
gets cropped: the iframe carries `scrolling="no"`, so whatever overflows is
simply gone.

Note for screenshots: Chrome does not paint a cross origin iframe that sits
outside the viewport, so a full page capture of either page shows the form's
reserved space as blank. Capture with `--viewport --scroll=` instead.

Two conveniences in the content itself: ` // ` surrounded by spaces becomes the styled
brand delimiter, and a Markdown image with a title becomes a captioned figure.

### Languages

The site is English only. `languages:` in `site.yml` drives the header switcher and the
document's `lang` attribute, and nothing else: no page is translated. The entry carrying
`active: true` sets both, so its `short` is what the trigger shows. German is listed
without an `href`, which renders it as an option that is visibly not reachable yet.

Turning German on later means: build the German pages, give that entry its `href`, and
move `active: true` to it. The header then reads DE with no template change.

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

Current total for `assets/`: about 7.6 MB, of which the hero video is 2.8 MB.

Page media follows the same rule as the panels below: the client names the file after
the page it belongs on, plus `top` for the hero and `bottom` for the wide band further
down, and the shipped name repeats it. So `about-us-top.webp` is the hero on /about, and
nothing has to be remembered to check it. Pages the client has not renamed a file for
still carry names of mine, `sol-` and `svc-` prefixed.

The click through panels on the six solution pages are named after their tab, both in
`brand assets/website images/` and as `tab-<tab slug>.webp` in `assets/img`, so a new
image for a tab needs no lookup: drop it in under the tab's name and encode. They arrive
in every orientation, so the panel frame is a fixed 3 by 2 that each image fills, which
keeps them all the same size on the page.

Two knobs for that, both optional:

- `trim: true` in `assets.config.mjs` cuts a white sheet away before encoding, for
  images where the subject floats in the middle of the file. Without it those fill the
  frame with their own margins and look smaller than their neighbours.
- `focus: top` on an image in the content moves the crop, for a screenshot whose heading
  carries the meaning or a diagram that reads top down. Default is centred.

## Review tools

```
node screenshot.mjs http://localhost:3001/about label --width=390 --viewport
node tools/inspect.mjs http://localhost:3001/about 390 844
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
