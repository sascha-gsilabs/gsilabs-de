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
npm run audit     # crawl every page for broken links, errors, metadata, overflow

npm run translations        # write translations.txt, every text EN beside DE
npm run translations:apply  # read the edited file back into content/de/
```

Edit a file under `content/`, run `npm run build`, reload. That is the whole loop.
For German wording, `translations.txt` is the shortcut: edit there and apply.

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
  solutions/                   the audience pages
  services/                    the service pages
  insights/
    articles/                  one file per article
    projects/                  one file per reference project
  jobs/                        one file per open role
  de/                          the same tree again, in German
    site.yml                   an overlay, only what differs from the English one
    pages/ solutions/ services/ insights/ jobs/ partials/
```

`content/` is the English site and the canonical one. `content/de/` mirrors it file for
file, using the same filenames, which is what makes a page and its translation two
copies of one thing rather than two separate pages.

### Routes

| Content file | URL |
| --- | --- |
| `pages/home.md` | `/` |
| `pages/about.md` | `/about` |
| `solutions/precast-manufacturers.md` | `/solutions/precast-manufacturers` |
| `services/ai-advisory.md` | `/services/ai-advisory` |
| `insights/articles/<slug>.md` | `/insights/<slug>` |
| `insights/projects/<slug>.md` | `/insights/<slug>` |
| `jobs/<slug>.md` | `/careers/<slug>` |

A `route:` key in the frontmatter overrides the default, which is how
`pages/insights-articles.md` ends up at `/insights/articles`.

German pages take the same routes with `/de` in front: `content/de/pages/about.md`
becomes `/de/about`. Slugs are deliberately not translated, so the switcher is a prefix
and nothing more, and a link only ever has to be written once.

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

### Taking a page down

`draft: true` in a page's frontmatter keeps the file but stops publishing it: no
HTML is written, the route leaves `sitemap.xml`, and any file an earlier build
left at that route is removed. Also delete the page's entry from `nav` in
`site.yml`, or the header links to a 404.

To put it back, delete the flag and restore the nav entry. Nothing else is lost:
the content file, its images and any partial it uses all stay where they were.

Currently down: `solutions/general-contractors` and
`services/robotics-feasibility-study`. Their images and the shared
`partials/why-partner.yml` are still in place for that reason, so they are not
orphans to be cleaned up.

Renaming a page is the same idea from the other end. The build sweeps
`services/`, `solutions/`, `insights/` and `careers/` after writing, removing any
folder with an `index.html` this run did not produce, so a renamed page does not
leave its old URL alive behind it. The project root is not swept: it holds files
that are not the build's to delete.

### Composed pages

Marketing pages list their sections under `blocks:`. Each block has a `type` that maps
to a renderer in `templates/blocks.mjs`:

`heroVideo` `hero` `statement` `showcase` `definitions` `metrics` `metricTiles`
`stages` `pillars` `team` `featureTabs` `faq` `pullQuote` `news` `insightIndex`
`jobList` `prose` `closer` `contact` `form`

The six solution pages share one shape, taken from the pages they replace: hero,
`featureTabs`, the FAQ on a black band, `metricTiles` with a square image beside
the numbers, why partner, news. The FAQ carries the band's headline rather than a
question about questions, which is where the original puts it.

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

The site is published in English at the root and in German under `/de`. Both come from
the same templates and the same block types: a German page is a translation, not a
second design.

`languages:` in `content/site.yml` is the whole configuration.

```yaml
languages:
  - { code: en, label: English,  short: EN, prefix: "",    dateLocale: en-US, dir: content }
  - { code: de, label: Deutsch,  short: DE, prefix: /de,   dateLocale: de-DE, dir: content/de }
```

The first entry is served from the root, every later one from its `prefix`. Which entry
is current, where the switcher points, and which pages exist in which language are all
worked out per page by the build from the files that are actually there, so adding a
page never means editing this list.

Three things follow from that, and they are the reason there is no second code path:

- **Links are written once.** Content files and templates write `/about`. On a German
  page the build puts `/de` in front of every internal `href`, on the way out. Nothing
  under `/assets` is touched, since there is one copy of those.
- **`content/de/site.yml` is an overlay.** It lists only the keys whose value differs and
  inherits the rest, so the phone number, the HubSpot form ids and the social links
  cannot drift between the two sites. Lists replace rather than merge: `nav:` has to be
  given in full or not at all.
- **Interface text lives under `ui:`.** Every word the templates emit themselves, from
  "Skip to content" to "Apply now", is a key there. A missing key fails the build rather
  than falling back to English, which is the failure this table exists to prevent.

Nav groups carry an `id:` (`solutions`, `company`, …) that is the same in both files.
The menu ids in the markup come from it rather than from the label, so CSS, the header
script and `tools/test-nav.mjs` keep working when the labels are German words.

#### Correcting a translation without opening a content file

`translations.txt` at the repo root holds every piece of text on the site, English
beside German, in one editable file. It is generated, and it writes back.

```
npm run translations         regenerate translations.txt from content/
npm run translations:apply   read it back into content/de/
npm run build
```

Each pair is labelled with the file it came from and the path inside it, and only
the DE block is ever written back: `content/` stays the canonical English site, so
editing the EN text in the file changes nothing.

Three things it refuses to do quietly. An empty DE block is skipped rather than
saved as an empty string. A path that no longer exists in the content file is
reported instead of silently dropped. And if the English text in the file no longer
matches the English site, the file is older than the content and `apply` says so
before you overwrite a newer translation with an older one, which is why step zero
is always to regenerate.

Only files with a real change are rewritten. Serialising a YAML file re-wraps every
folded block in it, which is harmless but would otherwise put the whole German site
into the diff for a one word correction.

#### Adding a language

1. Add an entry to `languages:` with its `prefix`, `dateLocale` and `dir`.
2. Create that directory with a `site.yml`, even an empty one, and translate the content
   files you want published.
3. Build. Pages you have not translated simply do not exist in that language: the build
   lists them at the end, and the switcher sends a visitor to that language's homepage
   rather than to a 404.

## Search engines

Everything below is generated, so it stays right when pages are added or renamed.

- **Titles and descriptions** come from each content file. A page whose heading is longer
  than a search result can show sets `metaTitle:` as well, which is used in `<title>` and
  the social tags while `title:` stays the heading on the page. Both long articles do this.
- **hreflang.** Every page carries one `<link rel="alternate">` per language it exists in,
  itself included, plus `x-default` pointing at the English page. The same set goes into
  `sitemap.xml` as `xhtml:link` entries. The set is built from one map, so it is always
  reciprocal, which is the condition for search engines to use it at all.
- **JSON-LD.** The homepage carries `Organization` and `WebSite`, service pages carry
  `Service`, articles carry `BlogPosting` or `Article`, job pages carry `JobPosting`, and
  every page below the top level carries a `BreadcrumbList`. All of them reference one
  `Organization` node by `@id`, so the two language sites describe one company.
- **JobPosting needs a date.** A job file without `posted:` is published as an ordinary
  page rather than with a record Google would reject. `employmentType:` is the schema.org
  value (`FULL_TIME`), separate from `employment:`, which is the label shown on the page
  and differs per language.
- **Redirects** live in `vercel.json`. Four URLs from the Framer site have moved and are
  answered with a 301 rather than a 404:

  | Old URL | Now |
  | --- | --- |
  | `/services/ai-workshop` | `/services/ai-advisory` |
  | `/services/dedicated-dev-team` | `/services/bim-software-development` |
  | `/solutions/general-contractors` | `/services/ai-sovereign-infrastructure` |
  | `/services/robotics-feasibility-study` | `/services/ai-advisory` |

  Renaming or unpublishing a page means adding a line here. `npm run build` will remove
  the old folder, so without a redirect the URL starts answering 404.

## Asset pipeline

The client's originals live in `brand assets/`, plus per article and per project folders
under `articles/` and `reference-projects/`. None of them are committed: together they
are over 200 MB of 6000px originals, manuscripts and a 19 MB master video.

```
npm run build:assets
```

runs four steps: stage the brand library into `.staging/` with web safe names, encode
the shipped images into `assets/img` and `assets/logo`, encode the hero video twice plus
its poster, and subset the supplied variable TTFs before converting them to WOFF2.

### Fonts

The two supplied typefaces carry every script their designers drew. Inter alone covers
2849 characters, of which this site uses 89, and it is preloaded, so a first visit waits
on it before any text is painted. `tools/build-fonts.mjs` cuts both down to the
characters this site can write in.

|  | as supplied | shipped |
| --- | --- | --- |
| Inter | 352 KB | 107 KB |
| Space Grotesk | 49 KB | 30 KB |

Subsetting removes glyphs, not axes: both fonts stay variable and render every weight
the design uses. Five pages in both languages were captured before and after and came
out pixel for pixel identical.

The cut is at latin plus Latin Extended-A, not at the 89 characters in the content
today. `tools/fonts.config.mjs` carries the ranges, the measurements behind where the
line was drawn, and what to add if the site ever needs another script. The build guards
it: any character in the content the shipped fonts cannot draw is named at the end of
`npm run build`, because the browser's own answer is to substitute a system font for
that one letter and say nothing.

`tools/assets.config.mjs` is the single list of what ships and at what width. A `from`
with no slash is a name in `.staging/img`; a `from` with a slash is a path relative to
the project root, which is how the content folders are read. `lossless: true` is for flat
colour wordmarks, where lossy WebP fringes the letterforms. `build-images` prints the
encoded pixel size of every output so the `width` and `height` in the content can be
filled in truthfully.

Current total for `assets/`: 8.3 MB across 88 files, of which the two hero video encodes
are 2.2 MB together.

### The hero video

Nine seconds of dark abstract motion behind a scrim that darkens it from 82% to 22%
black, with the headline over it. Nobody watches it, so it is encoded for weight.

Two files ship, and the browser downloads only the first one it can play:

| | | measured against the source |
| --- | --- | --- |
| `hero.webm` | AV1, 1600px | 895 KB, SSIM 0.99577 |
| `hero.mp4` | H.264, 1280px | 1345 KB, SSIM 0.99086 |
| what shipped before | H.264, 1600px | 2780 KB, SSIM 0.99497 |

The AV1 file is a third of the old one and measures closer to the source, because AV1 is
a decade newer than H.264. The MP4 is the fallback for Safari before 17.4 and older
Android. VP9 was measured too and lost to H.264 at every setting, so it is not shipped.
`tools/assets.config.mjs` carries the full ladder.

Two details that are easy to get wrong:

- The `<source>` for the WebM declares `codecs=av01.0.08M.08`, not a bare `video/webm`.
  Safari 16 through 17.3 plays WebM but not AV1, and given the bare type it would accept
  the source, download it and fail with no fallback left.
- The poster is cut from the source file, not from either encode. It is the one frame a
  visitor sees before any video loads, and on a slow connection the only one.

`assets/js/site.js` fetches the video only once the page is idle, and not at all under
`prefers-reduced-motion`, on a connection reporting Save-Data, or on 2G and 3G. Someone
on a metered connection is the last person who should spend 900 KB on wallpaper.

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
node tools/translations.mjs
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
one page. `tools/audit.mjs` crawls every page in the sitemap, in both languages, and
reports broken requests, console errors, dead internal links, missing or duplicated
`h1`, horizontal overflow, and the metadata a search engine reads: title and description
length, a canonical that does not match the page it is on, JSON-LD that does not parse,
an incomplete hreflang set, and any title or description used by two pages in the same
language. It is the check that catches a `/de/de/` link or a translation that quietly
went missing.

`tools/test-nav.mjs` walks the header menus with the mouse on both homepages, since the
German labels are longer words in the same layout.

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
  at the top of `content/pages/privacy.md` and in `content/de/pages/privacy.md`, and need
  legal sign off in both languages. The German version is the one a German visitor will
  be judged against, so it is the one to have checked first.
- **Imprint.** The old page was a contact form, not a legal notice. The rebuild has a
  proper Impressum assembled from the company data in the footer, in German under
  `/de/imprint` with the usual `§ 5 DDG` headings. Please check the wording of the
  liability and copyright paragraphs.
- **HubSpot form styling.** The forms are HubSpot's new embed, which renders inside a
  cross origin iframe. The frame is ours to style, the fields inside it are not: their
  3px corner radii and pale blue fills come from the form's own style settings in
  HubSpot and have to be changed there. The live site has the same mismatch.
- **The AI Advisory hero is the wrong photograph.** The page is now about advisory work
  rather than a two day workshop, but the photo is still a speaker addressing a seated
  room, and the source file is only 512px wide, which is soft on a modern screen. It
  wants a working session photo at a usable size. Flagged in a comment in
  `content/services/ai-advisory.md`.
- **Job posting dates.** `posted:` in both job files is set to the day the German site was
  built. Set it to the real date each role was published: Google ranks job results by how
  recent they are.
- **Client quotes are translated.** The testimonials on the homepage and on AI Advisory
  appear in German on the German site. They are translations of the English wording, not
  something the named people said in German. Worth a sign off from them, or swap in their
  own words if they gave them.
- **Some imagery is a semantic match, not a confirmed one.** The solution and service
  page photography was picked from the brand library by subject. Where you have the
  intended image, send it and it is a one line change in `tools/assets.config.mjs`.
