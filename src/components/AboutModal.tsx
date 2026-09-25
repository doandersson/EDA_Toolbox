import React, { useState } from 'react';
import {
  X,
  Info,
  ShieldCheck,
  Mail,
  Copyright,
  ExternalLink,
  Copy,
  Check,
  Zap,
  BookOpen,
  FileText,
  Heart,
  Send,
  Code2,
  Award,
  Sparkles,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'about' | 'copyright' | 'contact';
}

export const AboutModal: React.FC<Props> = ({
  isOpen,
  onClose,
  defaultTab = 'about',
}) => {
  const [activeTab, setActiveTab] = useState<'about' | 'copyright' | 'contact'>(defaultTab);
  const [copiedEmail, setCopiedEmail] = useState(false);

  if (!isOpen) return null;

  const contactEmail = 'doandersson@gmail.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(contactEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl relative space-y-6 animate-in zoom-in-95 duration-200 my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-sm">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                  Om EDA Toolbox
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                  PRO v1.2
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Professionell elteknik, dimensionering och standardiserade beteckningar
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-950 hover:bg-slate-800 border border-slate-800 transition cursor-pointer"
            aria-label="Stäng om-dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/70 border border-slate-800 rounded-2xl shrink-0">
          <button
            onClick={() => setActiveTab('about')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeTab === 'about'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>Om appen</span>
          </button>

          <button
            onClick={() => setActiveTab('copyright')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeTab === 'copyright'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Copyright className="w-3.5 h-3.5" />
            <span>Copyright &amp; Normer</span>
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeTab === 'contact'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Kontakt &amp; Support</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin scrollbar-thumb-slate-800 text-slate-300 text-xs sm:text-sm">
          {/* TAB 1: OM APPEN */}
          {activeTab === 'about' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-950 to-indigo-950/40 border border-slate-800 space-y-2.5">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>En heltäckande verktygslåda för elkonstruktion &amp; automation</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  EDA Toolbox är en svenskutvecklad ingenjörsplattform skapad för att förenkla och kvalitetssäkra det dagliga arbetet för elkonstruktörer, elingenjörer, automationstekniker och installatörer. Applikationen samlar beräkningar, standardlathundar och rapportgenerering i ett enhetligt, responsivt gränssnitt.
                </p>
              </div>

              {/* Module cards grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="font-bold text-amber-300 text-xs flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Ohms lag &amp; Effekthjul</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Formelhärledningar, pedagogiska uträkningssteg och interaktiv kretssimulering för $U, I, R, P$.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="font-bold text-emerald-300 text-xs flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Spänningsfall (SS 436 40 00)</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Kabeldimensionering med koppar/aluminium, temperaturfaktor och grafisk spänningsgradient.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="font-bold text-indigo-300 text-xs flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5" />
                    <span>3-Fas, Motorer &amp; Faskompensering</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Stjärna ($Y$) / Triangel ($\Delta$), effekttriangel ($P, Q, S$), kondensatorberäkning och osymmetrisk neutralledarström.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="font-bold text-cyan-300 text-xs flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Standarder (81346 &amp; 61355)</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Postbeteckningar (-), dokumentkoder (&amp;), AMA EL 19 &amp; BSAB 96 samt kabelledarfärger enligt SS-EN 60446.
                  </p>
                </div>
              </div>

              {/* Technical features */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span className="text-slate-300 font-semibold">100% PWA &amp; Offline-stöd</span>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">Klientbaserad arkitektur</span>
              </div>
            </div>
          )}

          {/* TAB 2: COPYRIGHT & NORMER */}
          {activeTab === 'copyright' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Copyright notice box */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Copyright className="w-4 h-4 text-amber-400" />
                  <span>Upphovsrätt &amp; Äganderätt</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  © 2026 EDA Toolbox. Alla rättigheter förbehållna. Programvaran och dess beräkningsmoduler är utvecklade för professionellt och internt bruk inom elprojektering, automation och installationsarbete.
                </p>
                <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                  Licensierad under <strong>MIT License</strong> för fri användning och vidareutveckling.
                </div>
              </div>

              {/* Standard norms list */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <span>Tillämpade standarder och föreskrifter</span>
                </div>
                <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <div>
                      <strong className="text-white">SS 436 40 00 (Elinstallationsreglerna):</strong> Svensk standard för dimensionering av ledningar, tillåtet spänningsfall samt skydd mot elchock och överström.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <div>
                      <strong className="text-white">SEK Handbok 444:</strong> Svenska Elstandardens riktlinjer för dimensionering av kablar och ledningssystem.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <div>
                      <strong className="text-white">SS-EN IEC 81346-1 &amp; 81346-2:</strong> Industriella system, installationer och utrustning – Struktureringsprinciper och referensbeteckningar (Postbeteckningar).
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <div>
                      <strong className="text-white">SS-EN 61355-1:</strong> Klassificering av dokumenttyper för anläggningar, system och utrustning (Dokumentkoder).
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <div>
                      <strong className="text-white">AMA EL 19 &amp; BSAB 96:</strong> Svensk Byggtjänsts standardiserade koder för el- och teletekniska beskrivningar.
                    </div>
                  </li>
                </ul>
              </div>

              {/* Disclaimer */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 leading-relaxed">
                <strong>Ansvarsfriskrivning:</strong> Beräkningar och lathundar är framtagna med högsta noggrannhet och baseras på gällande standarder. Resultaten är avsedda som dimensionerings- och projekteringsunderlag och ersätter inte slutlig granskning eller godkännande av behörig elinstallatör eller auktoriserad besiktningsman.
              </div>
            </div>
          )}

          {/* TAB 3: KONTAKT & SUPPORT */}
          {activeTab === 'contact' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Mail className="w-4 h-4 text-cyan-400" />
                  <span>Direktkontakt &amp; Support</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Har du frågor, förslag på nya funktioner, felrapporter eller idéer till framtida standarder i EDA Toolbox? Tveka inte att höra av dig via e-post!
                </p>

                {/* Email card with copy & mailto */}
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/15 text-cyan-400 flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-400 font-medium">Officiell e-postadress</div>
                      <div className="text-xs sm:text-sm font-bold text-white font-mono">{contactEmail}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyEmail}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold transition cursor-pointer border border-slate-700"
                    >
                      {copiedEmail ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Kopierat</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>Kopiera</span>
                        </>
                      )}
                    </button>

                    <a
                      href={`mailto:${contactEmail}?subject=${encodeURIComponent('Fråga / Feedback angående EDA Toolbox')}&body=${encodeURIComponent('Hej Daniel,\n\nJag använder EDA Toolbox och vill lämna följande feedback / fråga:\n\n')}`}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Skicka e-post</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Developer info */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-amber-400" />
                  <span>Utveckling &amp; Feedback</span>
                </div>
                <div className="text-xs text-slate-300 space-y-1.5 leading-relaxed">
                  <p>
                    <strong>Utvecklare:</strong> Daniel Andersson (<span className="text-cyan-300 font-mono text-[11px]">doandersson@gmail.com</span>)
                  </p>
                  <p>
                    <strong>Geografisk inriktning:</strong> Sverige &amp; Norden med full anpassning för europeiska IEC- och CENELEC-standarder.
                  </p>
                  <p>
                    <strong>Feedback tas tacksamt emot:</strong> Nya förinställningar, kabeltyper, AMA-koder eller beräkningsmoduler läggs löpande till baserat på användarönskemål.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>Byggd med passion för elteknik</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>i Sverige</span>
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
