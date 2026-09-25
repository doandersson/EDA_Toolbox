import React, { useState } from 'react';
import { CalculationResult } from '../types/electrical';
import { formatElectrNumber } from '../utils/electricalMath';
import { X, Trash2, Download, History as HistoryIcon, Clock, FileText } from 'lucide-react';
import { CalculationPdfReportModal } from './Report/CalculationPdfReportModal';
import { createOhmsLawReportData } from '../utils/reportHelpers';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  history: (CalculationResult & { label?: string })[];
  onClear: () => void;
  onDeleteOne: (timestamp: number) => void;
}

export const HistoryModal: React.FC<Props> = ({
  isOpen,
  onClose,
  history,
  onClear,
  onDeleteOne,
}) => {
  const [selectedReportItem, setSelectedReportItem] = useState<(CalculationResult & { label?: string }) | null>(null);

  if (!isOpen) return null;

  const handleExportCSV = () => {
    if (history.length === 0) return;
    const header = 'Datum,System,Koppling,Märkning,Spänning (V),Ström (A),Resistans (Ohm),Effekt (W),cosPhi\n';
    const rows = history
      .map((h) => {
        const date = new Date(h.timestamp).toLocaleString('sv-SE');
        const system = h.phaseType === '3-phase' ? '3-Fas' : '1-Fas';
        const conn = h.threePhaseConnection ? (h.threePhaseConnection === 'star' ? 'Stjärna (Y)' : 'Delta (D)') : '-';
        const label = `"${(h.label || '').replace(/"/g, '""')}"`;
        const pf = h.cosPhi !== undefined ? h.cosPhi : 1.0;
        return `${date},${system},${conn},${label},${h.voltage},${h.current},${h.resistance},${h.power},${pf}`;
      })
      .join('\n');

    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `elkalkyl-berakningar-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl max-h-[85vh] rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <HistoryIcon className="w-5 h-5 text-amber-400" />
            <h3 className="font-semibold text-white text-base">Sparade elberäkningar</h3>
            <span className="text-xs font-mono text-slate-400 ml-1">({history.length} st)</span>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <>
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs transition cursor-pointer"
                  title="Exportera till CSV (Excel)"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Exportera CSV</span>
                </button>
                <button
                  onClick={onClear}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-rose-900/50 bg-rose-950/30 hover:bg-rose-900/50 text-rose-300 text-xs transition cursor-pointer"
                  title="Rensa all historik"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Rensa</span>
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List Content */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-500 space-y-2">
              <Clock className="w-8 h-8 mx-auto opacity-40" />
              <p className="text-sm">Inga sparade beräkningar ännu</p>
              <p className="text-xs">
                Klicka på "Spara beräkning" i Ohms lag-kalkylatorn för att spara resultat lokalt i enheten.
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.timestamp}
                className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 hover:border-slate-700 transition space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white">
                      {item.label || (item.phaseType === '3-phase' ? '3-Fas Beräkning' : 'Ohms lag & Effekt')}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                      {item.phaseType === '3-phase'
                        ? `3-Fas (${item.threePhaseConnection === 'star' ? 'Y' : 'Δ'})`
                        : '1-Fas'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(item.timestamp).toLocaleDateString('sv-SE')}{' '}
                      {new Date(item.timestamp).toLocaleTimeString('sv-SE', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setSelectedReportItem(item)}
                      className="flex items-center gap-1 px-2 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-medium transition cursor-pointer"
                      title="Skapa PDF-rapport (A4)"
                    >
                      <FileText className="w-3 h-3" />
                      <span>PDF-rapport</span>
                    </button>
                    <button
                      onClick={() => onDeleteOne(item.timestamp)}
                      className="p-1 text-slate-500 hover:text-rose-400 rounded transition cursor-pointer"
                      title="Ta bort"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                  <div className="bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">
                      {item.phaseType === '3-phase' ? 'Huvudspänning (U_L)' : 'Spänning (U)'}
                    </span>
                    <span className="text-sky-300 font-semibold">{formatElectrNumber(item.voltage)} V</span>
                  </div>
                  <div className="bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">
                      {item.phaseType === '3-phase' ? 'Linjeström (I_L)' : 'Ström (I)'}
                    </span>
                    <span className="text-emerald-300 font-semibold">{formatElectrNumber(item.current)} A</span>
                  </div>
                  <div className="bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">
                      {item.phaseType === '3-phase' ? 'Fasresistans (R_fas)' : 'Resistans (R)'}
                    </span>
                    <span className="text-amber-300 font-semibold">{formatElectrNumber(item.resistance)} Ω</span>
                  </div>
                  <div className="bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">
                      {item.phaseType === '3-phase' ? 'Total Effekt (P)' : 'Effekt (P)'}
                    </span>
                    <span className="text-rose-300 font-semibold">{formatElectrNumber(item.power)} W</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* PDF Report Modal for selected calculation */}
      {selectedReportItem && (
        <CalculationPdfReportModal
          isOpen={!!selectedReportItem}
          onClose={() => setSelectedReportItem(null)}
          reportData={createOhmsLawReportData({
            result: selectedReportItem,
            label: selectedReportItem.label,
          })}
        />
      )}
    </div>
  );
};
