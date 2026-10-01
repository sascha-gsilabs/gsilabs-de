---
title: Allplan MCP
description: >-
  Allplan MCP connects Allplan to an MCP capable AI assistant. Ask about the model you
  have open, read and write attributes. The model stays on your workstation.
# This page carries its own palette and sets everything in Inter, scoped under
# `main.mcp` in assets/css/site.css. Its seven section types live in
# templates/allplan-mcp.mjs and are used by nothing else.
pageClass: mcp
blocks:
  - type: mcpHero
    title: ALLPLAN MCP
    lede: >-
      Talk to Allplan in your own words. It reads the model you have open, provides
      answers, highlights elements and adjusts attributes where necessary.
    cta: { label: See pricing, href: "#pricing" }
    link: { label: See how it works, href: "#how-it-works" }
    video:
      id: "1231988991"
      # The ratio the embed code ships with, 52.24% padding, so the frame holds
      # its place before the poster has loaded and keeps it when the player
      # takes over.
      ratio: 1600 / 834
      title: Allplan MCP
      params: badge=0&autopause=0&player_id=0&app_id=58479
      action: Play the video
      note: Vimeo loads only once you start it.
      poster:
        src: /assets/img/allplan-mcp-poster-en.webp
        width: 1600
        height: 834
        alt: The opening frame of the Allplan MCP video.

  - type: mcpProblem
    title: Common challenges
    lines:
      - >-
        Slow attribute checks, because the model has to be exported, searched column by
        column in a spreadsheet for outliers, and then written back.
      - >-
        Hard element searches, because finding a particular one means going through export
        lists or looking by hand.
      - >-
        Checks by eye alone, because some of them cannot be done any other way today,
        room by room.

  - type: mcpSteps
    id: how-it-works
    title: How it works
    steps:
      - You ask in plain language.
      - The assistant decides what to look up.
      - Allplan MCP reads or writes in the open model.
      - >-
        You see the answer and the elements it means, highlighted in the drawing.
    note: >-
      The model stays on your workstation. Nothing is exported and no second copy is
      created.
    art:
      assistant: AI assistant
      bridge: Allplan MCP
      model: Open model
      boundary: Your workstation
      alt: >-
        Isometric diagram of three plinths. The AI assistant stands on the left, outside
        a dashed outline. Allplan MCP and the open model stand inside it, on your
        workstation. A double headed arrow runs between the assistant and Allplan MCP,
        and a second one between Allplan MCP and the model, where one of three elements
        is highlighted in blue.

  - type: mcpExamples
    title: What you can ask
    items:
      - q: Which panels are missing a concrete grade?
        a: Nine of thirty-six. Highlighted in the drawing.
      - q: Are all the concrete grades valid?
        a: Two panels read C34/45, which is not a grade in EN 1992.
      - q: Which of these panels is the heaviest?
        a: >-
          4.84 m³, about 12.1 t. The lightest panel with the same outside dimensions
          weighs 7.5 t.
      - q: Set the concrete grade on those nine panels to C30/37.
        a: >-
          Nine elements updated. The field was empty before. You can undo it in the same
          session.

  - type: mcpOperations
    title: The six operations
    items:
      - icon: find
        title: Find elements
        body: Search by position number, layer, attribute value, or element type.
      - icon: read
        title: Read attributes
        body: Every value held on an element.
      - icon: write
        title: Write attributes
        body: Set, change, or clear values.
      - icon: geometry
        title: Read geometry
        body: Dimensions, volume, surface area, center of gravity.
      - icon: zoom
        title: Zoom to element
        body: Bring elements into view in every open window.
      - icon: highlight
        title: Highlight
        body: Mark elements in the drawing so the selection is visible.
    note: >-
      Connection and session tools come with it. Check the connection, list what a
      session did, and undo it.

  - type: mcpPricing
    id: pricing
    title: Pricing
    tiers:
      - name: Lite
        lead: true
        price: EUR 99
        unit: per user per year, excluding VAT
        body: The six operations above.
        cta: { label: Request a license, form: license }
      - name: Pro
        body: >-
          Everything in Lite, plus drawing generation, 3D modeling and reinforcement as
          they become available.
        cta: { label: Join the waitlist, form: waitlist }
      - name: Custom
        body: Tailored to your workflows and standards.
        cta: { label: Contact sales, href: /get-started }
    note: >-
      Allplan 2025 or 2026, and a subscription with any MCP capable AI assistant, for
      example Claude or ChatGPT. Delivery is an installer plus a license key. Setup takes
      a few minutes and needs no server.

  - type: mcpLicense
    id: license
    title: Try it on your own model.
    body:
      - >-
        Send us the version of Allplan you run and how many people would use it. We
        reply with a license key and the installer.
    note: We reply within one working day.
    cta: { label: Request a license, form: license }
    # Shown in place of the button if that link is ever missing, so the closing
    # band still leaves a way to answer.
    fallback: Write to {email} and you reach the same people.
---
