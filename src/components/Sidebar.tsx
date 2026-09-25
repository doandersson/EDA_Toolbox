import React from 'react';
import { ActiveTab } from '../types/electrical';
import { PWAInstallButton } from './PWAInstallButton';
import {
  Zap,
  Home,
  Cable,
  Cpu,
  Network,
  ArrowLeftRight,
  BookOpen,
  FileText,
  Search,
  Building2,
  Palette,
  ShieldAlert,
  History as HistoryIcon,
  Wifi,
  ChevronRight,
  X,
  Sparkles,
} from 'lucide-react';

interface Props {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab, subTab?: string) => void;
  historyCount: number;
  onOpenHistory: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  referenceSubTab?: string;
}

export const Sidebar: React.FC<Props> = ({
  activeTab,
  onSelectTab,
  historyCount,
  onOpenHistory,
  isOpenMobile,
  onCloseMobile,
  referenceSubTab,
}) => {
  const handleNavClick = (tab: ActiveTab, subTab?: string) => {
    onSelectTab(tab, subTab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="md:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 md:z-30 h-screen w-72 md:w-64 lg:w-72 bg-slate-950 border-r border-slate-800 flex flex-col shrink-0 transition-transform duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top Wordmark & Branding */}
        <div className="h-16 px-5 border-b border-slate-800/80 flex items-center justify-between">
          <div
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition shadow-sm">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5 group-hover:text-amber-400 transition">
                <span>EDA Toolbox</span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  PRO
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">
                Elkonstruktion & Automation
              </p>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
            aria-label="Stäng meny"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
          {/* Section 1: HUVUDVY */}
          <div className="space-y-1">
            <div className="px-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Huvudmeny
            </div>

            <button
              onClick={() => handleNavClick('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer text-left ${
                activeTab === 'dashboard'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <Home className={`w-4 h-4 ${activeTab === 'dashboard' ? 'text-slate-950' : 'text-amber-400'}`} />
              <span className="flex-1">Startsida & Nyheter</span>
              {activeTab === 'dashboard' && (
                <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />
              )}
            </button>
          </div>

          {/* Section 2: BERÄKNINGAR */}
          <div className="space-y-1">
            <div className="px-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Beräkning & Dimensionering
            </div>

            <button
              onClick={() => handleNavClick('ohms')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer text-left ${
                activeTab === 'ohms'
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <Zap className={`w-4 h-4 ${activeTab === 'ohms' ? 'text-amber-400' : 'text-slate-400'}`} />
              <span className="flex-1">Ohms lag & Effekt</span>
            </button>

            <button
              onClick={() => handleNavClick('voltage_drop')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer text-left ${
                activeTab === 'voltage_drop'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <Cable className={`w-4 h-4 ${activeTab === 'voltage_drop' ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span className="flex-1">Spänningsfall i kabel</span>
            </button>

            <button
              onClick={() => handleNavClick('three_phase')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer text-left ${
                activeTab === 'three_phase'
                  ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <Cpu className={`w-4 h-4 ${activeTab === 'three_phase' ? 'text-indigo-400' : 'text-slate-400'}`} />
              <span className="flex-1">3-Fas Effekt & Motorer</span>
            </button>

            <button
              onClick={() => handleNavClick('series_parallel')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer text-left ${
                activeTab === 'series_parallel'
                  ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <Network className={`w-4 h-4 ${activeTab === 'series_parallel' ? 'text-sky-400' : 'text-slate-400'}`} />
              <span className="flex-1">Serie & Parallell</span>
            </button>

            <button
              onClick={() => handleNavClick('converter')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer text-left ${
                activeTab === 'converter'
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <ArrowLeftRight className={`w-4 h-4 ${activeTab === 'converter' ? 'text-amber-400' : 'text-slate-400'}`} />
              <span className="flex-1">Enhetsomvandlare</span>
            </button>
          </div>

          {/* Section 3: STANDARDER & BETECKNINGAR */}
          <div className="space-y-1">
            <div className="px-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Standarder & Lathund</span>
              <BookOpen className="w-3 h-3 text-slate-500" />
            </div>

            <button
              onClick={() => handleNavClick('reference', 'iec61355')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer text-left ${
                activeTab === 'reference' && referenceSubTab === 'iec61355'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="flex-1 truncate">IEC 61355 Dokumentkoder (&amp;)</span>
            </button>

            <button
              onClick={() => handleNavClick('reference', 'iec81346')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer text-left ${
                activeTab === 'reference' && referenceSubTab === 'iec81346'
                  ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <Search className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="flex-1 truncate">IEC 81346 Postbeteckning (-)</span>
            </button>

            <button
              onClick={() => handleNavClick('reference', 'ama_bsa')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer text-left ${
                activeTab === 'reference' && referenceSubTab === 'ama_bsa'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="flex-1 truncate">AMA EL &amp; BSAB 96 Koder</span>
            </button>

            <button
              onClick={() => handleNavClick('reference', 'colors')}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs transition cursor-pointer text-left ${
                activeTab === 'reference' && referenceSubTab === 'colors'
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <Palette className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="flex-1 truncate">Kabelledarfärger (60446)</span>
            </button>

            <button
              onClick={() => handleNavClick('reference', 'fuses')}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs transition cursor-pointer text-left ${
                activeTab === 'reference' && referenceSubTab === 'fuses'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <Cable className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="flex-1 truncate">Area &amp; Säkringstabell</span>
            </button>

            <button
              onClick={() => handleNavClick('reference', 'ip')}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs transition cursor-pointer text-left ${
                activeTab === 'reference' && referenceSubTab === 'ip'
                  ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30 font-semibold'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span className="flex-1 truncate">IP-Kapslingsklasser</span>
            </button>
          </div>
        </div>

        {/* Bottom Actions & Offline Status */}
        <div className="p-3.5 border-t border-slate-800/80 bg-slate-950/90 space-y-2.5">
          <button
            onClick={() => {
              onOpenHistory();
              onCloseMobile();
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-200 text-xs font-semibold border border-slate-800 transition cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <HistoryIcon className="w-4 h-4 text-amber-400" />
              <span>Sparad historik</span>
            </div>
            {historyCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold">
                {historyCount}
              </span>
            )}
          </button>

          <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
            <span className="flex items-center gap-1.5">
              <Wifi className="w-3 h-3 text-emerald-400" />
              <span>Offline-stöd</span>
            </span>
            <PWAInstallButton compact />
          </div>
        </div>
      </aside>
    </>
  );
};
