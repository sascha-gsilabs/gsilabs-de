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
| Background (paper)  | `#F8F6F2` | Warm off white. Default page ground.                        |
| Text (ink)          | `#1F271B` | Deep olive black. All body copy and headings on paper.       |
| Secondary surface   | `#EBEBEB` | Light grey. Cards, insets and quiet panels on paper.        |
| Dark section ground | `#000000` | Pure black. Chosen by the client for all inverted sections.  |
| Text on dark        | `#F8F6F2` | Paper doubles as the type color inside black sections.       |
| Hairline on paper   | `#1F271B` | At 12 to 20 percent opacity. Never a separate gray.          |
| Hairline on black   | `#F8F6F2` | At 12 to 20 percent opacity.                                 |
| Pure white          | `#FFFFFF` | Reserved for logo marks and image mattes only.               |

Two roles were changed by the client after extraction, and both are deliberate:

- The original Framer build used `#1F271B` as its dark section ground. That is
  now pure black, while `#1F271B` stays as the ink color on paper.
- The secondary surface was the brand sand `#EAE3D7`. The client asked for light
  grey on the tiles, so it is now `#EBEBEB`. Sand is no longer used anywhere.

## Rules

1. There is no accent hue. Emphasis comes from sand on paper and paper on
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
