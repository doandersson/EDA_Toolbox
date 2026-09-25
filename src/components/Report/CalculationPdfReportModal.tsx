import React, { useState } from 'react';
import { PdfReportData } from '../../types/report';
import { generateCalculationPdf } from '../../utils/generateCalculationPdf';
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
