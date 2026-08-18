---
title: Von BIM-Objekten zu intelligenten Einbauabläufen
date: 2026-04-30
author: Sascha Avermiddig
readTime: 4 Min. Lesezeit
excerpt: >-
  Wie wir aus dem Produktkatalog von Peikko parametrische Einbauwerkzeuge für Allplan
  gemacht haben, die Anschlüsse, Bewehrung und Attribute automatisch erzeugen.
description: >-
  Die Peikko Allplan Toolbox: PythonParts-Plugins, die aus einem Produktkatalog
  parametrische Einbauwerkzeuge mit hinterlegten Bemessungstabellen machen.
image:
  src: /assets/img/cover-placement-workflows.webp
  alt: Ein BIM-Modell mit Bewehrung entlang eines Tragwerkselements
  width: 1600
  height: 900
cardImage:
  src: /assets/img/news-placement-workflows.webp
  alt: Ein BIM-Modell mit Bewehrung entlang eines Tragwerkselements
  width: 900
  height: 506
facts:
  - { label: Kunde, value: Peikko Group Corporation }
  - { label: Geschrieben von, value: Sascha Avermiddig }
  - { label: Plattform, value: Allplan // PythonParts }
  - { label: Im Einsatz seit, value: "2022" }
---

#### Besser als ein BIM-Objekt

Hersteller von Bauprodukten investieren viel in die Entwicklung guter Produkte. Wenn sich
diese Produkte in einem BIM-Werkzeug aber schwer nutzen lassen, arbeiten Ingenieure und
Konstrukteure daran vorbei oder lassen sie ganz weg.

Genau diese Aufgabe haben wir übernommen, als die Peikko Group Corporation, ein weltweit
führender Anbieter von Verbindungstechnik für Betonfertigteile, uns bat, etwas Besseres
als statische BIM-Objekte für Allplan zu entwickeln.

Was 2022 als Gespräch über parametrische Stützenschuhe begann, ist zu einer Reihe
intelligenter Einbauwerkzeuge gewachsen, die grundlegend verändern, wie Tragwerksplaner
im Alltag mit Peikko-Produkten arbeiten.

#### Das Problem mit statischen BIM-Objekten

Die meisten Hersteller von Bauprodukten bieten BIM-Objekte zum Herunterladen an,
3D-Modelle ihrer Produkte, die Ingenieure in ihre Planungssoftware ziehen können. Diese
Objekte sehen richtig aus, und mehr tun sie meistens nicht.

Ein Tragwerksplaner, der einen Anschluss von Stütze zu Fundament mit Peikko-Stützenschuhen
bemisst, braucht nicht nur ein 3D-Modell. Er muss die richtige Produktvariante aus einem
Katalog mit Dutzenden Einträgen auswählen. Er muss sie korrekt zur Geometrie von Stütze
und Fundament setzen. Er muss die richtigen Attribute für Auswertung und Berichte
vergeben. Er muss die zusätzliche Bewehrung um den Anschluss herum mit den richtigen
Durchmessern, Abständen und Biegeformen anhand der Bemessungstabellen erzeugen. Und das
alles muss sich mitziehen, wenn sich der Entwurf ändert.

Von Hand kostet das Zeit, es schleichen sich Fehler ein, und es entsteht Reibung, die die
Nutzung bremst.

#### Was wir stattdessen gebaut haben

Wir haben die Peikko Allplan Toolbox entwickelt, eine Familie von PythonParts-Plugins,
die Peikko-Produkte direkt in den Allplan-Ablauf einfügen. Nicht als passive Objekte,
sondern als aktive, parametrische Einbauwerkzeuge mit eingebautem Ingenieurwissen.

![Die Peikko Allplan Toolbox in Allplan](/assets/img/fig-peikko-allplan-window.webp "Die Toolbox läuft als native Allplan PythonParts, innerhalb des gewohnten Bewehrungsablaufs")

Die Toolbox umfasst derzeit vier Produktfamilien.

**Werkzeuge für Stützenanschlüsse** decken die Stützenschuhe von Peikko (HPKM, PEC,
BOLDA, HELKA) und die Ankerbolzen (HPM, PPM) ab. Der Ingenieur wählt Stütze und Fundament
im Modell, legt die Anschlussparameter wie Ankerbild, Versatz und Fugendicke fest, und
das Werkzeug erzeugt den vollständigen Anschluss automatisch. Stützenschuhe und
Ankerbolzen werden in einem Schritt gesetzt, ausgerichtet und attributiert. Ändert sich
später der Stützenquerschnitt, passt sich der Anschluss an.

**Werkzeuge für MODIX Bewehrungsmuffen** binden MODIX-Muffen in die Bewehrungsplanung
ein. Statt einzelne Muffenobjekte von Hand zu setzen und zu hoffen, dass die Positionen
zur Bewehrungsführung passen, übernimmt das Werkzeug die Platzierung innerhalb des
Allplan-Bewehrungsablaufs. Verlässliche Anschlüsse mit korrekten Attributen für die
Auswertung.

**Werkzeuge für TEBEA Balkonanschlüsse** behandeln thermische Trennelemente für
Balkonanschlüsse. Ingenieure wählen aus einer breiten Palette von TEBEA-Bauteilen für
unterschiedliche Balkongeometrien, und das Werkzeug sorgt dafür, dass sowohl das
Tragverhalten als auch die Anforderungen an die Wärmedämmung im Modell abgebildet sind.

**Werkzeuge für WINCO Konsolen** sind die jüngste Ergänzung, und hier zeigt der Ansatz
seine Tiefe. Die WINCO-Konsole ist ein Stahlbauteil, das TT-Platten und Nebenträger
gelenkig lagert. Drei Varianten (WINCO 65, 100, 130) mit unterschiedlichen
Tragfähigkeiten und Stahlprofilen. Der Ingenieur klickt zwei Punkte, um die Konsole zu
setzen, und das Werkzeug erzeugt die vollständige 3D-Geometrie einschließlich Stahlprofil,
Lagerplatte und Ankerstab mit Kopfbolzen, durchgängig parametrisch aus den Maßen des
technischen Handbuchs.

Der eigentliche Wert liegt aber in der Bewehrung. Das Werkzeug kann alle 10
Bewehrungspositionen erzeugen, die in den Bemessungstabellen von Peikko festgelegt sind:
Zugbänder, geneigte Bügel, senkrechte und waagerechte U-Bügel, Stirnbügel und die
Ortbetonbewehrung der Platte. Durchmesser, Anzahl und Länge jeder Position werden
automatisch nachgeschlagen, anhand von drei Eingaben: WINCO-Typ, Plattendicke und
Steghöhe. Der Ingenieur schaltet die Bewehrung ein und bekommt in Sekunden eine statisch
korrekte, dokumentationsfertige Bewehrungsführung. Was einen erfahrenen Konstrukteur
früher 30 bis 60 Minuten Handarbeit gekostet hat, Tabellen nachschlagen, Stäbe einzeln
setzen, Abstände prüfen, läuft jetzt parametrisch.

#### Warum das für Tragwerksplaner zählt

Der Unterschied zwischen einem BIM-Objekt und einem Einbauablauf ist der Unterschied
zwischen einem Bauteil auf dem Schreibtisch und einem Bauteil, das im Projekt eingebaut
ist.

Bei einem statischen BIM-Objekt muss der Ingenieur die gesamte Ingenieurarbeit weiterhin
selbst leisten: die richtige Variante nachschlagen, richtig ausrichten, die Bewehrung
ergänzen, Attribute vergeben, Berichte erzeugen. Das BIM-Objekt erspart ihm nur, die
Geometrie von Grund auf zu modellieren.

Bei einem intelligenten Einbauwerkzeug steckt das Ingenieurwissen in der Software. Die
Bemessungstabellen, der Produktkatalog, die Einbauregeln, die Bewehrungslogik. Alles ist
hinterlegt. Der Ingenieur trifft die Entwurfsentscheidungen, also welches Produkt, welche
Geometrie und welche Lasten. Das Werkzeug übernimmt die Ausführung.

#### Die technische Grundlage

Alle Werkzeuge sind als Allplan PythonParts über die Allplan Python API umgesetzt. Das ist
eine bewusste Architekturentscheidung. PythonParts sind native Allplan-Objekte. Sie nehmen
am Attributsystem, an der Berichtserzeugung und an den Fertigteilabläufen von Allplan
teil. Sie lassen sich in Elementplänen und Fertigungsplänen darstellen. Sie unterstützen
den Bearbeitungsmodus, Ingenieure können gesetzte Produkte also jederzeit ändern.

Die Toolbox liest Produktdaten aus einer eingebauten Katalogdatenbank, wodurch die
Werkzeuge offline funktionieren und schnell arbeiten. Produktaktualisierungen wie neue
Größen, geänderte Maße oder eingestellte Varianten kommen über Softwareupdates im Rahmen
eines jährlichen Wartungspakets.

Unterstützt werden derzeit Allplan 2025 und 2026, die Unterstützung für 2027 ist in
Vorbereitung.
