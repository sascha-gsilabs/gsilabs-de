---
title: Allplan MCP
description: >-
  Allplan MCP verbindet Allplan mit einem MCP-fähigen KI-Assistenten. Fragen Sie das
  geöffnete Modell, lesen und schreiben Sie Attribute. Es bleibt auf Ihrem Rechner.
pageClass: mcp
blocks:
  - type: mcpHero
    title: Fragen Sie das Modell.
    lede: >-
      Sprechen Sie mit Allplan in Ihren eigenen Worten. Es liest das geöffnete Modell,
      beantwortet Ihre Fragen, hebt Elemente hervor und passt Attribute an, wo es nötig
      ist.
    cta: { label: Preise ansehen, href: "#pricing" }
    link: { label: So funktioniert es, href: "#how-it-works" }
    video:
      ratio: 16 / 9
      label: Platzhalter
      title: Produktvideo
      body: >-
        Hier gehört der Vimeo-Embed hin, in dem Rahmen, in dem er später läuft.

  - type: mcpProblem
    title: Das Problem
    lines:
      - >-
        Ein Element kann im Modell fertig aussehen und trotzdem das Feld leer lassen, das
        die Produktion ausliest.
      - Nichts ist kaputt, also warnt Sie auch nichts.
      - >-
        Bei zehntausend Elementen wird diese Prüfung von Hand nie fertig.

  - type: mcpSteps
    id: how-it-works
    title: So funktioniert es
    steps:
      - Sie fragen in normaler Sprache.
      - Der Assistent entscheidet, was er nachschlagen muss.
      - Allplan MCP liest oder schreibt im geöffneten Modell.
      - >-
        Sie sehen die Antwort und die betroffenen Elemente, hervorgehoben in der Zeichnung.
    note: >-
      Das Modell bleibt auf Ihrem Rechner. Nichts wird exportiert, und es entsteht keine
      zweite Kopie.
    art:
      assistant: KI-Assistent
      bridge: Allplan MCP
      model: Geöffnetes Modell
      boundary: Ihr Rechner
      alt: >-
        Isometrisches Schema mit drei Sockeln. Links steht der KI-Assistent, außerhalb
        einer gestrichelten Umgrenzung. Allplan MCP und das geöffnete Modell stehen
        innerhalb, auf Ihrem Rechner. Ein Doppelpfeil verbindet den Assistenten mit
        Allplan MCP, ein zweiter Allplan MCP mit dem Modell, in dem eines von drei
        Elementen blau hervorgehoben ist.

  - type: mcpExamples
    title: Was Sie fragen können
    items:
      - q: Welchen Elementen fehlt die Betongüte?
        a: Neun von sechsunddreißig. In der Zeichnung hervorgehoben.
      - q: Sind alle Betongüten gültig?
        a: Zwei Elemente haben C34/45. Diese Güte gibt es in EN 1992 nicht.
      - q: Welches dieser Elemente ist das schwerste?
        a: >-
          4,84 m³, rund 12,1 t. Das leichteste Element mit denselben Außenmaßen wiegt
          7,5 t.

  - type: mcpOperations
    title: Die sechs Funktionen
    items:
      - icon: find
        title: Elemente finden
        body: Suche nach Positionsnummer, Layer, Attributwert oder Elementtyp.
      - icon: read
        title: Attribute lesen
        body: Alle Werte, die an einem Element hinterlegt sind.
      - icon: write
        title: Attribute schreiben
        body: Werte setzen, ändern oder löschen.
      - icon: geometry
        title: Geometrie lesen
        body: Abmessungen, Volumen, Oberfläche, Schwerpunkt.
      - icon: zoom
        title: Auf Element zoomen
        body: Elemente in allen offenen Fenstern in den Blick holen.
      - icon: highlight
        title: Hervorheben
        body: Elemente in der Zeichnung markieren, damit die Auswahl sichtbar ist.
    note: >-
      Dazu kommen Verbindungs- und Sitzungswerkzeuge. Verbindung prüfen, den Ablauf einer
      Sitzung auflisten und ihn rückgängig machen.

  - type: mcpPricing
    id: pricing
    title: Preise
    tiers:
      - name: Lite
        lead: true
        price: 99 EUR
        unit: pro Nutzer und Jahr, zzgl. MwSt.
        body: Die sechs Funktionen oben.
        cta: { label: Lizenz anfragen, href: "#license" }
      - name: Pro
        body: >-
          Alles aus Lite, dazu Zeichnungserstellung, 3D-Modellierung und Bewehrung, sobald
          sie verfügbar sind.
        cta: { label: Auf die Warteliste, href: "#waitlist" }
      - name: Custom
        body: Zugeschnitten auf Ihre Abläufe und Standards.
        cta: { label: Vertrieb kontaktieren, href: /get-started }
    waitlist:
      id: waitlist
      form: waitlist
      label: Platzhalter
      title: Auf die Warteliste
      body: >-
        Hier gehört das Wartelisten-Formular hin. Solange es noch nicht angebunden ist,
        schreiben Sie an {email}, und wir nehmen Sie auf die Liste.
    note: >-
      Allplan 2025 oder 2026 und ein Abo bei einem beliebigen MCP-fähigen KI-Assistenten,
      zum Beispiel Claude oder ChatGPT. Ausgeliefert wird ein Installer plus
      Lizenzschlüssel. Die Einrichtung dauert wenige Minuten und braucht keinen Server.

  - type: mcpLicense
    id: license
    title: Testen Sie es an Ihrem eigenen Modell.
    body:
      - >-
        Schreiben Sie uns, welche Allplan-Version Sie einsetzen und wie viele Personen
        damit arbeiten würden. Sie erhalten Lizenzschlüssel und Installer zurück.
    note: Wir antworten innerhalb eines Werktags.
    slot:
      form: license
      label: Platzhalter
      title: Lizenz anfragen
      body: >-
        Hier gehört das Lizenzformular hin, mit den fünf Feldern darunter. Solange es noch
        nicht angebunden ist, schreiben Sie an {email}.
      fields:
        - Name
        - Firma
        - E-Mail
        - Allplan-Version
        - Anzahl Nutzer
---
