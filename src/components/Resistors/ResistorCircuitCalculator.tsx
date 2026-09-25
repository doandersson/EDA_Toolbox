import React, { useState } from 'react';
import { formatElectrNumber, autoFormatResistance } from '../../utils/electricalMath';
import { Plus, Trash2, GitFork, Network, RotateCcw } from 'lucide-react';
import { FormulaTheoryCard, FormulaVariable } from '../FormulaTheoryCard';

interface ResistorItem {
  id: string;
  name: string;
  value: number; // in Ohms
  raw: string;
}

export const ResistorCircuitCalculator: React.FC = () => {
  const [circuitType, setCircuitType] = useState<'series' | 'parallel'>('series');
  const [supplyVoltage, setSupplyVoltage] = useState<string>('12');
  const [resistors, setResistors] = useState<ResistorItem[]>([
    { id: '1', name: 'R1', value: 100, raw: '100' },
    { id: '2', name: 'R2', value: 220, raw: '220' },
    { id: '3', name: 'R3', value: 470, raw: '470' },
  ]);

  const U = parseFloat(supplyVoltage) || 0;

  // Add resistor
  const handleAdd = () => {
    const nextIdx = resistors.length + 1;
    setResistors([
      ...resistors,
      { id: Date.now().toString(), name: `R${nextIdx}`, value: 100, raw: '100' },
    ]);
  };

  // Remove resistor
  const handleRemove = (id: string) => {
    if (resistors.length <= 1) return;
    setResistors(resistors.filter((r) => r.id !== id));
  };

  // Update value
  const handleUpdate = (id: string, text: string) => {
    const val = parseFloat(text.replace(',', '.')) || 0;
    setResistors(
      resistors.map((r) => (r.id === id ? { ...r, raw: text, value: val } : r))
    );
  };

  // Calculations
  let rTot = 0;
  if (circuitType === 'series') {
    rTot = resistors.reduce((sum, r) => sum + r.value, 0);
  } else {
    // Parallel: 1/Rtot = 1/R1 + 1/R2 + ...
    const valid = resistors.filter((r) => r.value > 0);
    if (valid.length > 0) {
      const invSum = valid.reduce((sum, r) => sum + 1 / r.value, 0);
      rTot = invSum > 0 ? 1 / invSum : 0;
    }
  }

  const totalCurrent = rTot > 0 && U > 0 ? U / rTot : 0;
  const totalPower = U * totalCurrent;

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Network className="w-5 h-5 text-amber-400" />
              <span>Serie- & Parallellkoppling av motstånd</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Beräkna ersättningsresistans, spänningsdelning och strömfördelning i kretsar.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCircuitType('series')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                circuitType === 'series'
                  ? 'bg-amber-500 text-slate-950 border-amber-500 font-semibold'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
              }`}
            >
              <span>Seriekoppling</span>
            </button>
            <button
              onClick={() => setCircuitType('parallel')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                circuitType === 'parallel'
                  ? 'bg-amber-500 text-slate-950 border-amber-500 font-semibold'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
              }`}
            >
              <span>Parallellkoppling</span>
            </button>
          </div>
        </div>

        {/* Global Voltage Input */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-medium text-slate-300">Mata kretsen med spänning (U)</span>
            <p className="text-[11px] text-slate-500">För att beräkna delspänningar och delströmmar</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              inputMode="decimal"
              value={supplyVoltage}
              onChange={(e) => setSupplyVoltage(e.target.value)}
              className="w-28 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm font-mono text-white text-right focus:outline-none focus:border-amber-500"
              placeholder="12"
            />
            <span className="text-xs font-mono text-sky-400">V</span>
          </div>
        </div>

        {/* Resistors List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-medium text-slate-400">
            <span>Motstånd i kretsen ({resistors.length} st)</span>
            <button
              onClick={handleAdd}
              className="flex items-center gap-1 text-amber-400 hover:text-amber-300 text-xs font-medium cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Lägg till motstånd</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {resistors.map((r, index) => {
              // Individual voltage / current
              let indVoltage = 0;
              let indCurrent = 0;
              let indPower = 0;

              if (circuitType === 'series') {
                indCurrent = totalCurrent;
                indVoltage = totalCurrent * r.value;
                indPower = indVoltage * indCurrent;
              } else {
                indVoltage = U;
                indCurrent = r.value > 0 ? U / r.value : 0;
                indPower = indVoltage * indCurrent;
              }

              return (
                <div
                  key={r.id}
                  className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 relative space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {r.name}
                    </span>
                    {resistors.length > 1 && (
                      <button
                        onClick={() => handleRemove(r.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 rounded transition cursor-pointer"
                        title="Ta bort motstånd"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={r.raw}
                      onChange={(e) => handleUpdate(r.id, e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-sm font-mono text-white focus:outline-none focus:border-amber-500"
                    />
                    <span className="text-xs font-mono text-slate-400">Ω</span>
                  </div>

                  {/* Individual metrics */}
                  {U > 0 && (
                    <div className="pt-2 border-t border-slate-800/80 text-[11px] font-mono grid grid-cols-2 gap-1 text-slate-400">
                      <div>
                        <span className="text-slate-500">U: </span>
                        <span className="text-sky-300 font-semibold">{formatElectrNumber(indVoltage, 2)} V</span>
                      </div>
                      <div>
                        <span className="text-slate-500">I: </span>
                        <span className="text-emerald-300 font-semibold">{formatElectrNumber(indCurrent, 3)} A</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-500">Effekt: </span>
                        <span className="text-rose-300 font-semibold">{formatElectrNumber(indPower, 2)} W</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Total Results */}
        <div className="pt-4 border-t border-slate-800">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-950/80 border border-amber-500/30 rounded-xl p-4">
              <span className="text-xs font-medium text-amber-400">Ersättningsresistans (R_tot)</span>
              <div className="my-1">
                <span className="text-2xl font-bold font-mono tabular-nums text-white">
                  {formatElectrNumber(rTot, 2)}
                </span>
                <span className="text-xs font-mono text-amber-400 ml-1">Ω</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                {autoFormatResistance(rTot).formatted}
              </span>
            </div>

            <div className="bg-slate-950/80 border border-emerald-500/30 rounded-xl p-4">
              <span className="text-xs font-medium text-emerald-400">Total Kretsström (I_tot)</span>
              <div className="my-1">
                <span className="text-2xl font-bold font-mono tabular-nums text-white">
                  {formatElectrNumber(totalCurrent, 3)}
                </span>
                <span className="text-xs font-mono text-emerald-400 ml-1">A</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                Vid {U} V matning
              </span>
            </div>

            <div className="bg-slate-950/80 border border-rose-500/30 rounded-xl p-4">
              <span className="text-xs font-medium text-rose-400">Total Effekt (P_tot)</span>
              <div className="my-1">
                <span className="text-2xl font-bold font-mono tabular-nums text-white">
                  {formatElectrNumber(totalPower, 2)}
                </span>
                <span className="text-xs font-mono text-rose-400 ml-1">W</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                Total värmeutveckling
              </span>
            </div>
          </div>

          <div className="mt-3 p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-xs font-mono text-slate-300">
            <strong>Snabböversikt: </strong>
            {circuitType === 'series'
              ? `R_tot = ${resistors.map((r) => r.name).join(' + ')} = ${resistors.map((r) => `${r.value}Ω`).join(' + ')} = ${formatElectrNumber(rTot, 2)} Ω`
              : `1 / R_tot = ${resistors.map((r) => `(1 / ${r.name})`).join(' + ')} ➔ R_tot = ${formatElectrNumber(rTot, 2)} Ω`}
          </div>
        </div>

        {/* Utbildande informationsavsnitt med matematisk formel */}
        <div className="pt-2">
          {circuitType === 'series' ? (
            <FormulaTheoryCard
              title="Matematisk formel & kretsteori – Seriekrets"
              badge="Kirchhoffs spänningslag (KVL)"
              formula="R_{\text{tot}} = R_1 + R_2 + \dots + R_n"
              secondaryFormula="U_k = U_{\text{matning}} \cdot \frac{R_k}{R_{\text{tot}}} \quad \text{och} \quad I_{\text{krets}} = \frac{U_{\text{matning}}}{R_{\text{tot}}}"
              substitution={`R_tot = ${resistors.map((r) => `${r.value} Ω`).join(' + ')} = ${formatElectrNumber(rTot, 2)} Ω\nI_tot = ${U} V / ${formatElectrNumber(rTot, 2)} Ω = ${formatElectrNumber(totalCurrent, 3)} A\nP_tot = ${U} V · ${formatElectrNumber(totalCurrent, 3)} A = ${formatElectrNumber(totalPower, 2)} W`}
              variables={[
                {
                  symbol: 'R_tot',
                  name: 'Ersättningsresistans',
                  unit: 'Ω (Ohm)',
                  description: 'Kretsens sammanlagda resistans, vilken är summan av alla ingående resistanser i serie.',
                },
                {
                  symbol: 'R_1, R_2…',
                  name: 'Delmotstånd',
                  unit: 'Ω (Ohm)',
                  description: 'Resistansen hos varje individuellt motstånd i seriekopplingen.',
                },
                {
                  symbol: 'I_tot',
                  name: 'Kretsström',
                  unit: 'A (Ampere)',
                  description: 'Strömmen är densamma genom alla seriekopplade komponenter (I = I₁ = I₂ = …).',
                },
                {
                  symbol: 'U_k',
                  name: 'Spänningsfall',
                  unit: 'V (Volt)',
                  description: 'Delspänningen över motstånd k (spänningsdelningsprincipen). Summan av delspänningarna är lika med matningsspänningen.',
                },
                {
                  symbol: 'P_tot',
                  name: 'Total effekt',
                  unit: 'W (Watt)',
                  description: 'Total förbrukad effekt / värmeutveckling (P = U · I = I² · R).',
                },
              ]}
              theory="Vid seriekoppling tvingas samma elektriska laddningsflöde (ström I) att passera genom varje enskild resistor i följd. Därför adderas motståndens resistans linjärt. Spänningen fördelas proportionellt efter varje resistors storlek enligt spänningsdelningsformeln (U_k = U · R_k / R_tot). Om en komponent bryts (avbrott), slutar strömmen flyta i hela kretsen."
              practicalRules={[
                'Strömmen (I) är identisk överallt i hela serieslingan.',
                'Totalresistansen är alltid STÖRRE än det största enskilda motståndet i slingan.',
                'Spänningsdelning används ofta för sensoravläsning (t.ex. NTC-motstånd, LDR och potentiometrar).',
                'Komponenter med högre resistans utvecklar mer värme (P = I² · R) vid konstant serieström.',
              ]}
            />
          ) : (
            <FormulaTheoryCard
              title="Matematisk formel & kretsteori – Parallellkrets"
              badge="Kirchhoffs strömlag (KCL)"
              formula="\frac{1}{R_{\text{tot}}} = \frac{1}{R_1} + \frac{1}{R_2} + \dots + \frac{1}{R_n} \iff R_{\text{tot}} = \frac{1}{\sum_{k=1}^n \frac{1}{R_k}}"
              secondaryFormula="I_{\text{tot}} = I_1 + I_2 + \dots + I_n \quad \text{där} \quad I_k = \frac{U_{\text{matning}}}{R_k}"
              substitution={`1 / R_tot = ${resistors.map((r) => `(1 / ${r.value} Ω)`).join(' + ')}\n➔ R_tot = ${formatElectrNumber(rTot, 2)} Ω\nI_tot = ${resistors.map((r) => `${formatElectrNumber(U / (r.value || 1), 3)} A`).join(' + ')} = ${formatElectrNumber(totalCurrent, 3)} A\nP_tot = ${U} V · ${formatElectrNumber(totalCurrent, 3)} A = ${formatElectrNumber(totalPower, 2)} W`}
              variables={[
                {
                  symbol: 'R_tot',
                  name: 'Ersättningsresistans',
                  unit: 'Ω (Ohm)',
                  description: 'Parallellkopplingens totala ekvivalenta resistans.',
                },
                {
                  symbol: '1 / R',
                  name: 'Konduktans (G)',
                  unit: 'S (Siemens)',
                  description: 'Ledningsförmåga (ledningsvärde). Vid parallellkoppling adderas konduktanserna: G_tot = G₁ + G₂ + …',
                },
                {
                  symbol: 'U',
                  name: 'Matningsspänning',
                  unit: 'V (Volt)',
                  description: 'Samma fulla spänning ligger över alla parallella grenar (U = U₁ = U₂ = …).',
                },
                {
                  symbol: 'I_k',
                  name: 'Grenström',
                  unit: 'A (Ampere)',
                  description: 'Strömmen genom gren k beräknas med Ohms lag: I_k = U / R_k.',
                },
                {
                  symbol: 'I_tot',
                  name: 'Totalström',
                  unit: 'A (Ampere)',
                  description: 'Enligt Kirchhoffs strömlag är total tillförd ström summan av alla grenströmmar.',
                },
              ]}
              theory="I en parallellkrets ansluts alla resistorer till samma spänningskällor. Varje gren utgör en alternativ väg för elektronerna, vilket ökar kretsens totala ledningsförmåga (konduktans G = 1/R). Därför minskar alltid kretsens totala resistans när fler parallella laster kopplas in. Om en gren kopplas bort eller går sönder fortsätter övriga grenar att fungera opåverkade."
              practicalRules={[
                'Gyllene regel: Ersättningsresistansen R_tot är ALLTID mindre än den minsta enskilda resistansen i kopplingen!',
                'För två parallella motstånd gäller genvägen: R_tot = (R₁ · R₂) / (R₁ + R₂).',
                'För N lika stora motstånd med resistans R gäller: R_tot = R / N.',
                'Elinstallationer i fastigheter (uttag, belysning, apparater) är alltid parallellkopplade för att alla apparater ska få samma märkspänning (230 V).',
              ]}
            />
          )}
        </div>
      </div>
    </div>
  );
};
