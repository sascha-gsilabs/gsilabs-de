# GSI Labs brand palette

Source of truth for all colors on gsilabs.de. Do not invent or substitute values.

## Origin

Extracted from the live Framer build of `https://www.gsilabs.de/` on 2026-08-17.
The five values below are the site's actual design tokens, read out of the
inline `<style>` block as `--token-*` custom properties, cross checked against
the most frequent computed colors in the document.

The logo SVGs in `logos and icons/` are monochrome (pure `#000` and `#fff`),
so they contribute no additional hues. The palette has no chromatic accent.

## Roles

| Role                | Hex       | Notes                                                       |
| ------------------- | --------- | ----------------------------------------------------------- |
| Background (paper)  | `#FFFFFF` | Pure white. Default page ground.                            |
| Text (ink)          | `#1F271B` | Deep olive black. All body copy and headings on paper.       |
| Secondary surface   | `#EBEBEB` | Light grey. Cards, insets and quiet panels on paper.        |
| Dark section ground | `#000000` | Pure black. Chosen by the client for all inverted sections.  |
| Text on dark        | `#FFFFFF` | Paper doubles as the type color inside black sections.       |
| Hairline on paper   | `#1F271B` | At 12 to 20 percent opacity. Never a separate gray.          |
| Hairline on black   | `#FFFFFF` | At 12 to 20 percent opacity.                                 |

Three roles were changed by the client after extraction, and all three are
deliberate:

- The original Framer build used `#1F271B` as its dark section ground. That is
  now pure black, while `#1F271B` stays as the ink color on paper.
- The secondary surface was the brand sand `#EAE3D7`. The client asked for light
  grey on the tiles, so it is now `#EBEBEB`. Sand is no longer used anywhere.
- Paper was the warm off white `#F8F6F2`. The client asked for pure white as the
  light page ground, so `--paper` is `#FFFFFF`. Because paper doubles as the type
  color inside black bands, that type is now pure white as well.

## The Allplan MCP page

One page is an exception, by the brief written for it:
`/solutions/allplan-mcp` and its German counterpart. It brings back the two
values that were replaced above and adds the brand green as an accent.

| Role                  | Hex       | Notes                                              |
| --------------------- | --------- | -------------------------------------------------- |
| Page ground           | `#F8F6F2` | Concrete, the original warm off white.             |
| Body copy             | `#1F271B` | Ink, unchanged from the rest of the site.          |
| Section surface       | `#EAE3D7` | Sand, also the answer bubbles.                     |
| Accent                | `#384438` | Forest. Hairlines, icons, placeholder flag, model. |
| Buttons and questions | `#000000` | Black, unchanged.                                  |
| Highlight, drawings   | `#2B57A8` | Steel blue. See below.                             |

Steel blue is the one value on the site that is not in the palette above it. It
exists because the drawings on that page have to say two different things: green
is the model, blue is the element an answer highlights. It appears inside the
two SVGs and nowhere else, never as a link colour, a button or a surface. It
measures 6.2:1 on Concrete.

Everything on that page is set in Inter, weights 400, 500 and 600, with headings
tracked in by three percent. Space Grotesk does not appear on it.

The page scopes all of this under `main.mcp`, so none of it reaches the header,
the footer, the navigation, the consent banner or any other page. The rules
below are unchanged everywhere else.

## Rules

1. There is no accent hue. Emphasis comes from grey on paper and paper on
   black, never from an invented color.
2. All values are exposed as CSS custom properties in
   `assets/css/site.css` (`--paper`, `--ink`, `--mist`, `--void`). Reference
   those everywhere. No hardcoded one off colors.
3. Layout, typography, spacing and effects are free. These colors are locked.

## Typefaces

| Role                  | Family        | Source                                    |
| --------------------- | ------------- | ----------------------------------------- |
| Display and headings  | Space Grotesk | `Inter,Space_Grotesk/Space_Grotesk/`      |
| Labels, eyebrows, data| Space Grotesk | Small size, uppercase, wide tracking      |
| Body copy             | Inter         | `Inter,Space_Grotesk/Inter/`              |

Both are variable fonts, self hosted as WOFF2 from `assets/fonts/`.
The previous site used Inter for everything plus Chakra Petch for one accent;
Space Grotesk replaces that accent role and takes over display duty.
