---
title: Was Holzfeuchtedaten über den Zustand eines Gebäudes verraten
# Die Überschrift oben ist der Artikel. Das hier zeigt das Suchergebnis.
metaTitle: Was Holzfeuchtedaten über ein Gebäude verraten
date: 2026-05-22
author: Yuyang Peng
readTime: 4 Min. Lesezeit
excerpt: >-
  Eine Fallstudie an einem hölzernen Dachstuhl mit dynamischer Regression und
  vorausschauender Auswertung.
description: >-
  Eine Fallstudie am hölzernen Dachstuhl: wie fortlaufendes Monitoring und ein
  dynamisches ARX-Modell aus Feuchtedaten frühere Instandhaltungsentscheidungen machen.
image:
  src: /assets/img/cover-building-health.webp
  alt: Innenansicht eines hölzernen Dachstuhls mit überlagerter Feuchtekurve
  width: 1600
  height: 896
cardImage:
  src: /assets/img/news-building-health.webp
  alt: Innenansicht eines hölzernen Dachstuhls mit überlagerter Feuchtekurve
  width: 900
  height: 504
facts:
  - { label: Geschrieben von, value: Yuyang Peng }
  - { label: Kategorie, value: Artikel }
  - { label: Lesezeit, value: 4 Min. }
  - { label: Methode, value: Dynamische Regression // ARX }
---

#### Die meisten Bauschäden beginnen nicht mit einem dramatischen Versagen.

Sie beginnen oft als kleine, schleichende Veränderungen, die über Wochen oder sogar
Monate unsichtbar bleiben. Bei Holzkonstruktionen ist eine der wichtigsten dieser
Veränderungen die Ansammlung von Feuchtigkeit. Erhöhte Holzfeuchte kann zu Schimmelbefall,
biologischem Abbau, Formänderungen und langfristigen Dauerhaftigkeitsproblemen beitragen.
Wenn sichtbare Anzeichen auftreten, ist die Schädigung oft schon weit fortgeschritten.

Traditionell stützt sich die Gebäudeinstandhaltung stark auf regelmäßige Begehungen und
Sichtprüfungen. Diese Verfahren bleiben wichtig, liefern aber nur gelegentliche
Momentaufnahmen des Gebäudezustands. Was zwischen den Begehungen passiert, bleibt oft
unbekannt.

Mit der wachsenden Verfügbarkeit von Sensoren, fortlaufenden Monitoringsystemen und
vorausschauender Auswertung wird ein anderer Ansatz möglich. Statt darauf zu warten, dass
Probleme auftreten, können Betreiber verborgene Risiken über Daten erkennen und
verstehen, wie sich Bauteile über die Zeit verhalten.

Dieser Artikel stellt eine Monitoringstudie an einem hölzernen Dachstuhl vor, die
untersucht hat, wie sich Umgebungsdaten und dynamische Modellierung nutzen lassen, um das
Feuchteverhalten von Holz besser zu verstehen und vorausschauendere
Instandhaltungsentscheidungen zu stützen.

![Ein Wiiste Holzfeuchtesensor auf einer Holzoberfläche montiert](/assets/img/fig-timber-sensor.webp "Holzfeuchtesensor von Wiiste")

#### Von der periodischen Prüfung zum fortlaufenden Monitoring

Die Studie befasste sich mit einem hölzernen Dachstuhl, der mit Sensoren für Umgebung und
Material ausgestattet war. Ziel war es, fortlaufend zu beobachten, wie die Holzfeuchte auf
wechselnde klimatische Bedingungen im Dachraum reagiert.

Das Monitoringsystem zeichnete mehrere zentrale Größen auf, darunter die Holzfeuchte, die
relative Luftfeuchte im Dachraum und die Temperatur im Dachraum. Über die Zeit entstand so
ein detaillierter Datensatz, der sowohl die Umgebung als auch die Reaktion des Holzes
darauf beschreibt.

Der Vorteil dieses Ansatzes liegt auf der Hand. Statt sich allein auf gelegentliche
Begehungen zu stützen, bekommen Betreiber fortlaufend Einblick, wie
Umgebungsbedingungen die Baustoffe über verschiedene Jahreszeiten und Wetterlagen hinweg
beeinflussen.

Daten zu sammeln ist allerdings nur der erste Schritt. Die wichtigere Aufgabe ist zu
verstehen, was diese Daten bedeuten und ob sie helfen, künftige Zustände vorherzusagen.

##### Lässt sich das Feuchteverhalten von Holz vorhersagen?

Ein naheliegender Ausgangspunkt war die Frage, ob sich die Holzfeuchte allein aus den
aktuellen Umgebungsbedingungen erklären lässt. Dazu wurde ein einfaches statisches
Regressionsmodell aufgestellt:

![Das statische Regressionsmodell für die Holzfeuchte](/assets/img/fig-timber-static-model.webp "Das statische Modell: Holzfeuchte als Funktion der aktuellen relativen Luftfeuchte und Temperatur")

Praktisch gesprochen nimmt dieses Modell an, dass Holz unmittelbar auf seine Umgebung
reagiert. Steigt die relative Luftfeuchte, sollte die Holzfeuchte entsprechend steigen.
Sinkt die Luftfeuchte, sollte auch die Holzfeuchte sinken.

Diese Annahme wirkt zunächst plausibel. Die Messergebnisse legten jedoch nahe, dass die
Wirklichkeit komplizierter ist.

Das statische Modell bestätigte, dass die relative Luftfeuchte ein wichtiger Treiber des
Feuchteverhaltens ist, seine Erklärungskraft blieb insgesamt aber begrenzt. Das Modell
erreichte ein Bestimmtheitsmaß von etwa 0,24, was bedeutet, dass sich ein großer Teil der
Feuchteschwankung nicht allein aus den aktuellen Umgebungsbedingungen erklären ließ.

Daraus ergab sich eine wichtige Frage: welche Information fehlte?

#### Warum das statische Modell nicht ausreichte

Die Antwort liegt im physikalischen Verhalten des Holzes selbst.

Anders als viele mechanische Systeme reagiert Holz nicht sofort auf Veränderungen der
Umgebung. Feuchteaufnahme und Feuchteabgabe verlaufen allmählich. Eine Phase hoher
Luftfeuchte kann die Holzfeuchte noch lange beeinflussen, nachdem sich die
Umgebungsbedingungen bereits verändert haben.

Über den Messzeitraum zeigte die Holzfeuchte eine starke Beharrlichkeit. Der aktuelle
Zustand des Materials wurde stark von seinem vorherigen Feuchtezustand geprägt und nicht
nur von den aktuellen Umgebungsgrößen.

Einfach gesagt: Holz hat ein Gedächtnis. Sein aktueller Zustand hängt nicht nur von der
Umgebung ab, sondern auch davon, wo es einige Stunden zuvor stand. Sobald dieses Verhalten
sichtbar wurde, war klar, dass ein anderer Modellansatz nötig war.

#### Das ARX-Modell

Um diese verzögerte Reaktion abzubilden, wurde ein dynamisches ARX-Modell eingeführt. ARX
steht für autoregressiv mit exogenen Eingängen. Der Name klingt technisch, das Konzept ist
aber vergleichsweise einfach. Das Modell verbindet zwei Informationsquellen:

1. Die aktuellen Umgebungsbedingungen.
2. Den vorherigen Feuchtezustand des Holzes.

Vereinfacht lässt sich das Modell so ausdrücken:

![Das ARX-Modell, ergänzt um den vorherigen Feuchtezustand als Term](/assets/img/fig-timber-arx-model.webp "Das ARX-Modell ergänzt den vorherigen Feuchtemesswert als Term")

Statt anzunehmen, dass Holz sofort auf Veränderungen reagiert, berücksichtigt das
ARX-Modell, dass sich Feuchteverhalten über die Zeit entwickelt. Der vorherige Zustand
enthält wertvolle Information darüber, wie sich das Material als Nächstes verhalten wird.

Aus Ingenieursicht spiegelt das eine einfache Tatsache: Holz hat ein Gedächtnis, und
Prognosemodelle sollten das abbilden.

Sobald das dynamische Verhalten des Holzes im Modell steckte, verbesserte sich die
Vorhersagegüte deutlich. Bereits das ARX-Modell erster Ordnung zeigte erhebliche
Verbesserungen gegenüber dem statischen Ansatz. Ein ARX-Modell zweiter Ordnung bildete das
gemessene Feuchteverhalten noch genauer ab.

Das resultierende Modell erreichte ein Bestimmtheitsmaß nahe 0,999 bei sehr geringem
Vorhersagefehler. Wichtiger noch: die vorhergesagten Werte folgten den Messwerten der
Sensoren sehr eng.

![Gemessene gegenüber vorhergesagter Holzfeuchte, mit den Residuen über die Zeit](/assets/img/fig-timber-arx-fit.webp "Abbildung 1: Gemessene und vorhergesagte Holzfeuchte mit ARX-Modellierung")

Die Bedeutung dieses Ergebnisses reicht über die statistische Güte hinaus. Ein Modell, das
das erwartete Feuchteverhalten verlässlich abschätzt, liefert eine Bezugslinie für den
Normalbetrieb. Künftige Messungen lassen sich gegen diese Bezugslinie halten, um
auffällige Muster oder aufkommende Risiken zu erkennen. Statt auf sichtbare Anzeichen der
Schädigung zu warten, können Betreiber Auffälligkeiten deutlich früher untersuchen.

Der Übergang ist unscheinbar, aber wichtig. Instandhaltung verschiebt sich vom Reagieren
auf Probleme hin zum Vorwegnehmen.

#### Was das für die Instandhaltung bedeutet

Der praktische Wert vorausschauenden Monitorings liegt nicht im Modell selbst. Er liegt in
besseren Entscheidungen.

Stellen Sie sich vor, das Feuchteverhalten weicht nach einer längeren Regenperiode von den
erwarteten Mustern ab. Ohne Monitoring bliebe das womöglich unbemerkt, bis sichtbare
Schäden auftreten. Mit fortlaufendem Monitoring und vorausschauender Modellierung lässt
sich das auffällige Verhalten viel früher erkennen, sodass die Instandhaltung nachsehen
kann, bevor größerer Schaden entsteht.

Dieser Ansatz ersetzt weder das Ingenieururteil noch die regelmäßige Prüfung. Er hilft
vielmehr, die Aufmerksamkeit dorthin zu lenken, wo sie am nötigsten ist. Mittel lassen
sich wirksamer einsetzen, Prüfungen werden gezielter, und die Instandhaltungsplanung stützt
sich auf Belege statt auf Annahmen. Für Eigentümer und Betreiber bedeutet das einen
Schritt hin zu einer vorausschauenden, datengestützten Instandhaltungsstrategie.

Es passt auch zu den übergeordneten Zielen der Branche in Bezug auf Nachhaltigkeit,
Widerstandsfähigkeit und Lebenszyklusleistung. Die Nutzungsdauer bestehender Bauwerke zu
verlängern ist oft nachhaltiger, als sie zu ersetzen, und vorausschauendes Monitoring ist
ein Weg dorthin.

#### Der Blick nach vorn

Diese Studie befasste sich zwar gezielt mit dem Feuchteverhalten von Holz, das zugrunde
liegende Prinzip lässt sich aber auf viele andere Gebäudesysteme übertragen.

Fortlaufendes Monitoring erlaubt Gebäuden, Informationen über ihren eigenen Zustand zu
erzeugen. Prognosemodelle helfen, diese Informationen in umsetzbare Erkenntnisse zu
verwandeln.

Künftige Gebäudemanagementsysteme könnten Monitoringplattformen, vorausschauende Auswertung
und automatisierte Prüfverfahren verbinden, um mögliche Risiken noch früher zu erkennen.
Die wichtigste Lehre aus diesem Projekt ist aber schon heute klar.

Gebäude tragen wertvolle Informationen über ihren eigenen Zustand in sich. Die
Herausforderung ist, zuhören zu lernen. Und dieser Weg beginnt mit Daten.
