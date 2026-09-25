# EDA Toolbox – Elteknisk Ingenjörsplattform & Lathund

> Professionell webb- och PWA-applikation för elteknik, dimensionering, kabelberäkningar och standardiserade beteckningssystem enligt svenska och internationella standarder (SS 436 40 00, SEK Handbok 444, SS-EN IEC 81346, SS-EN 61355, AMA EL & BSAB 96).

---

## ⚡ Innehållsförteckning
1. [Funktioner & Moduler](#-funktioner--moduler)
2. [Systemkrav](#-systemkrav)
3. [Installation & Snabbstart](#-installation--snabbstart)
4. [Bygg för produktion](#-bygg-för-produktion)
5. [Skript i package.json](#-skript-i-packagejson)
6. [PWA & Offline-installation](#-pwa--offline-installation)
7. [Kör med Docker](#-kör-med-docker)
8. [Projektstruktur](#-projektstruktur)
9. [Teknisk Stack](#-teknisk-stack)
10. [Standarder & Formler](#-standarder--formler)

---

## 🚀 Funktioner & Moduler

- **Ohms lag & Effektberäkning ($U, I, R, P$):**
  - Fullständig kalkylator med automatiska formelhärledningar och pedagogiska lösningssteg.
  - Förinställda scenarier för fordon (12V/24V), hushåll (230V), industri (400V) och elektronik (3.3V/5V).
  - Vektorbaserat Ohms hjul / effekttriangel och A4 PDF-rapportexport.

- **Kabeldimensionering & Spänningsfall ($\Delta U$):**
  - 1-fas ($230\,\text{V}$) och 3-fas ($400\,\text{V}$).
  - Ledarmaterial: Koppar ($\text{Cu}$, $\rho = 0.0175\,\Omega\cdot\text{mm}^2/\text{m}$) eller Aluminium ($\text{Al}$, $\rho = 0.0282\,\Omega\cdot\text{mm}^2/\text{m}$).
  - Temperaturkorrigering för ledarresistans ($20^\circ\text{C}$ till $90^\circ\text{C}$).
  - Grafiskt kretsschema med dynamisk spänningsgradient och toleransmätare enligt SS 436 40 00 (belysning max 3%, övrigt max 5%).

- **3-Fas Effekt & Motordimensionering:**
  - Aktiv effekt ($P$), reaktiv effekt ($Q$), skenbar effekt ($S$) och effektfaktor ($\cos\varphi$).
  - Fas- till linjeströmmar och spänningar i Stjärna ($Y$) respektive Triangel ($\Delta$).
  - Faskompensering (beräkning av nödvändig kondensatoreffekt $Q_c$ och kapacitans $C$ i $\mu\text{F}$).
  - Neutralledarström ($I_N$) vid osymmetrisk belastning med vektordiagram (visardiagram).

- **Resistorkretsar (Serie & Parallell):**
  - Obegränsat antal motstånd i serie och parallell med ekvivalent resistans $R_{tot}$.
  - Spänningsdelning och strömfördelning för varje enskild resistor.

- **Tekniska Standarder & Dokumentkoder:**
  - **IEC 61355:** Dokumentkodstruktur (&A, &B, &D, &E, &F...) med sök och filtrering.
  - **IEC 81346-2:** Postbeteckningar (-B givare, -K relä/kontaktor, -Q krafthalvledare/brytare, -W kabel...).
  - **AMA EL 19 & BSAB 96:** Installationskoder, källhänvisningar och gränssnitt.
  - **Standardtabeller:** Ledarmärkning enligt SS-EN 60446, area/säkringstabell, IP-kapslingsklasser.

- **Professionell A4 PDF-rapportgenerator:**
  - Export av tekniska beräkningsunderlag i standardiserat A4-format via `jsPDF`.
  - Inkluderar kretsscheman, toleransmätare, indata/utdata, normreferenser och signaturfält för kvalitetsgranskning.

- **100% PWA & Offline-stöd:**
  - Service worker med automatisk cache via Workbox.
  - Fungerar i fält, ställverk och källarutrymmen utan mobiltäckning.

---

## 📋 Systemkrav

Innan du bygger applikationen behöver du följande installerat på din dator:

- **Node.js**: Version **18.x**, **20.x LTS** (rekommenderas) eller senare.
- **Pakethanterare**: **npm** (följer med Node.js), **bun**, **pnpm** eller **yarn**.
- **Webbläsare**: Modern webbläsare med ES2022-stöd (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari).

Kontrollera dina versioner i terminalen:
```bash
node -v   # Bör visa v18.0.0 eller högre, t.ex. v20.18.0
npm -v    # Bör visa v9.0.0 eller högre
```

---

## 🛠️ Installation & Snabbstart

Följ dessa steg för att installera och starta projektet i utvecklingsläge:

### 1. Klona repositoryt eller navigera till projektmappen
```bash
git clone https://github.com/ditt-konto/eda-toolbox.git
cd eda-toolbox
```

### 2. Installera beroenden
Kör npm för att installera samtliga paket från `package.json`:
```bash
npm install
```
*(Alternativt med Bun: `bun install`)*

### 3. Starta den lokala utvecklingsservern
Starta Vite i utvecklingsläge:
```bash
npm run dev
```

Applikationen startas på:
```
  VITE v8.x  ready in 250 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://0.0.0.0:3000/
```

Öppna webbläsaren på [http://localhost:3000](http://localhost:3000).

---

## 🏗️ Bygg för produktion

När du ska publicera applikationen eller distribuera den till en webbserver/CDN genererar du ett optimerat och minifierat produktionsbygge:

```bash
npm run build
```

Detta utför:
1. Typkontroll via TypeScript (`tsc`).
2. Bundling och minifiering via Vite och Rollup.
3. Generering av CSS via Tailwind CSS v4.
4. Skapande av PWA-manifest och Service Worker i distributionsmappen `/dist`.

### Förhandsgranska produktionsbygget lokalt:
Efter att `npm run build` har slutförts kan du testa bygget lokalt:
```bash
npm run preview
```
Detta startar en lokal webbserver som serverar filerna direkt från `dist/`.

---

## 📜 Skript i package.json

| Kommando | Beskrivning |
| :--- | :--- |
| `npm run dev` | Startar Vite dev-server på port 3000 med Hot Module Replacement |
| `npm run build` | Kompilerar och paketerar hela applikationen till produktionsfärdiga filer i `dist/` |
| `npm run preview` | Startar en lokal HTTP-server för att förhandsgranska `dist/` innan publicering |
| `npm run lint` | Validerar TypeScript-typer och syntax via `tsc --noEmit` utan att generera filer |
| `npm run clean` | Rensar cache- och byggkataloger (`dist`) |

---

## 📱 PWA & Offline-installation

EDA Toolbox är konfigurerad som en fullvärdig **Progressive Web App (PWA)**:

### Installera på dator (Windows / macOS / Linux)
1. Öppna applikationen i **Google Chrome** eller **Microsoft Edge**.
2. Klicka på **Installera EDA Toolbox**-ikonen i adressfältets högra kant (eller klicka på "Installera App"-knappen i appens sidomeny/header).
3. Applikationen installeras som ett fristående program i eget fönster utan webbläsargränssnitt.

### Installera på iPhone & iPad (iOS)
1. Öppna applikationen i **Safari**.
2. Tryck på **Dela-knappen** (fyrkant med uppåtriktad pil).
3. Skrolla ned och välj **Lägg till på hemskärmen** (Add to Home Screen).
4. Välj **Lägg till**.

### Installera på Android
1. Öppna i **Google Chrome**.
2. Tryck på de tre punkterna i menyn eller på installationsbannern längst ned.
3. Välj **Installera app** eller **Lägg till på startskärmen**.

---

## 🐳 Kör med Docker

Om du vill köra eller distribuera appen som en containeriserad applikation med Nginx:

### 1. Skapa en `Dockerfile` i projektets rot:
```dockerfile
# Steg 1: Byggmiljö
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Steg 2: Produktionsmiljö med Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 2. Bygg och starta containern:
```bash
# Bygg Docker-image
docker build -t eda-toolbox:latest .

# Kör containern på port 8080
docker run -d -p 8080:80 --name eda-toolbox eda-toolbox:latest
```

Öppna webbläsaren på [http://localhost:8080](http://localhost:8080).

---

## 📁 Projektstruktur

```
eda-toolbox/
├── public/                 # Statiska filer, ikoner, favicons och PWA-resurser
│   ├── favicon.ico
│   ├── icon.svg
│   └── pwa-192x192.png
├── src/
│   ├── components/         # React-komponenter grupperade efter modul
│   │   ├── Converter/      # Enhetsomvandlare för el och fysik
│   │   ├── Dashboard/      # Huvudöversikt och branschnyhetsflöde
│   │   ├── OhmsLaw/        # Ohms lag kalkylator och formelvisare
│   │   ├── Reference/      # IEC 81346, IEC 61355, AMA & BSAB lathundar
│   │   ├── Report/         # A4 PDF-rapportgenerator och förhandsgranskning
│   │   ├── Resistors/      # Serie- och parallellkopplingar
│   │   ├── ThreePhase/     # 3-fas effekt, stjärna/triangel, faskompensering
│   │   ├── VoltageDrop/    # Spänningsfallskalkylator med kretsscheman
│   │   ├── BuildInfoModal.tsx # Interaktiv installations- & byggguide
│   │   ├── Header.tsx      # Appens toppmeny med snabbknappar
│   │   ├── Sidebar.tsx     # Responsiv sidonavigering
│   │   └── Navigation.tsx  # Mobil bottenmeny
│   ├── types/              # TypeScript-gränssnitt och typdefinitioner
│   ├── utils/              # Beräkningslogik, formelmotor och PDF-ritning
│   │   ├── generateCalculationPdf.ts # Vektoriserad A4 PDF-layout
│   │   └── reportHelpers.ts          # Mappning av beräkningsresultat till PDF
│   ├── App.tsx             # Huvudapplikationskomponent med flikhantering
│   ├── main.tsx            # React DOM-startpunkt
│   └── index.css           # Global Tailwind CSS v4 styling
├── index.html              # HTML-ingångssida med meta-taggar och PWA-inställningar
├── metadata.json           # Applikationsmetadata för AI Studio
├── package.json            # Beroenden, versionsnummer och skript
├── tsconfig.json           # TypeScript-kompilatorkonfiguration
└── vite.config.ts          # Vite-konfiguration och VitePWA plugin
```

---

## 🧰 Teknisk Stack

- **Frontend-ramverk:** React 19 med Functional Components & Hooks
- **Programspråk:** TypeScript 5+ (strikt typning)
- **Byggverktyg:** Vite 8 med blixtsnabb bundling och dev-server
- **Styling & CSS:** Tailwind CSS v4 (ingen separat runtime-overhead)
- **Ikonpaket:** Lucide React
- **Dokument- & PDF-motor:** jsPDF (vektoriserad rendering med millimeterprecision för A4)
- **Animationer:** Motion (tidigare Framer Motion)
- **Offline / PWA:** Vite Plugin PWA med Workbox service worker caching

---

## 📐 Standarder & Formler

Beräkningar och beteckningar implementerade i applikationen vilar på följande standarder:

1. **SS 436 40 00 (Elinstallationsreglerna):**
   - Spänningsfall: Max 3 % för belysningskretsar och max 5 % för övriga förbrukare.
   - Formel för 1-fas: $\Delta U = \frac{2 \cdot L \cdot I \cdot \cos\varphi}{\gamma \cdot A}$
   - Formel för 3-fas: $\Delta U = \frac{\sqrt{3} \cdot L \cdot I \cdot \cos\varphi}{\gamma \cdot A}$
2. **SEK Handbok 444:** Riktlinjer för ledningsdimensionering och skydd mot överströmmar.
3. **SS-EN IEC 81346-1 & 81346-2:** Struktureringsprinciper och referensbeteckningar för industriella system, installationer och utrustning.
4. **SS-EN 61355-1:** Klassificering av dokumenttyper för anläggningar, system och utrustning.
5. **SS-EN 60446:** Färgkodning av ledare (L1 Brun, L2 Svart, L3 Grå, N Blå, PE Grön/Gul).
6. **AMA EL 19 & BSAB 96:** Svenska koder och anvisningar för el- och teleinstallationer.

---

## 📄 Licens & Upphovsrätt

© 2026 EDA Toolbox. Utvecklad för elingenjörer, elkonstruktörer, automationstekniker och installatörer.
