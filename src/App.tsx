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
import { OfflineIndicator } from './components/OfflineIndicator';
import { Wifi } from 'lucide-react';

const STORAGE_KEY = 'elkalkyl_saved_history_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [referenceSubTab, setReferenceSubTab] = useState<RefSubTab>('iec61355');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [history, setHistory] = useState<(CalculationResult & { label?: string })[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

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
        />

        {/* Dynamic Route Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {activeTab === 'dashboard' && (
            <Dashboard
              onSelectTab={handleSelectTab}
              history={history}
              onOpenHistory={() => setIsHistoryOpen(true)}
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
        <footer className="mt-auto border-t border-slate-900 py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p>© {new Date().getFullYear()} EDA Toolbox – Professionell elteknik, dimensionering och standarder.</p>
            <p className="text-[11px] text-slate-600">
              Följer svensk standard SS 436 40 00, SS-EN IEC 81346 &amp; SS-EN 61355.
            </p>
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
    </div>
  );
}
