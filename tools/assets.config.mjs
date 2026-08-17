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

  // Insight covers. Wider than the card versions above, since a cover runs the
  // full content width.
  {
    from: 'articles/260611 Yuyang Peng timber moisture monitoring study/Marketing_GSI_Architectural_interior_of_a_timber_roof_truss_a_d04044f1-8d1d-42ef-a581-629a77ee2b7e_3.png',
    to: 'cover-building-health.webp',
    w: 1600,
  },
  {
    from: 'articles/260527 Yuyang Peng Robotics Potential Germany/Marketing_GSI_Sleek_white_humanoid_robot_standing_confidently_7303e5eb-6079-494f-af29-5914ec8a527c_0.png',
    to: 'cover-humanoid-robots.webp',
    w: 1600,
  },
  {
    from: 'reference-projects/260430 From BIM Objects to Intelligent Placement Workflows/7siMS93CLeMZYFNkWWM8chMUFg.webp',
    to: 'cover-placement-workflows.webp',
    w: 1600,
  },
  { from: '5d6f97d416986458acfce7a0-betahaus-shipka-sofia.jpg', to: 'cover-great-spaces.webp', w: 1600 },
  { from: '5d6f97d416986458acfce7a0-betahaus-shipka-sofia.jpg', to: 'news-great-spaces.webp', w: 900 },

  // Figures inside the articles.
  {
    from: 'articles/260611 Yuyang Peng timber moisture monitoring study/c14fde45-4b30-479c-83a4-9baa3ea75901.jpg',
    to: 'fig-timber-sensor.webp',
    w: 1100,
  },
  {
    from: 'articles/260611 Yuyang Peng timber moisture monitoring study/Capture.JPG',
    to: 'fig-timber-static-model.webp',
    w: 1000,
    lossless: true,
  },
  {
    from: 'articles/260611 Yuyang Peng timber moisture monitoring study/Capture 2.JPG',
    to: 'fig-timber-arx-model.webp',
    w: 1000,
    lossless: true,
  },
  {
    from: 'articles/260611 Yuyang Peng timber moisture monitoring study/Capture3.JPG',
    to: 'fig-timber-arx-fit.webp',
    w: 1400,
  },
  {
    from: 'articles/260527 Yuyang Peng Robotics Potential Germany/260522 yuyang peng german robotics market analysis.jpg',
    to: 'fig-robotics-market.webp',
    w: 1200,
  },
  {
    from: 'reference-projects/260430 From BIM Objects to Intelligent Placement Workflows/G9ZkBXwgHBkBiUJn8rF7dfC2EtE.avif',
    to: 'fig-peikko-allplan-window.webp',
    w: 1400,
  },

  // Solution pages: hero media and feature panels.
  { from: 'gsilabs-sentinel.jpg', to: 'sol-contractors-hero.webp', w: 1400 },
  { from: 'gsilabs-solutions-for-general-contractors.jpg', to: 'sol-contractors-site.webp', w: 1200 },
  { from: 'gsilabs-sentinel-risk-detection.jpg', to: 'sol-sentinel-risk.webp', w: 1200 },
  { from: 'gsilabs-sentinel-decision-support.jpg', to: 'sol-sentinel-support.webp', w: 1200 },
  { from: 'gsilabs-sentinel-decision-memory.jpg', to: 'sol-sentinel-memory.webp', w: 1200 },

  { from: 'evgeniy-surzhan-vfmhqkil6e4-unsplash.jpg', to: 'sol-design-hero.webp', w: 1400 },
  { from: 'dashboard-overview-kopie-rev01-1024x654.png', to: 'sol-design-dashboard.webp', w: 1024 },
  { from: 'plans.png', to: 'sol-design-plans.webp', w: 1200 },

  { from: 'scott-blake-x-ghf9ljrvg-unsplash.jpg', to: 'sol-geo-hero.webp', w: 1400 },
  { from: 'geojango-maps-z8ugb80-46w-unsplash.jpg', to: 'sol-geo-map.webp', w: 1200 },

  { from: 'gsilabs-stack-of-reinforced-concrete-slabs-in-a-factory-workshop.jpg', to: 'sol-precast-hero.webp', w: 1400 },
  { from: 'csm-structural-precast-parametric-staircase-planning-e340f5de20.jpg', to: 'sol-precast-staircase.webp', w: 1200 },

  { from: 'gsilabs-3d-product-configurator.jpg', to: 'sol-product-hero.webp', w: 1400 },
  { from: 'gsilabs-ai-product-assistant.png', to: 'sol-product-assistant.webp', w: 1200 },

  { from: 'gsilabs-ai-cost-prediction-real-estate.jpg', to: 'sol-realestate-hero.webp', w: 1400 },
  { from: 'gsilabs-ai-cost-prediction.jpg', to: 'sol-realestate-forecast.webp', w: 1200 },

  // Service pages.
  { from: 'kvalifik-5q07ss54d0q-unsplash.jpg', to: 'svc-workshop-hero.webp', w: 1400 },
  { from: 'robot-dog-construction-site.jpg', to: 'svc-robotics-hero.webp', w: 1400 },
  { from: 'unitree-g1-169-png.png', to: 'svc-robotics-unit.webp', w: 1200 },
  { from: 'thisisengineering-veomkbduizs-unsplash.jpg', to: 'svc-team-hero.webp', w: 1400 },

  // Company pages.
  { from: 'gsilabs-careers.jpg', to: 'careers-hero.webp', w: 1400 },
  { from: 'sascha-gsilabs.jpg', to: 'team-sascha.webp', w: 640 },
  { from: 'daniel-gsilabs.jpg', to: 'team-daniel.webp', w: 640 },
  { from: 'adrian-gsilabs.jpg', to: 'team-adrian.webp', w: 640 },

  // Client wordmarks used on the reference row.
  { from: 'allplan-logo.png', to: 'client-allplan-dark.webp', w: 320, lossless: true },
  { from: 'peikko-logo.jpg', to: 'client-peikko.webp', w: 320 },
  { from: 'mevaco.png', to: 'client-mevaco.webp', w: 320, lossless: true },
  { from: 'alwitra.png', to: 'client-alwitra.webp', w: 320, lossless: true },

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
