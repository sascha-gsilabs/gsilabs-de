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
  // Six of twelve columns since the client asked for it wider, so about 760 CSS
  // px on a full width viewport. 1500 keeps it at 2x there.
  { from: 'ricardo-gomez-angel-syk-jn0skby-unsplash.jpg', to: 'tunnel-in-service.webp', w: 1500 },

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
  // Insight covers keep their own two size naming, so only the source moved to
  // the file the client named for this story.
  { from: 'our-contribution-to-great-spaces-top.avif', to: 'cover-great-spaces.webp', w: 1600 },
  { from: 'our-contribution-to-great-spaces-top.avif', to: 'news-great-spaces.webp', w: 900 },

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

  // Page media the client named after the page it belongs on, with "top" for the
  // hero and "bottom" for the wide band further down. The shipped name repeats
  // that, so which image belongs where is checkable against the folder rather
  // than remembered. The remaining entries below still carry names of mine, for
  // the pages the client has not renamed a file for.
  { from: 'about-us-top.avif', to: 'about-us-top.webp', w: 1400 },
  // The square images beside the copy on the Company pages, and the three that
  // sit next to the process steps. All half the content width, so 1300 at 2x.
  // Pulled from the live site: the client's folder has none of them.
  { from: 'about-us-side.jpg', to: 'about-us-side.webp', w: 1300 },
  { from: 'imprint-office.jpg', to: 'imprint-office.webp', w: 1300 },
  { from: 'careers-team.jpg', to: 'careers-team.webp', w: 1300 },
  { from: 'careers-roles.jpg', to: 'careers-roles.webp', w: 700 },
  { from: 'our-process-understand.jpg', to: 'our-process-understand.webp', w: 1300 },
  { from: 'our-process-build.jpg', to: 'our-process-build.webp', w: 1300 },
  { from: 'our-process-deploy.jpg', to: 'our-process-deploy.webp', w: 1300 },
  // The client picked this one over the careers-top file they first supplied.
  { from: 'gsilabs-careers.jpg', to: 'careers-top.webp', w: 1400 },
  { from: 'our-process-top.jpg', to: 'our-process-top.webp', w: 1400 },
  { from: 'ai-workshop-top.avif', to: 'ai-workshop-top.webp', w: 1400 },
  { from: 'dedicated-dev-team-top.avif', to: 'dedicated-dev-team-top.webp', w: 1400 },
  { from: 'robotics-feasibility-study-bottom.jpg', to: 'robotics-feasibility-study-bottom.webp', w: 1600 },
  { from: 'geo-engineers-top.avif', to: 'geo-engineers-top.webp', w: 1400 },
  { from: 'precast-manufacturers-top.avif', to: 'precast-manufacturers-top.webp', w: 1400 },
  // Get Started. Sits in half the content width beside the form, so about 650
  // CSS px at the widest. 1300 keeps it at 2x there. Pulled from the live site:
  // the client's folder has no copy of it.
  { from: 'get-started-workshop.jpg', to: 'get-started-workshop.webp', w: 1300 },
  // The square image beside the metrics on each solution page. Half the content
  // width, about 650 CSS px, so 1300 keeps it at 2x. The client's folder has the
  // first three, at 1024 across, which the encoder will not upscale: those ship
  // softer than the rest. The other three were pulled from the live site.
  { from: 'general-contractors-bottom.avif', to: 'general-contractors-bottom.webp', w: 1300 },
  { from: 'geo-engineers-bottom.avif', to: 'geo-engineers-bottom.webp', w: 1300 },
  { from: 'planning-design-offices-bottom.avif', to: 'planning-design-offices-bottom.webp', w: 1300 },
  { from: 'precast-manufacturers-bottom.jpg', to: 'precast-manufacturers-bottom.webp', w: 1300 },
  { from: 'product-manufacturers-bottom.jpg', to: 'product-manufacturers-bottom.webp', w: 1300 },
  { from: 'real-estate-developers-bottom.jpg', to: 'real-estate-developers-bottom.webp', w: 1300 },

  // Solution page media still on names of mine.
  { from: 'gsilabs-sentinel.jpg', to: 'sol-contractors-hero.webp', w: 1400 },
  { from: 'gsilabs-solutions-for-general-contractors.jpg', to: 'sol-contractors-site.webp', w: 1200 },
  { from: 'evgeniy-surzhan-vfmhqkil6e4-unsplash.jpg', to: 'sol-design-hero.webp', w: 1400 },
  { from: 'gsilabs-3d-product-configurator.jpg', to: 'sol-product-hero.webp', w: 1400 },
  { from: 'gsilabs-ai-cost-prediction-real-estate.jpg', to: 'sol-realestate-hero.webp', w: 1400 },

  // The click through panels on the six solution pages. The client supplied one
  // image per tab, named after the tab, so the output name is the tab slug and
  // the mapping needs no lookup table. Tab labels are unique across all six
  // pages, so one flat namespace is enough.
  //
  // They arrive in mixed orientations, from 2:3 portrait to 19:10. The panel
  // frame is a fixed 3 by 2 that every image fills, so the band does not jump as
  // you click through and no image reads as smaller than its neighbours. 1200 is
  // the ceiling rather than the target: the encoder never upscales, and most of
  // these are 1024 at source.
  //
  // `trim: true` is on the five that arrive on a white sheet with the subject
  // floating in the middle. Without it they fill the frame with their own
  // margins and the subject ends up visibly smaller than on the other panels.
  // The book cover is the extreme case, with about a fifth of the file blank on
  // every side.
  { from: 'risk-detection.avif', to: 'tab-risk-detection.webp', w: 1200 },
  { from: 'decision-support.avif', to: 'tab-decision-support.webp', w: 1200, trim: true },
  { from: 'portfolio-memory.avif', to: 'tab-portfolio-memory.webp', w: 1200, trim: true },

  { from: 'soil-modeling.avif', to: 'tab-soil-modeling.webp', w: 1200 },
  { from: 'design-optimization.avif', to: 'tab-design-optimization.webp', w: 1200 },
  { from: 'co2-reduction.webp', to: 'tab-co2-reduction.webp', w: 1200 },
  { from: 'code-compliance.webp', to: 'tab-code-compliance.webp', w: 1200, trim: true },

  { from: 'workflow-analysis.avif', to: 'tab-workflow-analysis.webp', w: 1200 },
  { from: 'plugin-development.avif', to: 'tab-plugin-development.webp', w: 1200 },
  { from: 'standards-compliance.avif', to: 'tab-standards-compliance.webp', w: 1200 },
  // The source file spells it "continous".
  { from: 'continous-updates.avif', to: 'tab-continuous-updates.webp', w: 1200 },

  { from: 'project-modularization.avif', to: 'tab-project-modularization.webp', w: 1200 },
  { from: 'drawing-automation.webp', to: 'tab-drawing-automation.webp', w: 1200, trim: true },
  { from: 'machine-file-export.webp', to: 'tab-machine-file-export.webp', w: 1200 },
  { from: 'production-rules.webp', to: 'tab-production-rules.webp', w: 1200 },

  { from: '3d-configurator.avif', to: 'tab-3d-configurator.webp', w: 1200 },
  { from: 'bim-implementation.webp', to: 'tab-bim-implementation.webp', w: 1200 },
  { from: 'ai-assistant.webp', to: 'tab-ai-assistant.webp', w: 1200 },
  { from: 'analytics-insights.webp', to: 'tab-analytics-insights.webp', w: 1200, trim: true },

  { from: 'data-collection.avif', to: 'tab-data-collection.webp', w: 1200 },
  { from: 'cost-estimation.avif', to: 'tab-cost-estimation.webp', w: 1200 },
  { from: 'risk-analysis.avif', to: 'tab-risk-analysis.webp', w: 1200 },
  { from: 'monitoring-recalibration.webp', to: 'tab-monitoring-recalibration.webp', w: 1200 },

  // Service pages. The workshop, dev team and robotics media are in the block
  // above, under the client's own names.
  { from: 'robot-dog-construction-site.jpg', to: 'svc-robotics-hero.webp', w: 1400 },

  // Company pages.
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
