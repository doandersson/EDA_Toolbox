import React, { useState } from 'react';
import {
  X,
  Terminal,
  Download,
  Copy,
  Check,
  Cpu,
  Layers,
  CheckCircle2,
  ExternalLink,
  Laptop,
  Smartphone,
  ShieldCheck,
  FileCode,
  Zap,
  FolderGit2,
  Server,
  BookOpen,
  HelpCircle,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'quickstart' | 'pwa' | 'docker' | 'architecture';

export const BuildInfoModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('quickstart');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  const copyButton = (text: string, key: string, label?: string) => (
    <button
      onClick={() => handleCopy(text, key)}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono font-medium transition cursor-pointer border border-slate-700 shadow-sm"
      title="Kopiera kommando"
    >
      {copiedKey === key ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-emerald-400 font-sans text-[11px] font-semibold">Kopierat!</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-sans text-[11px]">{label || 'Kopiera'}</span>
        </>
      )}
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-5 sm:p-7 shadow-2xl relative space-y-6 animate-in fade-in zoom-in-95 duration-200 my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-white">
                  Bygg- &amp; Installationsinformation
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
                  v1.0
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Guide för att bygga, köra och installera EDA Toolbox lokalt eller som PWA.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-950 hover:bg-slate-800 border border-slate-800 transition cursor-pointer"
            aria-label="Stäng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/70 border border-slate-800 rounded-2xl shrink-0 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('quickstart')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 ${
              activeTab === 'quickstart'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Snabbstart &amp; Bygg</span>
          </button>

          <button
            onClick={() => setActiveTab('pwa')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 ${
              activeTab === 'pwa'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>PWA &amp; App-installation</span>
          </button>

          <button
            onClick={() => setActiveTab('docker')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 ${
              activeTab === 'docker'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Docker &amp; Hosting</span>
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 ${
              activeTab === 'architecture'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Arkitektur &amp; Moduler</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin scrollbar-thumb-slate-800 text-slate-300 text-xs sm:text-sm">
          {/* TAB 1: QUICKSTART */}
          {activeTab === 'quickstart' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Requirements Banner */}
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-white">Systemkrav för att bygga</div>
                    <div className="text-[11px] text-slate-400">
                      Node.js v18.0+ eller v20.x LTS (rekommenderas) • npm v9+ eller Bun 1.0+
                    </div>
                  </div>
                </div>
                {copyButton('node -v && npm -v', 'sys-req', 'Kopiera test')}
              </div>

              {/* Step 1: Install */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/90 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-mono text-xs font-bold flex items-center justify-center">
                      1
                    </span>
                    <span className="font-bold text-white text-xs sm:text-sm">
                      Installera alla paket &amp; beroenden
                    </span>
                  </div>
                  {copyButton('npm install', 'step-1')}
                </div>
                <p className="text-xs text-slate-400">
                  Laddar ner React 19, Vite, Tailwind CSS v4, jsPDF och Lucide ikoner.
                </p>
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 font-mono text-xs text-amber-300">
                  npm install
                </div>
              </div>

              {/* Step 2: Dev Server */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/90 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-mono text-xs font-bold flex items-center justify-center">
                      2
                    </span>
                    <span className="font-bold text-white text-xs sm:text-sm">
                      Starta lokal utvecklingsserver
                    </span>
                  </div>
                  {copyButton('npm run dev', 'step-2')}
                </div>
                <p className="text-xs text-slate-400">
                  Kör Vite dev-server på port 3000 med Hot Module Replacement.
                </p>
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 font-mono text-xs text-cyan-300">
                  npm run dev
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <span>Öppna i webbläsaren:</span>
                  <a
                    href="http://localhost:3000"
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-400 hover:underline font-mono"
                  >
                    http://localhost:3000
                  </a>
                </div>
              </div>

              {/* Step 3: Production Build */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/90 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold flex items-center justify-center">
                      3
                    </span>
                    <span className="font-bold text-white text-xs sm:text-sm">
                      Bygg för produktion (Dist)
                    </span>
                  </div>
                  {copyButton('npm run build', 'step-3')}
                </div>
                <p className="text-xs text-slate-400">
                  Kompilerar TypeScript, minifierar källkoden och genererar produktionsfärdiga filer i mappen <code className="text-amber-300 font-mono text-xs">/dist</code>.
                </p>
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 font-mono text-xs text-emerald-300">
                  npm run build
                </div>
              </div>

              {/* Step 4: Preview & Lint */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white text-xs">Förhandsgranska bygge</span>
                    {copyButton('npm run preview', 'step-preview')}
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg font-mono text-xs text-slate-300">
                    npm run preview
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white text-xs">Kör typkontroll (Lint)</span>
                    {copyButton('npm run lint', 'step-lint')}
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg font-mono text-xs text-slate-300">
                    npm run lint
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PWA */}
          {activeTab === 'pwa' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3.5">
                <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="text-xs sm:text-sm font-bold text-amber-300">
                    Installera som självständig app – 100% Offline-redo
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    EDA Toolbox har fullt PWA-stöd (Progressive Web App). När appen är installerad sparas alla kalkylatorer, formler, IEC-koder och rapportmotorer lokalt så att du kan arbeta i fält utan internetuppkoppling.
                  </p>
                </div>
              </div>

              {/* Platforms */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Desktop */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                  <div className="flex items-center gap-2 text-white font-bold text-xs sm:text-sm">
                    <Laptop className="w-4 h-4 text-cyan-400" />
                    <span>Dator (Windows, macOS, Linux)</span>
                  </div>
                  <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside leading-relaxed">
                    <li>Öppna appen i <strong>Google Chrome</strong> eller <strong>Microsoft Edge</strong>.</li>
                    <li>Klicka på ikonen <strong>Installera EDA Toolbox</strong> i adressfältets högra kant.</li>
                    <li>Alternativt: Klicka på knappen <strong>"Installera App"</strong> i sidomenyn.</li>
                    <li>Appen startar nu som ett eget fönster utan webbläsargränssnitt.</li>
                  </ol>
                </div>

                {/* Mobile */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                  <div className="flex items-center gap-2 text-white font-bold text-xs sm:text-sm">
                    <Smartphone className="w-4 h-4 text-amber-400" />
                    <span>Mobil &amp; Surfplatta (iOS &amp; Android)</span>
                  </div>
                  <div className="space-y-2 text-xs text-slate-300">
                    <div>
                      <strong className="text-white">iPhone &amp; iPad (Safari):</strong>
                      <p className="text-slate-400 mt-0.5">
                        Tryck på <strong>Dela</strong>-knappen (fyrkant med pil) och välj <strong>"Lägg till på hemskärmen"</strong>.
                      </p>
                    </div>
                    <div>
                      <strong className="text-white">Android (Chrome):</strong>
                      <p className="text-slate-400 mt-0.5">
                        Tryck på menyn (tre punkter) och välj <strong>"Installera app"</strong> eller klicka på installationsbannern.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Workbox details */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 space-y-1">
                <div className="font-semibold text-slate-200">Teknisk PWA-specifikation:</div>
                <p>
                  Automatisk Service Worker-uppdatering med Workbox-caching för HTML, CSS, JS och vektorikoner. Manifestet är deklarerat med start_url: '/', tema-färg: '#0b1329' och stöd för maskable ikoner.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: DOCKER & HOSTING */}
          {activeTab === 'docker' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-white text-xs sm:text-sm">
                    <Server className="w-4 h-4 text-cyan-400" />
                    <span>Dockerfile (Flera byggsteg med Node 20 + Nginx)</span>
                  </div>
                  {copyButton(
                    `# Multi-stage Dockerfile\nFROM node:20-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\nFROM nginx:alpine\nCOPY --from=builder /app/dist /usr/share/nginx/html\nEXPOSE 80\nCMD ["nginx", "-g", "daemon off;"]`,
                    'dockerfile',
                    'Kopiera Dockerfile'
                  )}
                </div>

                <pre className="bg-slate-900 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto leading-relaxed">
{`# 1. Byggstadium
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 2. Produktionsstadium med Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]`}
                </pre>
              </div>

              {/* Docker commands */}
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="text-xs font-semibold text-white">1. Bygg Docker-image:</div>
                    <code className="text-xs text-amber-300 font-mono">docker build -t eda-toolbox:latest .</code>
                  </div>
                  {copyButton('docker build -t eda-toolbox:latest .', 'docker-build')}
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="text-xs font-semibold text-white">2. Starta container på port 8080:</div>
                    <code className="text-xs text-cyan-300 font-mono">docker run -d -p 8080:80 --name eda-toolbox eda-toolbox:latest</code>
                  </div>
                  {copyButton('docker run -d -p 8080:80 --name eda-toolbox eda-toolbox:latest', 'docker-run')}
                </div>
              </div>

              {/* Static hosting note */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 space-y-1">
                <strong className="text-slate-200">Statisk driftsättning (Vercel / Netlify / Cloudflare Pages):</strong>
                <p>
                  Eftersom applikationen är en ren klientbaserad Single Page Application (SPA) kan mappen <code className="text-white font-mono">/dist</code> deployas direkt till valfri statisk hostingtjänst. Byggkommando: <code className="text-white font-mono">npm run build</code>, Utdata: <code className="text-white font-mono">dist</code>.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: ARCHITECTURE */}
          {activeTab === 'architecture' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Ohms lag &amp; Kretsscheman</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Formelvisare, Ohms effekthjul i SVG och pedagogiska mellansteg.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Spänningsfall (SS 436 40 00)</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Koppar/Aluminium, temperaturkorrigering och toleransmätare.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>3-Fas &amp; Motordimensionering</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Effekttriangel, fas- och linjeströmmar, faskompensering och N-ledarström.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Standarder (81346 &amp; 61355)</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Snabb lookup av postbeteckningar (-), dokumentkoder (&amp;) och AMA EL 19.
                  </p>
                </div>
              </div>

              {/* Technologies */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-white">Använda kärnbibliotek &amp; ramverk:</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 font-mono text-[11px]">
                    <span className="text-slate-400">React:</span> <span className="text-cyan-300">19.0.x</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 font-mono text-[11px]">
                    <span className="text-slate-400">Vite:</span> <span className="text-amber-300">8.3.x</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 font-mono text-[11px]">
                    <span className="text-slate-400">Tailwind:</span> <span className="text-sky-300">v4.3.x</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 font-mono text-[11px]">
                    <span className="text-slate-400">TypeScript:</span> <span className="text-blue-300">7.0.x</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 font-mono text-[11px]">
                    <span className="text-slate-400">jsPDF:</span> <span className="text-emerald-300">4.2.x</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 font-mono text-[11px]">
                    <span className="text-slate-400">Lucide:</span> <span className="text-rose-300">0.546.x</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Klar att köra lokalt med <code className="text-slate-200 font-mono">npm run dev</code></span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition cursor-pointer shadow-md"
          >
            Stäng guide
          </button>
        </div>
      </div>
    </div>
  );
};
