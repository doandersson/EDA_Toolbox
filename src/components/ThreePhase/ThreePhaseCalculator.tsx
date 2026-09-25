import React, { useState } from 'react';
import { formatElectrNumber, calculateNeutralCurrent } from '../../utils/electricalMath';
import { Cpu, Zap, ArrowLeftRight, Activity, ShieldAlert, CheckCircle2, Info, FileText } from 'lucide-react';
import { FormulaTheoryCard, FormulaVariable } from '../FormulaTheoryCard';
import { CalculationPdfReportModal } from '../Report/CalculationPdfReportModal';
import { createThreePhaseReportData } from '../../utils/reportHelpers';

type ThreePhaseTab = 'motor_power' | 'star_delta' | 'neutral_current';

export const ThreePhaseCalculator: React.FC = () => {
  const [subTab, setSubTab] = useState<ThreePhaseTab>('motor_power');
  const [showPdfModal, setShowPdfModal] = useState<boolean>(false);

  // --- SubTab 1: Power & Current ---
  const [solveFor, setSolveFor] = useState<'power' | 'current'>('power');
  const [voltage, setVoltage] = useState<string>('400');
  const [current, setCurrent] = useState<string>('16');
  const [activePower, setActivePower] = useState<string>('11');
  const [powerUnit, setPowerUnit] = useState<'kW' | 'W'>('kW');
  const [cosPhi, setCosPhi] = useState<string>('0.85');
  const [efficiency, setEfficiency] = useState<string>('0.90');

  const U = parseFloat(voltage) || 400;
  const pf = Math.min(1.0, Math.max(0.1, parseFloat(cosPhi) || 0.85));
  const eta = Math.min(1.0, Math.max(0.1, parseFloat(efficiency) || 0.9));

  let calcCurrent = 0;
  let calcP = 0;
  let calcS = 0;
  let calcQ = 0;

  const sinPhi = Math.sqrt(Math.max(0, 1 - pf * pf));

  if (solveFor === 'power') {
    const I = parseFloat(current) || 0;
    calcCurrent = I;
    calcP = Math.sqrt(3) * U * I * pf * eta;
    calcS = Math.sqrt(3) * U * I;
    calcQ = Math.sqrt(3) * U * I * sinPhi;
  } else {
    const rawP = (parseFloat(activePower) || 0) * (powerUnit === 'kW' ? 1000 : 1);
    calcP = rawP;
    const denom = Math.sqrt(3) * U * pf * eta;
    calcCurrent = denom > 0 ? rawP / denom : 0;
    calcS = Math.sqrt(3) * U * calcCurrent;
    calcQ = Math.sqrt(3) * U * calcCurrent * sinPhi;
  }

  // --- SubTab 2: Star / Delta Switcher ---
  const [sdVoltage, setSdVoltage] = useState<string>('400');
  const [elementResistance, setElementResistance] = useState<string>('24'); // Ohm per element

  const U_sd = parseFloat(sdVoltage) || 400;
  const R_elem = parseFloat(elementResistance) || 24;

  // Star calculations:
  // Phase voltage across element = U_sd / sqrt(3)
  const U_star_elem = U_sd / Math.sqrt(3);
  const I_star_phase = R_elem > 0 ? U_star_elem / R_elem : 0;
  const I_star_line = I_star_phase;
  const P_star_total = 3 * (U_star_elem * U_star_elem) / (R_elem || 1);

  // Delta calculations:
  // Phase voltage across element = U_sd
  const U_delta_elem = U_sd;
  const I_delta_phase = R_elem > 0 ? U_delta_elem / R_elem : 0;
  const I_delta_line = Math.sqrt(3) * I_delta_phase;
  const P_delta_total = 3 * (U_delta_elem * U_delta_elem) / (R_elem || 1);

  // --- SubTab 3: Unbalanced Neutral Current ---
  const [iL1, setIL1] = useState<string>('14');
  const [iL2, setIL2] = useState<string>('8');
  const [iL3, setIL3] = useState<string>('5');

  const numL1 = parseFloat(iL1) || 0;
  const numL2 = parseFloat(iL2) || 0;
  const numL3 = parseFloat(iL3) || 0;
  const iNeutral = calculateNeutralCurrent(numL1, numL2, numL3);
  const maxPhase = Math.max(numL1, numL2, numL3);
  const isNeutralHigh = iNeutral > maxPhase * 0.9;

  return (
    <div className="space-y-6">
      {/* Sub navigation within 3-Phase */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl w-fit">
        <button
          onClick={() => setSubTab('motor_power')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
            subTab === 'motor_power'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Effekt & Motordata</span>
        </button>

        <button
          onClick={() => setSubTab('star_delta')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
            subTab === 'star_delta'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          <span>Y- / Δ-Koppling (Stjärna/Delta)</span>
        </button>

        <button
          onClick={() => setSubTab('neutral_current')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
            subTab === 'neutral_current'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Nollströmsberäkning (I_N)</span>
        </button>
      </div>

      {/* VIEW 1: Motor & Power */}
      {subTab === 'motor_power' && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-5 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-amber-400" />
                <span>3-Fas Effekt & Motormärkström (400V)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Beräkna aktiv effekt (P), skenbar effekt (S), reaktiv effekt (Q) och märkström vid trefasbelastning.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSolveFor('power')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                  solveFor === 'power'
                    ? 'bg-amber-500 text-slate-950 border-amber-500 font-semibold'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
                }`}
              >
                Beräkna Effekt (P)
              </button>
              <button
                onClick={() => setSolveFor('current')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                  solveFor === 'current'
                    ? 'bg-amber-500 text-slate-950 border-amber-500 font-semibold'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
                }`}
              >
                Beräkna Ström (I)
              </button>
            </div>
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Huvudspänning (U)</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  inputMode="decimal"
                  value={voltage}
                  onChange={(e) => setVoltage(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-amber-500"
                  placeholder="400"
                />
                <span className="text-xs font-mono text-sky-400">V</span>
              </div>
            </div>

            {solveFor === 'power' ? (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Linjeström (I)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={current}
                    onChange={(e) => setCurrent(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-amber-500"
                    placeholder="16"
                  />
                  <span className="text-xs font-mono text-emerald-400">A</span>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Aktiv Motoreffekt (P)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={activePower}
                    onChange={(e) => setActivePower(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-amber-500"
                    placeholder="11"
                  />
                  <select
                    value={powerUnit}
                    onChange={(e) => setPowerUnit(e.target.value as 'kW' | 'W')}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-xs font-mono text-slate-200 cursor-pointer"
                  >
                    <option value="kW">kW</option>
                    <option value="W">W</option>
                  </select>
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-300">Effektfaktor (cos φ)</label>
                <span className="text-[10px] text-slate-500">Resistiv = 1.0, Motor ≈ 0.85</span>
              </div>
              <input
                type="text"
                inputMode="decimal"
                value={cosPhi}
                onChange={(e) => setCosPhi(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-amber-500"
                placeholder="0.85"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-300">Verkningsgrad (η)</label>
                <span className="text-[10px] text-slate-500">Typisk 0.85–0.95</span>
              </div>
              <input
                type="text"
                inputMode="decimal"
                value={efficiency}
                onChange={(e) => setEfficiency(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-amber-500"
                placeholder="0.90"
              />
            </div>
          </div>

          {/* Results */}
          <div className="pt-4 border-t border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <span>Beräkningsresultat för Trefas (400V)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                    cos φ = {pf} | η = {eta}
                  </span>
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setShowPdfModal(true)}
                className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition cursor-pointer shadow-sm shadow-amber-500/20 w-fit shrink-0"
                title="Skapa en professionell A4 PDF-rapport med källor och teknisk beskrivning"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Spara som PDF-rapport (A4)</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-slate-950/70 border border-rose-500/30 rounded-xl p-4">
                <span className="text-xs font-medium text-rose-400">Aktiv Effekt (P)</span>
                <div className="my-1">
                  <span className="text-2xl font-bold font-mono tabular-nums text-white">
                    {formatElectrNumber(calcP / 1000, 2)}
                  </span>
                  <span className="text-xs font-mono text-rose-400 ml-1">kW</span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  {formatElectrNumber(calcP, 0)} W
                </span>
              </div>

              <div className="bg-slate-950/70 border border-emerald-500/30 rounded-xl p-4">
                <span className="text-xs font-medium text-emerald-400">Linjeström per fas (I)</span>
                <div className="my-1">
                  <span className="text-2xl font-bold font-mono tabular-nums text-white">
                    {formatElectrNumber(calcCurrent, 2)}
                  </span>
                  <span className="text-xs font-mono text-emerald-400 ml-1">A</span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  Säkringsrekommendation: {calcCurrent > 25 ? '32A' : calcCurrent > 20 ? '25A' : calcCurrent > 16 ? '20A' : calcCurrent > 10 ? '16A' : '10A'}
                </span>
              </div>

              <div className="bg-slate-950/70 border border-sky-500/30 rounded-xl p-4">
                <span className="text-xs font-medium text-sky-400">Skenbar Effekt (S)</span>
                <div className="my-1">
                  <span className="text-2xl font-bold font-mono tabular-nums text-white">
                    {formatElectrNumber(calcS / 1000, 2)}
                  </span>
                  <span className="text-xs font-mono text-sky-400 ml-1">kVA</span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  S = √3 · U · I
                </span>
              </div>

              <div className="bg-slate-950/70 border border-amber-500/30 rounded-xl p-4">
                <span className="text-xs font-medium text-amber-400">Reaktiv Effekt (Q)</span>
                <div className="my-1">
                  <span className="text-2xl font-bold font-mono tabular-nums text-white">
                    {formatElectrNumber(calcQ / 1000, 2)}
                  </span>
                  <span className="text-xs font-mono text-amber-400 ml-1">kVAr</span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  sin φ = {formatElectrNumber(sinPhi, 3)}
                </span>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-mono text-slate-300">
              <strong>Snabböversikt 3-fas: </strong>
              P = √3 · U · I · cos φ · η = 1,732 · {U} V · {formatElectrNumber(calcCurrent, 2)} A · {pf} · {eta} = {formatElectrNumber(calcP / 1000, 2)} kW
            </div>
          </div>

          {/* Utbildande informationsavsnitt med matematisk formel för 3-fas effekt & märkström */}
          <div className="pt-2">
            <FormulaTheoryCard
              title="Matematisk formel & kretsteori – Trefaseffekt & Motordata"
              badge="SS-EN 60034 / Trefasteknik"
              formula={
                solveFor === 'power'
                  ? 'P = \\sqrt{3} \\cdot U_L \\cdot I_L \\cdot \\cos\\varphi \\cdot \\eta'
                  : 'I_L = \\frac{P}{\\sqrt{3} \\cdot U_L \\cdot \\cos\\varphi \\cdot \\eta}'
              }
              secondaryFormula="S = \\sqrt{3} \\cdot U_L \\cdot I_L \quad \text{och} \quad Q = \\sqrt{3} \\cdot U_L \\cdot I_L \\cdot \\sin\\varphi \quad (S = \sqrt{P^2 + Q^2})"
              substitution={
                solveFor === 'power'
                  ? `P = √3 · ${U} V · ${formatElectrNumber(calcCurrent, 2)} A · ${pf} · ${eta}\nP = 1.732 · ${U} · ${formatElectrNumber(calcCurrent, 2)} · ${pf} · ${eta} = ${formatElectrNumber(calcP, 1)} W (${formatElectrNumber(calcP / 1000, 2)} kW)\nSkenbar effekt S = √3 · ${U} V · ${formatElectrNumber(calcCurrent, 2)} A = ${formatElectrNumber(calcS / 1000, 2)} kVA\nReaktiv effekt Q = √3 · ${U} V · ${formatElectrNumber(calcCurrent, 2)} A · ${formatElectrNumber(sinPhi, 3)} = ${formatElectrNumber(calcQ / 1000, 2)} kVAr`
                  : `I_L = ${formatElectrNumber(calcP, 0)} W / (√3 · ${U} V · ${pf} · ${eta})\nI_L = ${formatElectrNumber(calcP, 0)} / (1.732 · ${U} · ${pf} · ${eta}) = ${formatElectrNumber(calcCurrent, 2)} A\nSkenbar effekt S = √3 · ${U} · ${formatElectrNumber(calcCurrent, 2)} A = ${formatElectrNumber(calcS / 1000, 2)} kVA`
              }
              variables={[
                {
                  symbol: 'P',
                  name: 'Aktiv effekt (nyttig motoreffekt)',
                  unit: 'W / kW (Watt / kilowatt)',
                  description: 'Den mekaniska eller termiska effekten som maskinen faktiskt uträttar. På en motormärkskylt är alltid P märkeffekten på motoraxeln.',
                },
                {
                  symbol: '√3 (ca 1,732)',
                  name: 'Trefasfaktorn',
                  unit: 'dimensionslös',
                  description: 'Härrör från trigonometrisk 120° fasförskjutning mellan de tre fasvektorerna i ett trefassystem (U_L = √3 · U_fas).',
                },
                {
                  symbol: 'U_L',
                  name: 'Huvudspänning (Linjespänning)',
                  unit: 'V (Volt)',
                  description: 'Spänningen mätt mellan två godtyckliga fasledare (i det svenska lågspänningsnätet normalt 400 V nominellt).',
                },
                {
                  symbol: 'I_L',
                  name: 'Linjeström (Märkström)',
                  unit: 'A (Ampere)',
                  description: 'Den ström som flyter i vardera inkommande fasledare (L1, L2, L3) vid full axelbelastning.',
                },
                {
                  symbol: 'cos φ',
                  name: 'Effektfaktor',
                  unit: '0,0 – 1,0',
                  description: 'Kosinus för fasvinkeln mellan spänning och ström. Asynkronmotorer har vanligen cos φ = 0,80–0,88 vid märkdrift på grund av magnetiseringsström.',
                },
                {
                  symbol: 'η (eta)',
                  name: 'Verkningsgrad',
                  unit: '0,0 – 1,0',
                  description: 'Förhållandet mellan avgiven mekanisk axeleffekt och tillförd elektrisk effekt (IE3/IE4-motorer har typiskt 90–95 % verkningsgrad).',
                },
                {
                  symbol: 'S / Q',
                  name: 'Skenbar och reaktiv effekt',
                  unit: 'VA / VAr',
                  description: 'S (kVA) dimensionerar kablar, säkringar och transformatorer. Q (kVAr) är den reaktiva magnetiseringseffekten som pendlar fram och tillbaka.',
                },
              ]}
              theory="I en trefas asynkronmotor producerar de tre faserna tillsammans ett roterande magnetfält (vridfält). Motorns mekaniska axeleffekt P är relaterad till den tillförda elektriska energin via verkningsgraden η och effektfaktorn cos φ. Eftersom trefaseffekten är summan av de tre enskilda faserna (3 · U_fas · I_fas) och U_fas = U_L / √3, erhålls den klassiska trefasekvationen: P = 3 · (U_L / √3) · I_L · cos φ = √3 · U_L · I_L · cos φ."
              practicalRules={[
                'Motorns märkskylt anger alltid mekanisk axeleffekt P (t.ex. 11 kW) vid märkspänning.',
                'Vid dimensionering av matarkabel och säkring används alltid linjeströmmen I_L.',
                'Effektfaktorn kan kompenseras med faskompenseringskondensatorer för att minska Q och därmed sänka strömmen i elnätet.',
                'En tumregel för 400 V asynkronmotorer är att märkströmmen I är ungefär dubbelt så stor som märkeffekten i kW (t.ex. 11 kW motor drar ca 21–22 A).',
              ]}
            />
          </div>
        </div>
      )}

      {/* VIEW 2: Star vs Delta Comparison */}
      {subTab === 'star_delta' && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-5 animate-in fade-in duration-150">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <ArrowLeftRight className="w-5 h-5 text-amber-400" />
              <span>Jämförelse av Y-koppling (Stjärna) och Δ-koppling (Delta / Triangel)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Se hur spänning över elementen, linjeström och avgiven effekt förändras när 3 likadana motstånd kopplas i Y jämfört med Δ.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Huvudspänning (U_L)</label>
              <input
                type="text"
                inputMode="decimal"
                value={sdVoltage}
                onChange={(e) => setSdVoltage(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-amber-500"
                placeholder="400"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Resistans per element (R_element i Ω)</label>
              <input
                type="text"
                inputMode="decimal"
                value={elementResistance}
                onChange={(e) => setElementResistance(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-amber-500"
                placeholder="24"
              />
            </div>
          </div>

          {/* Comparison Cards: Y vs Delta */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Star (Y) */}
            <div className="bg-slate-950/80 border border-sky-500/40 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-sm font-bold text-sky-400 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded bg-sky-500/20 text-sky-300 flex items-center justify-center font-mono">Y</span>
                  <span>Stjärnkoppling (Y)</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">1/3 av effekten</span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Spänning över element:</span>
                  <span className="text-white font-bold">{formatElectrNumber(U_star_elem, 1)} V (U_L / √3)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Fasström (I_f):</span>
                  <span className="text-emerald-400">{formatElectrNumber(I_star_phase, 2)} A</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Linjeström i L1/L2/L3:</span>
                  <span className="text-emerald-300 font-bold">{formatElectrNumber(I_star_line, 2)} A</span>
                </div>
                <div className="flex justify-between py-1.5 text-sm bg-sky-950/30 px-2 rounded-lg border border-sky-500/20">
                  <span className="text-slate-200">Total Effekt (P):</span>
                  <span className="text-sky-300 font-bold font-mono">{formatElectrNumber(P_star_total / 1000, 2)} kW</span>
                </div>
              </div>
            </div>

            {/* Delta (D) */}
            <div className="bg-slate-950/80 border border-amber-500/40 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-sm font-bold text-amber-400 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded bg-amber-500/20 text-amber-300 flex items-center justify-center font-mono">Δ</span>
                  <span>Deltakoppling (Δ / Triangel)</span>
                </span>
                <span className="text-[10px] text-amber-400 font-mono">3× effekten & strömmen</span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Spänning över element:</span>
                  <span className="text-white font-bold">{formatElectrNumber(U_delta_elem, 1)} V (Full U_L)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Fasström (I_f):</span>
                  <span className="text-amber-400">{formatElectrNumber(I_delta_phase, 2)} A</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Linjeström i L1/L2/L3:</span>
                  <span className="text-emerald-300 font-bold">{formatElectrNumber(I_delta_line, 2)} A (√3 · I_f)</span>
                </div>
                <div className="flex justify-between py-1.5 text-sm bg-amber-950/30 px-2 rounded-lg border border-amber-500/20">
                  <span className="text-slate-200">Total Effekt (P):</span>
                  <span className="text-amber-300 font-bold font-mono">{formatElectrNumber(P_delta_total / 1000, 2)} kW</span>
                </div>
              </div>
            </div>
          </div>

          {/* Explanation note */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong>Praktisk tillämpning för elektriker:</strong>
              <p className="text-slate-400 mt-1">
                Genom att koppla om samma 3 element från Δ till Y minskar effekten till exakt <strong>1/3</strong> (från {formatElectrNumber(P_delta_total / 1000, 2)} kW ner till {formatElectrNumber(P_star_total / 1000, 2)} kW) och linjeströmmen sjunker med en faktor <strong>3</strong> (från {formatElectrNumber(I_delta_line, 1)}A till {formatElectrNumber(I_star_line, 1)}A). Detta är grunden i manuella och automatiska <strong>Y/D-startkopplare</strong> för att minska nätets startströmsspikar.
              </p>
            </div>
          </div>

          {/* Utbildande informationsavsnitt med matematisk formel för Y- och D-koppling */}
          <div className="pt-2">
            <FormulaTheoryCard
              title="Matematisk formel & härledning – Y-koppling vs Δ-koppling"
              badge="Stjärna / Triangel-transformation"
              formula="\frac{P_{\Delta}}{P_Y} = 3 \quad \text{och} \quad \frac{I_{L,\Delta}}{I_{L,Y}} = 3"
              secondaryFormula="P_Y = \frac{U_L^2}{R} = 3 \cdot \frac{(U_L/\sqrt{3})^2}{R} \quad \text{mot} \quad P_{\Delta} = 3 \cdot \frac{U_L^2}{R}"
              substitution={`Stjärnkoppling (Y):\n• Elementspänning: U_elem = ${sdVoltage} V / √3 = ${formatElectrNumber(U_star_elem, 1)} V\n• Linjeström: I_L = ${formatElectrNumber(U_star_elem, 1)} V / ${R_elem} Ω = ${formatElectrNumber(I_star_line, 2)} A\n• Total effekt: P_Y = 3 · (${formatElectrNumber(U_star_elem, 1)} V)² / ${R_elem} Ω = ${formatElectrNumber(P_star_total, 1)} W (${formatElectrNumber(P_star_total / 1000, 2)} kW)\n\nDeltakoppling (Δ):\n• Elementspänning: U_elem = ${sdVoltage} V (full huvudspänning)\n• Fasström i element: I_fas = ${sdVoltage} V / ${R_elem} Ω = ${formatElectrNumber(I_delta_phase, 2)} A\n• Linjeström: I_L = √3 · ${formatElectrNumber(I_delta_phase, 2)} A = ${formatElectrNumber(I_delta_line, 2)} A\n• Total effekt: P_Δ = 3 · (${sdVoltage} V)² / ${R_elem} Ω = ${formatElectrNumber(P_delta_total, 1)} W (${formatElectrNumber(P_delta_total / 1000, 2)} kW)`}
              variables={[
                {
                  symbol: 'U_L',
                  name: 'Huvudspänning',
                  unit: 'V (Volt)',
                  description: 'Spänningen mellan faserna i elnätet (400 V nominellt).',
                },
                {
                  symbol: 'R_elem',
                  name: 'Elementresistans',
                  unit: 'Ω (Ohm)',
                  description: 'Resistansen per enskild faslindning eller värmeelement.',
                },
                {
                  symbol: 'U_elem,Y',
                  name: 'Elementspänning i Y',
                  unit: 'V (Volt)',
                  description: 'I stjärnkoppling ligger elementet mellan fas och stjärnpunkt (U_L / √3 = 230 V).',
                },
                {
                  symbol: 'U_elem,Δ',
                  name: 'Elementspänning i Δ',
                  unit: 'V (Volt)',
                  description: 'I deltakoppling kopplas varje element direkt mellan två faser och får fulla 400 V.',
                },
                {
                  symbol: 'I_L,Y & I_L,Δ',
                  name: 'Linjeströmmar',
                  unit: 'A (Ampere)',
                  description: 'Strömmen som dras från matningskabeln. Linjeströmmen i delta är exakt 3 gånger större än i stjärna.',
                },
                {
                  symbol: 'P_Y & P_Δ',
                  name: 'Total avgiven effekt',
                  unit: 'W / kW',
                  description: 'Deltakoppling utvecklar exakt 3 gånger mer värme/effekt än stjärnkoppling med identiska motstånd.',
                },
              ]}
              theory="I en stjärnkoppling (Y) är ena änden av alla tre element förenad i en gemensam stjärnpunkt (N). Varje element ser därmed fasspänningen U_f = U_L / √3 (230 V). Eftersom effekten beror på spänningen i kvadrat (P = U²/R), blir effekten per element (U_L / √3)² / R = (U_L² / 3) / R. I deltakoppling (Δ) är varje element anslutet direkt mellan två fasledare och får den fulla huvudspänningen U_L (400 V). Effekten per element blir då U_L² / R. Förhållandet mellan delta- och stjärneffekt blir därmed exakt 3."
              practicalRules={[
                'Y/D-start av elmotorer: Motorn startas i Y för att minska startströmmen med 67 % (till 1/3), och kopplas efter uppvarvning om till Δ för fullt vridmoment.',
                'Värmepatroner (t.ex. i elpannor och ackumulatortankar) kan effektregleras i steg genom att växla elementgrupper mellan Y och Δ.',
                'Kontrollera alltid motorns märkskylt: 230/400V motorer får i det svenska 400V-nätet ENDAST kopplas i Y (annars bränns lindningarna vid Δ). Motorer märkta 400/690V körs normalt i Δ vid 400V.',
              ]}
            />
          </div>
        </div>
      )}

      {/* VIEW 3: Unbalanced Neutral Current */}
      {subTab === 'neutral_current' && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-5 animate-in fade-in duration-150">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-400" />
              <span>Nollströmsberäkning vid osymmetrisk belastning (I_N)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Beräkna returströmmen i neutralledaren (nollan) när de tre faserna L1, L2 och L3 belastas ojämnt med 120° fasförskjutning.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8B4513]" />
                <span>Ström L1 (Brun)</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  inputMode="decimal"
                  value={iL1}
                  onChange={(e) => setIL1(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-amber-500"
                  placeholder="14"
                />
                <span className="text-xs font-mono text-slate-400">A</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                <span>Ström L2 (Svart)</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  inputMode="decimal"
                  value={iL2}
                  onChange={(e) => setIL2(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-amber-500"
                  placeholder="8"
                />
                <span className="text-xs font-mono text-slate-400">A</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-gray-500" />
                <span>Ström L3 (Grå)</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  inputMode="decimal"
                  value={iL3}
                  onChange={(e) => setIL3(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-amber-500"
                  placeholder="5"
                />
                <span className="text-xs font-mono text-slate-400">A</span>
              </div>
            </div>
          </div>

          {/* Neutral Result */}
          <div className="pt-4 border-t border-slate-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className={`p-4 rounded-xl border flex flex-col justify-between ${
                isNeutralHigh
                  ? 'bg-amber-950/30 border-amber-500/40 text-amber-300'
                  : 'bg-sky-950/20 border-sky-500/30 text-sky-300'
              }`}>
                <span className="text-xs font-medium text-slate-400 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span>Ström i Neutralledare (I_N)</span>
                </span>
                <div className="my-2">
                  <span className="text-3xl font-bold font-mono text-white tabular-nums">
                    {formatElectrNumber(iNeutral, 2)}
                  </span>
                  <span className="text-sm font-mono text-sky-400 ml-1">A</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  {numL1 === numL2 && numL2 === numL3 && numL1 > 0
                    ? 'Perfekt balanserad symmetrisk last (I_N = 0 A)'
                    : `Snedbelastning mellan faserna`}
                </span>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                <span className="text-xs font-medium text-slate-400">Vektorsumma formel (120°)</span>
                <div className="my-2 text-xs font-mono text-slate-300 bg-slate-900/80 p-2 rounded border border-slate-800">
                  I_N = √(I₁² + I₂² + I₃² - I₁·I₂ - I₂·I₃ - I₃·I₁)
                </div>
                <span className="text-[11px] text-slate-400">
                  Beräknas genom analytisk vektorsummering med 120 graders vinkelskillnad.
                </span>
              </div>
            </div>

            {/* Assessment Note */}
            <div className="mt-4">
              {iNeutral === 0 ? (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Faserna är helt balanserade. Ingen returström flyter i neutralledaren.</span>
                </div>
              ) : isNeutralHigh ? (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
                  <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Hög nollström:</strong> Strömmen i nollan ({formatElectrNumber(iNeutral, 1)} A) är betydande på grund av ojämn fasfördelning. Kontrollera att neutralledarens area inte är reducerad och omfördela enfasgrupper i centralen för jämnare last.
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>
                    Nollströmmen ({formatElectrNumber(iNeutral, 1)} A) är inom normala gränser för installationen.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Utbildande informationsavsnitt med matematisk formel för nollström */}
          <div className="pt-2">
            <FormulaTheoryCard
              title="Matematisk formel & vektoranalys – Neutralledarström (I_N)"
              badge="Komplex vektoranalys (120° förskjutning)"
              formula="I_N = \sqrt{I_1^2 + I_2^2 + I_3^2 - (I_1 \cdot I_2 + I_2 \cdot I_3 + I_3 \cdot I_1)}"
              secondaryFormula="\vec{I}_N + \vec{I}_1 + \vec{I}_2 + \vec{I}_3 = 0 \iff \vec{I}_N = -(\vec{I}_1 + \vec{I}_2 + \vec{I}_3)"
              substitution={`I_N = √[(${numL1})² + (${numL2})² + (${numL3})² - (${numL1}·${numL2} + ${numL2}·${numL3} + ${numL3}·${numL1})]\nI_N = √[${numL1 * numL1} + ${numL2 * numL2} + ${numL3 * numL3} - (${numL1 * numL2} + ${numL2 * numL3} + ${numL3 * numL1})]\nI_N = √[${numL1 * numL1 + numL2 * numL2 + numL3 * numL3} - ${numL1 * numL2 + numL2 * numL3 + numL3 * numL1}]\nI_N = ${formatElectrNumber(iNeutral, 2)} A`}
              variables={[
                {
                  symbol: 'I_N',
                  name: 'Nollström (Neutralledarström)',
                  unit: 'A (Ampere)',
                  description: 'Returströmmen som flyter i den gemensamma neutralledaren tillbaka till nätstationen/transformatorn.',
                },
                {
                  symbol: 'I₁, I₂, I₃',
                  name: 'Fasströmmar (L1, L2, L3)',
                  unit: 'A (Ampere)',
                  description: 'De momentana effektivvärdena för strömmarna i fasledarna Brun (L1), Svart (L2) och Grå (L3).',
                },
                {
                  symbol: '120° fasvinkel',
                  name: 'Symmetrisk vinkelskillnad',
                  unit: 'grader (°)',
                  description: 'Faserna är förskjutna 120° i tiden. Eftersom cos(120°) = -0,5 förvandlas dubbla korsprodukterna 2·I₁·I₂·cos(120°) till -I₁·I₂.',
                },
                {
                  symbol: 'I_N = 0 A',
                  name: 'Perfekt balans',
                  unit: 'Villkor',
                  description: 'När I₁ = I₂ = I₃ blir I₁² + I₁² + I₁² - 3·I₁² = 0. Neutralledaren leder då ingen ström alls.',
                },
              ]}
              theory="I ett trefassystem med gemensam stjärnpunkt gäller Kirchhoffs strömlag i stjärnpunkten: summan av alla inkommande och utgående strömmar måste vara noll (I₁ + I₂ + I₃ + I_N = 0 i vektorform). Eftersom de tre faserna är sinusformade och inbördes fasförskjutna med 120° (2π/3 radianer), motverkar strömmarna varandra. Vid identisk belastning på alla faser summerar vektorerna till exakt noll. Vid ojämn belastning (snedbelastning) kan vektorerna inte ta ut varandra helt, och skillnaden måste ledas tillbaka genom neutralledaren N."
              practicalRules={[
                'I bostäder och kontor är lasterna oftast 230 V enfasgrupper fördelade på L1, L2 och L3. God elfackmässig praxis är att fördela ugn, tvättmaskin, belysning och uttag jämnt över alla tre faser för att hålla I_N så låg som möjligt.',
                'Om neutralledaren bryts i en snedbelastad krets (s.k. nollsläpp eller flytande nolla) vandrar stjärnpunkten. Spänningen över lågt belastade apparater kan rusa upp mot 400 V och förstöra elektroniken!',
                'Observera: I moderna installationer med många switchade nätaggregat och LED-armaturer kan den 3:e övertonen (150 Hz) adderas i nollan snarare än att ta ut varandra, vilket kan göra nollströmmen större än fasströmmarna.',
              ]}
            />
          </div>
        </div>
      )}

      {/* PDF Report Modal */}
      {showPdfModal && (
        <CalculationPdfReportModal
          isOpen={showPdfModal}
          onClose={() => setShowPdfModal(false)}
          reportData={createThreePhaseReportData({
            solveFor,
            voltage: U,
            current: calcCurrent,
            activePowerW: calcP,
            apparentPowerVA: calcS,
            reactivePowerVAr: calcQ,
            cosPhi: pf,
            efficiency: eta,
          })}
        />
      )}
    </div>
  );
};
