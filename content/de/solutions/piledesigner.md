---
title: Piledesigner
description: >-
  Piledesigner ist eine Software aus unserem Haus. Diese Seite zeigt, was dahintersteht
  und für welche Projekte sie gerechnet hat.
# Grundlage ist assets/briefings/briefing-piledesigner-fuer-gsilabs.md. Vier
# Dinge daraus, die beim Bearbeiten leicht verloren gehen:
#
#   1. SCHREIBWEISE. Das Briefing verlangt "piledesigner.io", klein, auch am
#      Satzanfang. Der Auftraggeber hat am 09.10.2026 ausdrücklich "Piledesigner"
#      entschieden. Das ist eine bewusste Abweichung, keine Nachlässigkeit, und
#      sie gilt für den Produktnamen. Wo die Website gemeint ist, steht weiterhin
#      piledesigner.io, denn das ist die Adresse.
#
#   2. SUCHMASCHINEN. piledesigner.io rankt bereits und soll ranken. Diese Seite
#      darf ihr keine Sichtbarkeit abgraben. Deshalb zielen Titel und
#      Beschreibung auf die Portfolio-Absicht, nicht auf "Pfahlbemessung
#      Software". Kein Canonical auf piledesigner.io, der Link dorthin ohne
#      nofollow, und keine Textpassagen von dort übernehmen.
#
#   3. DIE EINE AUSSAGE. Wenn die Seite nur eine Sache transportiert, dann diese:
#      jeder Pfahl wird einzeln nach seinen eigenen Lasten bemessen, nicht
#      gruppiert nach der maßgebenden Last. Daran hängt der ganze
#      wirtschaftliche Hebel.
#
#   4. WAS BEWUSST FEHLT. Die Fotos der drei Referenzprojekte gehören JACBO,
#      Aarsleff und der Kölnmesse, die Bildrechte für diesen Zusammenhang sind
#      ungeklärt. Das Zitat und das Porträt von Daniel Bacon sind für diesen
#      neuen Zusammenhang nicht freigegeben. Das Baujahr des Projekts Flughafen
#      Nürnberg ist nicht hinterlegt, deshalb steht dort keines. Die Aussage
#      "mehrere 10.000 Pfähle pro Jahr" ist nicht auf Aktualität geprüft und
#      fehlt deshalb. Preise stehen nicht hier, sie stehen auf piledesigner.io
#      und veralten dort nicht.
blocks:
  - type: hero
    title: Piledesigner
    lede: >-
      Software für die Pfahlbemessung, die im Browser läuft. Sie rechnet nach EA-Pfähle
      und DIN 1054 und gibt eine prüffähige Dokumentation als PDF aus.
    cta: { label: Zu piledesigner.io, href: "https://piledesigner.io" }
    image:
      ratio: 1296 / 886
      src: /assets/img/piledesigner-hero.webp
      alt: >-
        Ein Gebäudemodell auf seiner Pfahlgründung, daneben ein Bodenprofil mit dem
        Widerstandsdiagramm und der Tabelle der Pfahlwiderstände über die Tiefe
      width: 1296
      height: 886

  - type: statement
    title: Wer gruppiert bemisst, baut jeden Pfahl so stark wie den am stärksten belasteten.
    body:
      - >-
        Herkömmliche Software bemisst nach der maßgebenden Last einer ganzen Gruppe. Das
        trägt, und es kostet: an jedem Pfahl, der weniger abzutragen hat, stehen Beton,
        Stahl, Bohrmeter und CO₂ zu viel im Boden.
      - >-
        Piledesigner rechnet jeden einzelnen Pfahl nach seinen eigenen vertikalen und
        horizontalen Lasten, vollautomatisiert, auch bei mehreren tausend Pfählen im
        Projekt. Das Verfahren und der Rechenkern stammen aus dem Ingenieurbüro von
        Dr.-Ing. Ingo Hylla, Grundbaustatiker mit Schwerpunkt Spezialtiefbau.
    points:
      - Bemessung je Pfahl statt je Gruppe
      - Vertikal- und Horizontalkräfte in einer Rechnung
      - Vollständig im Browser, nichts zu installieren
    split: true
    image:
      src: /assets/img/geo-engineers-top.webp
      alt: >-
        Luftbild einer Baustelle mit einem Feld freigelegter Pfahlköpfe, daneben
        Bewehrungskörbe und ein Bohrgerät
      width: 1024
      height: 576

  - type: definitions
    title: Was die Software rechnet
    items:
      - label: Lastfälle
        body: >-
          Mehrere Lastfälle gleichzeitig verwalten und rechnen.
      - label: Bodenprofile
        body: >-
          Schichten, Grundwasserstand und Reibungswinkel je Projekt, direkt im Browser.
      - label: Tragfähigkeit
        body: >-
          Äußere und innere Tragfähigkeit unter allen relevanten Lasten, mit
          Mantelreibung, Spitzendruck und Setzung. Die Pfahllänge wird dabei optimiert.
      - label: Bewehrung
        body: >-
          Erforderliche Längs- und Querkraftbewehrung je Pfahl, aus dessen eigener
          Belastung.
    image:
      src: /assets/img/geo-engineers-bottom.webp
      alt: >-
        Luftbild einer innerstädtischen Baustelle mit einem Bohrgerät beim Herstellen
        der Bohrpfähle
      width: 1024
      height: 576

  - type: stages
    title: Vom Bodenprofil zum Nachweis
    layout: rows
    items:
      - title: Berechnungs-Einstellungen definieren
        body: >-
          Norm wählen, EA-Pfähle oder DIN 1054, und die Sicherheitsbeiwerte festlegen.
      - title: Bodenprofile anlegen
        body: >-
          Schichten, Grundwasserstand und Reibungswinkel eintragen.
      - title: Äußere Tragfähigkeit bestimmen
        body: >-
          Pfähle unter die Lastpunkte setzen und Typ, Abstand und Durchmesser wählen.
          Mantelreibung, Spitzendruck und Setzung rechnet die Software selbst.
      - title: Innere Tragfähigkeit prüfen
        body: >-
          Optional, mit der erforderlichen Bewehrung je Pfahl.

  # Auf Papier, nicht auf Schwarz: der Abbinder darunter ist das einzige dunkle
  # Band der Seite. Zwei dunkle Bänder hintereinander laufen ineinander.
  - type: pillars
    tone: paper
    title: Gerechnet für diese Projekte
    items:
      - title: Flughafen Nürnberg
        body:
          - >-
            Neubau eines Parkhauses, ausgeführt von JACBO Pfahlgründungen.
          - >-
            565 Bohrpfähle, Ø 60 cm, bis 10 m Länge. Vertikallast bis 2,5 MN je Stütze,
            im Mittel 1,7 MN. Rund fünf Wochen Bauzeit, bis zu 25 Pfähle pro Tag und
            Maschine.
      - title: Solarprojekt MOJO
        body:
          - >-
            Flevoland, Niederlande, 2021, ausgeführt von Aarsleff Grundbau.
          - >-
            Rund 2.800 Fertigpfähle, 45 × 45 cm, im Kopfbereich 45 × 67 cm, 5 m Länge.
            Die Pfähle sind Fundament und Montagefuß zugleich, für ein
            Photovoltaik-Carport-System.
      - title: Kölnmesse, Halle 1plus
        body:
          - >-
            Köln, 2018 bis 2019. Bauherr Kölnmesse GmbH, ausgeführt von JACBO
            Pfahlgründungen.
          - >-
            400 Bohrpfähle, 241 mit Ø 70 cm und 159 mit Ø 80 cm, bis 17,5 m Tiefe.
            Vertikallast im Mittel 2,7 MN, maximal 3,6 MN.

  - type: closer
    title: Dreißig Tage kostenlos, ohne Kreditkarte.
    body: >-
      Piledesigner läuft im Browser, es gibt nichts zu installieren. Preise, Referenzen
      und die Anmeldung stehen auf piledesigner.io.
    cta: { label: Zu piledesigner.io, href: "https://piledesigner.io" }
    secondary: { label: Demo buchen, href: "https://piledesigner.io/kontakt/" }
---
