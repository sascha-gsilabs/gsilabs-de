---
title: StructureOS
description: >-
  StructureOS ist ein Wissenssystem für Tragwerksplanungsbüros. Projekte, Bürostandards
  und Baurichtlinien an einem Ort, abrufbar in normaler Sprache.
# Grundlage ist assets/briefings/structureos-briefing.md. Drei Dinge daraus, die
# beim Bearbeiten leicht verloren gehen:
#
#   1. NUR VIER BESTÄTIGTE FUNKTIONEN gibt es: das gesammelte Bürowissen in
#      normaler Sprache fragen, mit Quellenangabe an jeder Antwort; Normen und
#      Richtlinien hochladen, die in die Antworten einfließen; die Anbindung an
#      das Projektmanagement; die Anbindung an die Zeiterfassung. Nichts darüber
#      hinaus als Tatsache behaupten. Keine Kennzahlen, keine Kundennamen, keine
#      Versprechen.
#
#   2. KEINE ANBIETER, KEIN HOSTING, KEINE PREISE. Das Briefing will dafür
#      Platzhalter statt erfundener Angaben. Die Seite kommt ohne Platzhalter
#      aus, weil sie die Fragen nicht aufwirft: der Abschnitt zu den Anbindungen
#      nennt Funktionen statt Produkte. Wer eine Aussage zu Hosting, Datenschutz,
#      einer namentlichen Anbindung oder einem Preis ergänzt, braucht vorher eine
#      Antwort darauf.
#
#   3. KEINE GEDANKENSTRICHE als Satzzeichen, und nie die Konstruktion "nicht X,
#      sondern Y". Beides steht im Briefing und beides prüft
#      npm run test:briefing.
#
# Das Briefing sagt, die deutsche Fassung folge später. Das war am 09.10.2026
# überholt: der Auftraggeber hat sie am selben Tag angefordert. Jede Änderung
# gilt ab jetzt für beide Sprachen.
#
# Die Fotos stammen von den fünf Zielgruppenseiten, die diese Seite ersetzt hat.
# Übernommen wurden die, auf denen Ingenieure mit ihrem Wissen arbeiten. Die
# Screenshots auf jenen Seiten zeigten andere Produkte und sind geblieben, wo sie
# waren.
blocks:
  - type: hero
    # Weiches Trennzeichen im Kompositum. Ohne es läuft das Wort in dieser
    # Größe aus der Überschriftenspalte unter das Bild. Es wird nur benutzt,
    # wenn die Zeile es braucht, und ist sonst unsichtbar.
    title: Das Second Brain für Tragwerks&shy;planungsbüros
    lede: >-
      StructureOS führt Ihre Projekte, Bürostandards und Baurichtlinien in einem System
      zusammen, das Ihre Ingenieure in normaler Sprache fragen können.
    cta: { label: Jetzt loslegen, href: /get-started }
    image:
      src: /assets/img/sol-design-hero.webp
      alt: Zwei Ingenieure am Schreibtisch im Gespräch über ein Tragwerksmodell am Bildschirm
      width: 1400
      height: 934

  - type: statement
    title: Ihr Büro weiß mehr, als ein Einzelner finden kann.
    body:
      - >-
        Die Antwort auf die heutige Frage steht meist in einer Statik von vor vier
        Jahren, in einer Anmerkung des Prüfingenieurs oder im Gedächtnis einer Kollegin.
        Sie zu finden kostet oft mehr, als die Aufgabe noch einmal zu lösen.
      - >-
        Neue Ingenieure brauchen Monate, bis sie die Bürostandards kennen. Wenn
        erfahrene Kollegen gehen, geht ihr Wissen mit.

  - type: definitions
    title: Was ein Second Brain hier bedeutet
    items:
      - label: Erfassen
        body: >-
          Statiken, Prüfberichte, Korrespondenz und Projektunterlagen gehen so hinein,
          wie sie sind.
      - label: Fragen
        body: >-
          Ihre Ingenieure stellen die Frage in eigenen Worten. Die Antwort kommt mit dem
          Dokument zurück, aus dem sie stammt.
      - label: Verknüpfen
        body: >-
          Projekte, Aufgaben und erfasste Stunden stehen neben den Unterlagen, zu denen
          sie gehören.

  - type: statement
    title: Fragen, die Ihre Ingenieure ohnehin stellen
    body: >-
      Heute fragen sie eine Kollegin, oder sie suchen. Beides kostet Zeit, und beides
      hängt davon ab, wer gerade da ist.
    points:
      - >-
        Wie haben wir das Durchstanzen bei ähnlichen Flachdecken gelöst, und was hat der
        Prüfingenieur angemerkt?
      - Welche früheren Projekte hatten vergleichbare Bodenverhältnisse?
      - Was verlangt die hochgeladene Richtlinie für dieses Anschlussdetail?
      - Wie viele Stunden haben vergleichbare Projekte in der Entwurfsphase gebraucht?

  - type: featureTabs
    title: Finden, was das Büro weiß, danach handeln, und es behalten.
    items:
      - label: Finden
        body: >-
          Jede Statik, jeder Bericht und jede Richtlinie, die Ihr Büro erstellt hat, wird
          über eine Frage auffindbar.
        points:
          - >-
            Ihre Ingenieure fragen in normaler Sprache und bekommen Antworten aus den
            eigenen Unterlagen.
          - Jede Antwort verweist auf ihre Quelle.
          - Hochgeladene Baurichtlinien und Normen fließen in jede Antwort ein.
        image:
          src: /assets/img/tab-standards-compliance.webp
          alt: Zwei Ingenieure lesen eine Richtlinie gegen eine Zeichnung auf dem Tisch
          width: 1024
          height: 684
      - label: Handeln
        body: >-
          Das Wissen verbindet sich mit den Werkzeugen, mit denen Ihr Team ohnehin plant
          und erfasst.
        points:
          - >-
            Projekte und Aufgaben aus Ihrem Projektmanagement sind mit ihren Unterlagen
            verknüpft.
          - Die Zeiterfassung zeigt, was vergleichbare Arbeit tatsächlich gekostet hat.
          - Teams starten neue Projekte von bewährten Lösungen aus.
        image:
          src: /assets/img/planning-design-offices-bottom.webp
          alt: Zwei erfahrene Ingenieure arbeiten gemeinsam einen Plan durch
          width: 1024
          height: 684
      - label: Behalten
        body: >-
          Was Ihre Ingenieure lernen, bleibt im Büro.
        points:
          - Neue Ingenieure lernen die Bürostandards schneller.
          - Erfahrung bleibt verfügbar, wenn erfahrene Kollegen gehen.
          - Jedes Projekt vergrößert das, worauf das nächste zurückgreifen kann.
        image:
          src: /assets/img/tab-data-collection.webp
          alt: Eine Skyline aus fertiggestellten Gebäuden
          width: 1024
          height: 596

  - type: pillars
    tone: paper
    title: Woran es angebunden ist
    items:
      - title: Projektmanagement
        body: >-
          Projekte, Aufgaben und ihr Status, gehalten an den Unterlagen, die daraus
          entstanden sind.
      - title: Zeiterfassung
        body: >-
          Erfasste Stunden je Projekt, damit vergleichbare Arbeit daran gemessen werden
          kann, was sie tatsächlich gekostet hat.
      - title: Dokumente und Richtlinien
        body: >-
          Normen, Richtlinien und interne Standards, hochgeladen und in jeder Antwort
          herangezogen.

  - type: closer
    title: Sehen Sie es an Ihren eigenen Projekten.
    body: >-
      Sagen Sie uns, was Ihr Büro bereits erstellt hat und wo Ihre Ingenieure Zeit mit
      Suchen verlieren. Wir kommen mit einer ehrlichen Einschätzung zurück, was sich zu
      bauen lohnt.
    cta: { label: Jetzt loslegen, href: /get-started }
    secondary: { label: Unser Vorgehen ansehen, href: /our-process }
---
