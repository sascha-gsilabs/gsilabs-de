---
title: Baukosten KI
description: >-
  Baukosten KI estimates construction costs to DIN 276 and works out fees to HOAI.
  With a range and the derivation per item. Free to try for seven days.
# This page follows the briefing 261009_Briefing Landingpage gsilabs_V00 under
# assets/briefings/. Three rules from it that are easy to lose when editing:
#
#   1. The name is always "Baukosten KI", with a space, in English too. The
#      hyphen exists only in the domain. Never shorten it to "BK": that sits too
#      close to BKI, the competitor.
#   2. The claim "Die Zahl, die trägt." belongs on the closing band only, never
#      beside the name and never in the header. There is no English claim and
#      none may be invented, so it stays in German here and carries lang="de" so
#      a screen reader pronounces it.
#   3. The limits in "Where the application stops" are contractually binding
#      through the terms. Promise nothing beyond them: no breakdown below the
#      first level of DIN 276, no service profile other than buildings, no
#      regional factors below state level, no teams, no work on existing stock.
blocks:
  # The hero carries the name alone. There is no cleared product image, and the
  # right half of the illustrated hero would stand empty. The descriptive line is
  # the section right under it, set flush: it belongs where someone meets the
  # brand for the first time.
  - type: hero
    title: Baukosten KI

  - type: statement
    flushTop: true
    title: Cost estimates to DIN 276. Fees to HOAI.
    body: >-
      A cost figure before the design is settled, with a derivation you can follow. For
      design offices, architects and engineering practices.
    cta: { label: Try it free, href: "https://www.baukosten-ki.de/" }

  - type: definitions
    title: What the application does
    items:
      - label: Cost estimate
        body: >-
          A total to DIN 276, first level, with a range.
      - label: Derivation
        body: >-
          Per item the benchmark set, the benchmark per square meter, the regional
          factor, the index level and the edition of the benchmarks.
      - label: Fees
        body: >-
          Worked out to HOAI 2021 for the buildings service profile, across all service
          phases.
      - label: Description
        body: >-
          You describe the project in your own words. The application reads the building
          type, the standard and the size out of it.
      - label: Output
        body: >-
          PDF, Excel and ZIP, with your own office details in the header.
      - label: Languages
        body: German and English.

  - type: stages
    title: How you get to the figure
    layout: rows
    items:
      -
        title: Describe the project
        body: >-
          You write what it is about, in your own words. The application reads the input
          values out of it.
      -
        title: Estimate the cost
        body: >-
          You get a total to DIN 276 with a range, and the derivation per item alongside
          it.
      -
        title: Work out the fee
        body: >-
          The fee calculation to HOAI builds on that estimate. You export the result as
          PDF, Excel or ZIP.

  # On paper rather than black: the closing band below is the one dark band
  # on the page, as it is on every other page. Two dark bands in a row run
  # into each other.
  - type: definitions
    title: Where the application stops
    lede: >-
      So you know what is not in it before you try it.
    items:
      - label: DIN 276
        body: >-
          Benchmarks at the first level. No breakdown into KG 310, KG 320 and the rest.
      - label: HOAI
        body: >-
          The buildings service profile under § 34 only. No outdoor facilities, no
          interiors, no building services.
      - label: Regional factors
        body: >-
          At state level. Neither district nor municipal level.
      - label: Account
        body: >-
          One user per account. No team function.
      - label: Scope of work
        body: >-
          New build above ground. Work on existing stock is not in the benchmarks yet.

  - type: closer
    # The claim stays German: there is no English one and inventing a second
    # brand element is not this page's call to make.
    title: <span lang="de">Die Zahl, die trägt.</span>
    body: >-
      Seven days with everything above. The trial starts when you register, asks for no
      payment details and ends by itself. It does not roll into a paid contract.
    cta: { label: Try it free, href: "https://www.baukosten-ki.de/" }
    secondary: { label: support@baukosten-ki.de, href: "mailto:support@baukosten-ki.de" }
---
