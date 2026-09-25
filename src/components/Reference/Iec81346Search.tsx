import React, { useState, useMemo } from 'react';
import {
  IEC_TABLE_2_ENTRIES,
  IEC_MAIN_CLASSES,
  IEC_PREFIX_RULES,
  searchIec81346,
  Iec81346Entry,
} from '../../utils/iec81346Data';
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
} from 'lucide-react';

export const Iec81346Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Alla');
  const [selectedMainClass, setSelectedMainClass] = useState('Alla');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showPrefixGuide, setShowPrefixGuide] = useState(false);

  // Available categories for filter pills
  const categories = useMemo(() => {
    const set = new Set<string>();
    IEC_TABLE_2_ENTRIES.forEach((e) => set.add(e.category));
    return ['Alla', ...Array.from(set)];
  }, []);

  // Filtered entries
  const filteredEntries = useMemo(() => {
    return searchIec81346(searchQuery, selectedCategory, selectedMainClass);
  }, [searchQuery, selectedCategory, selectedMainClass]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleClear = () => {
    setSearchQuery('');
    setSelectedCategory('Alla');
    setSelectedMainClass('Alla');
  };

  // Quick search presets for field electricians
  const quickSearchPresets = [
    { label: 'Dvärgbrytare (MCB)', query: 'dvärgbrytare' },
    { label: 'Kontaktor', query: 'kontaktor' },
    { label: 'Smältsäkring', query: 'smältsäkring' },
    { label: 'Jordfelsbrytare', query: 'jordfelsbrytare' },
    { label: 'Frekvensomriktare', query: 'frekvensomriktare' },
    { label: 'Temperaturgivare (PT100)', query: 'temperatur' },
    { label: 'Nödstopp', query: 'nödstopp' },
    { label: 'Radplint', query: 'radplint' },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5 sm:mt-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <span>Postbeteckningar enligt IEC 81346 Tabell 2</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                  SS-EN IEC 81346-2
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Slå upp och sök referensbeteckningar (komponentkoder) för elscheman, styrskåp och automationsanläggningar.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowPrefixGuide(!showPrefixGuide)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 ${
              showPrefixGuide
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-950/80 hover:bg-slate-800 text-slate-300 border border-slate-700'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-indigo-400" />
            <span>{showPrefixGuide ? 'Dölj prefixguide (= + - :)' : 'Prefixguide (= + - :)'}</span>
          </button>
        </div>

        {/* Collapsible Prefix & Structure Guide */}
        {showPrefixGuide && (
          <div className="mt-5 pt-4 border-t border-slate-800/80 space-y-4 animate-in fade-in duration-200">
            <div className="bg-slate-950/70 border border-indigo-500/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2 text-indigo-300 font-semibold text-xs">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Struktur för fullständig referensbeteckning (IEC 81346-1):</span>
              </div>
              <div className="font-mono text-sm sm:text-base font-bold text-white bg-slate-900 px-4 py-2.5 rounded-lg border border-slate-800 flex flex-wrap items-center gap-2">
                <span className="text-amber-400" title="Funktionsaspekt">=FUNKTION</span>
                <span className="text-sky-400" title="Placeringsaspekt">+PLACERING</span>
                <span className="text-emerald-400" title="Produktaspekt">-KOMPONENT</span>
                <span className="text-pink-400" title="Anslutningsaspekt">:KLÄMMA</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                <strong>Exempel:</strong> <code className="text-indigo-300 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">=P1 +W1 -QA1 :1</code> =
                Pumpstation 1 (=P1), Apparatskåp 1 (+W1), Huvudströmbrytare/Effektbrytare 1 (-QA1), Klämma 1 (:1).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {IEC_PREFIX_RULES.map((rule) => (
                <div key={rule.symbol} className="bg-slate-950/50 border border-slate-800 rounded-xl p-3 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-300 font-mono font-bold text-base flex items-center justify-center border border-indigo-500/30">
                      {rule.symbol}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 font-semibold">{rule.englishAspect}</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{rule.name}</h4>
                    <p className="text-[11px] text-slate-300 mt-1">{rule.purpose}</p>
                    <div className="text-[10px] font-mono text-amber-300 bg-slate-900/90 px-2 py-1 rounded mt-2 border border-slate-800/80">
                      Ex: {rule.example}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Search Bar & Filter Controls */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        {/* Main Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Sök postbeteckning t.ex. 'QA', 'kontaktor', 'dvärgbrytare', 'FC', 'PT100', 'nödstopp'..."
            className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 rounded-xl pl-12 pr-10 py-3 text-sm sm:text-base font-medium text-white placeholder-slate-500 focus:outline-none transition shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
              title="Rensa sökning"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Search Badges */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] text-slate-400 flex items-center gap-1 mr-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Vanliga sökningar:
          </span>
          {quickSearchPresets.map((preset) => (
            <button
              key={preset.label}
              onClick={() => setSearchQuery(preset.query)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition cursor-pointer ${
                searchQuery.toLowerCase() === preset.query.toLowerCase()
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'bg-slate-950/70 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:text-white'
              }`}
            >
              {preset.label}
            </button>
          ))}
          {(searchQuery || selectedCategory !== 'Alla' || selectedMainClass !== 'Alla') && (
            <button
              onClick={handleClear}
              className="ml-auto text-xs text-rose-400 hover:text-rose-300 font-medium transition cursor-pointer py-1 px-2 rounded hover:bg-rose-500/10"
            >
              Återställ alla filter
            </button>
          )}
        </div>

        {/* Filter by IEC Main Class (Table 1: A-X) */}
        <div className="pt-2 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>Huvudklass (Tabell 1 – Grundbokstav):</span>
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              {filteredEntries.length} {filteredEntries.length === 1 ? 'träff' : 'träffar'}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            <button
              onClick={() => setSelectedMainClass('Alla')}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition cursor-pointer shrink-0 ${
                selectedMainClass === 'Alla'
                  ? 'bg-indigo-600 text-white font-bold shadow-sm'
                  : 'bg-slate-950/60 hover:bg-slate-800 text-slate-400 border border-slate-800'
              }`}
            >
              Alla
            </button>
            {IEC_MAIN_CLASSES.map((mc) => {
              const isSelected = selectedMainClass === mc.letter;
              return (
                <button
                  key={mc.letter}
                  onClick={() => setSelectedMainClass(isSelected ? 'Alla' : mc.letter)}
                  title={`${mc.letter}: ${mc.name}`}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-indigo-500 text-slate-950 shadow-sm'
                      : 'bg-slate-950/60 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  }`}
                >
                  <span className="font-bold">{mc.letter}</span>
                  <span className="text-[10px] font-sans font-normal text-slate-400 hidden sm:inline">
                    {mc.category}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter by Category Pills */}
        <div className="pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-1.5 mb-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-semibold text-slate-400">Filtrera per fackområde:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-950/50 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Results Grid */}
      <div className="space-y-3">
        {filteredEntries.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-white">Inga postbeteckningar matchade &quot;{searchQuery}&quot;</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Försök söka på komponentens svenska namn (t.ex. &quot;kontaktor&quot;, &quot;säkring&quot;, &quot;brytare&quot;), engelska term eller en enskild bokstav (t.ex. &quot;Q&quot; eller &quot;F&quot;).
            </p>
            <button
              onClick={handleClear}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition cursor-pointer shadow"
            >
              Återställ sökning
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEntries.map((entry) => {
              const isCopied = copiedCode === entry.typicalPrefix;
              return (
                <div
                  key={entry.code}
                  className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 sm:p-5 space-y-3 shadow-sm transition hover:shadow-md flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    {/* Header: Code Badge + Category */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`font-mono text-xl font-extrabold px-3 py-1 rounded-xl border ${entry.colorClass}`}
                        >
                          {entry.code}
                        </span>
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                            Huvudklass {entry.mainClass}
                          </span>
                          <span className="text-[11px] font-medium text-amber-400/90 font-mono">
                            {entry.category}
                          </span>
                        </div>
                      </div>

                      {/* Schematic Prefix Copy Button */}
                      <button
                        onClick={() => handleCopy(entry.typicalPrefix)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition cursor-pointer border ${
                          isCopied
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-slate-950/80 hover:bg-slate-800 text-slate-300 border-slate-800 hover:text-white'
                        }`}
                        title="Kopiera schema-prefix"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{entry.typicalPrefix}</span>
                      </button>
                    </div>

                    {/* Swedish Name & Official English Title */}
                    <div>
                      <h3 className="text-base font-bold text-white leading-snug">{entry.swedishName}</h3>
                      <p className="text-xs text-slate-400 font-sans italic mt-0.5">{entry.englishName}</p>
                    </div>

                    {/* Standard Definition */}
                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/80">
                      {entry.definition}
                    </p>

                    {/* Real-world component examples in Sweden */}
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                        <Tag className="w-3 h-3 text-indigo-400" />
                        Typiska komponenter & fabrikat:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {entry.examples.map((example, idx) => (
                          <span
                            key={idx}
                            className="bg-slate-950 text-slate-300 border border-slate-800/90 px-2 py-0.5 rounded-md text-[11px]"
                          >
                            {example}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Legacy Note (IEC 61346 vs 81346) */}
                  {entry.legacyComparison && (
                    <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-1.5">
                      <Info className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-slate-300">Äldre standard:</strong> {entry.legacyComparison}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Practical Industry Knowledge Card */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-amber-400" />
          <span>Viktigt att veta om IEC 81346-2 för fälttekniker</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300 leading-relaxed">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
            <strong className="text-white block text-xs">Varför bytte standarden från IEC 61346 till 81346?</strong>
            <p className="text-slate-400">
              I äldre ritningar (IEC 61346) betecknades en komponent utifrån <em>vad den är</em> (t.ex. -Q för brytare, -K för relä). I IEC 81346 klassificeras objekt strikt efter dess <strong>primära funktion / uppgift</strong> (task/purpose). Därför är en dvärgbrytare med överströmsskydd klassad som <strong>-FD</strong> (skyddsklass F), medan en kontaktor i kraftkrets är <strong>-QC</strong> (kraftkoppling Q) och i styrkrets <strong>-KM</strong> (signalbehandling K).
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
            <strong className="text-white block text-xs">Postbeteckning vid flera likadana komponenter</strong>
            <p className="text-slate-400">
              Vid flera komponenter av samma typ i samma skåp numreras de sekventiellt uppifrån och ned eller från vänster till höger i schemat, t.ex. <code className="text-amber-300 bg-slate-900 px-1 py-0.5 rounded">-QA1</code>, <code className="text-amber-300 bg-slate-900 px-1 py-0.5 rounded">-QA2</code>, <code className="text-amber-300 bg-slate-900 px-1 py-0.5 rounded">-FD1</code>, <code className="text-amber-300 bg-slate-900 px-1 py-0.5 rounded">-FD2</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
