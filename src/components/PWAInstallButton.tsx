import React, { useState } from 'react';
import { Download, Share2, PlusSquare, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed as standalone PWA, hide
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={`flex items-center gap-2 rounded-lg bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-medium transition shadow-md shadow-amber-500/20 whitespace-nowrap cursor-pointer ${
          compact ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'
        }`}
        title="Installera appen på din enhet för offline-användning"
      >
        <Download className="w-4 h-4 shrink-0" />
        <span>Installera app</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-200 font-medium transition cursor-pointer whitespace-nowrap ${
            compact ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-xs'
          }`}
          title="Installera på iPhone eller iPad"
        >
          <Download className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Spara till hemskärm</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-2xl text-slate-100">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Download className="w-4 h-4" />
                  </div>
                  <h3 className="font-semibold text-slate-100 text-sm">Installera på iPhone/iPad</h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="py-4 space-y-3 text-xs text-slate-300">
                <div className="flex items-start gap-3 bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/50">
                  <div className="p-1.5 rounded-md bg-blue-500/20 text-blue-400 shrink-0">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <p>
                    1. Tryck på <strong className="text-white">Dela-knappen</strong> i Safaris menyfält längst ner.
                  </p>
                </div>
                <div className="flex items-start gap-3 bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/50">
                  <div className="p-1.5 rounded-md bg-amber-500/20 text-amber-400 shrink-0">
                    <PlusSquare className="w-4 h-4" />
                  </div>
                  <p>
                    2. Bläddra nedåt och välj <strong className="text-white">Lägg till på hemskärmen</strong>.
                  </p>
                </div>
                <p className="text-[11px] text-slate-400 pt-1">
                  Appen fungerar då precis som en vanlig app, helt offline utan internetuppkoppling i fält!
                </p>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition"
              >
                Jag förstår
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
