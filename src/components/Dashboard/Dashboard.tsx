import React, { useState, useMemo } from 'react';
import { ActiveTab, CalculationResult } from '../../types/electrical';
import {
  INDUSTRY_NEWS,
  STANDARDS_STATUS,
  IndustryNewsItem,
} from '../../utils/industryNewsData';
import {
  Zap,
  Cable,
  Cpu,
  ArrowLeftRight,
  BookOpen,
  Network,
  Search,
  FileText,
  Building2,
  Newspaper,
  Calendar,
  Clock,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  History,
  Share2,
  Info,
  CheckCircle2,
  Bookmark,
  Check,
  SlidersHorizontal,
  X,
  Terminal,
  Copy,
} from 'lucide-react';

interface Props {
  onSelectTab: (tab: ActiveTab, subTab?: string) => void;
  history: (CalculationResult & { label?: string })[];
  onOpenHistory: () => void;
  onOpenBuildInfo?: () => void;
}

export const Dashboard: React.FC<Props> = ({
  onSelectTab,
  history,
  onOpenHistory,
  onOpenBuildInfo,
}) => {
  const [selectedSource, setSelectedSource] = useState<string>('Alla');
  const [newsSearch, setNewsSearch] = useState<string>('');
  const [activeArticle, setActiveArticle] = useState<IndustryNewsItem | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Filter news
  const filteredNews = useMemo(() => {
    return INDUSTRY_NEWS.filter((item) => {
      if (selectedSource !== 'Alla' && item.source !== selectedSource) {
        return false;
      }
      if (!newsSearch.trim()) return true;
      const q = newsSearch.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.excerpt.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q)) ||
        item.source.toLowerCase().includes(q)
      );
    });
  }, [selectedSource, newsSearch]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const getSourceBadge = (source: IndustryNewsItem['source']) => {
    switch (source) {
      case 'Elsäkerhetsverket':
        return {
          bg: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
          dot: 'bg-rose-400',
        };
      case 'SEK Elstandard':
        return {
          bg: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
          dot: 'bg-blue-400',
        };
      case 'Tidningen Automation':
        return {
          bg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
          dot: 'bg-amber-400',
        };
      case 'Svensk Byggtjänst / AMA':
        return {
          bg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
          dot: 'bg-emerald-400',
        };
      default:
        return {
          bg: 'bg-slate-500/10 text-slate-300 border-slate-500/30',
          dot: 'bg-slate-400',
        };
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Hero / Overview Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/50 border border-slate-800 p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5" />
              <span>EDA Toolbox • Elteknisk Ingenjörsplattform</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Professionellt stöd för{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-cyan-400">
                eldesign, beräkning & standarder
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Utför snabba dimensioneringar av spänningsfall och trefas, slå upp komponentkoder enligt{' '}
              <strong className="text-white">IEC 81346</strong>, dokumentbeteckningar enligt{' '}
              <strong className="text-white">IEC 61355</strong> och branschkoder i{' '}
              <strong className="text-white">AMA EL & BSAB 96</strong>.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 bg-slate-950/60 px-3 py-1 rounded-lg border border-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                SS 436 40 00 & SS-EN 60204-1
              </span>
              <span className="flex items-center gap-1.5 bg-slate-950/60 px-3 py-1 rounded-lg border border-slate-800">
                <FileText className="w-4 h-4 text-amber-400" />
                Exportera PDF-rapporter (A4)
              </span>
              <span className="flex items-center gap-1.5 bg-slate-950/60 px-3 py-1 rounded-lg border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                PWA • Fungerar offline i fält
              </span>
            </div>
          </div>

          {/* Quick Metrics / Stats Widget */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 shrink-0 lg:w-72">
            <div className="bg-slate-950/80 border border-slate-800/90 rounded-2xl p-4 shadow-sm">
              <div className="text-[11px] font-medium text-slate-400">Dokumentkoder</div>
              <div className="text-2xl font-black text-cyan-400 font-mono mt-1">45+ st</div>
              <div className="text-[10px] text-slate-500 mt-0.5">IEC 61355 klasser</div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800/90 rounded-2xl p-4 shadow-sm">
              <div className="text-[11px] font-medium text-slate-400">Postbeteckningar</div>
              <div className="text-2xl font-black text-indigo-400 font-mono mt-1">50+ st</div>
              <div className="text-[10px] text-slate-500 mt-0.5">IEC 81346 tabell 2</div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800/90 rounded-2xl p-4 shadow-sm">
              <div className="text-[11px] font-medium text-slate-400">AMA & BSAB</div>
              <div className="text-2xl font-black text-emerald-400 font-mono mt-1">70+ st</div>
              <div className="text-[10px] text-slate-500 mt-0.5">AMA EL & BSAB 96</div>
            </div>

            <div
              onClick={onOpenHistory}
              className="bg-slate-950/80 border border-slate-800/90 hover:border-amber-500/50 rounded-2xl p-4 shadow-sm cursor-pointer transition group"
            >
              <div className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
                <span>Historik</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition" />
              </div>
              <div className="text-2xl font-black text-amber-400 font-mono mt-1">
                {history.length} st
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Sparade beräkningar</div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Announcement: PDF Calculation Reports in A4 */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-sky-500/10 border border-amber-500/25 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-bold text-white text-sm">
                Exportera beräkningar som professionell A4 PDF-rapport
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                A4 FORMAT
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                KÄLLHÄNVISNINGAR
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5 max-w-2xl leading-relaxed">
              Spara kalkylen som ett komplett dimensioneringsunderlag i PDF. Inkluderar normativa källor (SS 436 40 00, SEK Handbok 444, ELSÄK-FS), insatta formler och teknisk bedömning – allt perfekt proportionerat för A4.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onSelectTab('voltage_drop')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition cursor-pointer shadow-md shadow-amber-500/20"
          >
            <span>Öppna Spänningsfall</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Feature 2: Build & Installation Information Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-bold text-white text-sm">
                Bygg &amp; Installera Applikationen Lokalt
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                NODE.JS 18+ / 20+
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                VITE + REACT 19
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5 max-w-2xl leading-relaxed">
              Snabbstart: Kör <code className="bg-slate-950 px-1.5 py-0.5 rounded text-amber-300 font-mono text-[11px] border border-slate-800">npm install</code> följt av <code className="bg-slate-950 px-1.5 py-0.5 rounded text-cyan-300 font-mono text-[11px] border border-slate-800">npm run dev</code>. Skapa produktionsbygge med <code className="bg-slate-950 px-1.5 py-0.5 rounded text-emerald-300 font-mono text-[11px] border border-slate-800">npm run build</code>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            onClick={() => handleCopy('npm install && npm run dev', 'dash-quick-run')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 transition cursor-pointer"
            title="Kopiera snabbstartskommando"
          >
            {copiedText === 'dash-quick-run' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Kopierat!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Kopiera start</span>
              </>
            )}
          </button>

          {onOpenBuildInfo && (
            <button
              onClick={onOpenBuildInfo}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition cursor-pointer shadow-md shadow-cyan-600/20"
            >
              <span>Installationsguide</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Quick Tool Launchpad (Snabbåtkomst till beräkningar & verktyg) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Verktygslåda & Beräkningar</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Välj ett beräkningsverktyg eller slå upp standarder och beteckningar.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Ohms lag */}
          <button
            onClick={() => onSelectTab('ohms')}
            className="group text-left p-4 rounded-2xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition cursor-pointer shadow-sm relative overflow-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-105 transition">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm group-hover:text-amber-300 transition flex items-center justify-between">
              <span>Ohms lag & Effekt</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition text-amber-400" />
            </h3>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              Beräkna U, I, R och P med formelsteg, automatiska enheter och visualisering.
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-[10px] font-mono text-amber-400/90 font-semibold">
              <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">U = I · R</span>
              <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">P = U · I</span>
            </div>
          </button>

          {/* Spänningsfall */}
          <button
            onClick={() => onSelectTab('voltage_drop')}
            className="group text-left p-4 rounded-2xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition cursor-pointer shadow-sm relative overflow-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-105 transition">
              <Cable className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm group-hover:text-emerald-300 transition flex items-center justify-between">
              <span>Spänningsfall i kabel</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition text-emerald-400" />
            </h3>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              Kabeldimensionering och kontroll mot 3 % / 5 % gränsen enligt SS 436 40 00.
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-[10px] font-mono text-emerald-400/90 font-semibold">
              <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">Cu & Al</span>
              <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">1-fas & 3-fas</span>
            </div>
          </button>

          {/* 3-Fas effekt */}
          <button
            onClick={() => onSelectTab('three_phase')}
            className="group text-left p-4 rounded-2xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition cursor-pointer shadow-sm relative overflow-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-3 group-hover:scale-105 transition">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm group-hover:text-indigo-300 transition flex items-center justify-between">
              <span>3-Fas Effekt & Motorer</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition text-indigo-400" />
            </h3>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              Aktiv (P), reaktiv (Q) och skenbar effekt (S), cos φ samt Y- och D-kopplingar.
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-[10px] font-mono text-indigo-400/90 font-semibold">
              <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">P = √3·U·I·cosφ</span>
            </div>
          </button>

          {/* IEC 61355 Dokumentstandard */}
          <button
            onClick={() => onSelectTab('reference', 'iec61355')}
            className="group text-left p-4 rounded-2xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition cursor-pointer shadow-sm relative overflow-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3 group-hover:scale-105 transition">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm group-hover:text-cyan-300 transition flex items-center justify-between">
              <span>IEC 61355 Dokumentkoder</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition text-cyan-400" />
            </h3>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              Slå upp ritningsslag: Kretsschema (&FS), Kabellista (&FL), Apparatlista (&FA).
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-[10px] font-mono text-cyan-400/90 font-semibold">
              <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">&FS</span>
              <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">&FL</span>
              <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">&FA</span>
              <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">&MA</span>
            </div>
          </button>

          {/* IEC 81346 Postbeteckningar */}
          <button
            onClick={() => onSelectTab('reference', 'iec81346')}
            className="group text-left p-4 rounded-2xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition cursor-pointer shadow-sm relative overflow-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-3 group-hover:scale-105 transition">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm group-hover:text-indigo-300 transition flex items-center justify-between">
              <span>IEC 81346 Postbeteckningar</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition text-indigo-400" />
            </h3>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              Tabell 2 komponentkoder (-QA dvärgbrytare, -KM kontaktor, -SF givare).
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-[10px] font-mono text-indigo-400/90 font-semibold">
              <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">-QA</span>
              <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">-KM</span>
              <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">-SF</span>
              <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">:1</span>
            </div>
          </button>

          {/* AMA & BSAB Koder */}
          <button
            onClick={() => onSelectTab('reference', 'ama_bsa')}
            className="group text-left p-4 rounded-2xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition cursor-pointer shadow-sm relative overflow-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-105 transition">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm group-hover:text-emerald-300 transition flex items-center justify-between">
              <span>AMA EL & BSAB 96</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition text-emerald-400" />
            </h3>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              Sök byggdelar (61-68), kanalisation (EB), kablar (EC), ställverk (ED) och YKB.
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-[10px] font-mono text-emerald-400/90 font-semibold">
              <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">63.1</span>
              <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">EBC</span>
              <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">EVB</span>
              <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">YKB</span>
            </div>
          </button>

          {/* Serie & Parallell */}
          <button
            onClick={() => onSelectTab('series_parallel')}
            className="group text-left p-4 rounded-2xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-sky-500/50 transition cursor-pointer shadow-sm relative overflow-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 mb-3 group-hover:scale-105 transition">
              <Network className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm group-hover:text-sky-300 transition flex items-center justify-between">
              <span>Serie- & Parallell</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition text-sky-400" />
            </h3>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              Kombinerade kretsar, ersättningsresistans, spänningsdelning och strömfördelning.
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-[10px] font-mono text-sky-400/90 font-semibold">
              <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">R_tot = Σ R</span>
              <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">1/R_p</span>
            </div>
          </button>

          {/* Enhetsomvandlare */}
          <button
            onClick={() => onSelectTab('converter')}
            className="group text-left p-4 rounded-2xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition cursor-pointer shadow-sm relative overflow-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-105 transition">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm group-hover:text-amber-300 transition flex items-center justify-between">
              <span>Enhetsomvandlare</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition text-amber-400" />
            </h3>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              AWG till mm², HP till kW, cos φ till fasvinkel, kWh till MJ.
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-[10px] font-mono text-amber-400/90 font-semibold">
              <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">AWG ↔ mm²</span>
              <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">HP ↔ kW</span>
            </div>
          </button>
        </div>
      </div>

      {/* 3. Industry News Section (Branschnyheter från Elsäkerhetsverket, Elstandard & Automation) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1">
              <Newspaper className="w-4 h-4" />
              <span>Branschbevakning & Standarduppdateringar</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Nyheter för elkonstruktörer & automationsingenjörer
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Kurerade nyheter och regelverksförändringar från Elsäkerhetsverket, SEK Elstandard och Tidningen Automation.
            </p>
          </div>

          {/* Search bar inside news */}
          <div className="relative sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={newsSearch}
              onChange={(e) => setNewsSearch(e.target.value)}
              placeholder="Sök nyheter, ämnen, standarder..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
            />
            {newsSearch && (
              <button
                onClick={() => setNewsSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Source Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-medium mr-1 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            Källa:
          </span>
          {[
            'Alla',
            'Elsäkerhetsverket',
            'SEK Elstandard',
            'Tidningen Automation',
            'Svensk Byggtjänst / AMA',
          ].map((source) => {
            const isSelected = selectedSource === source;
            return (
              <button
                key={source}
                onClick={() => setSelectedSource(source)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer border ${
                  isSelected
                    ? source === 'Elsäkerhetsverket'
                      ? 'bg-rose-600 text-white border-rose-500 shadow'
                      : source === 'SEK Elstandard'
                      ? 'bg-blue-600 text-white border-blue-500 shadow'
                      : source === 'Tidningen Automation'
                      ? 'bg-amber-600 text-white border-amber-500 shadow'
                      : source === 'Svensk Byggtjänst / AMA'
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow'
                      : 'bg-cyan-600 text-white border-cyan-500 shadow'
                    : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {source === 'Alla' ? 'Alla källor' : source}
              </button>
            );
          })}
        </div>

        {/* News Feed Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNews.length === 0 ? (
            <div className="col-span-full bg-slate-900/50 border border-slate-800 rounded-2xl p-8 text-center space-y-2">
              <p className="text-sm font-semibold text-white">Inga nyheter matchade din filtrering</p>
              <p className="text-xs text-slate-400">
                Pröva att välja "Alla källor" eller rensa sökfältet.
              </p>
              <button
                onClick={() => {
                  setSelectedSource('Alla');
                  setNewsSearch('');
                }}
                className="mt-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-medium rounded-lg text-slate-200 transition cursor-pointer"
              >
                Återställ nyhetsfilter
              </button>
            </div>
          ) : (
            filteredNews.map((article) => {
              const badge = getSourceBadge(article.source);
              return (
                <div
                  key={article.id}
                  className="bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 flex flex-col justify-between transition shadow-sm group hover:shadow-md"
                >
                  <div className="space-y-3">
                    {/* Source tag & date */}
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${badge.bg}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                        <span>{article.source}</span>
                      </span>

                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        {article.date}
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      onClick={() => setActiveArticle(article)}
                      className="text-sm sm:text-base font-bold text-white group-hover:text-amber-300 transition cursor-pointer leading-snug"
                    >
                      {article.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                      {article.excerpt}
                    </p>

                    {/* Practical Impact Callout Box */}
                    <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                        <Info className="w-3 h-3 text-cyan-400" />
                        Inverkan för elkonstruktören:
                      </span>
                      <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                        {article.impactForDesigners}
                      </p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {article.tags.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] bg-slate-950 px-2 py-0.5 rounded text-slate-400 border border-slate-800/80"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Action: Read more */}
                  <div className="mt-4 pt-3 border-t border-slate-800/70 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.readTime}
                    </span>

                    <button
                      onClick={() => setActiveArticle(article)}
                      className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition flex items-center gap-1 cursor-pointer"
                    >
                      <span>Läs mer & åtgärder</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 4. Active Standards & Status Bar (Standardöversikt) */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-white font-bold text-sm sm:text-base">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>Aktuella standarder & utgåvor i Sverige</span>
          </div>
          <span className="text-[11px] text-slate-400">
            Referenser för dimensionering och projektering
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {STANDARDS_STATUS.map((std) => (
            <div
              key={std.standard}
              className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-white">{std.standard}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {std.status}
                </span>
              </div>
              <div className="text-[11px] font-semibold text-slate-300">{std.edition}</div>
              <p className="text-[11px] text-slate-400 leading-relaxed">{std.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Article Detail Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl relative space-y-5 animate-in fade-in zoom-in-95 duration-200 my-8">
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-950/80 hover:bg-slate-800 border border-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-2 pr-10">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full border ${
                    getSourceBadge(activeArticle.source).bg
                  }`}
                >
                  {activeArticle.source}
                </span>
                <span className="text-xs text-slate-400">{activeArticle.sourceCategory}</span>
                <span className="text-xs text-slate-500">• {activeArticle.date}</span>
              </div>

              <h2 className="text-lg sm:text-xl font-extrabold text-white leading-snug">
                {activeArticle.title}
              </h2>
            </div>

            {/* Modal Impact Highlight Box */}
            <div className="bg-cyan-950/30 border border-cyan-500/40 rounded-2xl p-4 space-y-1.5">
              <div className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Vad innebär detta för elkonstruktören & montören?</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {activeArticle.impactForDesigners}
              </p>
            </div>

            {/* Full text content */}
            <div className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line space-y-3">
              {activeArticle.fullText}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              {activeArticle.tags.map((t) => (
                <span
                  key={t}
                  className="text-xs bg-slate-950 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-800"
                >
                  #{t}
                </span>
              ))}
            </div>

            {/* Modal Footer actions */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() =>
                  handleCopy(
                    `${activeArticle.title}\nKälla: ${activeArticle.source} (${activeArticle.date})\n\n${activeArticle.fullText}`,
                    'modal-article'
                  )
                }
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 transition cursor-pointer"
              >
                {copiedText === 'modal-article' ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Kopierat till urklipp</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-slate-400" />
                    <span>Kopiera sammanfattning</span>
                  </>
                )}
              </button>

              {activeArticle.externalUrl && (
                <a
                  href={activeArticle.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition shadow-sm"
                >
                  <span>Besök {activeArticle.source}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
