import React, { useState } from 'react';
import {
  X,
  Laptop,
  Download,
  ExternalLink,
  Copy,
  Check,
  CheckCircle2,
  Terminal,
  Smartphone,
  ShieldCheck,
  Zap,
  ArrowRight,
  FolderGit2,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onNativeInstall?: () => void;
  isInstallable?: boolean;
}

export const DesktopInstallModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onNativeInstall,
  isInstallable = false,
}) => {
  const [activeTab, setActiveTab] = useState<'pwa' | 'scripts' | 'mobile'>('pwa');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentUrl = window.location.href;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleCopyCmd = (cmd: string, id: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const handleOpenStandaloneTab = () => {
    window.open(currentUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl relative space-y-6 animate-in zoom-in-95 duration-200 my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-sm">
              <Laptop className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                  Installera på din dator
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                  SKRIVBORDS-APP
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Installera EDA Toolbox som ett fristående program i Windows, macOS eller Linux
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-950 hover:bg-slate-800 border border-slate-800 transition cursor-pointer"
            aria-label="Stäng installationsdialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/70 border border-slate-800 rounded-2xl shrink-0">
          <button
            onClick={() => setActiveTab('pwa')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeTab === 'pwa'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>PWA i webbläsare</span>
          </button>

          <button
            onClick={() => setActiveTab('scripts')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeTab === 'scripts'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Lokal dator (Skript / CLI)</span>
          </button>

          <button
            onClick={() => setActiveTab('mobile')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeTab === 'mobile'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobil &amp; Tablet</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin scrollbar-thumb-slate-800 text-slate-300 text-xs sm:text-sm">
          {/* TAB 1: PWA DESKTOP */}
          {activeTab === 'pwa' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Native Prompt Available Action */}
              {isInstallable && onNativeInstall ? (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-emerald-500/15 border border-amber-500/30 flex items-center justify-between gap-3 shadow-md">
                  <div>
                    <h3 className="font-bold text-white text-sm">Direktinstallation är tillgänglig!</h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Din webbläsare är redo att installera applikationen med ett enda klick.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onNativeInstall();
                      onClose();
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition cursor-pointer shadow-md shrink-0"
                  >
                    <Download className="w-4 h-4" />
                    <span>Installera nu</span>
                  </button>
                </div>
              ) : null}

              {/* Iframe explanation & Open in standalone window */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-white font-bold text-xs sm:text-sm flex items-center gap-2">
                      <ExternalLink className="w-4 h-4 text-cyan-400" />
                      <span>Steg 1: Öppna appen i fullskärm i webbläsaren</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Om du ser denna app inbäddad i en ram (iframe), blockerar webbläsaren av säkerhetsskäl installationsknappen. Öppna appen i en egen flik så aktiveras webbläsarens installationsikon direkt.
                    </p>
                  </div>

                  <button
                    onClick={handleOpenStandaloneTab}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition cursor-pointer shrink-0 shadow-sm"
                  >
                    <span>Öppna i ny flik</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-400 truncate">URL: {currentUrl}</span>
                  <button
                    onClick={handleCopyUrl}
                    className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 transition cursor-pointer shrink-0 font-medium"
                  >
                    {copiedUrl ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Kopierad</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Kopiera länk</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Browser Instructions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Google Chrome */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-white font-bold text-xs flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                    <span>Google Chrome (Windows / Mac)</span>
                  </div>
                  <ol className="text-xs text-slate-300 space-y-1.5 list-decimal list-inside leading-relaxed">
                    <li>Klicka på ikonen <strong>Installera (⊕)</strong> till höger i adressfältet.</li>
                    <li>Eller: Klicka på menyn <strong>(⋮) ➜ Spara och dela ➜ Installera EDA Toolbox</strong>.</li>
                    <li>Välj <strong>Installera</strong>. En genväg skapas på skrivbordet.</li>
                  </ol>
                </div>

                {/* Microsoft Edge */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-white font-bold text-xs flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                    <span>Microsoft Edge (Windows / Mac)</span>
                  </div>
                  <ol className="text-xs text-slate-300 space-y-1.5 list-decimal list-inside leading-relaxed">
                    <li>Klicka på ikonen <strong>App tillgänglig</strong> i adressfältet.</li>
                    <li>Eller: Klicka på <strong>(...) ➜ Appar ➜ Installera den här webbplatsen</strong>.</li>
                    <li>Appen körs i ett eget fönster och kan fästas i Aktivitetsfältet.</li>
                  </ol>
                </div>
              </div>

              {/* Benefits */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>100% Offline-stöd:</strong> När appen är installerad kan du öppna den och utföra beräkningar helt utan internetuppkoppling i ställverk eller ute i fält.
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: LOCAL COMPUTER SCRIPTS & CLI */}
          {activeTab === 'scripts' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                <div className="text-white font-bold text-xs sm:text-sm flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-amber-400" />
                  <span>Kör eller installera lokalt med färdiga skript</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Applikationens källkod innehåller färdiga körbara skript för Windows, macOS och Linux. Du kan installera och starta på din egen dator med ett enda dubbelklick!
                </p>
              </div>

              {/* Windows Script */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white text-xs flex items-center gap-1.5">
                    <span className="text-amber-400">Windows:</span>
                    <code className="text-amber-300 font-mono text-[11px]">install.bat &amp; run.bat</code>
                  </div>
                  <button
                    onClick={() => handleCopyCmd('.\\install.bat', 'win-script')}
                    className="text-[11px] text-slate-400 hover:text-white transition cursor-pointer font-mono"
                  >
                    {copiedCmd === 'win-script' ? 'Kopierat!' : 'Kopiera'}
                  </button>
                </div>
                <p className="text-xs text-slate-400">
                  Dubbelklicka på filen <code className="text-slate-200">install.bat</code> i projektmappen. Den verifierar Node.js, kör <code className="text-slate-200">npm install</code>, bygger appen och startar den direkt. För snabbstart i framtiden dubbelklickar du bara på <code className="text-slate-200">run.bat</code>.
                </p>
              </div>

              {/* Mac / Linux Script */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white text-xs flex items-center gap-1.5">
                    <span className="text-cyan-400">macOS / Linux:</span>
                    <code className="text-cyan-300 font-mono text-[11px]">./install.sh &amp; ./run.sh</code>
                  </div>
                  <button
                    onClick={() => handleCopyCmd('chmod +x install.sh run.sh && ./install.sh', 'unix-script')}
                    className="text-[11px] text-slate-400 hover:text-white transition cursor-pointer font-mono"
                  >
                    {copiedCmd === 'unix-script' ? 'Kopierat!' : 'Kopiera'}
                  </button>
                </div>
                <p className="text-xs text-slate-400">
                  Öppna terminalen i projektmappen och kör:
                </p>
                <div className="bg-slate-900 p-2 rounded-lg font-mono text-xs text-cyan-300 border border-slate-800">
                  chmod +x install.sh run.sh && ./install.sh
                </div>
              </div>

              {/* CLI one liner */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Manuella npm-kommandon:</span>
                  <button
                    onClick={() => handleCopyCmd('npm install && npm run build && npm run preview', 'npm-all')}
                    className="text-[11px] text-slate-400 hover:text-white transition cursor-pointer font-mono"
                  >
                    {copiedCmd === 'npm-all' ? 'Kopierat!' : 'Kopiera alla'}
                  </button>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg font-mono text-xs text-emerald-300 border border-slate-800 overflow-x-auto">
                  npm install &amp;&amp; npm run build &amp;&amp; npm run preview
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MOBILE */}
          {activeTab === 'mobile' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-white font-bold text-xs flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                    <span>iPhone &amp; iPad (Safari)</span>
                  </div>
                  <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside leading-relaxed">
                    <li>Öppna webbplatsen i <strong>Safari</strong>.</li>
                    <li>Tryck på <strong>Dela-knappen</strong> (fyrkant med pil).</li>
                    <li>Välj <strong>Lägg till på hemskärmen</strong>.</li>
                    <li>Appen sparas med egen ikon och startar i fullskärm.</li>
                  </ol>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-white font-bold text-xs flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span>Android (Google Chrome)</span>
                  </div>
                  <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside leading-relaxed">
                    <li>Öppna webbplatsen i <strong>Chrome</strong>.</li>
                    <li>Tryck på menyn <strong>(tre punkter)</strong>.</li>
                    <li>Välj <strong>Installera app</strong> eller <strong>Lägg till på startskärmen</strong>.</li>
                    <li>Appen installeras direkt i telefonens applista.</li>
                  </ol>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Fristående appfönster utan webbläsarkontroller</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition cursor-pointer shadow-md"
          >
            Stäng
          </button>
        </div>
      </div>
    </div>
  );
};
