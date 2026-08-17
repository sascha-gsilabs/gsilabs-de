// Every media file the site actually ships, and the size it ships at.
//
// `from` is a slugified name inside .staging/img (produced by
// tools/stage-assets.mjs from the client's "brand assets" folder).
// `w` is the intrinsic width to encode, roughly twice the largest CSS width the
// image is displayed at, so it stays sharp on 2x screens without paying for the
// 6000px originals.
export const images = [
  // Homepage
  { from: 'ricardo-gomez-angel-syk-jn0skby-unsplash.jpg', to: 'tunnel-in-service.webp', w: 1200 },
  { from: '5d6f97d416986458acfce7a0-betahaus-shipka-sofia.jpg', to: 'news-building-health.webp', w: 900 },
  { from: 'robot-humanoid-construction-site-2.jpg', to: 'news-humanoid-robots.webp', w: 900 },
  { from: 'csm-structural-precast-parametric-staircase-planning-e340f5de20.jpg', to: 'news-placement-workflows.webp', w: 900 },
  { from: 'gsilabs-reference-allplan.jpg', to: 'portrait-cristian-panturoiu.webp', w: 160 },
  { from: 'logo-schoeck-de-2021-rgb.png', to: 'client-schoeck.webp', w: 340 },

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
