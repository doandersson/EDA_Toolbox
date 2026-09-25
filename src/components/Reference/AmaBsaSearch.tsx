import React, { useState, useMemo } from 'react';
import {
  AMA_BSA_ENTRIES,
  AMA_BSA_CATEGORIES,
  searchAmaBsa,
  AmaBsaEntry,
  AmaBsaSystem,
} from '../../utils/amaBsaData';
import {
  Search,
  X,
  BookOpen,
  Copy,
  Check,
  Info,
  Layers,
  Sparkles,
  HelpCircle,
  Tag,
  ArrowRight,
  Shield,
  Zap,
  SlidersHorizontal,
  Building2,
  FileSpreadsheet,
  Download,
  Share2,
} from 'lucide-react';

export const AmaBsaSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSystem, setSelectedSystem] = useState<string>('Alla');
  const [selectedCategory, setSelectedCategory] = useState<string>('Alla');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showSystemGuide, setShowSystemGuide] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Filtered results
  const filteredEntries = useMemo(() => {
    return searchAmaBsa(searchQuery, selectedSystem, selectedCategory);
  }, [searchQuery, selectedSystem, selectedCategory]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(label);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleClear = () => {
    setSearchQuery('');
    setSelectedSystem('Alla');
    setSelectedCategory('Alla');
  };

  const handleExportList = () => {
    if (filteredEntries.length === 0) return;
    const header = 'Kod\tSystem\tRubrik\tKategori\tOmfattning\tTypiska material\tIEC 81346\tIEC 61355\n';
    const rows = filteredEntries
      .map(
        (e) =>
          `${e.code}\t${e.system}\t${e.title}\t${e.category}\t${e.scope.replace(/\n/g, ' ')}\t${e.typicalMaterials.join(', ')}\t${e.iec81346Equivalents?.join(', ') || '-'}\t${e.iec61355Documents?.join(', ') || '-'}`
      )
      .join('\n');

    navigator.clipboard.writeText(header + rows);
    setExportNotice(`Kopierade ${filteredEntries.length} koder till urklipp (tabbavgränsad tabell för Excel)!`);
    setTimeout(() => setExportNotice(null), 3500);
  };

  // Quick preset shortcuts
  const quickSearchPresets = [
    { label: 'Brandlarm (EVB / 65.1)', query: 'brandlarm' },
    { label: 'Belysning & DALI (EL / 63.7)', query: 'belysning' },
    { label: 'Kabelstegar & Rännor (EBC)', query: 'kabelstegar' },
    { label: 'Datanät & Fiber (EU / 64.1)', query: 'fastighetsnät' },
    { label: 'Passersystem (EVE / 65.4)', query: 'passer' },
    { label: 'Solceller & Laddning (EE)', query: 'solcell' },
    { label: 'Styr & SCADA (EY / 67)', query: 'styr' },
    { label: 'Ställverk & Centraler (ED)', query: 'ställverk' },
    { label: 'Märkning (YKB) & Kontroll (YL)', query: 'provning' },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5 sm:mt-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <span>AMA EL & BSAB 96 Sökning</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                  AMA EL 25 / BSAB 96
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Sök bland svenska branschkoder för eltekniska beskrivningar, installationsmateriel, byggdelar och gränsdragningar.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowSystemGuide(!showSystemGuide)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                showSystemGuide
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-950/80 hover:bg-slate-800 text-slate-300 border border-slate-700'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-emerald-400" />
              <span>{showSystemGuide ? 'Dölj AMA/BSA guide' : 'Lathund: Hur hänger systemen ihop?'}</span>
            </button>

            <button
              onClick={handleExportList}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-950/80 hover:bg-slate-800 text-slate-300 border border-slate-700 transition cursor-pointer"
              title="Kopiera filtrerad kodlista till Excel/urklipp"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Exportera</span>
            </button>
          </div>
        </div>

        {/* Collapsible System Relationship Guide */}
        {showSystemGuide && (
          <div className="mt-5 pt-4 border-t border-slate-800/80 space-y-4 animate-in fade-in duration-200">
            <div className="bg-slate-950/70 border border-emerald-500/30 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-emerald-300 font-semibold text-xs">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Samband mellan BSAB 96, AMA EL och IEC-standarderna:</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800 space-y-1">
                  <div className="font-bold text-sky-400 flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded bg-sky-500/20 text-[10px] font-mono">BSAB 96 Tabell 2</span>
                    <span>Byggdelar & System</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Sifferkoder (t.ex. <code>63.1</code> Huvudledning, <code>65.1</code> Brandlarm, <code>67.2</code> DUC-centraler). Beskriver <em>vad systemet är till för</em> i anläggningen.
                  </p>
                </div>

                <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800 space-y-1">
                  <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-[10px] font-mono">AMA EL Tabell 3</span>
                    <span>Produktionsresultat</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Bokstavskoder (t.ex. <code>EBC</code> Kabelstegar, <code>EDD</code> Normcentraler, <code>EVB</code> Brandlarm). Anger <em>krav på material och montage</em> i teknisk beskrivning.
                  </p>
                </div>

                <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800 space-y-1">
                  <div className="font-bold text-indigo-400 flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-[10px] font-mono">IEC 81346 & 61355</span>
                    <span>Komponent & Ritning</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Betecknar fysiska komponenter på elschema (<code>-QA1</code>, <code>-SF1</code>) samt handlingstyp (<code>&FS</code> kretsschema, <code>&FL</code> kabellista).
                  </p>
                </div>
              </div>

              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-[11px] text-slate-300">
                <strong>Praktiskt exempel på samverkan i ett projekt:</strong>
                <p className="mt-1 text-slate-400">
                  I rambeskrivningen föreskrivs system <span className="text-sky-300 font-mono">65.1 Brandlarmanläggningar</span>. Entreprenören monterar enligt <span className="text-emerald-300 font-mono">EVB</span> och kabel enligt <span className="text-emerald-300 font-mono">ECG</span>. På kretsschemat <span className="text-cyan-300 font-mono">&FS</span> benämns rökdetektorn som <span className="text-indigo-300 font-mono">-SF1</span> och anläggningen märks upp enligt <span className="text-amber-300 font-mono">YKB</span>.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Export notice notification */}
        {exportNotice && (
          <div className="mt-3 p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{exportNotice}</span>
          </div>
        )}
      </div>

      {/* Search Bar & Primary Filters */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
        {/* Search input field */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Sök kod (t.ex. EB, 63.1, EVB, YKB) eller sökord (brandlarm, kabelstege, solcell, normcentral, ställdon)..."
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-11 pr-24 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-12 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-200 transition"
              title="Rensa sökning"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            {filteredEntries.length} st
          </span>
        </div>

        {/* Quick Search Preset Tags */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1 mr-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Snabbval:
          </span>
          {quickSearchPresets.map((preset) => (
            <button
              key={preset.label}
              onClick={() => setSearchQuery(preset.query)}
              className={`px-2.5 py-1 rounded-lg text-xs transition cursor-pointer border ${
                searchQuery.toLowerCase() === preset.query.toLowerCase()
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-medium'
                  : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {preset.label}
            </button>
          ))}
          {(searchQuery || selectedSystem !== 'Alla' || selectedCategory !== 'Alla') && (
            <button
              onClick={handleClear}
              className="px-2.5 py-1 rounded-lg text-xs text-rose-400 hover:text-rose-300 bg-rose-500/10 border border-rose-500/20 transition cursor-pointer ml-auto"
            >
              Återställ filter
            </button>
          )}
        </div>

        {/* System tabs: Alla | AMA EL | BSAB 96 | AMA Samordning */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
          <span className="text-xs font-medium text-slate-400 mr-1 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            System:
          </span>

          {(['Alla', 'AMA EL', 'BSAB 96', 'AMA Samordning'] as const).map((sys) => {
            const isSelected = selectedSystem === sys;
            return (
              <button
                key={sys}
                onClick={() => setSelectedSystem(sys)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer border ${
                  isSelected
                    ? sys === 'AMA EL'
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow'
                      : sys === 'BSAB 96'
                      ? 'bg-sky-600 text-white border-sky-500 shadow'
                      : sys === 'AMA Samordning'
                      ? 'bg-amber-600 text-white border-amber-500 shadow'
                      : 'bg-slate-800 text-white border-slate-700 shadow'
                    : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {sys === 'Alla' ? 'Alla system' : sys}
              </button>
            );
          })}
        </div>

        {/* Category filter pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2">
          <span className="text-xs font-medium text-slate-400 mr-1">Område:</span>
          {AMA_BSA_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs transition cursor-pointer border ${
                  isSelected
                    ? 'bg-slate-200 text-slate-900 border-white font-medium'
                    : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-3">
        {filteredEntries.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-10 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-white">Inga koder matchade din sökning</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Pröva att söka på en kortare bokstavskod (t.ex. <code>EB</code>, <code>63</code>, <code>EV</code>) eller enklare ord som <em>central</em>, <em>kabel</em>, <em>larm</em> eller <em>belysning</em>.
            </p>
            <button
              onClick={handleClear}
              className="mt-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-medium transition cursor-pointer"
            >
              Återställ filter och sökning
            </button>
          </div>
        ) : (
          filteredEntries.map((entry) => {
            const isCopied = copiedCode === entry.code;
            const isAmaEl = entry.system === 'AMA EL';
            const isBsab96 = entry.system === 'BSAB 96';

            return (
              <div
                key={`${entry.system}-${entry.code}`}
                className="bg-slate-900/70 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4 sm:p-5 transition shadow-sm space-y-3 group"
              >
                {/* Header row: Code, System Badge, Title, Category */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span
                      className={`font-mono text-base sm:text-lg font-extrabold px-3 py-1 rounded-xl border ${
                        isAmaEl
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : isBsab96
                          ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {entry.code}
                    </span>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-300 transition">
                          {entry.title}
                        </span>
                        <span
                          className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border ${
                            isAmaEl
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : isBsab96
                              ? 'bg-sky-500/20 text-sky-300 border-sky-500/30'
                              : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          }`}
                        >
                          {entry.system}
                        </span>
                        {entry.parentCode && (
                          <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                            Del av {entry.parentCode}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Tag className="w-3 h-3 text-slate-500" />
                        {entry.category}
                      </span>
                    </div>
                  </div>

                  {/* Copy actions */}
                  <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0">
                    <button
                      onClick={() => handleCopy(entry.code, entry.code)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-950/70 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-medium border border-slate-800 transition cursor-pointer"
                      title="Kopiera kod"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-semibold">Kopierad</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>Kopiera kod</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() =>
                        handleCopy(
                          `${entry.code} ${entry.title} (${entry.system})\n${entry.scope}`,
                          `full-${entry.code}`
                        )
                      }
                      className="px-2.5 py-1.5 bg-slate-950/70 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-medium border border-slate-800 transition cursor-pointer"
                      title="Kopiera kod och beskrivning"
                    >
                      {copiedCode === `full-${entry.code}` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <span>Kopiera text</span>
                      )}
                    </button>
                  </div>
                </div>

                {/* Scope / Description */}
                <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed">
                  {entry.scope}
                </p>

                {/* Typical materials pills */}
                {entry.typicalMaterials.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <span className="text-[11px] font-medium text-slate-400">Typiskt materiel / innehåll:</span>
                    {entry.typicalMaterials.map((mat) => (
                      <span
                        key={mat}
                        className="text-[11px] bg-slate-950 text-slate-300 px-2 py-0.5 rounded-md border border-slate-800/80"
                      >
                        {mat}
                      </span>
                    ))}
                  </div>
                )}

                {/* Cross-reference bridge: IEC 81346 & IEC 61355 */}
                <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-800/60 text-xs">
                  {entry.iec81346Equivalents && entry.iec81346Equivalents.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-indigo-400 font-medium flex items-center gap-1">
                        <Zap className="w-3 h-3 text-indigo-400" />
                        IEC 81346 schema:
                      </span>
                      {entry.iec81346Equivalents.map((iec) => (
                        <span
                          key={iec}
                          className="font-mono text-[11px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/30"
                        >
                          {iec}
                        </span>
                      ))}
                    </div>
                  )}

                  {entry.iec61355Documents && entry.iec61355Documents.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-cyan-400 font-medium flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-cyan-400" />
                        IEC 61355 handlingar:
                      </span>
                      {entry.iec61355Documents.map((doc) => (
                        <span
                          key={doc}
                          className="font-mono text-[11px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30"
                        >
                          {doc}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* RA Notes / Field advice callout */}
                {entry.raNotes && (
                  <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/90 text-xs text-slate-400 flex items-start gap-2">
                    <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-emerald-400 font-semibold mr-1">Råd & Anvisningar (RA):</span>
                      <span className="text-slate-300 text-[11px] leading-relaxed">{entry.raNotes}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
