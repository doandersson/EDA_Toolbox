import React, { useState, useMemo } from 'react';
import {
  IEC_61355_ENTRIES,
  IEC_61355_MAIN_CLASSES,
  IEC_61355_PROJECT_TEMPLATES,
  searchIec61355,
  Iec61355DocumentKind,
  Iec61355ProjectTemplate,
} from '../../utils/iec61355Data';
import {
  FileText,
  Search,
  CheckSquare,
  Square,
  Copy,
  Check,
  Download,
  Info,
  Layers,
  Sparkles,
  BookOpen,
  ArrowRight,
  Filter,
  X,
  FileCheck,
  ShieldCheck,
  Cpu,
  Building,
  Sun,
  Droplet,
  Plus,
  Trash2,
  Share2,
} from 'lucide-react';

type SelectorViewMode = 'search' | 'templates' | 'guide';

export const Iec61355Selector: React.FC = () => {
  const [viewMode, setViewMode] = useState<SelectorViewMode>('search');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('control_cabinet_machine');

  // Selected document codes for the active project
  const [selectedDocCodes, setSelectedDocCodes] = useState<Set<string>>(() => {
    const initialTpl = IEC_61355_PROJECT_TEMPLATES[0];
    return new Set(initialTpl.recommendedDocs.map((d) => d.letterCode));
  });

  // Custom project prefix values for designation generator
  const [projectPlant, setProjectPlant] = useState('P1');
  const [projectLocation, setProjectLocation] = useState('W1');

  // Search state for Explorer
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Alla');
  const [selectedMainClass, setSelectedMainClass] = useState('Alla');

  // UI state
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [showAddCustomModal, setShowAddCustomModal] = useState(false);

  // Active template
  const currentTemplate = useMemo(() => {
    return (
      IEC_61355_PROJECT_TEMPLATES.find((t) => t.id === selectedTemplateId) ||
      IEC_61355_PROJECT_TEMPLATES[0]
    );
  }, [selectedTemplateId]);

  // When changing template, optionally load recommended docs
  const handleSelectTemplate = (template: Iec61355ProjectTemplate) => {
    setSelectedTemplateId(template.id);
    setSelectedDocCodes(new Set(template.recommendedDocs.map((d) => d.letterCode)));
  };

  // Toggle selection of a doc code
  const toggleDocSelection = (letterCode: string) => {
    setSelectedDocCodes((prev) => {
      const next = new Set(prev);
      if (next.has(letterCode)) {
        next.delete(letterCode);
      } else {
        next.add(letterCode);
      }
      return next;
    });
  };

  // Quick select actions
  const selectAllObligatory = () => {
    const next = new Set(selectedDocCodes);
    currentTemplate.recommendedDocs
      .filter((d) => d.requirementLevel.includes('Krav'))
      .forEach((d) => next.add(d.letterCode));
    setSelectedDocCodes(next);
  };

  const selectAllRecommended = () => {
    const next = new Set(selectedDocCodes);
    currentTemplate.recommendedDocs.forEach((d) => next.add(d.letterCode));
    setSelectedDocCodes(next);
  };

  const clearSelection = () => {
    setSelectedDocCodes(new Set());
  };

  // Filtered explorer entries
  const filteredEntries = useMemo(() => {
    return searchIec61355(searchQuery, selectedCategory, selectedMainClass);
  }, [searchQuery, selectedCategory, selectedMainClass]);

  // Unique categories for filter pills
  const categories = useMemo(() => {
    const set = new Set<string>();
    IEC_61355_ENTRIES.forEach((e) => set.add(e.category));
    return ['Alla', ...Array.from(set)];
  }, []);

  // Stats calculation
  const stats = useMemo(() => {
    const totalRecommended = currentTemplate.recommendedDocs.length;
    const obligatoryDocs = currentTemplate.recommendedDocs.filter((d) =>
      d.requirementLevel.includes('Krav')
    );
    const selectedObligatoryCount = obligatoryDocs.filter((d) =>
      selectedDocCodes.has(d.letterCode)
    ).length;
    const totalSelectedCount = selectedDocCodes.size;

    return {
      totalRecommended,
      obligatoryTotal: obligatoryDocs.length,
      obligatorySelected: selectedObligatoryCount,
      allSelectedCount: totalSelectedCount,
      isFullyCompliant: selectedObligatoryCount === obligatoryDocs.length,
    };
  }, [currentTemplate, selectedDocCodes]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2500);
  };

  // Generate markdown / delivery text for the project
  const generateDeliveryListText = () => {
    const dateStr = new Date().toISOString().split('T')[0];
    const lines: string[] = [];
    lines.push(`========================================================================`);
    lines.push(`DOKUMENTFÖRTECKNING ENLIGT IEC 61355-1 / SS-EN 61355-1`);
    lines.push(`Projekt/Tillämpning: ${currentTemplate.name}`);
    lines.push(`Referensstandard: ${currentTemplate.standardReference}`);
    lines.push(`Datum: ${dateStr}`);
    lines.push(`Anläggningsdel (=): =${projectPlant || 'ANL'} | Placering (+): +${projectLocation || 'SKAP'}`);
    lines.push(`========================================================================\n`);

    lines.push(`VALDA DOKUMENT (${selectedDocCodes.size} st):\n`);

    const selectedEntries = IEC_61355_ENTRIES.filter((e) =>
      selectedDocCodes.has(e.letterCode)
    );

    selectedEntries.forEach((entry, idx) => {
      const templateItem = currentTemplate.recommendedDocs.find(
        (d) => d.letterCode === entry.letterCode
      );
      const req = templateItem ? `[${templateItem.requirementLevel}]` : '[Anpassat val]';
      const customNote = templateItem?.customNote ? ` - ${templateItem.customNote}` : '';
      const docDesignation = `=${projectPlant} +${projectLocation} &${entry.letterCode}01`;

      lines.push(`${idx + 1}. Kod: &${entry.letterCode} | Ritningsbeteckning: ${docDesignation}`);
      lines.push(`   Titel: ${entry.swedishTitle} (${entry.englishTitle})`);
      lines.push(`   Status: ${req}${customNote}`);
      lines.push(`   Definition: ${entry.definition}`);
      lines.push(`   Innehåll: ${entry.typicalContents.slice(0, 3).join(', ')}`);
      lines.push(`   Referensstandard: ${entry.relevantStandards.join(', ')}`);
      lines.push(``);
    });

    lines.push(`------------------------------------------------------------------------`);
    lines.push(`Beteckningssyntax enligt IEC 81346 & IEC 61355:`);
    lines.push(`  = [Funktion/Anläggning] + [Placering/Skåp] & [Dokumentkod] - [Komponent] : [Plint]`);
    lines.push(`  Exempel: =${projectPlant} +${projectLocation} &FS01 -QA1:1`);
    lines.push(`========================================================================`);

    return lines.join('\n');
  };

  // Download export as txt
  const handleDownloadExport = () => {
    const text = generateDeliveryListText();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Dokumentförteckning_IEC61355_${currentTemplate.id}_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Helper template icon
  const getTemplateIcon = (id: string) => {
    switch (id) {
      case 'control_cabinet_machine':
        return <Cpu className="w-5 h-5 text-indigo-400" />;
      case 'building_distribution':
        return <Building className="w-5 h-5 text-amber-400" />;
      case 'pv_bess_solar':
        return <Sun className="w-5 h-5 text-emerald-400" />;
      case 'pump_station_water':
        return <Droplet className="w-5 h-5 text-cyan-400" />;
      default:
        return <Layers className="w-5 h-5 text-sky-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Explanation */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-2">
              <FileCheck className="w-3.5 h-3.5" />
              <span>SS-EN IEC 61355-1 Klassificering & Dokumenturval</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Urval av dokumentstandard enligt IEC 61355
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Skapa, kontrollera och exportera standardiserade dokumentleveranser för apparatskåp,
              ställverk, elanläggningar och maskiner med officiella dokumentklasskoder (DCC med prefix{' '}
              <code className="text-cyan-300 font-mono font-bold bg-cyan-950/60 px-1 py-0.5 rounded border border-cyan-800/60">
                &amp;
              </code>
              ).
            </p>
          </div>

          {/* Quick mode switcher */}
          <div className="flex items-center bg-slate-950/80 border border-slate-800 p-1.5 rounded-xl shrink-0">
            <button
              onClick={() => setViewMode('search')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                viewMode === 'search'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Sök beteckningar (&amp;)</span>
            </button>

            <button
              onClick={() => setViewMode('templates')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                viewMode === 'templates'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Projektmallar & Checklista</span>
            </button>

            <button
              onClick={() => setViewMode('guide')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                viewMode === 'guide'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Struktur & Prefix</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: PROJEKTURVAL & CHECKLISTA */}
      {viewMode === 'templates' && (
        <div className="space-y-6">
          {/* 1. Template selection cards */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                1. Välj anläggningstyp eller projektprofil
              </span>
              <span className="text-xs text-slate-500">
                Fördefinierade dokumentkrav enligt svenska och internationella standarder
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {IEC_61355_PROJECT_TEMPLATES.map((tpl) => {
                const isSelected = selectedTemplateId === tpl.id;
                return (
                  <button
                    key={tpl.id}
                    onClick={() => handleSelectTemplate(tpl)}
                    className={`text-left p-3.5 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-slate-800/90 border-cyan-500 ring-2 ring-cyan-500/20 shadow-md'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800">
                          {getTemplateIcon(tpl.id)}
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                          {tpl.badge}
                        </span>
                      </div>
                      <h3 className="font-semibold text-white text-xs sm:text-sm line-clamp-1">
                        {tpl.name}
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {tpl.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-mono text-cyan-400 text-[10px]">
                        {tpl.recommendedDocs.length} dok i mall
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {tpl.standardReference.split(',')[0]}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Active Template Overview & Designation Prefixes */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    {getTemplateIcon(currentTemplate.id)}
                    <span>{currentTemplate.name}</span>
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-300 text-xs font-medium">
                    {currentTemplate.standardReference}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
                  {currentTemplate.description} Målgrupp: {currentTemplate.targetApplication}
                </p>
              </div>

              {/* Status Compliance Meter */}
              <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl flex items-center gap-4 shrink-0">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">
                    Obligatoriska krav
                  </div>
                  <div className="text-lg font-bold text-white flex items-center gap-1.5">
                    <span
                      className={
                        stats.isFullyCompliant ? 'text-emerald-400' : 'text-amber-400'
                      }
                    >
                      {stats.obligatorySelected} / {stats.obligatoryTotal}
                    </span>
                    {stats.isFullyCompliant ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3" /> Uppfyllt
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400 bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded-full">
                        Saknar {stats.obligatoryTotal - stats.obligatorySelected} krav
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Totalt valda: {stats.allSelectedCount} dokument
                  </div>
                </div>

                <div className="w-12 h-12 rounded-full border-2 border-slate-800 flex items-center justify-center relative">
                  <span className="text-xs font-bold font-mono text-cyan-400">
                    {Math.round((stats.obligatorySelected / Math.max(stats.obligatoryTotal, 1)) * 100)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Prefix configuration for live drawing numbers */}
            <div className="mt-4 pt-3 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  Konfigurera ritningsprefix:
                </span>
                <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1">
                  <span className="text-amber-400 font-mono font-bold">=</span>
                  <input
                    type="text"
                    value={projectPlant}
                    onChange={(e) => setProjectPlant(e.target.value)}
                    placeholder="P1"
                    className="w-14 bg-transparent text-white font-mono text-xs focus:outline-none"
                    title="Funktion / Anläggning (IEC 81346)"
                  />
                  <span className="text-[10px] text-slate-500">Anläggning</span>
                </div>

                <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1">
                  <span className="text-sky-400 font-mono font-bold">+</span>
                  <input
                    type="text"
                    value={projectLocation}
                    onChange={(e) => setProjectLocation(e.target.value)}
                    placeholder="W1"
                    className="w-14 bg-transparent text-white font-mono text-xs focus:outline-none"
                    title="Placering / Skåp (IEC 81346)"
                  />
                  <span className="text-[10px] text-slate-500">Skåp</span>
                </div>
              </div>

              {/* Quick checklist buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={selectAllObligatory}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition cursor-pointer"
                >
                  Välj obligatoriska
                </button>
                <button
                  onClick={selectAllRecommended}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition cursor-pointer"
                >
                  Välj alla i mallen
                </button>
                <button
                  onClick={clearSelection}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-rose-400 hover:text-rose-300 text-[11px] font-medium transition cursor-pointer"
                >
                  Rensa
                </button>
              </div>
            </div>
          </div>

          {/* 3. Document Checklist & Selection Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  2. Dokumentchecklista för {currentTemplate.name}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-cyan-400 font-mono">
                  {selectedDocCodes.size} valda
                </span>
              </div>

              {/* Export and copy actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    handleCopy(generateDeliveryListText(), 'list')
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition cursor-pointer border border-slate-700"
                >
                  {copiedText === 'list' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Kopierad!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-300" />
                      <span>Kopiera lista</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleDownloadExport}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition cursor-pointer shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Exportera .txt</span>
                </button>

                <button
                  onClick={() => setShowAddCustomModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold transition cursor-pointer border border-cyan-800/60"
                  title="Lägg till valfritt dokument ur hela standarden"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Lägg till från standarden</span>
                </button>
              </div>
            </div>

            {/* Checklist items */}
            <div className="divide-y divide-slate-800/80">
              {currentTemplate.recommendedDocs.map((recItem) => {
                const fullEntry = IEC_61355_ENTRIES.find(
                  (e) => e.letterCode === recItem.letterCode
                );
                if (!fullEntry) return null;

                const isSelected = selectedDocCodes.has(recItem.letterCode);
                const isObligatory = recItem.requirementLevel.includes('Krav');
                const docDesignation = `=${projectPlant} +${projectLocation} &${fullEntry.letterCode}01`;

                return (
                  <div
                    key={recItem.letterCode}
                    onClick={() => toggleDocSelection(recItem.letterCode)}
                    className={`p-4 transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      isSelected
                        ? 'bg-slate-900/90 hover:bg-slate-850'
                        : 'bg-slate-950/40 hover:bg-slate-900/60 opacity-60 hover:opacity-90'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="pt-0.5">
                        {isSelected ? (
                          <div className="w-5 h-5 rounded bg-cyan-600 text-white flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded border border-slate-700 bg-slate-950 hover:border-slate-500" />
                        )}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono font-bold text-sm text-cyan-300 bg-cyan-950/70 border border-cyan-800/80 px-2 py-0.5 rounded">
                            {fullEntry.code}
                          </span>
                          <h4 className="font-bold text-white text-sm">
                            {fullEntry.swedishTitle}
                          </h4>
                          <span className="text-xs text-slate-400 italic">
                            ({fullEntry.englishTitle})
                          </span>

                          {/* Requirement Badge */}
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                              isObligatory
                                ? 'bg-amber-950/80 text-amber-300 border-amber-800/80'
                                : recItem.requirementLevel.includes('Rekommenderad')
                                ? 'bg-sky-950/80 text-sky-300 border-sky-800/80'
                                : 'bg-slate-800 text-slate-400 border-slate-700'
                            }`}
                          >
                            {recItem.requirementLevel}
                          </span>

                          <span className="text-[10px] text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                            {fullEntry.category}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                          {fullEntry.definition}
                        </p>

                        {/* Project Specific Note if any */}
                        {recItem.customNote && (
                          <div className="mt-2 text-[11px] text-amber-200/90 bg-amber-950/30 border border-amber-900/50 px-2.5 py-1 rounded-md flex items-center gap-1.5">
                            <Info className="w-3 h-3 text-amber-400 shrink-0" />
                            <span>
                              <strong>Projektråd:</strong> {recItem.customNote}
                            </span>
                          </div>
                        )}

                        {/* Standard Contents preview */}
                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
                          {fullEntry.typicalContents.slice(0, 3).map((c, i) => (
                            <span
                              key={i}
                              className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800"
                            >
                              • {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right side: standard drawing number & standards */}
                    <div
                      className="md:text-right shrink-0 md:min-w-[200px] flex flex-col md:items-end gap-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                        Standardbeteckning
                      </div>
                      <div className="flex items-center gap-1.5">
                        <code className="font-mono text-xs font-bold text-cyan-300 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                          {docDesignation}
                        </code>
                        <button
                          onClick={() => handleCopy(docDesignation, docDesignation)}
                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
                          title="Kopiera ritningsbeteckning"
                        >
                          {copiedText === docDesignation ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      <div className="text-[10px] text-slate-400 line-clamp-1 max-w-[220px]">
                        {fullEntry.relevantStandards.join(', ')}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Any additional custom documents added outside the template */}
              {Array.from(selectedDocCodes)
                .filter(
                  (code) =>
                    !currentTemplate.recommendedDocs.some((d) => d.letterCode === code)
                )
                .map((customCode) => {
                  const fullEntry = IEC_61355_ENTRIES.find(
                    (e) => e.letterCode === customCode
                  );
                  if (!fullEntry) return null;
                  const docDesignation = `=${projectPlant} +${projectLocation} &${fullEntry.letterCode}01`;

                  return (
                    <div
                      key={customCode}
                      className="p-4 bg-cyan-950/20 border-l-2 border-cyan-500 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="pt-0.5">
                          <div className="w-5 h-5 rounded bg-cyan-600 text-white flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono font-bold text-sm text-cyan-300 bg-cyan-950/70 border border-cyan-800/80 px-2 py-0.5 rounded">
                              {fullEntry.code}
                            </span>
                            <h4 className="font-bold text-white text-sm">
                              {fullEntry.swedishTitle}
                            </h4>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                              Manuellt tillagt tillval
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 mt-1">
                            {fullEntry.definition}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <code className="font-mono text-xs font-bold text-cyan-300 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                          {docDesignation}
                        </code>
                        <button
                          onClick={() => toggleDocSelection(customCode)}
                          className="p-1.5 rounded bg-rose-950/60 border border-rose-800 text-rose-300 hover:bg-rose-900 transition cursor-pointer"
                          title="Ta bort från urvalet"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: FULLSTÄNDIG SÖKBAR DATABAS ÖVER IEC 61355 KLASSKODER */}
      {viewMode === 'search' && (
        <div className="space-y-6">
          {/* Search bar & filter controls */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Sök på dokumentbeteckning (&FS, FT, MA, LD...), titel (kretsschema, apparatlista, kabellista), innehåll eller standard..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-24 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-12 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
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
                <Sparkles className="w-3 h-3 text-cyan-400" />
                Snabbval ritningsslag:
              </span>
              {[
                { label: 'Kretsschema (&FS)', query: '&FS' },
                { label: 'Apparatlista (&FA)', query: '&FA' },
                { label: 'Kabellista (&FL)', query: '&FL' },
                { label: 'Plinttabell (&FT)', query: '&FT' },
                { label: 'Yttre kretsschema (&FN)', query: '&FN' },
                { label: 'Skåplayout (&FE)', query: '&FE' },
                { label: 'Flödesschema / P&ID (&FB)', query: '&FB' },
                { label: 'Underhåll (&MA)', query: '&MA' },
                { label: 'Provningsprotokoll (&PM)', query: '&PM' },
                { label: 'VFD-parametrar (&WC)', query: '&WC' },
                { label: 'Fastighetsnät/IP (&WD)', query: '&WD' },
                { label: 'CE-försäkran (&DA)', query: '&DA' },
              ].map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => setSearchQuery(preset.query)}
                  className={`px-2.5 py-1 rounded-lg text-xs transition cursor-pointer border ${
                    searchQuery.toLowerCase() === preset.query.toLowerCase()
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-medium'
                      : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
              {(searchQuery || selectedMainClass !== 'Alla' || selectedCategory !== 'Alla') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedMainClass('Alla');
                    setSelectedCategory('Alla');
                  }}
                  className="px-2.5 py-1 rounded-lg text-xs text-rose-400 hover:text-rose-300 bg-rose-500/10 border border-rose-500/20 transition cursor-pointer ml-auto"
                >
                  Återställ filter
                </button>
              )}
            </div>

            {/* Main Class Selector Buttons (Table 1 Main Classes) */}
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Huvudklass enligt IEC 61355 Tabell 1:</span>
                <span className="text-slate-500 text-[10px]">
                  {selectedMainClass === 'Alla' ? 'Alla klasser' : `Klass ${selectedMainClass}`}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => setSelectedMainClass('Alla')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    selectedMainClass === 'Alla'
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Alla ({IEC_61355_ENTRIES.length})
                </button>
                {IEC_61355_MAIN_CLASSES.map((mc) => {
                  const isSelected = selectedMainClass === mc.letter;
                  return (
                    <button
                      key={mc.letter}
                      onClick={() => setSelectedMainClass(mc.letter)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-cyan-600 text-white ring-1 ring-cyan-400'
                          : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                      title={mc.name}
                    >
                      <span className="text-cyan-400">&amp;{mc.letter}</span>
                      <span className="text-[11px] font-sans font-normal text-slate-300 hidden sm:inline">
                        {mc.name.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-slate-400 mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3 text-cyan-400" /> Kategori:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-slate-800 text-cyan-300 border border-cyan-700'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Results count & active selection bar */}
          <div className="flex items-center justify-between px-1">
            <span className="text-xs text-slate-400 font-medium">
              Visar {filteredEntries.length} dokumentkoder
            </span>
            <span className="text-xs text-cyan-400 font-medium">
              {selectedDocCodes.size} dokument valda till ditt projekt
            </span>
          </div>

          {/* Grid of IEC 61355 Entries */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEntries.map((entry) => {
              const isSelected = selectedDocCodes.has(entry.letterCode);
              return (
                <div
                  key={entry.code}
                  className={`bg-slate-900 border rounded-2xl p-4 sm:p-5 transition flex flex-col justify-between ${
                    isSelected
                      ? 'border-cyan-500/80 ring-1 ring-cyan-500/20 bg-slate-900/90'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    {/* Card Top: Code badge & Actions */}
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-base font-extrabold text-cyan-300 bg-cyan-950/80 border border-cyan-800 px-2.5 py-1 rounded-lg">
                          {entry.code}
                        </span>
                        <div>
                          <h4 className="font-bold text-white text-sm leading-snug">
                            {entry.swedishTitle}
                          </h4>
                          <span className="text-[11px] text-slate-400 italic">
                            {entry.englishTitle}
                          </span>
                        </div>
                      </div>

                      {/* Add to project toggle button */}
                      <button
                        onClick={() => toggleDocSelection(entry.letterCode)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shrink-0 ${
                          isSelected
                            ? 'bg-cyan-600 text-white shadow-sm'
                            : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-cyan-700 hover:text-cyan-300'
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>I urvalet</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Välj</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Definition */}
                    <p className="text-xs text-slate-300 leading-relaxed mt-2">
                      {entry.definition}
                    </p>

                    {/* Typical contents list */}
                    <div className="mt-3 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                      <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                        Typiskt innehåll i handlingen:
                      </div>
                      <ul className="space-y-1">
                        {entry.typicalContents.map((c, i) => (
                          <li
                            key={i}
                            className="text-[11px] text-slate-300 flex items-start gap-1.5"
                          >
                            <span className="text-cyan-400 font-bold shrink-0 mt-0.5">•</span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Card Bottom: Drawing designation example & Standards */}
                  <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-500 font-medium">Beteckning:</span>
                        <code className="font-mono text-xs font-bold text-cyan-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          ={projectPlant} +{projectLocation} {entry.code}01
                        </code>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleCopy(entry.code, `code-${entry.code}`)}
                          className="px-2 py-0.5 rounded bg-slate-950 hover:bg-slate-800 text-slate-300 text-[11px] font-medium border border-slate-800 transition cursor-pointer flex items-center gap-1"
                          title="Kopiera dokumentkod"
                        >
                          {copiedText === `code-${entry.code}` ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Kopierad</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-slate-400" />
                              <span>{entry.code}</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() =>
                            handleCopy(
                              `=${projectPlant} +${projectLocation} ${entry.code}01`,
                              `full-${entry.code}`
                            )
                          }
                          className="px-2 py-0.5 rounded bg-slate-950 hover:bg-slate-800 text-slate-300 text-[11px] font-medium border border-slate-800 transition cursor-pointer flex items-center gap-1"
                          title="Kopiera fullständig ritningsbeteckning"
                        >
                          {copiedText === `full-${entry.code}` ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Kopierad</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-slate-400" />
                              <span>Beteckning</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 flex-wrap">
                      {entry.relevantStandards.map((st, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-medium"
                        >
                          {st.split(' ')[0]}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 3: STRUKTUR & PREFIXGUIDE (IEC 61355 + IEC 81346) */}
      {viewMode === 'guide' && (
        <div className="space-y-6">
          {/* Syntaxtabell */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Fullständig beteckningssyntax (IEC 81346 + IEC 61355)</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
              I modern elkonstruktion (CAD-system såsom EPLAN, AutoCAD Electrical, PCSCHEMATIC m.fl.)
              kombineras <strong>IEC 81346</strong> (anläggnings-, skåps- och komponentbeteckning)
              med <strong>IEC 61355</strong> (dokument- och ritningsslag). Varje informationsnivå
              har ett unikt prefix-tecken:
            </p>

            {/* Prefix hierarchy cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-2xl font-bold text-amber-400">=</span>
                    <span className="text-[10px] font-semibold text-amber-400/90 bg-amber-950/60 px-2 py-0.5 rounded">
                      IEC 81346
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-xs">Funktion / Anläggning</h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                    Vilket system eller processanläggning objektet tillhör.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800 font-mono text-[11px] text-amber-300">
                  Ex: =P1 (Pumpstation 1)
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-2xl font-bold text-sky-400">+</span>
                    <span className="text-[10px] font-semibold text-sky-400/90 bg-sky-950/60 px-2 py-0.5 rounded">
                      IEC 81346
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-xs">Placering / Skåp</h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                    Var utrustningen sitter fysiskt monterad i byggnad/fält.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800 font-mono text-[11px] text-sky-300">
                  Ex: +W1 (Apparatskåp 1)
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-cyan-800/80 ring-1 ring-cyan-500/20 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-2xl font-bold text-cyan-300">&amp;</span>
                    <span className="text-[10px] font-semibold text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                      IEC 61355
                    </span>
                  </div>
                  <h4 className="font-bold text-cyan-200 text-xs">Dokumentklass (DCC)</h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                    Vilken handlingstyp och ritningsblad det avser.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800 font-mono text-[11px] text-cyan-300">
                  Ex: &amp;FS01 (Kretsschema)
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-2xl font-bold text-indigo-400">-</span>
                    <span className="text-[10px] font-semibold text-indigo-400/90 bg-indigo-950/60 px-2 py-0.5 rounded">
                      IEC 81346 Tab 2
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-xs">Postbeteckning</h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                    Specifik apparat eller komponent i kretsschemat.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800 font-mono text-[11px] text-indigo-300">
                  Ex: -QA1, -KM1, -FD1
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-2xl font-bold text-emerald-400">:</span>
                    <span className="text-[10px] font-semibold text-emerald-400/90 bg-emerald-950/60 px-2 py-0.5 rounded">
                      IEC 81346
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-xs">Anslutningspunkt</h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                    Klämma, anslutningsstift eller plintnummer.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800 font-mono text-[11px] text-emerald-300">
                  Ex: :1, :A1, :14
                </div>
              </div>
            </div>
          </div>

          {/* Vanligaste ritningsslag i industrin */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-cyan-400" />
              <span>Sammanfattning: Standardkoder du möter i svensk eldokumentation</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="font-mono font-bold text-cyan-300">&amp;FS — Kretsschema</div>
                <div className="text-slate-400 text-[11px]">
                  Kärnan i all elkonstruktion. Visar alla ledare, plintar, brytare och reläer.
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="font-mono font-bold text-cyan-300">&amp;FT — Enlinjeschema</div>
                <div className="text-slate-400 text-[11px]">
                  Översikt över kraftdistribution, inkommande serviser och centralers matningar.
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="font-mono font-bold text-cyan-300">&amp;MA — Plinttabell</div>
                <div className="text-slate-400 text-[11px]">
                  Oumbärlig för fältelektriker vid inkoppling av externa kablar till skåpet.
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="font-mono font-bold text-cyan-300">&amp;ME — Kabellista</div>
                <div className="text-slate-400 text-[11px]">
                  Lista över kabeltyper, partantal, areor, längder och var de är anslutna.
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="font-mono font-bold text-cyan-300">&amp;LD — Skåpslayout / Dörrvy</div>
                <div className="text-slate-400 text-[11px]">
                  Mekaniska mått, komponentplacering på DIN-skenor och kapslingens frontlayout.
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="font-mono font-bold text-cyan-300">&amp;PB — Provningsprotokoll</div>
                <div className="text-slate-400 text-[11px]">
                  Obligatorisk kontroll före idrifttagning (kontinuitet, isolation, jordfelsbrytare).
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Lägg till dokument ur standarden */}
      {showAddCustomModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base">
                  Lägg till dokument ur IEC 61355-1 standarden
                </h3>
                <p className="text-xs text-slate-400">
                  Välj ytterligare dokument som du vill inkludera i ditt projekturval
                </p>
              </div>
              <button
                onClick={() => setShowAddCustomModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-2 flex-1">
              {IEC_61355_ENTRIES.map((entry) => {
                const isSelected = selectedDocCodes.has(entry.letterCode);
                return (
                  <div
                    key={entry.code}
                    onClick={() => toggleDocSelection(entry.letterCode)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-500'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-sm text-cyan-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        {entry.code}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-white">
                          {entry.swedishTitle}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {entry.definition}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 pl-3">
                      {isSelected ? (
                        <div className="px-2.5 py-1 rounded bg-cyan-600 text-white text-xs font-semibold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>Vald</span>
                        </div>
                      ) : (
                        <div className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:text-white text-xs font-medium">
                          + Lägg till
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3.5 border-t border-slate-800 bg-slate-950/60 flex justify-end">
              <button
                onClick={() => setShowAddCustomModal(false)}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold cursor-pointer"
              >
                Klar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
