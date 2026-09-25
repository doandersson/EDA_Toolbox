import React from 'react';
import { ActiveTab } from '../types/electrical';
import { Home, Zap, Cable, Cpu, ArrowLeftRight, BookOpen } from 'lucide-react';

interface Props {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
}

export const Navigation: React.FC<Props> = ({ activeTab, onSelectTab }) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-6 h-16 items-center">
        <button
          onClick={() => onSelectTab('dashboard')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 cursor-pointer transition ${
            activeTab === 'dashboard' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-[9px] sm:text-[10px] font-medium tracking-tight mt-1">Start</span>
        </button>

        <button
          onClick={() => onSelectTab('ohms')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 cursor-pointer transition ${
            activeTab === 'ohms' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-[9px] sm:text-[10px] font-medium tracking-tight mt-1">Ohms</span>
        </button>

        <button
          onClick={() => onSelectTab('voltage_drop')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 cursor-pointer transition ${
            activeTab === 'voltage_drop' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Cable className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-[9px] sm:text-[10px] font-medium tracking-tight mt-1">U-fall</span>
        </button>

        <button
          onClick={() => onSelectTab('three_phase')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 cursor-pointer transition ${
            activeTab === 'three_phase' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Cpu className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-[9px] sm:text-[10px] font-medium tracking-tight mt-1">3-Fas</span>
        </button>

        <button
          onClick={() => onSelectTab('converter')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 cursor-pointer transition ${
            activeTab === 'converter' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ArrowLeftRight className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-[9px] sm:text-[10px] font-medium tracking-tight mt-1">Omvandla</span>
        </button>

        <button
          onClick={() => onSelectTab('reference')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 cursor-pointer transition ${
            activeTab === 'reference' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-[9px] sm:text-[10px] font-medium tracking-tight mt-1">Lathund</span>
        </button>
      </div>
    </nav>
  );
};
