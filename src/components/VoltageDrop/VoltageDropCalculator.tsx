import React, { useState, useMemo } from 'react';
import { formatElectrNumber } from '../../utils/electricalMath';
import { Cable, AlertTriangle, CheckCircle2, ShieldAlert, FileText } from 'lucide-react';
import { FormulaTheoryCard, FormulaVariable } from '../FormulaTheoryCard';
import { CalculationPdfReportModal } from '../Report/CalculationPdfReportModal';
import { createVoltageDropReportData } from '../../utils/reportHelpers';
import { VoltageDropDiagram } from './VoltageDropDiagram';

export const VoltageDropCalculator: React.FC = () => {
  const [phaseType, setPhaseType] = useState<'1-phase' | '3-phase'>('1-phase');
  const [voltage, setVoltage] = useState<string>('230');
  const [current, setCurrent] = useState<string>('10');
  const [length, setLength] = useState<string>('25'); // meters
  const [area, setArea] = useState<string>('1.5'); // mm2
  const [material, setMaterial] = useState<'cu' | 'al'>('cu');
  const [cosPhi, setCosPhi] = useState<string>('1.0');
  const [maxDropPct, setMaxDropPct] = useState<string>('4.0');
  const [showPdfModal, setShowPdfModal] = useState<boolean>(false);

  const U = parseFloat(voltage) || 230;
  const I = parseFloat(current) || 0;
  const L = parseFloat(length) || 0;
  const A = parseFloat(area) || 1.5;
  const pf = parseFloat(cosPhi) || 1.0;
  const maxLimit = parseFloat(maxDropPct) || 4.0;

  // Conductivity (gamma) in m/(Ohm * mm2) at ~20°C:
  // Cu = 56, Al = 34
  const gamma = material === 'cu' ? 56 : 34;

  // Cable resistance for one-way length
  const rSingle = L / (gamma * A);

  // Voltage drop formula:
  // 1-phase: dU = 2 * L * I * cosPhi / (gamma * A)
  // 3-phase: dU = sqrt(3) * L * I * cosPhi / (gamma * A)
  const dropFactor = phaseType === '1-phase' ? 2 : Math.sqrt(3);
  const deltaU = (dropFactor * L * I * pf) / (gamma * A);
  const dropPercent = U > 0 ? (deltaU / U) * 100 : 0;
  const endVoltage = Math.max(0, U - deltaU);
  const powerLoss = phaseType === '1-phase' ? 2 * (I * I) * rSingle : 3 * (I * I) * rSingle;

  const isWithinLimit = dropPercent <= maxLimit;

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-5">
        <div className="border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Cable className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-semibold text-white">Spänningsfall i kabel (SS 436 40 00)</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Beräkna ledningsresistans och spänningsfall enligt svensk elstandard för att säkerställa god funktion och brandsäkerhet.
          </p>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Faskoppling */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Systemtyp</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setPhaseType('1-phase');
                  setVoltage('230');
                }}
                className={`py-2 px-3 rounded-lg text-xs font-medium border transition cursor-pointer ${
                  phaseType === '1-phase'
                    ? 'bg-amber-500 text-slate-950 border-amber-500 font-semibold'
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                1-Fas (230V)
              </button>
              <button
                type="button"
                onClick={() => {
                  setPhaseType('3-phase');
                  setVoltage('400');
                }}
                className={`py-2 px-3 rounded-lg text-xs font-medium border transition cursor-pointer ${
                  phaseType === '3-phase'
                    ? 'bg-amber-500 text-slate-950 border-amber-500 font-semibold'
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                3-Fas (400V)
              </button>
            </div>
          </div>

          {/* Belastningsström */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Ström (A)</label>
            <input
              type="text"
              inputMode="decimal"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-amber-500"
              placeholder="10"
            />
          </div>

          {/* Kabellängd */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Kabellängd enkel väg (meter)</label>
            <input
              type="text"
              inputMode="decimal"
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-amber-500"
              placeholder="25"
            />
          </div>

          {/* Ledningsarea */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Kabelarea (mm²)</label>
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="1.5">1.5 mm² (10A standard)</option>
              <option value="2.5">2.5 mm² (16A standard)</option>
              <option value="4">4.0 mm² (20A)</option>
              <option value="6">6.0 mm² (25A)</option>
              <option value="10">10 mm² (35-50A)</option>
              <option value="16">16 mm² (63A)</option>
              <option value="25">25 mm²</option>
              <option value="35">35 mm²</option>
              <option value="50">50 mm²</option>
            </select>
          </div>

          {/* Material */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Ledarmaterial</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMaterial('cu')}
                className={`py-2 px-3 rounded-lg text-xs font-medium border transition cursor-pointer ${
                  material === 'cu'
                    ? 'bg-slate-800 text-amber-300 border-amber-500/60 font-semibold'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
                }`}
              >
                Koppar (Cu)
              </button>
              <button
                type="button"
                onClick={() => setMaterial('al')}
                className={`py-2 px-3 rounded-lg text-xs font-medium border transition cursor-pointer ${
                  material === 'al'
                    ? 'bg-slate-800 text-amber-300 border-amber-500/60 font-semibold'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
                }`}
              >
                Aluminium (Al)
              </button>
            </div>
          </div>

          {/* Max Tillåtet spänningsfall */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Max tillåtet fall (%)</label>
            <select
              value={maxDropPct}
              onChange={(e) => setMaxDropPct(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="3.0">3.0% (Rekommenderat allmänt)</option>
              <option value="4.0">4.0% (SS 436 40 00 standard)</option>
              <option value="5.0">5.0% (Industri / motorer)</option>
            </select>
          </div>
        </div>

        {/* Results Banner */}
        <div className="pt-4 border-t border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <span>Beräkningsresultat ({phaseType === '1-phase' ? '1-Fas 230V' : '3-Fas 400V'})</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                  L = {L} m | A = {A} mm²
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Spänningsfall, förlusteffekt och ledningsresistans enligt svensk standard.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowPdfModal(true)}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition cursor-pointer shadow-sm shadow-amber-500/20 w-fit shrink-0"
              title="Skapa en professionell A4 PDF-rapport med källor och teknisk beskrivning"
            >
              <FileText className="w-4 h-4" />
              <span>Spara som PDF-rapport (A4)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Spänningsfall */}
            <div className={`p-4 rounded-xl border flex flex-col justify-between ${
              isWithinLimit
                ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
            }`}>
              <span className="text-[11px] font-medium opacity-80">Spänningsfall (ΔU)</span>
              <div className="my-1">
                <span className="text-2xl font-bold font-mono tabular-nums text-white">
                  {formatElectrNumber(deltaU, 2)}
                </span>
                <span className="text-xs font-mono ml-1">V</span>
              </div>
              <span className="text-xs font-mono font-semibold">
                {formatElectrNumber(dropPercent, 2)}%
              </span>
            </div>

            {/* Slutspänning */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <span className="text-[11px] font-medium text-slate-400">Spänning vid förbrukare</span>
              <div className="my-1">
                <span className="text-2xl font-bold font-mono tabular-nums text-sky-400">
                  {formatElectrNumber(endVoltage, 1)}
                </span>
                <span className="text-xs font-mono text-sky-400 ml-1">V</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                Nominell: {U} V
              </span>
            </div>

            {/* Kabelresistans */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <span className="text-[11px] font-medium text-slate-400">Ledningsresistans (R)</span>
              <div className="my-1">
                <span className="text-2xl font-bold font-mono tabular-nums text-amber-400">
                  {formatElectrNumber(rSingle * (phaseType === '1-phase' ? 2 : 1), 3)}
                </span>
                <span className="text-xs font-mono text-amber-400 ml-1">Ω</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                {phaseType === '1-phase' ? 'Tur & retur' : 'Per fasledare'}
              </span>
            </div>

            {/* Effektförlust */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <span className="text-[11px] font-medium text-slate-400">Effektförlust i kabel</span>
              <div className="my-1">
                <span className="text-2xl font-bold font-mono tabular-nums text-rose-400">
                  {formatElectrNumber(powerLoss, 1)}
                </span>
                <span className="text-xs font-mono text-rose-400 ml-1">W</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                Värmeutveckling i kabel
              </span>
            </div>
          </div>

          {/* Standard compliance indicator */}
          <div className="mt-4">
            {isWithinLimit ? (
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>Godkänd installation:</strong> Spänningsfallet ({formatElectrNumber(dropPercent, 2)}%) understiger gränsen på {maxLimit}% enligt standard.
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                <span>
                  <strong>För högt spänningsfall:</strong> {formatElectrNumber(dropPercent, 2)}% överskrider gränsen {maxLimit}%. Öka kabelarean till nästa standarddimension (t.ex. {A < 2.5 ? '2.5 mm²' : A < 4 ? '4.0 mm²' : '6.0 mm²'}) för att minska förluster och spänningsdippar.
                </span>
              </div>
            )}
          </div>

          {/* Modern Visual Circuit Diagram & Tolerance Meter */}
          <div className="pt-2">
            <VoltageDropDiagram
              voltage={U}
              endVoltage={endVoltage}
              current={I}
              length={L}
              area={A}
              material={material}
              deltaU={deltaU}
              dropPercent={dropPercent}
              maxDropPct={maxLimit}
              isWithinLimit={isWithinLimit}
              phaseType={phaseType}
              rCable={rSingle * (phaseType === '1-phase' ? 2 : 1)}
              powerLoss={powerLoss}
            />
          </div>
        </div>

        {/* Utbildande informationsavsnitt med matematisk formel för spänningsfall */}
        <div className="pt-2">
          <FormulaTheoryCard
            title={
              phaseType === '1-phase'
                ? 'Matematisk formel för spänningsfall i 1-fas (enfaskrets)'
                : 'Matematisk formel för spänningsfall i 3-fas (trefaskrets)'
            }
            badge={phaseType === '1-phase' ? 'SS 436 40 00 – Enfaskrets' : 'SS 436 40 00 – Trefaskrets'}
            formula={
              phaseType === '1-phase'
                ? '\\Delta U = \\frac{2 \\cdot L \\cdot I \\cdot \\cos\\varphi}{\\gamma \\cdot A} = 2 \\cdot I \\cdot R_{\\text{ledare}} \\cdot \\cos\\varphi'
                : '\\Delta U = \\frac{\\sqrt{3} \\cdot L \\cdot I \\cdot \\cos\\varphi}{\\gamma \\cdot A} = \\sqrt{3} \\cdot I \\cdot R_{\\text{ledare}} \\cdot \\cos\\varphi'
            }
            secondaryFormula={`\\Delta U [\\%] = \\frac{\\Delta U}{U_{\\text{nominell}}} \\cdot 100\\% \\quad \\text{och} \\quad P_{\\text{förlust}} = ${phaseType === '1-phase' ? '2' : '3'} \\cdot I^2 \\cdot R_{\\text{ledare}}`}
            substitution={`ΔU = (${phaseType === '1-phase' ? '2' : '√3 ≈ 1.732'} · ${L} m · ${I} A · ${pf}) / (${gamma} · ${A} mm²)\nΔU = ${formatElectrNumber(deltaU, 2)} V\nSpänningsfall i procent: (${formatElectrNumber(deltaU, 2)} V / ${U} V) · 100 = ${formatElectrNumber(dropPercent, 2)} %\nMottagande spänning: ${U} V - ${formatElectrNumber(deltaU, 2)} V = ${formatElectrNumber(endVoltage, 1)} V\nEffektförlust i kabel: ${phaseType === '1-phase' ? '2' : '3'} · (${I} A)² · ${formatElectrNumber(rSingle, 4)} Ω = ${formatElectrNumber(powerLoss, 1)} W`}
            variables={[
              {
                symbol: 'ΔU',
                name: 'Spänningsfall',
                unit: 'V (Volt)',
                description: 'Den spänningsförlust som uppstår längs ledningen på grund av ledarmaterialets inre resistans.',
              },
              {
                symbol: phaseType === '1-phase' ? 'Faktor 2' : 'Faktor √3',
                name: phaseType === '1-phase' ? 'Tur- & returslinga' : 'Trefasfaktor (√3)',
                unit: 'dimensionslös',
                description:
                  phaseType === '1-phase'
                    ? 'Strömmen måste gå fram genom fasledaren och tillbaka genom neutralledaren (dubbla kabellängden).'
                    : 'I ett symmetriskt trefassystem är fasspänningsfallet i en ledare ΔU_fas = I·R. Multiplicerat med √3 erhålls huvudspänningsfallet.',
              },
              {
                symbol: 'L',
                name: 'Enkel ledningslängd',
                unit: 'm (meter)',
                description: 'Avståndet från centralen till den anslutna lasten (sträckans fysiska längd).',
              },
              {
                symbol: 'I',
                name: 'Belastningsström',
                unit: 'A (Ampere)',
                description: 'Kabelns dimensionerande driftsström vid full belastning.',
              },
              {
                symbol: 'γ (gamma)',
                name: 'Elektrisk konduktivitet',
                unit: 'm / (Ω · mm²)',
                description: `Materialets ledningsförmåga vid driftstemperatur (Koppar Cu = 56, Aluminium Al = 34 vid 20°C). Resistiviteten ρ = 1/γ (${material === 'cu' ? '0.0178' : '0.0294'} Ω·mm²/m).`,
              },
              {
                symbol: 'A',
                name: 'Ledararea',
                unit: 'mm² (kvadratmillimeter)',
                description: 'Ledarens tvärsnittsarea (t.ex. 1.5, 2.5, 6.0 mm²). Ju större area, desto lägre resistans och spänningsfall.',
              },
              {
                symbol: 'cos φ',
                name: 'Effektfaktor',
                unit: '0.0 – 1.0',
                description: 'Fasförskjutningen mellan spänning och ström. Rent resistiva laster som värmeelement har cos φ = 1.0.',
              },
            ]}
            theory={
              phaseType === '1-phase'
                ? 'I en enfaskrets flyter strömmen först genom fasledaren (L) och sedan tillbaka genom neutralledaren (N). Båda ledarna har elektrisk resistans proportionell mot längden och omvänt proportionell mot arean (R = L / (γ·A)). Eftersom strömmen passerar två lika långa ledare multipliceras resistansen med 2. Detta orsakar ett spänningstapp som minskar spänningen hos förbrukaren och genererar värmeförluster i kabeln.'
                : 'I ett symmetriskt balanserat trefassystem tar strömmarna i de tre faserna ut varandra i stjärnpunkten (neutralledaren förblir strömlös). Spänningsfallet över en enskild fasledare är ΔU_fas = I · R_ledare · cos φ. Det resulterande spänningsfallet mellan två faser (huvudspänningen) blir därför √3 gånger spänningsfallet i en fas.'
            }
            practicalRules={[
              'Svensk standard (SS 436 40 00 / Elinstallationsreglerna): Högst 3–4 % spänningsfall rekommenderas från mätartavla/central till förbrukningspunkt.',
              'För belysningskretsar (speciellt glödljus och halogen) leder 5 % spänningsfall till nästan 15–20 % sämre ljusutbyte.',
              'För elmotorer och kompressorer leder för stort spänningsfall till ökad strömförbrukning och överhettning vid start.',
              'För långa kabellängder (>25–50 m) är spänningsfallet ofta den avgörande faktorn för kabeldimensionering, snarare än kabelns maximala belastningsförmåga (säkringsstorlek).',
            ]}
          />
        </div>
      </div>

      {/* PDF Report Modal */}
      {showPdfModal && (
        <CalculationPdfReportModal
          isOpen={showPdfModal}
          onClose={() => setShowPdfModal(false)}
          reportData={createVoltageDropReportData({
            phaseType,
            voltage: U,
            current: I,
            length: L,
            area: A,
            material,
            cosPhi: pf,
            maxDropPct: maxLimit,
            deltaU,
            dropPercent,
            endVoltage,
            rSingle,
            powerLoss,
            isWithinLimit,
          })}
        />
      )}
    </div>
  );
};
