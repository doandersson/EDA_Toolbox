import React from 'react';
import { ActiveTab } from '../types/electrical';
import { PWAInstallButton } from './PWAInstallButton';
import { History as HistoryIcon, Zap, Menu, Newspaper, Home, Terminal, Info } from 'lucide-react';

interface Props {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  historyCount: number;
  onOpenHistory: () => void;
  onToggleMobileSidebar: () => void;
  referenceSubTab?: string;
  onOpenBuildInfo?: () => void;
  onOpenAbout?: () => void;
}

export const Header: React.FC<Props> = ({
  activeTab,
  onSelectTab,
  historyCount,
  onOpenHistory,
  onToggleMobileSidebar,
  referenceSubTab,
  onOpenBuildInfo,
  onOpenAbout,
}) => {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Startsida & Branschnyheter';
      case 'ohms':
        return 'Ohms lag & Effektberäkning';
      case 'voltage_drop':
        return 'Spänningsfall i kabel';
      case 'three_phase':
        return '3-Fas Effekt & Motorer';
      case 'series_parallel':
        return 'Serie- & Parallellkoppling';
      case 'converter':
        return 'Enhetsomvandlare';
      case 'reference':
        if (referenceSubTab === 'iec61355') return 'IEC 61355 Dokumentkoder';
        if (referenceSubTab === 'iec81346') return 'IEC 81346 Postbeteckningar';
        if (referenceSubTab === 'ama_bsa') return 'AMA EL & BSAB 96 Koder';
        return 'Standarder & Lathund';
      default:
        return 'EDA Toolbox';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="w-full px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4">
        {/* Left side: Mobile menu toggle + Wordmark / Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileSidebar}
            className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white bg-slate-900 border border-slate-800 transition cursor-pointer"
            aria-label="Öppna meny"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Wordmark visible on mobile, breadcrumb on desktop */}
          <div className="flex items-center gap-2.5 md:hidden">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Zap className="w-3.5 h-3.5" />
            </div>
            <span className="text-sm font-bold text-white tracking-tight">
              EDA Toolbox
            </span>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
            <span
              onClick={() => onSelectTab('dashboard')}
              className="hover:text-slate-200 transition cursor-pointer flex items-center gap-1"
            >
              <Home className="w-3.5 h-3.5 text-slate-400" />
              <span>EDA Toolbox</span>
            </span>
            <span className="text-slate-600">/</span>
            <span className="text-white font-semibold flex items-center gap-1.5">
              {getTabTitle()}
            </span>
          </div>
        </div>

        {/* Right side: Quick nav / History / Install */}
        <div className="flex items-center gap-2 sm:gap-3">
          {activeTab !== 'dashboard' && (
            <button
              onClick={() => onSelectTab('dashboard')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium transition cursor-pointer"
            >
              <Newspaper className="w-3.5 h-3.5 text-cyan-400" />
              <span>Nyheter &amp; Start</span>
            </button>
          )}

          {onOpenBuildInfo && (
            <button
              onClick={onOpenBuildInfo}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-medium transition cursor-pointer"
              title="Visa information och installationsguide för att bygga applikationen"
            >
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Bygg &amp; Installera</span>
            </button>
          )}

          {onOpenAbout && (
            <button
              onClick={onOpenAbout}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-medium transition cursor-pointer"
              title="Om appen, copyright och kontaktinformation"
            >
              <Info className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Om appen</span>
            </button>
          )}

          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-medium transition cursor-pointer"
            title="Visa sparade beräkningar"
          >
            <HistoryIcon className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Historik</span>
            {historyCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold">
                {historyCount}
              </span>
            )}
          </button>

          <PWAInstallButton compact />
        </div>
      </div>
    </header>
  );
};
