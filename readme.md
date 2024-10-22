## Installation

- Download/Pull und _npm i_ laufen lassen.
- In _playwright.config.ts_ den Pfad für Chrome-Browser anpassen
  <br>
  <img src=./readme_assets/3.PNG width=300>

### Setup Mocks

Angenommen ich möchte für eine bestimmten Request eine vordefinierte Antwort schicken:

- Man sucht sich die genaue URL des zu mockenden Aufrufs (zB in dem Fall für https://dummyjson.com/products)
  <br>
  <img src=./readme_assets/template_test_mock_3.PNG width=300>
- Man navigiert zum entsprechenden Directory des Services in ./mocks (in dem Fall "global"):
  <br>
  <img src=./readme_assets/template_test_mock_3.PNG width=300>
- und erstellt im File (in dem Fall global.mocks.ts) einen neuen Eintrag vom Typ "Mock"
  - Wenn die URL mit "http" oder "https" beginnt, wird die komplette, im Eintrag eingetragene URL übernommen.
  - Wenn die URL _nicht_ mit "http" oder "https" beginnt, wird vor die eingetragene URL die, im config.local.ts definierte "baseUrl" verwendet.
- Hier kann man im parameter "response" das gewünschte Objekt angeben, welches man gerne returned haben möchte.
  <br>
- Man kann auch für eine URL verschiedene Responses definieren, je nachdem welcher Request geschicht wurde. Dafür einfach statt dem Objekt _response_ ein Array _responses_ mitgeben, in denen man einen Request definieren kann. Nur wenn im Portal ein Request mit genau dem Body und der Methode abgegeben wird, wird die dazugehörige Reponse geschickt.
  <br>
  <img src=./readme_assets/mocks/3.png width=300>
  - Hier wird zB ein unterschiedlicher Response geschickt je nachdem ob der Request sort "AGE" oder sort "STATUS" hat:
    <br>
    <img src=./readme_assets/mocks/5.png width=300>

### Setup Browser

- Browser für Playwright manuell downloaden
  <br>
  <img src=./readme_assets/1.png width=300>
- Systemumgebungsvariable setzen
  <br>
  <img src=./readme_assets/2.png width=300>

### Codegen

Man kann sich auch den Code für einen Testfall generieren lassen:

- Terminal in /codegen öffnen
  <br>
  <img src=./readme_assets/codegen/1.PNG width=300>
- _npm i_ inital ausführen (tsx installieren)
  <br>
  <img src=./readme_assets/codegen/2.PNG width=300>
- Wieder im Directory _playwright_ den Befehl _npm --prefix codegen run start_ ausführen:
  <br>
  <img src=./readme_assets/template_codegen_1.PNG width=300>
- Es öffnet sich Chrome mit dem Playwright-Inspector. Außerdem werden die definierten Mocks verwendet.
- _Record_ drücken und in der App wie gewünscht navigieren. Die Interaktionen werden im Inspector aufgenommen und der Code dafür generiert
  <br>
  <img src=./readme_assets/codegen.gif width=300></a>

## Warum Playwright/Komponenten Tests?

- **Einfache und robuste Einführung bei nicht getesteten Projekten**: Durch das rendern des gesamten Browsers und nicht nur der Komponenten, eignet es sich für Projekte, die bereits historisch gewachsen sind und über keine Testabdeckung verfügen, als erster Schritt der Qualitätssicherung vor einem Refactoring.

- **Optionale Unabhängig von Backend-Services**: Durch das Mocken kann man seine Tests unabhängig von Backend und Datenbank erstellen. Das vereinfacht den Vorgang wenn man die genutzten Services nicht lokal laufen lassen kann.

- **Reduzierung der Fehlersuche**: Durch das frühzeitige Abfangen von Fehlern in der Entwicklungsphase reduziert sich die Zeit, die für die Fehlersuche und -behebung aufgewendet wird signifikant.

- **Automatisierung**: Durch die Automatisierung der Testprozesse wird die Freigabe des Codes beschleunigt. Es gibt keine Verzögerungen mehr durch manuelle Tests.

- **Kontinuierliche Integration**: Playwright kann einfach in den CI/CD-Prozess integriert werden, was zu einer effizienteren Pipeline führt.

- **Cross-Browser-Tests**: Playwright unterstützt Tests in verschiedenen Browsern, was seine Vielseitigkeit und Reichweite erhöht.

- **Leichte Wartung**: Tests, die mit Playwright geschrieben sind, sind in der Regel leicht zu warten und zu aktualisieren, was sie zukunftssicher macht.

- **Aufwand vs. Nutzen**: Während es anfangs Zeit braucht, um Playwright zu lernen und Tests zu schreiben, spart es auf lange Sicht Zeit durch frühe Fehlererkennung und automatisierte Testprozesse.

- **Qualitätssicherung**: Die Einführung von Playwright trägt zur Qualitätssicherung bei und ermöglicht es, qualitativ hochwertige Software schneller auszuliefern.

- **Refactoring-Vorteile**: Mit einer guten Testabdeckung kann das Projekt zukünftig refactort werden, ohne die Sorge, dass etwas zerstört wird.

- **Tester entlasten**: Automatisierte Tests entlasten die Tester und erlauben ihnen, sich auf komplexere Testfälle zu konzentrieren.
