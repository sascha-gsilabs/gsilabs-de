# gsilabs.de

Static rebuild of gsilabs.de, replacing the Framer site. Plain HTML, one CSS
file, one JS file, self hosted fonts. No framework and no build step for the
pages themselves: what is in the repo is what gets deployed.

## Run it

```
node serve.mjs                       # http://localhost:3000
node screenshot.mjs http://localhost:3000            # full page
node screenshot.mjs http://localhost:3000 label --width=390 --viewport
```

`screenshot.mjs` writes to `temporary screenshots/`, auto numbered, never
overwriting. Useful flags:

| Flag | Effect |
| --- | --- |
| `--width=` `--height=` | viewport size, default 1440x900 |
| `--viewport` | capture the viewport only instead of the full page |
| `--scroll=N` | scroll to N pixels before capturing |
| `--hover=SEL` / `--click=SEL` | drive an interactive state first, chain with ` >> ` |
| `--motion` | do not emulate reduced motion, so animations run |

By default captures emulate `prefers-reduced-motion: reduce`, which makes them
deterministic rather than caught mid transition.

`node tools/inspect.mjs URL [w] [h]` prints computed boxes, overflow offenders
and any failed requests.

## Asset pipeline

The client's originals live in `brand assets/`, plus per article and per project
content folders under `articles/` and `reference-projects/`. None of them are
committed. These steps turn them into the small files the site actually serves:

```
node tools/stage-assets.mjs     # brand assets/ -> .staging/ with web safe names
node tools/build-images.mjs     # .staging/ -> assets/img, assets/logo
node tools/build-video.mjs      # 19 MB master -> assets/video/hero.mp4 + poster
node tools/build-fonts.mjs      # supplied TTFs -> assets/fonts/*.woff2
```

`tools/assets.config.mjs` is the single list of what ships and at what width.
Add an entry there, rerun `build-images`, reference the new name. A `from` with
no slash is a name in `.staging/img`; a `from` with a slash is a path relative to
the project root, which is how the `articles/` and `reference-projects/` folders
are read. `build-images` prints the encoded pixel size of each output, so the
`width` and `height` attributes in the HTML can be filled in truthfully.

Current total for `assets/`: about 3.6 MB, of which the hero video is 2.7 MB.

## Design system

Colors are locked to `brand assets/brand.md` and exposed as four custom
properties: `--paper` `#F8F6F2`, `--ink` `#1F271B`, `--mist` `#EBEBEB`,
`--void` `#000000`. There is no accent hue. Everything else is opacity on one of
those four.

Sections are `.band`, and `.band--void` swaps a set of ground tokens
(`--ground`, `--on-ground`, `--line`, `--surface`) so components never need to
know which ground they sit on. Add a component using those tokens and it works
on paper and on black without a variant.

Type is Space Grotesk for display and for the uppercase utility labels, Inter
for body copy. The `//` delimiter comes from GSI Labs' own copy and is the only
mark used between label fragments.

The square dot raster is taken from the logo mark. It appears in two places
only: the hero field, and the seam that hands a paper band over to a black one.

Photography ships in its original colour. Where type sits over an image, the
legibility scrim is a plain black gradient rather than an ink tint, so the photo
darkens without being pulled toward olive.

## Status

Home page and the shared header, footer and design system are built. The
remaining pages mirror the original site's structure one to one:

- `/solutions/` general-contractors, planning-design-offices,
  geotechnical-engineers, precast-manufacturers, product-manufacturers,
  real-estate-developers
- `/services/` ai-workshop, robotics-feasibility-study, dedicated-dev-team
- `/about`, `/our-process`, `/careers` (plus job template), `/get-started`
- `/insights`, `/insights/articles`, `/insights/projects` (plus article template)
- `/imprint`, `/privacy`

Links to these already exist in the header and footer and will 404 until the
pages are added. `serve.mjs` resolves extensionless URLs to `<name>.html` or
`<name>/index.html`, so both layouts work.
