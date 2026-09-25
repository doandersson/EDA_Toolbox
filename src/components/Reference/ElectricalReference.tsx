import React, { useState, useEffect } from 'react';
import { BookOpen, ShieldCheck, Check, Info, Search, Palette, Cable, ShieldAlert, FileText, Building2 } from 'lucide-react';
import { Iec81346Search } from './Iec81346Search';
import { Iec61355Selector } from './Iec61355Selector';
import { AmaBsaSearch } from './AmaBsaSearch';

export type RefSubTab = 'ama_bsa' | 'iec61355' | 'iec81346' | 'colors' | 'fuses' | 'ip' | 'all';

interface Props {
  subTab?: RefSubTab;
}

export const ElectricalReference: React.FC<Props> = ({ subTab }) => {
  const [activeSubTab, setActiveSubTab] = useState<RefSubTab>(subTab || 'iec61355');

  useEffect(() => {
    if (subTab) {
      setActiveSubTab(subTab);
    }
  }, [subTab]);

  return (
    <div className="space-y-6">
      {/* Sub navigation bar */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-900/90 border border-slate-800 p-2 rounded-2xl shadow-sm">
        <button
          onClick={() => setActiveSubTab('iec61355')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
            activeSubTab === 'iec61355'
              ? 'bg-cyan-600 text-white shadow'
              : 'bg-slate-950/60 hover:bg-slate-800 text-slate-300 border border-slate-800'
          }`}
        >
          <Search className="w-4 h-4 text-cyan-300" />
          <span>IEC 61355 Dokumentbeteckningar</span>
        </button>

        <button
          onClick={() => setActiveSubTab('iec81346')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
            activeSubTab === 'iec81346'
              ? 'bg-indigo-600 text-white shadow'
              : 'bg-slate-950/60 hover:bg-slate-800 text-slate-300 border border-slate-800'
          }`}
        >
          <Search className="w-4 h-4 text-indigo-300" />
          <span>IEC 81346 Postbeteckningar</span>
        </button>

        <button
          onClick={() => setActiveSubTab('ama_bsa')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
            activeSubTab === 'ama_bsa'
              ? 'bg-emerald-600 text-white shadow'
              : 'bg-slate-950/60 hover:bg-slate-800 text-slate-300 border border-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4 text-emerald-300" />
          <span>AMA & BSAB Koder</span>
        </button>

        <button
          onClick={() => setActiveSubTab('colors')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
            activeSubTab === 'colors'
              ? 'bg-amber-500 text-slate-950 shadow'
              : 'bg-slate-950/60 hover:bg-slate-800 text-slate-300 border border-slate-800'
          }`}
        >
          <Palette className="w-4 h-4 text-amber-400" />
          <span>Kabelledarfärger (SS-EN 60446)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('fuses')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
            activeSubTab === 'fuses'
              ? 'bg-amber-500 text-slate-950 shadow'
              : 'bg-slate-950/60 hover:bg-slate-800 text-slate-300 border border-slate-800'
          }`}
        >
          <Cable className="w-4 h-4 text-emerald-400" />
          <span>Area & Säkringstabell</span>
        </button>

        <button
          onClick={() => setActiveSubTab('ip')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
            activeSubTab === 'ip'
              ? 'bg-amber-500 text-slate-950 shadow'
              : 'bg-slate-950/60 hover:bg-slate-800 text-slate-300 border border-slate-800'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-sky-400" />
          <span>IP-Kapslingsklasser</span>
        </button>

        <button
          onClick={() => setActiveSubTab('all')}
          className={`ml-auto flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
            activeSubTab === 'all'
              ? 'bg-slate-800 text-white font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Visa allt</span>
        </button>
      </div>

      {/* 0. AMA & BSAB Koder */}
      {(activeSubTab === 'ama_bsa' || activeSubTab === 'all') && (
        <AmaBsaSearch />
      )}

      {/* 0.25. IEC 61355 Dokumentstandard & Urvalsfunktion */}
      {(activeSubTab === 'iec61355' || activeSubTab === 'all') && (
        <Iec61355Selector />
      )}

      {/* 0.5. IEC 81346 Postbeteckningar */}
      {(activeSubTab === 'iec81346' || activeSubTab === 'all') && (
        <Iec81346Search />
      )}

      {/* 1. Kabelledarfärger enligt SS-EN 60446 */}
      {(activeSubTab === 'colors' || activeSubTab === 'all') && (
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="border-b border-slate-800 pb-3">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <span>Kabelledarfärger i fasta elinstallationer (Svensk Standard SS-EN 60446)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Gäller alla moderna svenska installationer och kablar (EXQ, EKK, FQ, FXQ m.fl.)
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* L1 */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#8B4513] border border-amber-900/50 shadow-sm shrink-0" />
            <div>
              <span className="text-xs font-bold text-white block">Fas 1 (L1)</span>
              <span className="text-[11px] text-amber-300 font-medium">Brun</span>
            </div>
          </div>

          {/* L2 */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-black border border-slate-700 shadow-sm shrink-0" />
            <div>
              <span className="text-xs font-bold text-white block">Fas 2 (L2)</span>
              <span className="text-[11px] text-slate-300 font-medium">Svart</span>
            </div>
          </div>

          {/* L3 */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-500 border border-gray-400 shadow-sm shrink-0" />
            <div>
              <span className="text-xs font-bold text-white block">Fas 3 (L3)</span>
              <span className="text-[11px] text-gray-300 font-medium">Grå</span>
            </div>
          </div>

          {/* N */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 border border-blue-400 shadow-sm shrink-0" />
            <div>
              <span className="text-xs font-bold text-white block">Neutralledare (N)</span>
              <span className="text-[11px] text-blue-300 font-medium">Ljusblå / Blå</span>
            </div>
          </div>

          {/* PE */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 via-green-500 to-yellow-400 border border-yellow-500 shadow-sm shrink-0" />
            <div>
              <span className="text-xs font-bold text-white block">Skyddsjord (PE)</span>
              <span className="text-[11px] text-yellow-300 font-medium">Gul / Grön rand</span>
            </div>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800 flex items-start gap-2">
          <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
          <span>
            <strong>Viktigt vid äldre anläggningar (före 2002):</strong> Svart användes ofta som fas i enfasgrupper, vit eller röd har förekommit som tändtråd eller jord i mycket gamla ledningsnät. Kontrollmät alltid spänningslöst tillstånd med godkänd spänningsprovare!
          </span>
        </div>
      </div>
      )}

      {/* 2. Säkringsguide & Kabelarea */}
      {(activeSubTab === 'fuses' || activeSubTab === 'all') && (
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="border-b border-slate-800 pb-3">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <span>Säkringsstorlekar & Minsta Kabelarea (Bostad & Industri)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Riktlinjer för nominell ström, säkringens passdel/färgkod och rekommenderad ledararea.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-2 font-medium">Märkström</th>
                <th className="pb-2 font-medium">Diazed Färgkod</th>
                <th className="pb-2 font-medium">Min kabelarea (Cu)</th>
                <th className="pb-2 font-medium">Max effekt (1-fas 230V)</th>
                <th className="pb-2 font-medium">Max effekt (3-fas 400V)</th>
                <th className="pb-2 font-medium">Typisk användning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono text-slate-300">
              <tr>
                <td className="py-2.5 font-bold text-white">6 A</td>
                <td className="py-2.5 text-emerald-400">Grön</td>
                <td className="py-2.5">1.5 mm²</td>
                <td className="py-2.5">1 380 W</td>
                <td className="py-2.5">4 150 W</td>
                <td className="py-2.5 font-sans text-slate-400">Belysning, styrkretsar</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-white">10 A</td>
                <td className="py-2.5 text-rose-400">Röd</td>
                <td className="py-2.5">1.5 mm²</td>
                <td className="py-2.5">2 300 W</td>
                <td className="py-2.5">6 900 W</td>
                <td className="py-2.5 font-sans text-slate-400">Vanliga vägguttag, allmän belysning</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-white">13 A</td>
                <td className="py-2.5 text-slate-400">– (Dvärgbrytare)</td>
                <td className="py-2.5">1.5 mm² *</td>
                <td className="py-2.5">2 990 W</td>
                <td className="py-2.5">9 000 W</td>
                <td className="py-2.5 font-sans text-slate-400">Moderna lägenheter (*vid god kylning)</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-white">16 A</td>
                <td className="py-2.5 text-slate-300">Grå</td>
                <td className="py-2.5 font-semibold text-amber-300">2.5 mm²</td>
                <td className="py-2.5">3 680 W</td>
                <td className="py-2.5">11 000 W</td>
                <td className="py-2.5 font-sans text-slate-400">Tvättmaskin, torktumlare, elbilsladdare</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-white">20 A</td>
                <td className="py-2.5 text-blue-400">Blå</td>
                <td className="py-2.5">4.0 mm²</td>
                <td className="py-2.5">4 600 W</td>
                <td className="py-2.5">13 800 W</td>
                <td className="py-2.5 font-sans text-slate-400">Spis/häll, mindre undercentral, bastu</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-white">25 A</td>
                <td className="py-2.5 text-amber-400">Gul</td>
                <td className="py-2.5">6.0 mm²</td>
                <td className="py-2.5">5 750 W</td>
                <td className="py-2.5">17 300 W</td>
                <td className="py-2.5 font-sans text-slate-400">Huvudsäkring villa, värmepump</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-white">35 A</td>
                <td className="py-2.5 text-slate-100">Svart</td>
                <td className="py-2.5">10 mm²</td>
                <td className="py-2.5">8 050 W</td>
                <td className="py-2.5">24 200 W</td>
                <td className="py-2.5 font-sans text-slate-400">Större fastighet, verkstad</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-white">63 A</td>
                <td className="py-2.5 text-orange-400">Koppar</td>
                <td className="py-2.5">16 mm²</td>
                <td className="py-2.5">14 490 W</td>
                <td className="py-2.5">43 600 W</td>
                <td className="py-2.5 font-sans text-slate-400">Servisledning, industrifördelning</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="text-[11px] text-slate-400 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800 flex items-start gap-2">
          <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
          <span>
            <strong>Fältnotering för importerad utrustning:</strong> Om du stöter på amerikanska kabelmärkningar i AWG (t.ex. AWG 14 eller AWG 12) eller motoreffekt i hästkrafter (hk/hp), använd fliken <strong>Omvandlare</strong> i menyn för exakt dimensionering och svensk standardmotsvarighet.
          </span>
        </div>
      </div>
      )}

      {/* 3. IP-Klasser */}
      {(activeSubTab === 'ip' || activeSubTab === 'all') && (
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="border-b border-slate-800 pb-3">
          <h2 className="text-base font-semibold text-white">IP-Kapslingsklasser (Skydd mot damm & fukt)</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 space-y-1">
            <span className="text-xs font-bold font-mono text-amber-400">IP20</span>
            <p className="text-xs text-white font-medium">Vanlig inomhusmiljö</p>
            <p className="text-[11px] text-slate-400">Petskyddat mot fingrar (≥12.5mm). Ej skyddat mot vatten. Standard i torra rum som vardagsrum & sovrum.</p>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 space-y-1">
            <span className="text-xs font-bold font-mono text-amber-400">IP21 / IP23</span>
            <p className="text-xs text-white font-medium">Droppskyddat</p>
            <p className="text-[11px] text-slate-400">Skyddat mot vertikala vattendroppar och kondens. Används t.ex. i tvättstugor och badrum zon 3.</p>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 space-y-1">
            <span className="text-xs font-bold font-mono text-emerald-400">IP44</span>
            <p className="text-xs text-white font-medium">Sköljtätt / Utomhusstandard</p>
            <p className="text-[11px] text-slate-400">Skydd mot partiklar &gt;1mm och vattenstänk från alla riktningar. Krav i badrum zon 2 och vanlig utomhusinstallation.</p>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 space-y-1">
            <span className="text-xs font-bold font-mono text-sky-400">IP65</span>
            <p className="text-xs text-white font-medium">Dammtätt & Spolsäkert</p>
            <p className="text-[11px] text-slate-400">Helt tätt mot fint damm och skyddat mot spolande vattenstrålar. Utmärkt för industrier, biltvättar och fasadbelysning.</p>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 space-y-1">
            <span className="text-xs font-bold font-mono text-blue-400">IP67</span>
            <p className="text-xs text-white font-medium">Vattentätt (Kortvarig nedsänkning)</p>
            <p className="text-[11px] text-slate-400">Tål nedsänkning i vatten till 1 meters djup under 30 minuter. Markarmaturer och fältinstrument.</p>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 space-y-1">
            <span className="text-xs font-bold font-mono text-indigo-400">IP68</span>
            <p className="text-xs text-white font-medium">Tryckvattentätt (Permanent nedsänkning)</p>
            <p className="text-[11px] text-slate-400">För permanent användning under vatten, t.ex. i fontäner, brunnar och pooler.</p>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};
