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
    eyebrow: Allplan MCP
    title: Ask the model.
    lede: >-
      Talk to Allplan in your own words. It reads the model you have open, provides
      answers, highlights elements and adjusts attributes where necessary.
    cta: { label: See pricing, href: "#pricing" }
    link: { label: See how it works, href: "#how-it-works" }
    chat:
      question: Which panel is the heaviest?
      answer: Panel 04. 4.84 m³, about 12.1 t.
    art:
      marker: Panel 04
      alt: >-
        Isometric drawing of seven precast wall panels set out in an L. Six are drawn in
        green, the fourth panel in the long row is drawn in blue and labelled panel 04,
        which is the answer to the question above the drawing.

  - type: mcpProblem
    title: The problem
    eyebrow: Attribute maintenance
    lines:
      - >-
        A panel can look finished in the viewport and still be missing the field
        production reads.
      - Nothing is broken, so nothing warns you.
      - >-
        At ten thousand elements, checking that by hand is not a task anyone finishes.

  - type: mcpSteps
    id: how-it-works
    title: How it works
    eyebrow: Four steps
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
    eyebrow: Three examples
    items:
      - q: Which panels are missing a concrete grade?
        a: Nine of thirty-six. Highlighted in the drawing.
      - q: Are all the concrete grades valid?
        a: Two panels read C34/45, which is not a grade in EN 1992.
      - q: Which of these panels is the heaviest?
        a: >-
          4.84 m³, about 12.1 t. The lightest panel with the same outside dimensions
          weighs 7.5 t.

  - type: mcpOperations
    title: The six operations
    eyebrow: What is in Lite
    items:
      - icon: find
        title: Find elements
        body: Search by position number, layer, attribute value or element type.
      - icon: read
        title: Read attributes
        body: Every value held on an element.
      - icon: write
        title: Write attributes
        body: Set, change or clear values.
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
      session did and undo it.

  - type: mcpPricing
    id: pricing
    title: Pricing
    eyebrow: Three tiers
    tiers:
      - name: Lite
        lead: true
        price: EUR 99
        unit: per user per year, excluding VAT
        body: The six operations above.
        cta: { label: Request a licence, href: "#licence" }
      - name: Pro
        body: >-
          Everything in Lite, plus drawing generation, 3D modeling and reinforcement as
          they become available.
        cta: { label: Join the waitlist, href: "#waitlist" }
      - name: Custom
        body: Tailored to your workflows and standards.
        cta: { label: Contact sales, href: /get-started }
    waitlist:
      id: waitlist
      form: waitlist
      label: Placeholder
      title: Join the waitlist
      body: >-
        The waitlist form belongs here. Until it is connected, write to {email} and we
        put you on the list.
    note: >-
      Allplan 2025 or 2026, and a subscription with any MCP capable AI assistant, for
      example Claude or ChatGPT. Delivery is an installer plus a licence key. Setup takes
      a few minutes and needs no server.

  - type: mcpLicence
    id: licence
    eyebrow: Request a licence
    title: Try it on your own model.
    body:
      - >-
        Send us the version of Allplan you run and how many people would use it. We
        reply with a licence key and the installer.
    note: We reply within one working day.
    slot:
      form: licence
      label: Placeholder
      title: Request a licence
      body: >-
        The licence form belongs here, with the five fields listed below. Until it is
        connected, write to {email}.
      fields:
        - Name
        - Company
        - Email
        - Allplan version
        - Number of users
---
