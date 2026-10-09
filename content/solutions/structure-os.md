---
title: StructureOS
description: >-
  StructureOS is a knowledge system for structural engineering firms. Projects, office
  standards and building codes in one place, asked in plain language.
# Based on assets/briefings/structureos-briefing.md. Four things from it that
# are easy to lose when editing:
#
#   1. ENGLISH ONLY, for now. The briefing says German follows later, so this
#      page has no counterpart under content/de/ and the German navigation does
#      not list it. The build reports it at the end of every run as a page in one
#      language only. That is expected, not a fault.
#
#   2. ONLY FOUR CONFIRMED FEATURES exist: asking the collected office knowledge
#      in plain language with a source on every answer, uploading codes and
#      guidelines into those answers, a link to the project management tool, and
#      a link to timesheet tracking. Nothing else may be stated as fact. No
#      figures, no customer names, no promises.
#
#   3. NO VENDORS, NO HOSTING, NO PRICES. The briefing wants those marked [TBD]
#      rather than invented. The page avoids needing the marks by not raising the
#      questions: the integrations band names functions rather than products.
#      If a claim about hosting, data protection, a named integration or a price
#      is ever added, it needs an answer first.
#
#   4. NO DASHES as punctuation anywhere in the copy, and never the "not X, it is
#      Y" construction. Both are in the briefing, and both are checked by
#      npm run test:briefing.
#
# The photographs come from the five audience pages this page replaced. They are
# the ones that show engineers working with what they know; the screenshots on
# those pages belonged to other products and were left behind.
blocks:
  - type: hero
    title: The Second Brain for Structural Engineering Firms
    lede: >-
      StructureOS brings your projects, standards and building codes into one system
      your engineers can ask in plain language.
    cta: { label: "Let's Talk", href: /get-started }
    image:
      src: /assets/img/sol-design-hero.webp
      alt: Two engineers at a desk discussing a structural model on screen
      width: 1400
      height: 934

  - type: statement
    title: Your firm knows more than any one engineer can find.
    body:
      - >-
        The answer to today's question usually sits in a calculation from four years
        ago, in a checking engineer's note, or in a colleague's memory. Finding it often
        costs more than solving the problem again.
      - >-
        New engineers take months to learn the office standards. When experienced staff
        leave, what they knew leaves with them.

  - type: definitions
    title: A second brain, in the AI sense
    items:
      - label: Capture
        body: >-
          Calculations, reports, correspondence and project files go in as they are.
      - label: Ask
        body: >-
          Engineers put a question in their own words. The answer comes back with the
          document it came from.
      - label: Connect
        body: >-
          Projects, tasks and recorded hours sit alongside the documents they belong to.

  - type: statement
    title: Questions your engineers already ask
    body: >-
      Today they ask a colleague, or they search. Both cost time, and both depend on who
      is in the room.
    points:
      - >-
        How did we solve punching shear on similar flat slabs, and what did the checking
        engineer note?
      - Which past projects had comparable soil conditions?
      - What does the uploaded guideline require for this connection detail?
      - How many hours did comparable projects take in the design phase?

  - type: featureTabs
    title: Find what the firm knows, act on it, and keep it.
    items:
      - label: Find
        body: >-
          Every calculation, report and guideline your firm has produced becomes
          searchable by question.
        points:
          - Engineers ask in plain language and get answers from your own documents.
          - Every answer points to its source.
          - Uploaded building codes and guidelines are part of every answer.
        image:
          src: /assets/img/tab-standards-compliance.webp
          alt: Two engineers reading a guideline against a drawing on the table
          width: 1024
          height: 684
      - label: Act
        body: >-
          Knowledge connects to the tools your team already uses to plan and track work.
        points:
          - >-
            Projects and tasks from your project management tool are linked to their
            documents.
          - Timesheet data shows what comparable work actually took.
          - Teams start new projects from proven solutions.
        image:
          src: /assets/img/planning-design-offices-bottom.webp
          alt: Two experienced engineers working through a plan together
          width: 1024
          height: 684
      - label: Retain
        body: >-
          What your engineers learn stays with the firm.
        points:
          - New engineers learn office standards faster.
          - Experience remains available when senior staff leave.
          - Each project adds to what the next one can draw on.
        image:
          src: /assets/img/tab-data-collection.webp
          alt: A city skyline of completed buildings
          width: 1024
          height: 596

  - type: pillars
    tone: paper
    title: What it connects to
    items:
      - title: Project management
        body: >-
          Projects, tasks and their status, held against the documents they produced.
      - title: Timesheet tracking
        body: >-
          Recorded hours per project, so comparable work can be measured against what it
          actually took.
      - title: Documents and guidelines
        body: >-
          Standards, guidelines and internal rules, uploaded and drawn on in every
          answer.

  - type: closer
    title: See it against your own projects.
    body: >-
      Tell us what your office has already produced and where your engineers lose time
      looking for it. We come back with an honest read on what would be worth building.
    cta: { label: "Let's Talk", href: /get-started }
    secondary: { label: See our process, href: /our-process }
---
