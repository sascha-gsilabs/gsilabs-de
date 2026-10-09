---
title: Piledesigner
description: >-
  Piledesigner is software we built. This page shows what is behind it and the projects
  it has calculated. The software itself runs on piledesigner.io.
# Based on assets/briefings/briefing-piledesigner-fuer-gsilabs.md. Four things
# from it that are easy to lose when editing:
#
#   1. SPELLING. The briefing asks for "piledesigner.io", lower case, even at the
#      start of a sentence. The client decided on "Piledesigner" on 2026-10-09.
#      That is a deliberate departure rather than an oversight, and it applies to
#      the product name. Where the website is meant it stays piledesigner.io,
#      because that is the address.
#
#   2. SEARCH. piledesigner.io already ranks and is the page that should rank.
#      This one must not take visibility off it. So the title and the description
#      aim at the portfolio intent rather than at "pile design software". No
#      canonical to piledesigner.io, the link to it without nofollow, and no
#      passages copied from there.
#
#   3. THE ONE CLAIM. If the page carries a single thing, it is this: every pile
#      is designed on its own loads rather than grouped under the governing one.
#      The whole commercial argument hangs off that.
#
#   4. WHAT IS DELIBERATELY MISSING. The photographs of the three reference
#      projects belong to JACBO, Aarsleff and Kölnmesse, and the rights for this
#      context are not settled. Daniel Bacon's quote and portrait are not cleared
#      for this new context. The year of the Nuremberg airport project is not on
#      record, so none is given. The claim "several tens of thousands of piles a
#      year" has not been checked for currency and is therefore absent. Prices
#      are not here: they are on piledesigner.io, where they do not go stale.
blocks:
  - type: hero
    title: Piledesigner
    lede: >-
      Pile design software that runs in the browser. It calculates to EA-Pfähle and
      DIN 1054 and produces documentation as a PDF, ready for review.
    cta: { label: Go to piledesigner.io, href: "https://piledesigner.io" }
    image:
      ratio: 1296 / 886
      src: /assets/img/piledesigner-hero.webp
      alt: >-
        A building model on its pile foundation, beside a soil profile with the
        resistance diagram and the table of pile resistances over depth
      width: 1296
      height: 886

  - type: statement
    title: Design a group, and every pile is built as strong as the one carrying the most.
    body:
      - >-
        Conventional software designs to the governing load of a whole group. It holds,
        and it costs: every pile with less to carry goes into the ground with surplus
        concrete, steel, drilling metres and CO₂.
      - >-
        Piledesigner calculates each pile on its own vertical and horizontal loads,
        automatically, across several thousand piles in a project. The method and the
        calculation core come from the engineering practice of Dr.-Ing. Ingo Hylla, a
        foundation engineer working in specialist foundation design.
    points:
      - Designed per pile rather than per group
      - Vertical and horizontal forces in one calculation
      - Entirely in the browser, nothing to install

  - type: definitions
    title: What the software calculates
    items:
      - label: Load cases
        body: >-
          Several load cases held and calculated at once.
      - label: Soil profiles
        body: >-
          Layers, groundwater level and friction angle per project, in the browser.
      - label: Capacity
        body: >-
          External and internal capacity under every relevant load, with skin friction,
          base resistance and settlement. The pile length is optimised along the way.
      - label: Reinforcement
        body: >-
          The longitudinal and shear reinforcement each pile needs, from the load that
          pile actually carries.

  - type: stages
    title: From the soil profile to the verification
    layout: rows
    items:
      - title: Set the calculation up
        body: >-
          Choose the standard, EA-Pfähle or DIN 1054, and fix the partial safety factors.
      - title: Enter the soil profiles
        body: >-
          Layers, groundwater level and friction angle.
      - title: Determine the external capacity
        body: >-
          Place piles under the load points and choose type, spacing and diameter. Skin
          friction, base resistance and settlement are calculated for you.
      - title: Check the internal capacity
        body: >-
          Optional, with the reinforcement each pile needs.

  # On paper rather than black: the closing band below is the one dark band on
  # the page. Two dark bands in a row run into each other.
  - type: pillars
    tone: paper
    title: Calculated for these projects
    items:
      - title: Nuremberg Airport
        body:
          - >-
            A new multi storey car park, built by JACBO Pfahlgründungen.
          - >-
            565 bored piles, Ø 60 cm, up to 10 m long. Vertical load up to 2,5 MN per
            column, 1,7 MN on average. About five weeks on site, up to 25 piles per day
            per rig.
      - title: MOJO solar project
        body:
          - >-
            Flevoland, the Netherlands, 2021, built by Aarsleff Grundbau.
          - >-
            Around 2.800 precast piles, 45 × 45 cm, 45 × 67 cm at the head, 5 m long. The
            piles are foundation and mounting base at once, for a photovoltaic carport
            system.
      - title: Koelnmesse, Hall 1plus
        body:
          - >-
            Cologne, 2018 to 2019. Client Kölnmesse GmbH, built by JACBO
            Pfahlgründungen.
          - >-
            400 bored piles, 241 at Ø 70 cm and 159 at Ø 80 cm, down to 17,5 m. Vertical
            load 2,7 MN on average, 3,6 MN at most.

  - type: closer
    title: Thirty days free, no credit card.
    body: >-
      Piledesigner runs in the browser, with nothing to install. Prices, references and
      registration are on piledesigner.io.
    cta: { label: Go to piledesigner.io, href: "https://piledesigner.io" }
    secondary: { label: Book a demo, href: "https://piledesigner.io/kontakt/" }
---
