# Briefing: Produktseite StructureOS auf gsilabs.de

## Aufgabe
Baue eine neue Unterseite für das Produkt **StructureOS** auf gsilabs.de. Pfad: `/structure-os`.

Prüfe vorher die bestehende Projektstruktur. Nutze eine vorhandene Produkt- oder Serviceseite als Vorlage und übernimm deren Komponenten, Layout und Abstände. Baue keine neuen Designmuster, wenn es passende gibt. Verlinke die Seite in Navigation bzw. Produktübersicht analog zu den anderen Produkten.

## Produkt in einem Satz
StructureOS ist das Second Brain für Tragwerksplanungsbüros: ein KI-Wissenssystem, das Projektwissen, Bürostandards und Baurichtlinien zusammenführt und per Frage in natürlicher Sprache abrufbar macht, mit Quellenangabe.

## Bestätigte Funktionen (nur diese als Fakten verwenden)
1. **Second Brain / Wissensabfrage:** Fragen in natürlicher Sprache an das gesammelte Bürowissen (Statiken, Prüfberichte, Korrespondenz, Projektunterlagen). Antworten mit Verweis auf die Quelle.
2. **Baurichtlinien hochladen:** Normen, Richtlinien und interne Standards können hochgeladen werden und fließen in die Antworten ein.
3. **Anbindung Projektmanagement-Tool:** Projekte, Aufgaben und Status sind mit dem Wissen verknüpft.
4. **Anbindung Timesheet-Tracking:** Zeiterfassung ist angebunden, Projektaufwände werden mit dem Projektwissen verknüpft.

Keine weiteren Funktionen, Kennzahlen, Kundennamen oder Versprechen erfinden. Aussagen zu Hosting, Datenschutz, Integrationsanbietern oder Preisen nur als Platzhalter `[TBD]` einbauen.

## Zielgruppe
Inhaber, Geschäftsführer und leitende Ingenieure in Tragwerksplanungsbüros (DACH). Typische Schmerzpunkte:
- Wissen steckt in Köpfen und alten Projektordnern.
- Neue Ingenieure brauchen lange, bis sie Bürostandards kennen.
- Erfahrene Kollegen gehen, ihr Wissen geht mit.
- Viel Zeit fließt in die Suche nach früheren Lösungen und Prüfanmerkungen.

## Seitenstruktur
1. **Hero:** Headline, Subline, CTA "Let's Talk".
2. **Problem:** Kurzer Abschnitt zum verstreuten Bürowissen.
3. **Was StructureOS ist:** Erklärung Second Brain im KI-Zeitalter (erfassen ohne Aufwand, fragen statt suchen, verknüpfen).
4. **Beispielfragen:** 3 bis 4 Fragen, wie ein Ingenieur sie stellen würde (siehe unten).
5. **Feature-Tabs (3 Tabs):** feste Logik
   - Tab 1: Was das System erkennt und findet (Wissensabfrage, Baurichtlinien)
   - Tab 2: Wie das Team damit arbeitet (Projektmanagement, Timesheets)
   - Tab 3: Was als institutioneller Wert entsteht (Bürogedächtnis, Einarbeitung, Wissenserhalt)
6. **Integrationen:** Projektmanagement, Timesheet-Tracking, Dokumente/Richtlinien. Nur funktionale Begriffe, keine Herstellernamen.
7. **Abschluss-CTA:** "Let's Talk".

## Copy-Regeln (verbindlich)
- Sprache: **Englisch**. Deutsch folgt später.
- Ton: seriös, technisch, beratend. Referenz ist der Stil von Palantir. Kein SaaS-Marketing-Sprech.
- **Keine Gedankenstriche** (kein —, kein –, kein Bindestrich als Satzverbinder). Stattdessen Punkt, Komma, Doppelpunkt oder Klammer.
- Keine Konstruktion "It's not X, it's Y".
- Feature-Texte: ein kurzer Absatz, darauf drei Bullets mit je genau einem Satz. Kein fett gedruckter Titel mit Beschreibung im Bullet.
- Kurz halten.
- Diagramme oder Systemgrafiken: nur Fähigkeiten benennen, keine Produkt- oder Herstellernamen.

## Copy-Entwurf (anpassen, Regeln einhalten)

**Hero**
- H1: The Second Brain for Structural Engineering Firms
- Subline: StructureOS brings your projects, standards and building codes into one system your engineers can ask in plain language.
- CTA: Let's Talk

**Beispielfragen**
- How did we solve punching shear on similar flat slabs, and what did the checking engineer note?
- Which past projects had comparable soil conditions?
- What does the uploaded guideline require for this connection detail?
- How many hours did comparable projects take in the design phase?

**Tab 1: Find**
Every calculation, report and guideline your firm has produced becomes searchable by question.
- Engineers ask in plain language and get answers from your own documents.
- Every answer points to its source.
- Uploaded building codes and guidelines are part of every answer.

**Tab 2: Act**
Knowledge connects to the tools your team already uses to plan and track work.
- Projects and tasks from your project management tool are linked to their documents.
- Timesheet data shows what comparable work actually took.
- Teams start new projects from proven solutions.

**Tab 3: Retain**
What your engineers learn stays with the firm.
- New engineers learn office standards faster.
- Experience remains available when senior staff leave.
- Each project adds to what the next one can draw on.

## Design
- Bestehende Brand-Tokens der Seite verwenden (Concrete #F8F6F2, Ink #1F271B, Sand #EAE3D7, Forest #384438, Inter Variable), sofern im Projekt nicht anders definiert.
- Optional: schlichte UI-Andeutung einer Frage/Antwort mit Quellenverweis im Hero oder Abschnitt 3. Kein Stockfoto.
- Mobile zuerst prüfen, keine horizontale Scrollleiste.

## Abnahme
- Seite erreichbar, in Navigation verlinkt, responsive.
- Kein Gedankenstrich im gesamten Seitentext (per Suche prüfen).
- Keine Fakten außerhalb der vier bestätigten Funktionen, offene Punkte als `[TBD]`.
- Meta-Title und Meta-Description gesetzt (Englisch).
