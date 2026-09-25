import React, { useState } from 'react';
import { PdfReportData } from '../../types/report';
import { generateCalculationPdf } from '../../utils/generateCalculationPdf';
import { formatElectrNumber } from '../../utils/electricalMath';
import {
  X,
  Download,
  Printer,
  Copy,
  Check,
  FileText,
  Sliders,
  Eye,
  ShieldCheck,
  Building,
  Calendar,
  User,
  Info,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  reportData: PdfReportData;
}

export const CalculationPdfReportModal: React.FC<Props> = ({
  isOpen,
  onClose,
  reportData: initialData,
}) => {
  const [data, setData] = useState<PdfReportData>(initialData);
  const [activeTab, setActiveTab] = useState<'preview' | 'settings'>('preview');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  // Sync state if initialData changes
  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  if (!isOpen) return null;

  const handleDownloadPdf = () => {
    setIsGenerating(true);
    try {
      const doc = generateCalculationPdf(data);
      const safeName = (data.title || 'Elberakning')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_')
        .replace(/_+/g, '_');
      const filename = `EDA_Toolbox_${safeName}_${data.dateStr || Date.now()}.pdf`;
      doc.save(filename);
    } catch (err) {
      console.error('Kunde inte generera PDF:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    // Generate a temporary PDF blob and open print dialogue
    try {
      const doc = generateCalculationPdf(data);
      const blob = doc.output('blob');
      const blobUrl = URL.createObjectURL(blob);
      const printWindow = window.open(blobUrl);
      if (printWindow) {
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
        }, 500);
      }
    } catch (err) {
      console.error('Kunde inte skriva ut:', err);
      window.print();
    }
  };

  const handleCopyText = () => {
    const text = [
      `=== ${data.title.toUpperCase()} ===`,
      `Underrubrik: ${data.subtitle}`,
      `Dokumentbeteckning (IEC 61355): ${data.docCode || '&BD01'}`,
      `Referensbeteckning (IEC 81346): ${data.systemTag || '=P1 +W1'}`,
      `Projekt: ${data.projectName}`,
      `Upprättad av: ${data.authorName}`,
      `Beställare: ${data.clientName}`,
      `Datum: ${data.dateStr}`,
      data.statusBadge ? `STATUS: ${data.statusBadge.text}` : '',
      '',
      '--- HUVUDRESULTAT ---',
      ...data.results.map((r) => `${r.label}: ${r.value} ${r.unit || ''} (${r.description || ''})`),
      '',
      '--- INDATA & FÖRUTSÄTTNINGAR ---',
      ...data.inputs.map((i) => `${i.label}: ${i.value} ${i.unit || ''} - ${i.description || ''}`),
      '',
      '--- MATEMATISK MODELL & FORMLER ---',
      `Formel: ${data.formula.formulaText}`,
      data.formula.secondaryFormula ? `Sekundär: ${data.formula.secondaryFormula}` : '',
      `Insättning:\n${data.formula.substitutionText || ''}`,
      '',
      '--- TEKNISK BESKRIVNING & BEDÖMNING ---',
      data.description.summary,
      '',
      data.description.technicalAssessment,
      '',
      'Rekommendationer:',
      ...data.description.recommendations.map((rec) => `• ${rec}`),
      '',
      '--- NORMATIVA KÄLLOR & STANDARDER ---',
      ...data.sources.map((s) => `${s.standard} (${s.section || ''}): ${s.title} - ${s.requirement}`),
      '',
      'Genererad via EDA Toolbox – Svensk Elkonstruktion & Dimensionering',
    ]
      .filter(Boolean)
      .join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="w-full max-w-6xl max-h-[95vh] rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col text-slate-100 overflow-hidden my-auto">
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white text-base">Teknisk Beräkningsrapport (PDF A4)</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  A4 FORMAT
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  {data.docCode || '&BD01'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Komplett dimensioneringsunderlag med standardkällor (SS 436 40 00, SEK HB 444), formler och teknisk beskrivning.
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium transition cursor-pointer"
              title="Kopiera textunderlag till urklipp"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Kopierat!' : 'Kopiera text'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium transition cursor-pointer"
              title="Skriv ut eller spara via webbläsaren"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Skriv ut</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isGenerating}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition cursor-pointer shadow-sm shadow-amber-500/20 disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isGenerating ? 'Genererar...' : 'Ladda ner PDF (A4)'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
              title="Stäng fönster"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View Switcher on smaller screens */}
        <div className="flex lg:hidden items-center justify-center border-b border-slate-800 bg-slate-950 p-2 gap-2">
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'preview'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>A4 Förhandsgranskning</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'settings'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Projektinställningar</span>
          </button>
        </div>

        {/* Modal Body: Left settings, Right A4 preview */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
          {/* Left Column: Metadata & Report customization */}
          <div
            className={`lg:col-span-4 p-5 space-y-5 bg-slate-950/60 overflow-y-auto ${
              activeTab === 'settings' ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                <span>Rapportuppgifter & Metadata</span>
              </h4>
              <p className="text-[11px] text-slate-400">
                Anpassa projektdata som skrivs ut i rapportens formella sidhuvud och signaturbås.
              </p>
            </div>

            {/* Inputs Form */}
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Projektnamn
                </label>
                <input
                  type="text"
                  value={data.projectName}
                  onChange={(e) => setData({ ...data, projectName: e.target.value })}
                  placeholder="t.ex. Kv. Fabriken 4 – Huvudcentral A"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Dokumentkod (IEC 61355)
                  </label>
                  <input
                    type="text"
                    value={data.docCode || '&BD01'}
                    onChange={(e) => setData({ ...data, docCode: e.target.value })}
                    placeholder="&BD01"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Anläggningspos (IEC 81346)
                  </label>
                  <input
                    type="text"
                    value={data.systemTag || '=P1 +W1'}
                    onChange={(e) => setData({ ...data, systemTag: e.target.value })}
                    placeholder="=P1 +W1 -QM01"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-mono text-sky-300 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Upprättad av / Konstruktör
                </label>
                <input
                  type="text"
                  value={data.authorName}
                  onChange={(e) => setData({ ...data, authorName: e.target.value })}
                  placeholder="Namn, Elkonstruktör"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Beställare / Kund
                </label>
                <input
                  type="text"
                  value={data.clientName}
                  onChange={(e) => setData({ ...data, clientName: e.target.value })}
                  placeholder="t.ex. Byggherre / Fastighets AB"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Datum
                </label>
                <input
                  type="text"
                  value={data.dateStr}
                  onChange={(e) => setData({ ...data, dateStr: e.target.value })}
                  placeholder="YYYY-MM-DD"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Kompletterande projektanteckningar
                </label>
                <textarea
                  rows={3}
                  value={data.notes || ''}
                  onChange={(e) => setData({ ...data, notes: e.target.value })}
                  placeholder="Egna noteringar om förläggning, omgivningstemperatur eller montageställe..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Normative Standards included overview */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Inkluderade standarder i rapporten ({data.sources.length} st)</span>
              </span>
              <div className="space-y-1.5">
                {data.sources.map((s, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-[10px] space-y-0.5"
                  >
                    <div className="font-semibold text-amber-300">{s.standard} {s.section && `(${s.section})`}</div>
                    <div className="text-slate-300 truncate">{s.title}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick action button in settings panel */}
            <button
              onClick={handleDownloadPdf}
              disabled={isGenerating}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-amber-500/20"
            >
              <Download className="w-4 h-4" />
              <span>Ladda ner komplett A4 PDF</span>
            </button>
          </div>

          {/* Right Column: Authentic Scaled A4 Preview */}
          <div
            className={`lg:col-span-8 p-4 sm:p-6 bg-slate-950 flex flex-col items-center overflow-y-auto ${
              activeTab === 'preview' ? 'block' : 'hidden lg:block'
            }`}
          >
            {/* Zoom / Info toolbar */}
            <div className="w-full max-w-[700px] flex items-center justify-between mb-3 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-300">A4 Förhandsgranskning (210 × 297 mm)</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  Skalad 100% inom A4
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(75, z - 10))}
                  className="p-1 rounded hover:bg-slate-800 text-slate-300 cursor-pointer"
                  title="Minska förhandsgranskning"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono text-[11px] w-12 text-center text-slate-300">
                  {zoomLevel}%
                </span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(130, z + 10))}
                  className="p-1 rounded hover:bg-slate-800 text-slate-300 cursor-pointer"
                  title="Öka förhandsgranskning"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* The A4 Paper Sheet (White background, black text, exact print proportions) */}
            <div
              style={{
                width: `${(680 * zoomLevel) / 100}px`,
                maxWidth: '100%',
                transition: 'width 0.15s ease-out',
              }}
              className="bg-white text-slate-900 rounded shadow-2xl border border-slate-300 p-6 sm:p-8 space-y-4 font-sans text-xs leading-relaxed select-text"
            >
              {/* Document Header Bar */}
              <div className="bg-slate-900 text-white p-3 rounded flex items-center justify-between border-b-2 border-amber-500">
                <div>
                  <div className="font-bold text-sm tracking-wide text-white">EDA TOOLBOX</div>
                  <div className="text-[9px] text-slate-300 uppercase tracking-wider">
                    Teknisk Beräkningsrapport & Dimensioneringsunderlag
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-xs text-amber-300">
                    {data.docCode || '&BD01'}
                  </div>
                  <div className="text-[8px] text-slate-400">IEC 61355</div>
                </div>
              </div>

              {/* Title & Subtitle */}
              <div>
                <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  {data.title}
                </h1>
                <p className="text-[11px] text-slate-600 mt-0.5">{data.subtitle}</p>
              </div>

              {/* Metadata 3x2 Grid */}
              <div className="grid grid-cols-3 gap-2 p-2.5 rounded bg-slate-50 border border-slate-200 text-[10px]">
                <div>
                  <span className="font-bold text-[9px] uppercase text-slate-500 block">Projekt</span>
                  <span className="font-medium text-slate-900 truncate block">{data.projectName}</span>
                </div>
                <div>
                  <span className="font-bold text-[9px] uppercase text-slate-500 block">
                    Anläggningspos (IEC 81346)
                  </span>
                  <span className="font-mono font-semibold text-slate-900 block">{data.systemTag}</span>
                </div>
                <div>
                  <span className="font-bold text-[9px] uppercase text-slate-500 block">Datum</span>
                  <span className="text-slate-900 block">{data.dateStr}</span>
                </div>
                <div>
                  <span className="font-bold text-[9px] uppercase text-slate-500 block">Upprättad av</span>
                  <span className="text-slate-900 block">{data.authorName}</span>
                </div>
                <div>
                  <span className="font-bold text-[9px] uppercase text-slate-500 block">Beställare / Kund</span>
                  <span className="text-slate-900 block">{data.clientName}</span>
                </div>
                <div>
                  <span className="font-bold text-[9px] uppercase text-slate-500 block">Norm / Standard</span>
                  <span className="text-slate-900 block">SS 436 40 00</span>
                </div>
              </div>

              {/* Status Badge */}
              {data.statusBadge && (
                <div
                  className={`p-2 rounded border text-[11px] font-bold flex items-center gap-2 ${
                    data.statusBadge.type === 'success'
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                      : data.statusBadge.type === 'warning'
                      ? 'bg-amber-50 border-amber-400 text-amber-900'
                      : data.statusBadge.type === 'error'
                      ? 'bg-rose-50 border-rose-400 text-rose-900'
                      : 'bg-slate-100 border-slate-300 text-slate-800'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>STATUS: {data.statusBadge.text}</span>
                </div>
              )}

              {/* 1. Huvudresultat (Key Results Grid) */}
              <div className="space-y-1.5">
                <div className="font-bold text-xs uppercase text-slate-800 tracking-wider">
                  1. Huvudresultat & Beräknade Nyckeltal
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {data.results.map((res, i) => (
                    <div
                      key={i}
                      className={`p-2.5 rounded border flex flex-col justify-between ${
                        res.highlight
                          ? 'bg-sky-50 border-sky-300'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <span className="text-[9px] font-bold uppercase text-slate-500">
                        {res.label}
                      </span>
                      <div className="my-1">
                        <span
                          className={`text-base font-bold font-mono ${
                            res.highlight ? 'text-sky-700' : 'text-slate-900'
                          }`}
                        >
                          {res.value}
                        </span>
                        {res.unit && (
                          <span className="text-[10px] font-medium text-slate-600 ml-1">
                            {res.unit}
                          </span>
                        )}
                      </div>
                      {res.description && (
                        <span className="text-[8px] text-slate-500 font-mono">
                          {res.description}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Graphic Circuit Schematic & Tolerance Diagram (Matching PDF) */}
              {data.diagram?.type === 'voltage_drop' && (() => {
                const d = data.diagram.data;
                const isOk = d.isWithinLimit;
                const clampedPct = Math.min(6.0, Math.max(0, d.dropPercent));
                const needlePct = (clampedPct / 6.0) * 100;
                return (
                  <div className="space-y-1.5 border border-slate-200 rounded p-2.5 bg-slate-50/70">
                    <div className="font-bold text-xs uppercase text-slate-800 tracking-wider">
                      Kretsschema & Spänningsgradient
                    </div>
                    <div className="w-full">
                      <svg viewBox="0 0 680 90" className="w-full h-auto select-none" xmlns="http://www.w3.org/2000/svg">
                        {/* Source Box */}
                        <g transform="translate(10, 6)">
                          <rect x="0" y="0" width="130" height="74" rx="6" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1" />
                          <text x="65" y="16" textAnchor="middle" fill="#64748b" fontSize="9" fontWeight="bold">MATNING / NÄT</text>
                          <text x="65" y="38" textAnchor="middle" fill="#0f172a" fontSize="16" fontWeight="bold" fontFamily="monospace">{d.voltage} V</text>
                          <text x="65" y="52" textAnchor="middle" fill="#0284c7" fontSize="8.5" fontWeight="600">{d.phaseType === '1-phase' ? '1-Fas (230V)' : '3-Fas (400V)'}</text>
                          <text x="65" y="65" textAnchor="middle" fill="#94a3b8" fontSize="7.5">Nominell spänning</text>
                        </g>

                        {/* Cable Lines & Tags */}
                        <g transform="translate(140, 6)">
                          <line x1="0" y1="28" x2="390" y2="28" stroke="#0284c7" strokeWidth="2.5" />
                          <line x1="0" y1="46" x2="390" y2="46" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4,4" />

                          <rect x="110" y="6" width="170" height="32" rx="4" fill="#ffffff" stroke="#f59e0b" strokeWidth="1" />
                          <text x="195" y="20" textAnchor="middle" fill="#b45309" fontSize="9.5" fontWeight="bold">
                            Kabel: {d.length} m • {d.area} mm² ({d.material === 'cu' ? 'Cu' : 'Al'})
                          </text>
                          <text x="195" y="32" textAnchor="middle" fill="#334155" fontSize="8.5" fontFamily="monospace">
                            I = {d.current} A  •  R = {formatElectrNumber(d.rCable, 3)} Ω
                          </text>

                          <rect x="115" y="44" width="160" height="24" rx="4" fill={isOk ? '#ecfdf5' : '#fef2f2'} stroke={isOk ? '#10b981' : '#ef4444'} strokeWidth="1" />
                          <text x="195" y="56" textAnchor="middle" fill={isOk ? '#065f46' : '#991b1b'} fontSize="8.5" fontWeight="bold">
                            ΔU = -{formatElectrNumber(d.deltaU, 2)} V (-{formatElectrNumber(d.dropPercent, 2)}%)
                          </text>
                          <text x="195" y="65" textAnchor="middle" fill={isOk ? '#047857' : '#b91c1c'} fontSize="7.5" fontFamily="monospace">
                            P_förlust = {formatElectrNumber(d.powerLoss, 1)} W
                          </text>
                        </g>

                        {/* Load Box */}
                        <g transform="translate(530, 6)">
                          <rect x="0" y="0" width="140" height="74" rx="6" fill={isOk ? '#f0fdf4' : '#fef2f2'} stroke={isOk ? '#10b981' : '#ef4444'} strokeWidth="1" />
                          <text x="70" y="16" textAnchor="middle" fill="#64748b" fontSize="9" fontWeight="bold">FÖRBRUKARE / LAST</text>
                          <text x="70" y="38" textAnchor="middle" fill={isOk ? '#166534' : '#991b1b'} fontSize="16" fontWeight="bold" fontFamily="monospace">{formatElectrNumber(d.endVoltage, 1)} V</text>
                          <text x="70" y="52" textAnchor="middle" fill="#64748b" fontSize="8.5">Spänning vid plint</text>
                          <text x="70" y="65" textAnchor="middle" fill={isOk ? '#16a34a' : '#dc2626'} fontSize="8" fontWeight="bold">
                            {isOk ? '✓ GODKÄND' : '⚠ ÖVERSKRIDER GRÄNS'}
                          </text>
                        </g>
                      </svg>
                    </div>

                    {/* Tolerance meter in preview */}
                    <div className="space-y-1 pt-0.5">
                      <div className="relative pt-4 pb-1">
                        <div className="h-2 w-full rounded bg-slate-200 flex overflow-hidden border border-slate-300">
                          <div className="h-full bg-emerald-500" style={{ width: '50%' }} />
                          <div className="h-full bg-amber-400" style={{ width: '16.67%' }} />
                          <div className="h-full bg-rose-500" style={{ width: '33.33%' }} />
                        </div>
                        <div
                          className="absolute top-0 -translate-x-1/2 flex flex-col items-center pointer-events-none"
                          style={{ left: `${needlePct}%` }}
                        >
                          <span className={`px-1.5 py-0.2 rounded text-[7.5px] font-mono font-bold text-white ${
                            isOk ? 'bg-emerald-600' : 'bg-rose-600'
                          }`}>
                            {formatElectrNumber(d.dropPercent, 2)}%
                          </span>
                          <div className={`w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[4px] ${
                            isOk ? 'border-t-emerald-600' : 'border-t-rose-600'
                          }`} />
                        </div>
                      </div>
                      <div className="flex justify-between text-[7.5px] text-slate-500 font-mono">
                        <span>0%</span>
                        <span className="text-emerald-700 font-semibold">3% (SS 436 40 00 rekommendation)</span>
                        <span className="text-amber-700 font-semibold">4% (Max standardgräns)</span>
                        <span>6%+</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Power Triangle in Preview */}
              {data.diagram?.type === 'power_triangle' && (() => {
                const d = data.diagram.data;
                return (
                  <div className="space-y-1.5 border border-slate-200 rounded p-2.5 bg-slate-50/70">
                    <div className="font-bold text-xs uppercase text-slate-800 tracking-wider">
                      Effekttriangel & Vektorrelationer (P, Q, S)
                    </div>
                    <div className="grid grid-cols-12 gap-3 items-center">
                      <div className="col-span-7">
                        <svg viewBox="0 0 320 140" className="w-full h-auto select-none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="0" y="0" width="320" height="140" rx="6" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.5" />
                          {/* Triangle: (40, 115) -> (200, 115) -> (200, 30) */}
                          <line x1="40" y1="115" x2="200" y2="115" stroke="#f43f5e" strokeWidth="2.5" />
                          <line x1="200" y1="115" x2="200" y2="30" stroke="#f59e0b" strokeWidth="2.5" />
                          <line x1="40" y1="115" x2="200" y2="30" stroke="#0284c7" strokeWidth="2.5" />
                          <path d="M 188,115 L 188,103 L 200,103" fill="none" stroke="#94a3b8" strokeWidth="1" />
                          <path d="M 65,115 A 25 25 0 0 0 63,100" fill="none" stroke="#eab308" strokeWidth="1.5" />
                          <text x="68" y="108" fill="#ca8a04" fontSize="8" fontWeight="bold">φ</text>

                          <text x="120" y="128" textAnchor="middle" fill="#f43f5e" fontSize="9" fontWeight="bold">P = {formatElectrNumber(d.activePowerKw, 2)} kW</text>
                          <text x="208" y="75" fill="#d97706" fontSize="9" fontWeight="bold">Q = {formatElectrNumber(d.reactivePowerKvar, 2)} kVAr</text>
                          <text x="105" y="65" fill="#0284c7" fontSize="9" fontWeight="bold">S = {formatElectrNumber(d.apparentPowerKva, 2)} kVA</text>
                        </svg>
                      </div>
                      <div className="col-span-5 space-y-1 text-[9px] font-mono p-2 bg-white rounded border border-slate-200">
                        <div className="font-bold text-slate-800 text-[10px]">Fasegenskaper:</div>
                        <div>Effektfaktor cos φ: <strong className="text-amber-700">{formatElectrNumber(d.cosPhi, 2)}</strong></div>
                        <div>Verkningsgrad η: <strong className="text-emerald-700">{formatElectrNumber(d.efficiency * 100, 1)}%</strong></div>
                        <div>Linjeström: <strong className="text-slate-900">{formatElectrNumber(d.current, 2)} A</strong></div>
                        <div className="text-[8px] text-slate-500 pt-1">S = √(P² + Q²) = √3·U·I</div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Star / Delta in Preview */}
              {data.diagram?.type === 'star_delta' && (() => {
                const d = data.diagram.data;
                return (
                  <div className="space-y-1.5 border border-slate-200 rounded p-2.5 bg-slate-50/70">
                    <div className="font-bold text-xs uppercase text-slate-800 tracking-wider">
                      Kopplingsschema: Stjärna (Y) vs Delta (Δ)
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-[9px] font-mono">
                      <div className="p-2 rounded bg-sky-50 border border-sky-200 space-y-1">
                        <span className="font-bold text-sky-800 block text-[10px]">STJÄRNKOPPLING (Y)</span>
                        <div>Elementspänning: <strong>{formatElectrNumber(d.uStarElem, 1)} V</strong></div>
                        <div>Linjeström: <strong>{formatElectrNumber(d.iStarLine, 2)} A</strong></div>
                        <div>Total Effekt: <strong className="text-sky-700">{formatElectrNumber(d.pStarTotal / 1000, 2)} kW</strong> (1/3 av delta)</div>
                      </div>
                      <div className="p-2 rounded bg-amber-50 border border-amber-200 space-y-1">
                        <span className="font-bold text-amber-800 block text-[10px]">DELTAKOPPLING (Δ)</span>
                        <div>Elementspänning: <strong>{d.voltage} V</strong> (Full U_L)</div>
                        <div>Linjeström: <strong>{formatElectrNumber(d.iDeltaLine, 2)} A</strong> (3× Y-ström)</div>
                        <div>Total Effekt: <strong className="text-amber-700">{formatElectrNumber(d.pDeltaTotal / 1000, 2)} kW</strong> (3× Y-effekt)</div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Neutral Phasor in Preview */}
              {data.diagram?.type === 'neutral_phasor' && (() => {
                const d = data.diagram.data;
                return (
                  <div className="space-y-1.5 border border-slate-200 rounded p-2.5 bg-slate-50/70">
                    <div className="font-bold text-xs uppercase text-slate-800 tracking-wider">
                      Visardiagram: Fasströmmar & Nollström
                    </div>
                    <div className="grid grid-cols-12 gap-3 items-center">
                      <div className="col-span-5 flex justify-center">
                        <svg viewBox="0 0 160 140" className="w-32 h-28" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="80" cy="70" r="55" fill="none" stroke="#cbd5e1" strokeWidth="0.8" strokeDasharray="2,2" />
                          <line x1="80" y1="70" x2="135" y2="70" stroke="#b45309" strokeWidth="2" />
                          <line x1="80" y1="70" x2="52" y2="117" stroke="#64748b" strokeWidth="2" />
                          <line x1="80" y1="70" x2="52" y2="23" stroke="#475569" strokeWidth="2" />
                          <circle cx="80" cy="70" r="3" fill="#0284c7" />
                          <text x="138" y="73" fill="#b45309" fontSize="7" fontWeight="bold">L1</text>
                          <text x="40" y="125" fill="#64748b" fontSize="7" fontWeight="bold">L2</text>
                          <text x="40" y="20" fill="#475569" fontSize="7" fontWeight="bold">L3</text>
                        </svg>
                      </div>
                      <div className="col-span-7 space-y-1 text-[9px] font-mono p-2 bg-white rounded border border-slate-200">
                        <div className="font-bold text-slate-800 text-[10px]">Vektorsumma & Returström:</div>
                        <div>Fasströmmar: L1 = {d.iL1}A, L2 = {d.iL2}A, L3 = {d.iL3}A</div>
                        <div className="text-sky-700 font-bold text-xs">Ström i nollan: {formatElectrNumber(d.iNeutral, 2)} A</div>
                        <div className="text-[8px] text-slate-500">I_N = √(I₁² + I₂² + I₃² - I₁I₂ - I₂I₃ - I₃I₁)</div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* 2. Indata & Förutsättningar */}
              <div className="space-y-1.5">
                <div className="font-bold text-xs uppercase text-slate-800 tracking-wider">
                  2. Dimensioneringsförutsättningar & Indata
                </div>
                <div className="border border-slate-200 rounded overflow-hidden">
                  <table className="w-full text-left text-[10px]">
                    <thead className="bg-slate-100 border-b border-slate-200 text-slate-600 uppercase font-bold text-[8px]">
                      <tr>
                        <th className="p-1.5">Parameter</th>
                        <th className="p-1.5">Värde</th>
                        <th className="p-1.5">Enhet</th>
                        <th className="p-1.5">Beskrivning / Krav</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {data.inputs.map((inp, idx) => (
                        <tr key={idx} className={idx % 2 === 1 ? 'bg-slate-50/60' : 'bg-white'}>
                          <td className="p-1.5 font-semibold text-slate-800">{inp.label}</td>
                          <td className="p-1.5 font-mono font-bold text-slate-900">{inp.value}</td>
                          <td className="p-1.5 text-slate-600">{inp.unit || '-'}</td>
                          <td className="p-1.5 text-slate-600">{inp.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 3. Matematisk Modell & Formel */}
              <div className="space-y-1.5">
                <div className="font-bold text-xs uppercase text-slate-800 tracking-wider">
                  3. Matematisk Modell & Formeltillämpning
                </div>
                <div className="p-2.5 rounded bg-slate-50 border border-slate-200 space-y-1.5 text-[10px]">
                  <div className="font-bold text-slate-600 text-[9px] uppercase">
                    {data.formula.name}
                  </div>
                  <div className="font-mono font-bold text-amber-700 bg-white p-1.5 rounded border border-amber-200">
                    {data.formula.formulaText}
                  </div>
                  {data.formula.secondaryFormula && (
                    <div className="font-mono text-slate-600 text-[9px]">
                      {data.formula.secondaryFormula}
                    </div>
                  )}
                  {data.formula.substitutionText && (
                    <div className="space-y-0.5 pt-1">
                      <div className="font-bold text-slate-600 text-[8px] uppercase">
                        Insatta projektvärden & beräkningsgång:
                      </div>
                      <pre className="font-mono text-[9px] text-slate-800 whitespace-pre-wrap bg-white p-1.5 rounded border border-slate-200">
                        {data.formula.substitutionText}
                      </pre>
                    </div>
                  )}
                </div>
              </div>

              {/* 4. Teknisk Beskrivning & Dimensioneringsanalys */}
              <div className="space-y-1.5">
                <div className="font-bold text-xs uppercase text-slate-800 tracking-wider">
                  4. Teknisk Beskrivning & Dimensioneringsanalys
                </div>
                <div className="space-y-2 text-[10px] text-slate-700 leading-normal">
                  <p>{data.description.summary}</p>
                  {data.description.technicalAssessment && (
                    <p className="font-medium text-slate-800">{data.description.technicalAssessment}</p>
                  )}
                  {data.description.recommendations.length > 0 && (
                    <div className="space-y-1 pt-1">
                      <div className="font-bold text-slate-800 text-[9px] uppercase">
                        Rekommenderade åtgärder för elkonstruktören:
                      </div>
                      <ul className="list-disc pl-4 space-y-0.5 text-slate-700">
                        {data.description.recommendations.map((rec, i) => (
                          <li key={i}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* 5. Normativa Källor & Standardreferenser */}
              <div className="space-y-1.5">
                <div className="font-bold text-xs uppercase text-slate-800 tracking-wider">
                  5. Normativa Källor & Standardreferenser
                </div>
                <div className="space-y-1 text-[9px]">
                  {data.sources.map((src, idx) => (
                    <div key={idx} className="p-1.5 rounded bg-slate-50 border border-slate-200">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-700">
                          {src.standard} {src.section && `(${src.section})`}
                        </span>
                        <span className="font-semibold text-slate-800">{src.title}</span>
                      </div>
                      <p className="text-slate-600 mt-0.5">{src.requirement}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6. Formell signaturbox */}
              <div className="p-2.5 rounded bg-slate-50 border border-slate-200 grid grid-cols-3 gap-3 text-[9px] pt-3">
                <div className="space-y-3">
                  <span className="font-bold uppercase text-slate-500 block">Beräknad av:</span>
                  <div className="border-b border-slate-400 pb-1 text-slate-900 font-medium">
                    {data.authorName}
                  </div>
                </div>
                <div className="space-y-3">
                  <span className="font-bold uppercase text-slate-500 block">Granskad av:</span>
                  <div className="border-b border-slate-400 pb-1 text-slate-900 font-medium">
                    Behörig Elinstallatör
                  </div>
                </div>
                <div className="space-y-3">
                  <span className="font-bold uppercase text-slate-500 block">Datum & Status:</span>
                  <div className="border-b border-slate-400 pb-1 text-slate-900 font-medium">
                    {data.dateStr} – Slutgiltig
                  </div>
                </div>
              </div>

              {/* Footer text */}
              <div className="border-t border-slate-200 pt-2 flex items-center justify-between text-[8px] text-slate-500">
                <span>EDA Toolbox • Svensk Elstandard & Dimensionering (SS 436 40 00)</span>
                <span>Dokumentbeteckning {data.docCode || '&BD01'} • Sida 1 av 1 (eller 2)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Korrekt skalad för A4 utskrift & PDF-arkivering. Inga element faller utanför sidmarginalerna.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-750 text-slate-300 transition cursor-pointer"
            >
              Stäng
            </button>
            <button
              onClick={handleDownloadPdf}
              disabled={isGenerating}
              className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition cursor-pointer shadow-sm shadow-amber-500/20 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isGenerating ? 'Genererar...' : 'Ladda ner PDF (A4)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
