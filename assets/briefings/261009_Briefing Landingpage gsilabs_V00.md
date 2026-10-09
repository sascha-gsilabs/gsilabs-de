# Briefing: Landingpage „Baukosten KI" auf gsilabs.de

**Dokument:** 261009_Briefing Landingpage gsilabs_V00
**Stand:** 09.10.2026
**Für:** die Entwicklung der Landingpage auf gsilabs.de
**Quellen:** Markenhandbuch `260729_Brand Guidelines_V00`, `assets/css/tokens.css`,
die ausgelieferten Seiten von baukosten-ki.de, Register der Startfreigabe

---

## 0. Zuerst lesen: drei Dinge, die den Zuschnitt bestimmen

**Die beworbene Website ist noch nicht öffentlich.** `baukosten-ki.de` liegt
hinter einem HTTP-Basic-Zugangsschutz, und `vercel.json` setzt auf jedem Pfad
`X-Robots-Tag: noindex, nofollow`. Dasselbe gilt für die Anwendung unter
`app.baukosten-ki.de`. Wer von einer öffentlichen Landingpage dorthin klickt,
landet auf einer Passwortabfrage.

→ Entweder die Landingpage geht erst mit der Freigabe von baukosten-ki.de
online, oder sie verlinkt zunächst nicht dorthin, sondern sammelt
Interessenten. Das ist zu entscheiden, bevor der erste Verweis gesetzt wird.

**Die Wort-Bild-Marke ist noch nicht angemeldet.** Die Anmeldung beim DPMA
(Klassen 9, 35, 42) ist beschlossen, aber nicht erfolgt. Eine gut sichtbare
Seite auf einer bereits indexierten Domain erhöht die Sichtbarkeit vor dem
Zeitrang. Besonderes Risiko: BKI, das Baukosteninformationszentrum, im selben
Dienstleistungsumfeld.

→ Vor der Veröffentlichung mit der Geschäftsführung klären.

**Das Produkt ist noch nicht entgeltlich bestellbar.** Der Bestellweg über
Stripe steht, läuft aber auf einem Testpreis von einem Euro. Eine Landingpage,
die zum Kauf auffordert, geht auf diesen Preis.

→ Handlungsaufforderung vorerst auf „kostenfrei testen" richten, nicht auf
„jetzt kaufen".

---

## 1. Was das Produkt ist

Eine webbasierte Anwendung zur **Kostenschätzung nach DIN 276** und zur
anschließenden **Honorarermittlung nach HOAI**. Zielgruppe sind Planungsbüros,
Architektinnen und Architekten, Ingenieurbüros.

Der Nutzen in einem Satz: eine belastbare Kostenaussage, bevor der Entwurf
steht, mit nachvollziehbarer Herleitung.

Die Überschrift der Startseite lautet „Baukosten schätzen, bevor der Entwurf
steht." Sie ist erprobt und kann als Leitgedanke dienen, sollte auf der
Landingpage aber nicht wörtlich wiederholt werden.

---

## 2. Marke: was unverhandelbar ist

### Schreibweise

**„Baukosten KI"**, immer mit Leerzeichen, nie mit Bindestrich. Der
Bindestrich existiert ausschließlich in der Domain. Auch in englischen Texten
bleibt es „Baukosten KI", **kein „Baukosten AI"**.

**Nie ein Monogramm aus „BK" bilden.** Das ist keine Geschmacksfrage: „BK"
liegt zu nah an BKI, dem direkten Wettbewerber, und begründet
Verwechslungsgefahr.

### Claim und Beschreibungszeile

| | |
|---|---|
| Claim | **Die Zahl, die trägt.** |
| Beschreibungszeile | **Kostenschätzung nach DIN 276. Honorare nach HOAI.** |

Der Claim steht als Abbinder auf Abschlussflächen, **nicht** als
Dauerbegleiter des Logos und **nicht** in der Kopfzeile. Die
Beschreibungszeile steht dort, wo jemand die Marke zum ersten Mal sieht — auf
einer Landingpage also weit oben.

Einen englischen Claim gibt es nicht und er darf nicht erfunden werden; er
wäre ein neues Markenelement und braucht die Freigabe der Geschäftsführung.

### Tonfall

Kurze Sätze. Aussage zuerst, Begründung danach. Keine Ausrufezeichen. Anrede
durchgehend **Sie**. Ein Gedanke je Absatz.

### Verbotener Wortschatz

> revolutionär, innovativ, disruptiv, ganzheitlich, „Lösungen" als
> eigenständiges Wort, smart, Game Changer, KI-Power, „in der heutigen
> schnelllebigen Zeit", Features, Insights, powered by, Rocket

### Verbotene Aussagen

> „exakt", „centgenau", „garantiert", „100 Prozent"
>
> Jede Prozentangabe zur Treffsicherheit ohne dokumentierten Abgleich gegen
> abgerechnete Kosten.
>
> **„HOAI-konforme Honorare"** oder „verbindliche Honorare". Die Honorartafeln
> der HOAI 2021 sind Orientierungswerte; das Honorar ist frei vereinbar und in
> Textform zu vereinbaren. Diese Formulierung ist eine unzulässige
> Rechtsaussage, kein Werbefehler.

### Zur KI selbst

Beschreiben, **was sie tut**, nicht **dass sie existiert**. „Erkennt aus Ihrer
Projektbeschreibung Gebäudeart, Standard und Umfang" ist besser als
„KI-gestützt". Der Name trägt das Thema bereits. **Eine Nennung je Seite
genügt.**

---

## 3. Was die Anwendung kann — und was sie nicht kann

Dieser Abschnitt ist der wichtigste. Eine Zusage, die das Produkt nicht
einlöst, ist über die AGB vertraglich bindend; genau daran hat das Projekt
diese Woche gearbeitet.

### Kann

- Kostenschätzung nach DIN 276 als Gesamtsumme **mit Bandbreite**
- Herleitung je Position: Kennwertsatz, Kennwert je Quadratmeter,
  Regionalfaktor, Indexstand, Fassung der Kennwerte
- Honorarermittlung nach HOAI 2021, alle Leistungsphasen
- Ausgabe nach PDF, Excel und ZIP, mit eigenen Büroangaben im Kopf
- Projektbeschreibung in eigenen Worten, aus der die Eingangsgrößen
  herausgelesen werden
- Zweisprachig, deutsch und englisch

### Kann nicht — hier nichts versprechen

| Grenze | Was das heißt |
|---|---|
| Kennwerte nur **erste Ebene** der DIN 276 | Keine Untergliederung in KG 310, 320 usw. |
| HOAI nur **Leistungsbild Gebäude** nach § 34 | Keine Freianlagen, keine Innenräume, keine technische Ausrüstung |
| Regionalfaktoren nur auf **Bundeslandebene** | Keine Kreis- oder Gemeindeebene |
| **Ein Nutzer je Konto** | Keine Teamfunktion, kein Einladen von Kolleginnen |
| Nur **Neubau Hochbau** gesichert | Bauen im Bestand ist in den Kennwerten noch nicht hinterlegt |

Formulierungen wie „alle Kostengruppen", „jedes Leistungsbild", „für Ihr ganzes
Büro" sind damit unzutreffend.

---

## 4. Preise und Testzugang

| Stufe | Preis | Umfang |
|---|---|---|
| Basis | **0 €**, nicht befristet | Ein Projekt gleichzeitig, Kostenschätzung als Gesamtsumme mit Bandbreite, erste Ebene DIN 276, ohne Herleitung je Position, ohne Export, ohne HOAI |
| Pro | **9 € je Nutzer und Monat**, zuzüglich Umsatzsteuer, **jährlich abgerechnet** | Herleitung je Position, HOAI, Export, unbegrenzte Projekte |

**Schreibweise der Beträge:** `9 €` mit geschütztem Leerzeichen vor dem
Eurozeichen (`&nbsp;`). Deutsche Zahlenformate: `1.284,50 €`, `5.400 m²`,
`09.10.2026`, Bereiche mit Halbgeviertstrich `15,2 – 22,8 Mio. €`.

**Der Monat ist die Bezugsgröße des Preises, nicht der Abrechnungszeitraum.**
Abgerechnet wird jährlich im Voraus. Diese Unterscheidung ist im Projekt
bereits einmal falsch wiedergegeben worden.

**Testzugang:** sieben Tage im vollen Umfang der Stufe Pro, beginnt mit der
Registrierung, ohne Zahlungsdaten, endet von selbst und geht **nicht** in
einen entgeltlichen Vertrag über. Das ist die stärkste
Handlungsaufforderung, die derzeit zulässig ist.

---

## 5. Gestaltung

### Farben

```css
--c-graphit:      #14181C   /* Fließtext, dunkle Flächen, Bildmarke */
--c-beton:        #5F656A   /* Sekundärtext, Meta, Tabellenköpfe */
--c-kalk:         #F6F5F2   /* Seitenhintergrund */
--c-weiss:        #FFFFFF   /* Karten und Panels */
--c-signal:       #F25C05   /* Flächen, Schaltflächen, Grafik */
--c-signal-dunkel:#B33F02   /* Signalfarbe als TEXT auf hellem Grund */
```

**Orange ist keine Textfarbe.** `--c-signal` nur für Flächen, Schaltflächen und
Grafik; für Text auf hellem Grund `--c-signal-dunkel`. Schaltflächen sind
**graphitfarbener Text auf Orange**, niemals weißer Text auf Orange.

### Schrift

```
IBM Plex Sans   400, 500, 600
IBM Plex Mono   400, 500   (für Zahlen und Kennwerte)
```

### Offene Frage an den Auftraggeber

Soll die Landingpage das Design-System von Baukosten KI übernehmen oder das
von gsilabs.de? Beides ist vertretbar: die eigene Marke stärkt den
Wiedererkennungswert, das Hausdesign die Einbettung. **Nicht mischen.** Wird
das Design-System von Baukosten KI genutzt, sind `tokens.css` und die
Schriftdateien aus `baukosten-ki-website/assets/` zu übernehmen und nicht
nachzubauen.

---

## 6. Technische Vorgaben

- **Keine externen Ressourcen.** Keine Google Fonts, kein CDN, keine fremden
  Skripte, keine Zähldienste. Schriften liegen im Repository. Das ist nicht
  nur Stil: Die Datenschutzerklärung von Baukosten KI sagt zu, dass nichts von
  fremden Servern geladen wird.
- **WCAG 2.1 AA.** Sichtbarer Fokus, ein `h1` je Seite, Überschriften ohne
  Sprung, Sprungmarke zum Inhalt, vollständige Tastaturbedienung.
- **Mobile first.** Haltepunkte bei 375, 768, 1024 und 1440 Pixeln prüfen.
- **Keine erfundenen Angaben.** Preise, Kontingente, Registerdaten und
  Zahlenbeispiele nur aus diesem Dokument oder aus den Quellen. Fehlt etwas,
  sichtbar `[noch zu bestätigen]` setzen, statt zu schätzen.

---

## 7. Verweise

| Ziel | Adresse | Zustand |
|---|---|---|
| Website | `https://www.baukosten-ki.de` | hinter Zugangsschutz, `noindex` |
| Anwendung | `https://app.baukosten-ki.de` | hinter Zugangsschutz |
| Kontakt | `support@baukosten-ki.de` | eingerichtet |

Impressum, Datenschutzerklärung und AGB liegen auf baukosten-ki.de und werden
**nicht verdoppelt**. Für die Landingpage auf gsilabs.de gilt das Impressum
und die Datenschutzerklärung von gsilabs.de — und die muss abdecken, was die
Landingpage tut. Wird dort ein Formular angeboten, gehört die Verarbeitung der
Anfragedaten hinein.

---

## 8. Checkliste vor der Veröffentlichung

- [ ] Ist entschieden, ob die Seite vor der Freigabe von baukosten-ki.de
      online geht? Falls ja: Verweise zeigen nicht auf die geschlossene Seite
- [ ] Markenanmeldung mit der Geschäftsführung geklärt
- [ ] Kein Wort aus dem verbotenen Wortschatz, keine verbotene Aussage
- [ ] „Baukosten KI" durchgehend ohne Bindestrich, kein „BK"
- [ ] Keine Zusage über die Grenzen aus Abschnitt 3 hinaus
- [ ] Beträge mit geschütztem Leerzeichen, deutsche Zahlenformate
- [ ] Kein weißer Text auf Orange, Orange nicht als Textfarbe
- [ ] Keine Anfrage an eine fremde Herkunft im Netzwerkprotokoll
- [ ] Ein `h1`, Fokus sichtbar, mit der Tastatur vollständig bedienbar
- [ ] Datenschutzerklärung von gsilabs.de deckt ab, was die Seite tut
