# Installationsguide för EDA Toolbox

Denna guide beskriver steg för steg hur du installerar, bygger och driftar **EDA Toolbox** i olika miljöer:
- [1. Förutsättningar & Systemkrav](#1-förutsättningar--systemkrav)
- [2. Installation på Windows 10/11](#2-installation-på-windows-1011)
- [3. Installation på macOS](#3-installation-på-macos)
- [4. Installation på Linux (Ubuntu, Debian, Fedora)](#4-installation-på-linux)
- [5. Bygga applikationen för produktion](#5-bygga-applikationen-för-produktion)
- [6. Bygga och köra med Docker](#6-bygga-och-köra-med-docker)
- [7. Installation som PWA (Desktop & Mobil)](#7-installation-som-pwa-desktop--mobil)
- [8. Felsökning & Vanliga frågor](#8-felsökning--vanliga-frågor)

---

## 1. Förutsättningar & Systemkrav

Applikationen är byggd på modern JavaScript/TypeScript med **React 19** och **Vite**. Du behöver följande installerat på ditt system:

- **Node.js:** Version **18.x**, **20.x LTS** (rekommenderas starkt) eller senare.
- **npm:** Medföljer Node.js (version 9 eller 10+).
- **Git:** För att klona källkoden.
- **Minneskrav:** Minst 2 GB RAM (för att köra kompilering och bundling).
- **Hårddisk:** Ca 250 MB ledigt utrymme för `node_modules` och byggfiler.

---

## 2. Installation på Windows 10/11

### Steg 2.1: Installera Node.js
1. Ladda ner Node.js LTS-installeraren (.msi) från officiella webbplatsen: [https://nodejs.org](https://nodejs.org).
2. Kör installationsprogrammet och följ anvisningarna. Se till att kryssrutan för att inkludera `npm` i systemets `PATH` är markerad.
3. Öppna **PowerShell** eller **Windows Terminal** och verifiera:
   ```powershell
   node -v
   npm -v
   ```

### Steg 2.2: Hämta källkoden
```powershell
# Klona eller ladda ner projektet till valfri mapp, t.ex. C:\Projekt
git clone https://github.com/ditt-konto/eda-toolbox.git
cd eda-toolbox
```

### Steg 2.3: Installera paket
```powershell
npm install
```

### Steg 2.4: Starta utvecklingsservern
```powershell
npm run dev
```
Öppna webbläsaren på `http://localhost:3000`.

---

## 3. Installation på macOS

### Steg 3.1: Installera Node.js via Homebrew eller nvm
Öppna Terminal och kör något av följande:

**Alternativ A: Med Homebrew**
```bash
brew install node@20
```

**Alternativ B: Med NVM (Node Version Manager - Rekommenderas)**
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.zshrc
nvm install 20
nvm use 20
```

### Steg 3.2: Klona och installera
```bash
git clone https://github.com/ditt-konto/eda-toolbox.git
cd eda-toolbox
npm install
```

### Steg 3.3: Starta
```bash
npm run dev
```

---

## 4. Installation på Linux (Ubuntu, Debian, Fedora)

### Ubuntu / Debian:
```bash
# 1. Installera NodeSource repository för Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs git build-essential

# 2. Kontrollera versioner
node -v
npm -v

# 3. Klona och installera
git clone https://github.com/ditt-konto/eda-toolbox.git
cd eda-toolbox
npm install

# 4. Starta i dev-läge
npm run dev -- --host 0.0.0.0
```

### Fedora / RHEL:
```bash
sudo dnf install -y nodejs git
git clone https://github.com/ditt-konto/eda-toolbox.git
cd eda-toolbox
npm install
npm run dev
```

---

## 5. Bygga applikationen för produktion

När applikationen ska driftsättas i skarp miljö genereras statiska HTML/JS/CSS-filer:

```bash
# Kör produktionsbygge
npm run build
```

När kompileringen är klar har en katalog med namnet `dist/` skapats i projektets rot. Katalogen innehåller:
- `index.html` (optimerad entrépunkt)
- `assets/` (minifierade och hashade JavaScript- och CSS-filer)
- `manifest.webmanifest` (PWA-applikationsmanifest)
- `sw.js` (Service Worker för offline-funktionalitet)
- Bilder, ikoner och typsnitt

### Testa bygget med preview:
```bash
npm run preview
```
Detta startar en lokal webbserver som serverar `dist/` precis som i en riktig produktionsmiljö.

### Publicering på valfri webbserver:
Kopiera innehållet i `dist/` till rotmappen på din webbserver:
- **Nginx:** `/var/www/html/` eller konfigurerad `root`.
- **Apache:** `/var/www/html/` med mod_rewrite för SPA-routing.
- **Vercel / Netlify / Cloudflare Pages:** Peka "Build command" till `npm run build` och "Output directory" till `dist`.

---

## 6. Bygga och köra med Docker

Om du föredrar att distribuera applikationen i en isolerad Docker-container:

### 1. Skapa `Dockerfile` i roten:
```dockerfile
# Steg 1: Byggfas
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Steg 2: Produktionsserver med Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Konfigurera SPA-fallback i Nginx
RUN echo 'server { listen 80; location / { root /usr/share/nginx/html; index index.html; try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 2. Bygg containern:
```bash
docker build -t eda-toolbox:v1 .
```

### 3. Starta containern:
```bash
docker run -d -p 8080:80 --name eda-toolbox-app eda-toolbox:v1
```
Gå till `http://localhost:8080` i din webbläsare.

---

## 7. Installation som PWA (Desktop & Mobil)

EDA Toolbox stöder installation direkt från webbläsaren som en lokal skrivbords- eller mobilapplikation.

### Fördelar med PWA:
- Startar blixtsnabbt från skrivbordet eller hemskärmen.
- Eget fristående fönster utan webbläsarens adressfält.
- **Fungerar 100% offline:** Alla beräkningsmotorer, lathundar, IEC-koder och PDF-rapporter sparas lokalt i webbläsarens cache.

### Installation på dator (Google Chrome / Edge):
1. Navigera till appens URL.
2. I adressfältets högra hörn klickar du på ikonen **Installera EDA Toolbox**.
3. Välj **Installera**.
4. En genväg skapas automatiskt i startmenyn/skrivbordet/dockan.

### Installation på iOS (iPhone/iPad):
1. Öppna webbsidan i **Safari**.
2. Klicka på **Dela**-ikonen (rektangel med uppåtpil i nedre menyn).
3. Välj **Lägg till på hemskärmen**.
4. Ange önskat namn och tryck **Lägg till**.

---

## 8. Felsökning & Vanliga frågor

### F: Får felmeddelande "Port 3000 is already in use"
**Svar:** En annan process använder port 3000. Du kan ange en annan port:
```bash
npm run dev -- --port 3001
```

### F: "npm install misslyckas med ERESOLVE eller peer dependency conflict"
**Svar:** Kör installation med legacy peer deps:
```bash
npm install --legacy-peer-deps
```

### F: "Kompileringen misslyckas vid npm run build"
**Svar:** Kör typkontroll för att identifiera exakta rader:
```bash
npm run lint
```
Kontrollera att du använder Node.js 18 eller senare (`node -v`).

### F: "Hur rensar jag gamla byggfiler och cache?"
**Svar:** Kör projektets inbyggda rensningsskript:
```bash
npm run clean
# eller manuellt:
rm -rf dist node_modules
npm install
```

---

*Vid frågor eller förfrågningar, se informationen i applikationens bygg- och hjälpmeny.*
