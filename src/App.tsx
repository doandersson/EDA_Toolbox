import React, { useState, useEffect } from 'react';
import { ActiveTab, CalculationResult } from './types/electrical';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard/Dashboard';
import { OhmsLawCalculator } from './components/OhmsLaw/OhmsLawCalculator';
import { VoltageDropCalculator } from './components/VoltageDrop/VoltageDropCalculator';
import { ResistorCircuitCalculator } from './components/Resistors/ResistorCircuitCalculator';
import { ThreePhaseCalculator } from './components/ThreePhase/ThreePhaseCalculator';
import { UnitConverter } from './components/Converter/UnitConverter';
import { ElectricalReference, RefSubTab } from './components/Reference/ElectricalReference';
import { HistoryModal } from './components/HistoryModal';
import { BuildInfoModal } from './components/BuildInfoModal';
import { AboutModal } from './components/AboutModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { Wifi } from 'lucide-react';

const STORAGE_KEY = 'elkalkyl_saved_history_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [referenceSubTab, setReferenceSubTab] = useState<RefSubTab>('iec61355');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [history, setHistory] = useState<(CalculationResult & { label?: string })[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isBuildInfoOpen, setIsBuildInfoOpen] = useState<boolean>(false);
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);

  // Load history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch {
      // Local storage fallback
    }
  }, []);

  // Save history to localStorage
  const saveHistoryItem = (item: CalculationResult & { label?: string }) => {
    setHistory((prev) => {
      const updated = [item, ...prev].slice(0, 50); // keep last 50
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // storage quota
      }
      return updated;
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const handleDeleteOne = (timestamp: number) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.timestamp !== timestamp);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleSelectTab = (tab: ActiveTab, subTab?: string) => {
    setActiveTab(tab);
    if (subTab) {
      setReferenceSubTab(subTab as RefSubTab);
    }
    // Scroll smoothly to top when switching
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-row font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* PWA Offline Banner indicator */}
      <OfflineIndicator />

      {/* Left Sidebar Navigation (Desktop / Tablet persistent, Mobile drawer) */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        referenceSubTab={referenceSubTab}
        onOpenBuildInfo={() => setIsBuildInfoOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        {/* Top Header */}
        <Header
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          historyCount={history.length}
          onOpenHistory={() => setIsHistoryOpen(true)}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
          referenceSubTab={referenceSubTab}
          onOpenBuildInfo={() => setIsBuildInfoOpen(true)}
          onOpenAbout={() => setIsAboutOpen(true)}
        />

        {/* Dynamic Route Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {activeTab === 'dashboard' && (
            <Dashboard
              onSelectTab={handleSelectTab}
              history={history}
              onOpenHistory={() => setIsHistoryOpen(true)}
              onOpenBuildInfo={() => setIsBuildInfoOpen(true)}
              onOpenAbout={() => setIsAboutOpen(true)}
            />
          )}
          {activeTab === 'ohms' && (
            <OhmsLawCalculator onSaveToHistory={saveHistoryItem} />
          )}
          {activeTab === 'series_parallel' && (
            <ResistorCircuitCalculator />
          )}
          {activeTab === 'voltage_drop' && (
            <VoltageDropCalculator />
          )}
          {activeTab === 'three_phase' && (
            <ThreePhaseCalculator />
          )}
          {activeTab === 'converter' && (
            <UnitConverter />
          )}
          {activeTab === 'reference' && (
            <ElectricalReference subTab={referenceSubTab} />
          )}
        </main>

        {/* Footer */}
        <footer className="mt-auto border-t border-slate-900 py-6 text-xs text-slate-500 bg-slate-950/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
              <span className="text-slate-400 font-medium">
                © {new Date().getFullYear()} EDA Toolbox PRO.
              </span>
              <span className="hidden sm:inline text-slate-700">•</span>
              <span className="text-[11px] text-slate-500">
                Svensk standard SS 436 40 00, SS-EN IEC 81346 &amp; SS-EN 61355.
              </span>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center text-xs">
              <button
                onClick={() => setIsAboutOpen(true)}
                className="text-slate-400 hover:text-amber-400 transition cursor-pointer font-medium"
              >
                Om appen
              </button>
              <span className="text-slate-700">•</span>
              <button
                onClick={() => setIsAboutOpen(true)}
                className="text-slate-400 hover:text-cyan-400 transition cursor-pointer font-medium"
              >
                Copyright &amp; Normer
              </button>
              <span className="text-slate-700">•</span>
              <button
                onClick={() => setIsAboutOpen(true)}
                className="text-slate-400 hover:text-emerald-400 transition cursor-pointer font-medium"
              >
                Kontakt &amp; Support
              </button>
              <span className="text-slate-700">•</span>
              <button
                onClick={() => setIsBuildInfoOpen(true)}
                className="text-slate-400 hover:text-white transition cursor-pointer font-mono text-[11px]"
              >
                Bygginfo (CLI)
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* Mobile Bottom Navigation */}
      <Navigation activeTab={activeTab} onSelectTab={handleSelectTab} />

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onClear={handleClearHistory}
        onDeleteOne={handleDeleteOne}
      />

      {/* Build & Installation Info Modal */}
      <BuildInfoModal
        isOpen={isBuildInfoOpen}
        onClose={() => setIsBuildInfoOpen(false)}
      />

      {/* About App & Copyright & Contact Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />
    </div>
  );
}
