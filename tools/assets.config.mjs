// Every media file the site actually ships, and the size it ships at.
//
// `from` is either a bare slugified name inside .staging/img (produced by
// tools/stage-assets.mjs from the client's "brand assets" folder), or a path
// relative to the project root, used for the per article and per project
// content folders the client drops in.
// `w` is the intrinsic width to encode, roughly twice the largest CSS width the
// image is displayed at, so it stays sharp on 2x screens without paying for the
// 6000px originals.
export const images = [
  // Homepage
  { from: 'ricardo-gomez-angel-syk-jn0skby-unsplash.jpg', to: 'tunnel-in-service.webp', w: 1200 },

  // Client wordmarks. Encoded lossless: they are flat colour on transparency,
  // where lossy WebP leaves visible fringing around the letterforms.
  { from: 'logo-schoeck-de-2021-rgb.png', to: 'client-schoeck.webp', w: 340, lossless: true },
  { from: 'logo-allplan-company-negativ.png', to: 'client-allplan.webp', w: 320, lossless: true },

  // Homepage news cards, from the client's article and project folders.
  {
    from: 'articles/260611 Yuyang Peng timber moisture monitoring study/Marketing_GSI_Architectural_interior_of_a_timber_roof_truss_a_d04044f1-8d1d-42ef-a581-629a77ee2b7e_3.png',
    to: 'news-building-health.webp',
    w: 900,
  },
  {
    from: 'articles/260527 Yuyang Peng Robotics Potential Germany/Marketing_GSI_Sleek_white_humanoid_robot_standing_confidently_7303e5eb-6079-494f-af29-5914ec8a527c_0.png',
    to: 'news-humanoid-robots.webp',
    w: 900,
  },
  // The project folder holds two images. The other one,
  // G9ZkBXwgHBkBiUJn8rF7dfC2EtE.avif, is the full Allplan window including
  // toolbars, which is what the Framer site used. At card size the 16/11 crop
  // cuts through that UI chrome, so the clean model view is used instead.
  {
    from: 'reference-projects/260430 From BIM Objects to Intelligent Placement Workflows/7siMS93CLeMZYFNkWWM8chMUFg.webp',
    to: 'news-placement-workflows.webp',
    w: 900,
  },

  // Icons and social. JPEG, because social scrapers are less reliable with WebP.
  { from: 'gsi-labs-social-preview.jpg', to: 'social-preview.jpg', w: 1200 },
  { from: 'gsi-labs-apple-touch-icon.png', to: 'apple-touch-icon.png', w: 180 },
]

// Vector marks are copied through untouched, only renamed.
export const logos = [
  { from: '260506-gsilabs-logo-day-rev04.svg', to: 'logo-day.svg' },
  { from: '260506-gsilabs-logo-night-rev04.svg', to: 'logo-night.svg' },
  { from: '260506-gsilabs-icon-day-rev04.svg', to: 'icon-day.svg' },
  { from: '260506-gsilabs-icon-night-rev04.svg', to: 'icon-night.svg' },
]

// Source video for the hero, taken straight from the client's folder.
export const video = {
  from: 'brand assets/website videos/gsilabs intro banner video Rev07.mp4',
  to: 'assets/video/hero.mp4',
  poster: 'assets/img/hero-poster.webp',
  width: 1600,
  crf: 27,
}
