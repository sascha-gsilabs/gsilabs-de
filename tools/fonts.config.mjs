// Which characters the shipped typefaces are cut down to.
//
// The supplied variable fonts carry every script their designers drew. Inter
// alone covers 2849 characters, of which this site uses 89: the rest is Greek,
// Cyrillic, Vietnamese, phonetics and a few thousand accent combinations no
// visitor will ever see, downloaded on every first visit before the first line
// of text can be painted.
//
// The cut is not made at the 89 characters the content happens to use today. A
// Polish surname in a job ad or a French client name would then have no glyph
// and the browser would drop to a system font mid word. It is made one block
// wider than the languages this site is written in.
//
// Measured on Inter, which is the expensive one of the two:
//
//   2849 chars   352 KB   as supplied
//   1525 chars   192 KB   latin + latin-ext, the full Google Fonts pair
//    903 chars   183 KB   ... without phonetics and Latin Extended C and D
//    586 chars   128 KB   ... and with Vietnamese instead of Extended-B
//    472 chars   106 KB   latin + Latin Extended-A          <- what we ship
//    342 chars    96 KB   latin only
//
// Latin Extended-A costs 10 KB and buys Polish, Czech, Slovak, Hungarian,
// Romanian, Croatian, Turkish, Baltic and the Nordic languages. Everything
// above it costs more and buys scripts nobody writes here: Extended-B is
// African and phonetic Latin, and Vietnamese would be 22 KB for text that does
// not exist on the site. The Vietnam office is written "Ho Chi Minh City" and
// "Ho-Chi-Minh-Stadt", both plain ASCII, in English and in German.
//
// If Vietnamese copy ever appears, add [0x1ea0, 0x1ef9] and [0x01a0, 0x01b0]
// below and rerun `npm run build:assets`. tools/build-site.mjs will say so
// first: it warns about any character in the content this list cannot draw.

/* Ranges follow Google Fonts' own `latin` declaration, plus Latin Extended-A.
   Kept in their published form rather than simplified, so they can be diffed
   against the source if Google revises them. */
const RANGES = [
  // latin
  [0x0020, 0x00ff], [0x0131, 0x0131], [0x0152, 0x0153],
  [0x02bb, 0x02bc], [0x02c6, 0x02c6], [0x02da, 0x02da], [0x02dc, 0x02dc],
  [0x2000, 0x206f], [0x2074, 0x2074], [0x20ac, 0x20ac], [0x2122, 0x2122],
  [0x2191, 0x2191], [0x2193, 0x2193], [0x2212, 0x2212], [0x2215, 0x2215],
  [0xfffd, 0xfffd],
  // Latin Extended-A
  [0x0100, 0x017f],
]

/** Whether a character survives the subset. */
export const covers = (char) => {
  const code = char.codePointAt(0)
  return RANGES.some(([from, to]) => code >= from && code <= to)
}

/** Every character in the subset, as the string the subsetter takes. */
export function characters() {
  const out = []
  for (const [from, to] of RANGES) for (let c = from; c <= to; c++) out.push(String.fromCodePoint(c))
  return out.join('')
}
