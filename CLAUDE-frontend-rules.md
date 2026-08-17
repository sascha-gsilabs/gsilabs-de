# CLAUDE-frontend-rules.md

## Always Do First
- **Invoke the `frontend-design` skill** before writing any frontend code, every session, no exceptions.

## Reference Images
- If a reference image is provided: match layout, spacing, typography, and color exactly. Swap in placeholder content (images via `https://placehold.co/`, generic copy). Do not improve or add to the design.
- If no reference image: design from scratch with high craft (see guardrails below).
- Screenshot your output, compare against reference, fix mismatches, re-screenshot. Do at least 2 comparison rounds. Stop only when no visible differences remain or user says so.

## Local Server
- **Always serve on localhost** — never screenshot a `file:///` URL.
- Start the dev server: `node serve.mjs` (serves the project root at `http://localhost:3000`)
- `serve.mjs` lives in the project root. Start it in the background before taking any screenshots.
- If the server is already running, do not start a second instance.

## Screenshot Workflow
- Puppeteer is installed at `C:/Users/sascha.avermiddig.GBCVN/AppData/Local/Temp/puppeteer-test/`. Chrome cache is at `C:/Users/sascha.avermiddig.GBCVN/.cache/puppeteer/`.
- **Always screenshot from localhost:** `node screenshot.mjs http://localhost:3000`
- Screenshots are saved automatically to `./temporary screenshots/screenshot-N.png` (auto-incremented, never overwritten).
- Optional label suffix: `node screenshot.mjs http://localhost:3000 label` → saves as `screenshot-N-label.png`
- `screenshot.mjs` lives in the project root. Use it as-is.
- After screenshotting, read the PNG from `temporary screenshots/` with the Read tool — Claude can see and analyze the image directly.
- When comparing, be specific: "heading is 32px but reference shows ~24px", "card gap is 16px but should be 24px"
- Check: spacing/padding, font size/weight/line-height, colors (exact hex), alignment, border-radius, shadows, image sizing

## Output Defaults
- Single `index.html` file, all styles inline, unless user says otherwise
- Tailwind CSS via CDN: `<script src="https://cdn.tailwindcss.com"></script>`
- Placeholder images: `https://placehold.co/WIDTHxHEIGHT`
- Mobile-first responsive

## Brand Assets
- Always check the `brand_assets/` folder before designing. It may contain logos, color guides, style guides, or images.
- If assets exist there, use them. Do not use placeholders where real assets are available.
- If a logo is present, use it. If a color palette is defined, use those exact values — do not invent brand colors.

## Anti-Generic Guardrails
- **Colors:** Never use default Tailwind palette (indigo-500, blue-600, etc.). Pick a custom brand color and derive from it.
- **Shadows:** Never use flat `shadow-md`. Use layered, color-tinted shadows with low opacity.
- **Typography:** Never use the same font for headings and body. Pair a display/serif with a clean sans. Apply tight tracking (`-0.03em`) on large headings, generous line-height (`1.7`) on body.
- **Gradients:** Layer multiple radial gradients. Add grain/texture via SVG noise filter for depth.
- **Animations:** Only animate `transform` and `opacity`. Never `transition-all`. Use spring-style easing.
- **Interactive states:** Every clickable element needs hover, focus-visible, and active states. No exceptions.
- **Images:** Add a gradient overlay (`bg-gradient-to-t from-black/60`) and a color treatment layer with `mix-blend-multiply`.
- **Spacing:** Use intentional, consistent spacing tokens — not random Tailwind steps.
- **Depth:** Surfaces should have a layering system (base → elevated → floating), not all sit at the same z-plane.

## Hard Rules
- Do not add sections, features, or content not in the reference
- Do not "improve" a reference design — match it
- Do not stop after one screenshot pass
- Do not use `transition-all`
- Do not use default Tailwind blue/indigo as primary color

## Brand colors (mandatory)

Never invent or substitute a color palette. The site must use the client's real brand colors.

1. Source of truth, in this order:
   a. The client's existing website CSS — fetch the site, read its stylesheets,
      and extract the actual hex values (primary, secondary, accents,
      background, text).
   b. If there is no existing site or its CSS is unusable, extract the dominant
      colors from the client's logo in /brand_assets as hex.
   c. If neither yields a usable palette, STOP and ask me — do not guess.

2. Persist it: write the final palette to /brand_assets/brand.md as hex values
   with roles (primary / secondary / accent / background / text). If brand.md
   already exists, treat it as the source of truth and skip 1a–1b.

3. Apply consistently: define the palette as CSS custom properties
   (e.g. --color-primary) and reference those everywhere — buttons, links,
   headers, accents, backgrounds. No hardcoded one-off colors.

4. The frontend-design skill controls layout, typography, spacing and effects,
   but must NOT override these brand colors. Colors are locked to the client's
   palette; the skill styles everything else around them.

5. In your final summary, state which hex values you used and where they came
   from (CSS, logo, brand.md, or me).

   ## Theme

Default to a light theme unless I explicitly ask for dark:
- Background: white or near-white (#ffffff or a very light neutral).
- Body text: dark / near-black for strong contrast and readability.
- Use the brand colors as accents only (buttons, links, highlights, section
  dividers), never as the full-page background.
- Ensure strong, WCAG-level contrast between text and background.

## Copy style
- Never use dashes as punctuation in copy (no em dash, en dash, or " - ").
  Use commas, periods, or colons instead. Hyphens are allowed only inside real
  compound words.

  ## Git workflow
- Commit changes locally with clear, descriptive commit messages whenever you complete a meaningful change.
- NEVER run `git push` on your own. Only push to GitHub when I explicitly tell you to (e.g. "push to GitHub", "push this"). Until then, all work stays in local commits only.

## Site structure
- Always preserve the site structure of the original reference website I provide. Mirror its page hierarchy, navigation, and the set of pages/sections one to one.
- Do not add, remove, merge, or rename pages/sections unless I explicitly ask for it. The rebuild should match the original's structure; only the design, styling, and copy are being updated.