import React, { useState } from 'react';
import {
  METRIC_HP_FACTOR,
  MECHANICAL_HP_FACTOR,
  BTU_PER_HOUR_PER_KW,
  STANDARD_MOTOR_RATINGS,
  AWG_TABLE,
  SWEDISH_STANDARD_AREAS,
  calculateAwgDiameterMm,
  calculateAwgAreaMm2,
  calculateExactAwgFromAreaMm2,
  findNearestSwedishCableArea,
  TORQUE_FACTORS,
  TYPICAL_ELECTRICAL_TORQUES,
  celsiusToFahrenheit,
  fahrenheitToCelsius,
  celsiusToKelvin,
  kelvinToCelsius,
  calculateResistanceAtTemp,
  CONDUIT_TABLE,
} from '../../utils/conversionMath';
import { formatElectrNumber } from '../../utils/electricalMath';
import { FormulaTheoryCard } from '../FormulaTheoryCard';
import {
  ArrowLeftRight,
  Cpu,
  Cable,
  Wrench,
  Thermometer,
  Ruler,
  Hash,
  Info,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Search,
} from 'lucide-react';

type ConverterSubTab = 'power' | 'awg' | 'torque' | 'temperature' | 'conduit' | 'prefix';

export const UnitConverter: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<ConverterSubTab>('power');

  // --- POWER (kW / hk) STATE ---
  const [kwInput, setKwInput] = useState<string>('5.5');
  const [metricHkInput, setMetricHkInput] = useState<string>(
    (5.5 / METRIC_HP_FACTOR).toFixed(2)
  );
  const [mechanicalHpInput, setMechanicalHpInput] = useState<string>(
    (5.5 / MECHANICAL_HP_FACTOR).toFixed(2)
  );

  const handleKwChange = (val: string) => {
    setKwInput(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num >= 0) {
      setMetricHkInput((num / METRIC_HP_FACTOR).toFixed(2));
      setMechanicalHpInput((num / MECHANICAL_HP_FACTOR).toFixed(2));
    } else {
      setMetricHkInput('');
      setMechanicalHpInput('');
    }
  };

  const handleMetricHkChange = (val: string) => {
    setMetricHkInput(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num >= 0) {
      const kw = num * METRIC_HP_FACTOR;
      setKwInput(kw.toFixed(3));
      setMechanicalHpInput((kw / MECHANICAL_HP_FACTOR).toFixed(2));
    } else {
      setKwInput('');
      setMechanicalHpInput('');
    }
  };

  const handleMechanicalHpChange = (val: string) => {
    setMechanicalHpInput(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num >= 0) {
      const kw = num * MECHANICAL_HP_FACTOR;
      setKwInput(kw.toFixed(3));
      setMetricHkInput((kw / METRIC_HP_FACTOR).toFixed(2));
    } else {
      setKwInput('');
      setMetricHkInput('');
    }
  };

  const currentKw = parseFloat(kwInput) || 0;
  const currentMetricHk = parseFloat(metricHkInput) || 0;
  const currentMechHp = parseFloat(mechanicalHpInput) || 0;
  const currentWatts = currentKw * 1000;
  const currentBtu = currentKw * BTU_PER_HOUR_PER_KW;

  // --- AWG & CABLE AREA STATE ---
  const [areaMode, setAreaMode] = useState<'mm2_to_awg' | 'awg_to_mm2'>('mm2_to_awg');
  const [mm2Input, setMm2Input] = useState<string>('2.5');
  const [awgSelect, setAwgSelect] = useState<string>('14');
  const [awgFilterText, setAwgFilterText] = useState<string>('');

  const numMm2 = parseFloat(mm2Input) || 0;
  const calcDiameterFromMm2 = numMm2 > 0 ? Math.sqrt((4 * numMm2) / Math.PI) : 0;
  const calcAwgFromMm2 = numMm2 > 0 ? calculateExactAwgFromAreaMm2(numMm2) : 0;
  const nearestStandardArea = numMm2 > 0 ? findNearestSwedishCableArea(numMm2) : 2.5;

  // Calculate reverse AWG selection
  const selectedAwgEntry =
    AWG_TABLE.find((item) => item.awg.startsWith(awgSelect) || item.awg === awgSelect) ||
    AWG_TABLE[12]; // default AWG 14

  // --- TORQUE STATE ---
  const [nmInput, setNmInput] = useState<string>('2.5');
  const currentNm = parseFloat(nmInput) || 0;
  const calcLbfIn = currentNm * TORQUE_FACTORS.nm_to_lbfin;
  const calcLbfFt = currentNm * TORQUE_FACTORS.nm_to_lbfft;
  const calcKgfCm = currentNm * TORQUE_FACTORS.nm_to_kgfcm;

  // --- TEMPERATURE & RESISTANCE STATE ---
  const [celsiusInput, setCelsiusInput] = useState<string>('70');
  const [baseResistanceInput, setBaseResistanceInput] = useState<string>('1.0');
  const [cableMaterial, setCableMaterial] = useState<'copper' | 'aluminum'>('copper');

  const currentCelsius = parseFloat(celsiusInput) || 20;
  const currentFahrenheit = celsiusToFahrenheit(currentCelsius);
  const currentKelvin = celsiusToKelvin(currentCelsius);
  const baseR = parseFloat(baseResistanceInput) || 1.0;
  const tempCorrection = calculateResistanceAtTemp(baseR, currentCelsius, cableMaterial);

  // --- CONDUIT & LENGTH STATE ---
  const [meterInput, setMeterInput] = useState<string>('25');
  const currentMeters = parseFloat(meterInput) || 0;
  const currentFeet = currentMeters * 3.28084;
  const currentInches = currentMeters * 39.3701;

  // --- PREFIX STATE ---
  const [prefixBaseVal, setPrefixBaseVal] = useState<string>('100');
  const [prefixUnitType, setPrefixUnitType] = useState<'farad' | 'ohm' | 'henry'>('farad');
  const numPrefixBase = parseFloat(prefixBaseVal) || 0;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5 sm:mt-0">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <span>Enhetskonvertering för elektriker i fält</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                  Fältverktyg
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Snabba och exakta omvandlingar mellan metriska och internationella eltekniska enheter (kW ⇄ hk, mm² ⇄ AWG, moment, temperatur och rördimensioner).
              </p>
            </div>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveSubTab('power')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
              activeSubTab === 'power'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                : 'bg-slate-950/60 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Effekt (kW ⇄ hk / hp)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('awg')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
              activeSubTab === 'awg'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                : 'bg-slate-950/60 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <Cable className="w-4 h-4" />
            <span>Kabelarea (mm² ⇄ AWG)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('torque')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
              activeSubTab === 'torque'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                : 'bg-slate-950/60 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Moment (Nm ⇄ lbf·in)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('temperature')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
              activeSubTab === 'temperature'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                : 'bg-slate-950/60 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <Thermometer className="w-4 h-4" />
            <span>Temperatur & Varmgång</span>
          </button>

          <button
            onClick={() => setActiveSubTab('conduit')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
              activeSubTab === 'conduit'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                : 'bg-slate-950/60 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <Ruler className="w-4 h-4" />
            <span>VP-rör & Längd</span>
          </button>

          <button
            onClick={() => setActiveSubTab('prefix')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
              activeSubTab === 'prefix'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                : 'bg-slate-950/60 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <Hash className="w-4 h-4" />
            <span>SI-Prefix (µF, nF, pF)</span>
          </button>
        </div>
      </div>

      {/* --- TAB 1: POWER (kW ⇄ hk / hp) --- */}
      {activeSubTab === 'power' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Interactive Conversion Card */}
            <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 shadow-sm">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-white flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-amber-400" />
                    <span>Effektomvandlare (Motoreffekt)</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Omvandla tvåvägs mellan Kilowatt (kW) och Hästkrafter (hk/hp).
                  </p>
                </div>
              </div>

              {/* Input fields */}
              <div className="space-y-4">
                {/* 1. Kilowatt (kW) */}
                <div>
                  <label className="text-xs font-medium text-slate-300 mb-1 flex items-center justify-between">
                    <span>Kilowatt (kW) – Metrisk SI-enhet</span>
                    <span className="text-[11px] text-amber-400 font-mono font-normal">Standard i Europa</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={kwInput}
                      onChange={(e) => handleKwChange(e.target.value)}
                      placeholder="t.ex. 5.5"
                      className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-base sm:text-lg font-mono font-bold text-white focus:outline-none transition shadow-inner"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-semibold text-slate-400 pointer-events-none">
                      kW
                    </span>
                  </div>
                </div>

                {/* 2. Metriska hästkrafter (hk / PS) */}
                <div>
                  <label className="text-xs font-medium text-slate-300 mb-1 flex items-center justify-between">
                    <span>Metriska hästkrafter (hk / PS)</span>
                    <span className="text-[11px] text-slate-400 font-mono font-normal">1 hk = 735,5 W (Sverige/Tyskland)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={metricHkInput}
                      onChange={(e) => handleMetricHkChange(e.target.value)}
                      placeholder="t.ex. 7.5"
                      className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-base sm:text-lg font-mono font-bold text-amber-300 focus:outline-none transition shadow-inner"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-semibold text-amber-400 pointer-events-none">
                      hk
                    </span>
                  </div>
                </div>

                {/* 3. Brittiska / Mekaniska Horsepower (hp) */}
                <div>
                  <label className="text-xs font-medium text-slate-300 mb-1 flex items-center justify-between">
                    <span>Mekaniska Horsepower (hp / imperial)</span>
                    <span className="text-[11px] text-slate-400 font-mono font-normal">1 hp = 745,7 W (USA / UK)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={mechanicalHpInput}
                      onChange={(e) => handleMechanicalHpChange(e.target.value)}
                      placeholder="t.ex. 7.4"
                      className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-base sm:text-lg font-mono font-bold text-sky-300 focus:outline-none transition shadow-inner"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-semibold text-sky-400 pointer-events-none">
                      hp
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Preset Buttons for standard motors */}
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-2">
                  Snabbval vanliga elmotorer (kW):
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[0.37, 0.75, 1.5, 2.2, 4.0, 5.5, 7.5, 11, 15, 22, 30, 45].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => handleKwChange(preset.toString())}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono transition cursor-pointer ${
                        currentKw === preset
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-slate-950/70 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      {preset} kW
                    </button>
                  ))}
                </div>
              </div>

              {/* Additional Equivalent Units */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800">
                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Watt (W)</span>
                  <span className="text-sm sm:text-base font-bold font-mono text-emerald-400">
                    {formatElectrNumber(currentWatts, 0)} W
                  </span>
                </div>
                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">BTU/timme (Kyla/Värme)</span>
                  <span className="text-sm sm:text-base font-bold font-mono text-cyan-400">
                    {formatElectrNumber(currentBtu, 0)} BTU/h
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Quick Motor Selection Reference Table */}
            <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm flex flex-col justify-between">
              <div>
                <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Standard elmotorstorlekar (IEC vs US NEMA)</span>
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">400V 50Hz</span>
                </div>
                <p className="text-xs text-slate-400 mt-2 mb-3">
                  Jämförelsetabell mellan europeiska standardmärkeffekter i kW och amerikanska hästkrafter, inklusive typisk märkström vid 400 V trefas.
                </p>

                <div className="overflow-x-auto max-h-[340px] overflow-y-auto rounded-xl border border-slate-800 scrollbar-thin">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-950 text-slate-400 sticky top-0 border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3 font-semibold">Effekt (kW)</th>
                        <th className="py-2.5 px-3 font-semibold">Metrisk (hk)</th>
                        <th className="py-2.5 px-3 font-semibold">US (hp)</th>
                        <th className="py-2.5 px-3 font-semibold">Ca I vid 400V</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 text-slate-300">
                      {STANDARD_MOTOR_RATINGS.map((m) => {
                        const isMatch = Math.abs(currentKw - m.kw) < 0.05;
                        return (
                          <tr
                            key={m.kw}
                            onClick={() => handleKwChange(m.kw.toString())}
                            className={`cursor-pointer transition hover:bg-slate-800/60 ${
                              isMatch ? 'bg-amber-500/15 font-bold text-amber-300' : ''
                            }`}
                          >
                            <td className="py-2 px-3 text-white">{m.kw} kW</td>
                            <td className="py-2 px-3 text-amber-400">{m.metricHk} hk</td>
                            <td className="py-2 px-3 text-sky-400">{m.imperialHp} hp</td>
                            <td className="py-2 px-3 text-emerald-400">{m.typicalCurrent400V} A</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 bg-slate-950/40 p-3 rounded-xl border border-slate-800 flex items-start gap-2 mt-4">
                <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Elektrikertips:</strong> Vid ersättning av äldre motorer märkta i &quot;hk&quot; eller amerikanska maskiner i &quot;hp&quot;, välj närmaste högre eller identisk standard-kW för att garantera tillräckligt vridmoment på motoraxeln.
                </span>
              </div>
            </div>
          </div>

          {/* Formula Theory Card */}
          <FormulaTheoryCard
            title="Matematisk formel & härledning – Effekt (kW ⇄ hk / hp)"
            badge="Standard IEC & ISO"
            formula="P_{\text{kW}} = P_{\text{hk}} \times 0{,}73549875 \quad \iff \quad P_{\text{hk}} = \frac{P_{\text{kW}}}{0{,}7355}"
            secondaryFormula="1 \text{ hp (imperial)} = 745{,}69987 \text{ W} = 0{,}7457 \text{ kW} \quad (1 \text{ hp} \approx 1{,}0139 \text{ hk})"
            substitution={`Inmatad effekt: ${currentKw} kW\nMetriska hästkrafter: ${currentKw} kW / 0.73549875 = ${formatElectrNumber(currentMetricHk, 2)} hk\nImperial hästkrafter: ${currentKw} kW / 0.74569987 = ${formatElectrNumber(currentMechHp, 2)} hp\nI Watt: ${formatElectrNumber(currentWatts, 0)} W\nKyl/värmeeffekt: ${currentKw} kW · 3412.14 = ${formatElectrNumber(currentBtu, 0)} BTU/h`}
            variables={[
              {
                symbol: 'kW',
                name: 'Kilowatt (SI-enhet)',
                unit: 'kW (1000 Watt = 1000 J/s)',
                description: 'Den internationella standardenheten för aktiv motoreffekt och energiförbrukning.',
              },
              {
                symbol: 'hk (PS)',
                name: 'Metrisk hästkraft',
                unit: 'hk (735,49875 Watt)',
                description: 'Definierades ursprungligen som den effekt som krävs för att lyfta 75 kg en meter rakt upp på en sekund (75 kg · 9,80665 m/s² = 735,49875 W).',
              },
              {
                symbol: 'hp',
                name: 'Mekanisk / Imperial Horsepower',
                unit: 'hp (745,69987 Watt)',
                description: 'Brittisk/amerikansk definition av James Watt (550 foot-pounds per sekund = 745,7 W). Cirka 1,4 % starkare än en metrisk hästkraft.',
              },
            ]}
            theory="Inom industrin och fastighetstekniken anges motordata historiskt ofta i hästkrafter (hk i Sverige och Tyskland, hp i USA och Storbritannien). Moderna elmotorer tillverkade enligt IEC-standard är alltid märkta i kilowatt (kW) för den mekaniska axeleffekten. Vid import av amerikanska pumpar, kompressorer och reservdelar uppstår ofta behovet att snabbt verifiera exakt kW för att välja rätt motorskydd och matarkabel."
            practicalRules={[
              '1 kW är ungefär 1,36 metriska hästkrafter (hk).',
              '1 hk är cirka 0,736 kW (3/4 kW är en bra tumregel i huvudet).',
              'För elmotorer vid 400 V trefas drar motorn typiskt cirka 2 A per kW märkeffekt vid fullast (cos φ ≈ 0,85, verkningsgrad η ≈ 0,90).',
            ]}
          />
        </div>
      )}

      {/* --- TAB 2: CABLE AREA (mm² ⇄ AWG) --- */}
      {activeSubTab === 'awg' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Interactive Conversion Card */}
            <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 shadow-sm">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-white flex items-center gap-2">
                    <Cable className="w-5 h-5 text-amber-400" />
                    <span>Ledararea & AWG-omvandlare</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Konvertera mellan europeisk millimeterarea (mm²) och American Wire Gauge (AWG).
                  </p>
                </div>
              </div>

              {/* Mode toggle */}
              <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                <button
                  onClick={() => setAreaMode('mm2_to_awg')}
                  className={`py-2 text-xs font-semibold rounded-lg transition cursor-pointer ${
                    areaMode === 'mm2_to_awg'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Från mm² till AWG
                </button>
                <button
                  onClick={() => setAreaMode('awg_to_mm2')}
                  className={`py-2 text-xs font-semibold rounded-lg transition cursor-pointer ${
                    areaMode === 'awg_to_mm2'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Från AWG till mm²
                </button>
              </div>

              {areaMode === 'mm2_to_awg' ? (
                /* Mode 1: mm2 to AWG */
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-slate-300 mb-1 flex items-center justify-between">
                      <span>Ledararea (mm²)</span>
                      <span className="text-[11px] text-amber-400 font-mono">Europeisk standard</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="any"
                        min="0.05"
                        value={mm2Input}
                        onChange={(e) => setMm2Input(e.target.value)}
                        placeholder="t.ex. 2.5"
                        className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-base sm:text-lg font-mono font-bold text-white focus:outline-none transition shadow-inner"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-semibold text-slate-400 pointer-events-none">
                        mm²
                      </span>
                    </div>
                  </div>

                  {/* Standard Swedish Area chips */}
                  <div>
                    <label className="text-xs font-medium text-slate-400 block mb-2">
                      Svenska standardareor:
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {[1.5, 2.5, 4.0, 6.0, 10.0, 16.0, 25.0, 35.0, 50.0, 70.0, 95.0, 120.0].map((area) => (
                        <button
                          key={area}
                          onClick={() => setMm2Input(area.toString())}
                          className={`px-2.5 py-1 rounded-lg text-xs font-mono transition cursor-pointer ${
                            numMm2 === area
                              ? 'bg-amber-500 text-slate-950 font-bold'
                              : 'bg-slate-950/70 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
                          }`}
                        >
                          {area} mm²
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Calculated Results */}
                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Exakt beräknad AWG</span>
                        <span className="text-lg font-bold font-mono text-amber-400">
                          AWG {calcAwgFromMm2.toFixed(1)}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Närmaste hel AWG</span>
                        <span className="text-lg font-bold font-mono text-sky-400">
                          AWG {Math.round(calcAwgFromMm2)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Ledardiameter (d)</span>
                        <span className="text-sm font-semibold font-mono text-emerald-400">
                          {calcDiameterFromMm2.toFixed(3)} mm
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Ledardiameter (tum)</span>
                        <span className="text-sm font-semibold font-mono text-slate-300">
                          {(calcDiameterFromMm2 / 25.4).toFixed(4)} &quot;
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Mode 2: AWG to mm2 */
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-slate-300 mb-1 flex items-center justify-between">
                      <span>Välj AWG (American Wire Gauge)</span>
                      <span className="text-[11px] text-sky-400 font-mono">USA / Internationell</span>
                    </label>
                    <select
                      value={awgSelect}
                      onChange={(e) => setAwgSelect(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-base font-mono font-bold text-white focus:outline-none transition shadow-inner"
                    >
                      {AWG_TABLE.map((item) => (
                        <option key={item.awg} value={item.awg}>
                          AWG {item.awg} ({item.areaMm2.toFixed(2)} mm² – Ø {item.diameterMm.toFixed(2)} mm)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Calculated Results for selected AWG */}
                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Tvärsnittsarea</span>
                        <span className="text-xl font-bold font-mono text-amber-400">
                          {selectedAwgEntry.areaMm2.toFixed(2)} mm²
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Svensk kabelmotsvarighet</span>
                        <span className="text-base font-bold font-mono text-emerald-400">
                          {selectedAwgEntry.swedishEquivalent}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-xs font-mono">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Diameter</span>
                        <span className="text-slate-200">{selectedAwgEntry.diameterMm.toFixed(2)} mm</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Resistans (Cu)</span>
                        <span className="text-slate-200">{selectedAwgEntry.resistanceOhmPerKm} Ω/km</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Typisk säkring</span>
                        <span className="text-cyan-400">{selectedAwgEntry.typicalFuseAmps}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="text-[11px] text-slate-400 bg-slate-950/40 p-3 rounded-xl border border-slate-800 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Installationsvarning:</strong> Amerikanska maskiner använder ofta AWG 14 (2,08 mm²) som avsäkras med 15 A. I Sverige finns inte 2,08 mm² kabel i fast installation. Ersätt alltid med <strong>2,5 mm²</strong> kabel och 16 A säkring (eller 1,5 mm² kabel om säkringen sänks till max 10 A).
                </span>
              </div>
            </div>

            {/* Right: Full AWG Reference Table */}
            <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm flex flex-col justify-between">
              <div>
                <div className="border-b border-slate-800 pb-3 flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Komplett AWG-tabell med svensk standard</span>
                  </h3>
                  <div className="relative w-32 sm:w-44">
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Sök AWG / mm²..."
                      value={awgFilterText}
                      onChange={(e) => setAwgFilterText(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-2 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto max-h-[350px] overflow-y-auto rounded-xl border border-slate-800 scrollbar-thin mt-3">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-950 text-slate-400 sticky top-0 border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3 font-semibold">AWG</th>
                        <th className="py-2.5 px-3 font-semibold">Area (mm²)</th>
                        <th className="py-2.5 px-3 font-semibold">Ø (mm)</th>
                        <th className="py-2.5 px-3 font-semibold">Svensk standard</th>
                        <th className="py-2.5 px-3 font-semibold">Säkring</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 text-slate-300">
                      {AWG_TABLE.filter(
                        (item) =>
                          item.awg.toLowerCase().includes(awgFilterText.toLowerCase()) ||
                          item.areaMm2.toString().includes(awgFilterText) ||
                          item.swedishEquivalent.toLowerCase().includes(awgFilterText.toLowerCase())
                      ).map((item) => (
                        <tr
                          key={item.awg}
                          onClick={() => {
                            setAreaMode('awg_to_mm2');
                            setAwgSelect(item.awg);
                          }}
                          className={`cursor-pointer transition hover:bg-slate-800/60 ${
                            awgSelect === item.awg && areaMode === 'awg_to_mm2'
                              ? 'bg-amber-500/15 font-bold text-amber-300'
                              : ''
                          }`}
                        >
                          <td className="py-2 px-3 text-sky-400 font-bold">{item.awg}</td>
                          <td className="py-2 px-3 text-white">{item.areaMm2.toFixed(2)} mm²</td>
                          <td className="py-2 px-3 text-slate-400">{item.diameterMm.toFixed(2)} mm</td>
                          <td className="py-2 px-3 text-emerald-400 font-semibold">{item.swedishEquivalent}</td>
                          <td className="py-2 px-3 text-amber-300">{item.typicalFuseAmps}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800">
                <span>
                  <strong>kcmil (MCM):</strong> För mycket grova kablar (&gt;4/0) används <em>kcmil</em> (thousand circular mils). 1 kcmil = 0,5067 mm². T.ex. 250 kcmil ≈ 127 mm² (ersätts med 150 mm² i Sverige).
                </span>
              </div>
            </div>
          </div>

          {/* Formula Theory Card */}
          <FormulaTheoryCard
            title="Matematisk formel & definition – American Wire Gauge (AWG)"
            badge="ASTM B258 standard"
            formula="d_n = 0{,}127 \times 92^{\frac{36 - n}{39}} \text{ mm} \quad \text{och} \quad A = \frac{\pi}{4} \cdot d_n^2"
            secondaryFormula="n = 36 - 39 \cdot \frac{\ln(d / 0{,}127)}{\ln(92)} \quad \text{där } 00 = -1, \, 000 = -2, \, 0000 = -3"
            substitution={`Beräkning för inmatat värde:\nLedararea A = ${numMm2} mm²\nLedardiameter d = √(4 · ${numMm2} / π) = ${calcDiameterFromMm2.toFixed(3)} mm\nExakt AWG n = 36 - 39 · [ln(${calcDiameterFromMm2.toFixed(3)} / 0.127) / ln(92)] = AWG ${calcAwgFromMm2.toFixed(2)}\nNärmaste hel AWG: AWG ${Math.round(calcAwgFromMm2)}\nNärmaste svenska standardarea: ${nearestStandardArea} mm²`}
            variables={[
              {
                symbol: 'n',
                name: 'AWG Gauge-nummer',
                unit: 'dimensionslös (0 till 40)',
                description: 'Ju större AWG-nummer, desto tunnare tråd. Steg 36 motsvarar 0,005 tum (0,127 mm) och steg 0000 motsvarar 0,460 tum (11,684 mm).',
              },
              {
                symbol: 'd_n',
                name: 'Trådens diameter',
                unit: 'mm (millimeter)',
                description: 'Beräknas genom den logaritmiska fördelningen av 39 steg mellan 0,127 mm och 11,684 mm (förhållande 92:1).',
              },
              {
                symbol: 'A',
                name: 'Tvärsnittsarea',
                unit: 'mm² (kvadratmillimeter)',
                description: 'Ledarens effektiva ledararea för strömtransport.',
              },
            ]}
            theory="AWG (American Wire Gauge) är ett standardiserat logaritmiskt tråddimensioneringssystem som har använts sedan 1857 i Nordamerika. Det bygger på antalet dragningar tråden fick genomgå i dragskivan: varje dragning minskade diametern något. Därför har en tjock kabel ett lågt nummer (t.ex. AWG 4 är 21 mm²), medan en tunn styrkabel har ett högt nummer (t.ex. AWG 24 är 0,2 mm²). En smidig tumregel är att för vart 3:e AWG-steg halveras/dubbleras ledararean (t.ex. AWG 10 är dubbelt så grov som AWG 13)."
            practicalRules={[
              'AWG 14 = 2,08 mm² ➔ Ersätt alltid med 2,5 mm² i Sverige om säkringen är 16 A eller 13 A.',
              'AWG 12 = 3,31 mm² ➔ Ersätts med 4,0 mm².',
              'AWG 10 = 5,26 mm² ➔ Ersätts med 6,0 mm².',
              'AWG 8 = 8,37 mm² ➔ Ersätts med 10,0 mm².',
              'AWG 6 = 13,3 mm² ➔ Ersätts med 16,0 mm².',
              'AWG 4 = 21,2 mm² ➔ Ersätts med 25,0 mm².',
            ]}
          />
        </div>
      )}

      {/* --- TAB 3: TORQUE (MOMENT) --- */}
      {activeSubTab === 'torque' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Interactive Conversion Card */}
            <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 shadow-sm">
              <div className="border-b border-slate-800 pb-3">
                <h2 className="text-base font-semibold text-white flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-amber-400" />
                  <span>Åtdragningsmoment (Nm ⇄ lbf·in / lbf·ft)</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Avgörande för att förhindra glappkontakt, varmgång och ljusbågar i elcentraler och plintar.
                </p>
              </div>

              {/* Input for Newtonmeter */}
              <div>
                <label className="text-xs font-medium text-slate-300 mb-1 flex items-center justify-between">
                  <span>Newtonmeter (Nm) – SI-enhet</span>
                  <span className="text-[11px] text-amber-400 font-mono">Standard i Sverige</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    min="0"
                    value={nmInput}
                    onChange={(e) => setNmInput(e.target.value)}
                    placeholder="t.ex. 2.5"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-base sm:text-lg font-mono font-bold text-white focus:outline-none transition shadow-inner"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-semibold text-slate-400 pointer-events-none">
                    Nm
                  </span>
                </div>
              </div>

              {/* Quick Preset Buttons for common electrical torques */}
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-2">
                  Vanliga moment i elcentraler:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[0.6, 1.2, 2.0, 2.5, 2.8, 3.5, 4.5, 6.0, 10.0, 18.0].map((val) => (
                    <button
                      key={val}
                      onClick={() => setNmInput(val.toString())}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono transition cursor-pointer ${
                        currentNm === val
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-slate-950/70 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      {val} Nm
                    </button>
                  ))}
                </div>
              </div>

              {/* Output Values */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5">
                  <span className="text-[10px] text-slate-400 block">Pound-force inch</span>
                  <span className="text-lg font-bold font-mono text-amber-400">
                    {calcLbfIn.toFixed(1)} lbf·in
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Skruvplintar (US)</span>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5">
                  <span className="text-[10px] text-slate-400 block">Pound-force foot</span>
                  <span className="text-lg font-bold font-mono text-sky-400">
                    {calcLbfFt.toFixed(2)} lbf·ft
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Större bultar (US)</span>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5">
                  <span className="text-[10px] text-slate-400 block">Kilopond-centimeter</span>
                  <span className="text-lg font-bold font-mono text-emerald-400">
                    {calcKgfCm.toFixed(1)} kgf·cm
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Asiatiska manualer</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 bg-slate-950/40 p-3 rounded-xl border border-slate-800 flex items-start gap-2">
                <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Installationskrav:</strong> Enligt tillverkare (t.ex. Hager, Schneider, ABB) och försäkringsbolag måste automatsäkringar och huvudbrytare dras med rätt momentnyckel (ofta 2,0–2,8 Nm). Överdragning knäcker plasten/plinten; underdragning leder till varmgång och brand!
                </span>
              </div>
            </div>

            {/* Right: Torque Reference Guide */}
            <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Riktvärden för elektriska anslutningar</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Kontrollera alltid tillverkarens anvisning stämplad på komponenten.
                </p>
              </div>

              <div className="space-y-2.5 max-h-[360px] overflow-y-auto scrollbar-thin pr-1">
                {TYPICAL_ELECTRICAL_TORQUES.map((t, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      const match = t.nmRange.match(/(\d+(\.\d+)?)/);
                      if (match) setNmInput(match[0]);
                    }}
                    className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 cursor-pointer transition"
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-white">{t.component}</span>
                      <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        {t.nmRange}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>{t.notes}</span>
                      <span className="font-mono text-sky-400 shrink-0 ml-2">({t.lbfInRange})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Formula Theory Card */}
          <FormulaTheoryCard
            title="Matematisk formel – Vridmoment (Torque)"
            badge="Mekanisk & Elteknisk standard"
            formula="M = F \times r \quad [1 \text{ Nm} = 1 \text{ Newton} \times 1 \text{ meter}]"
            secondaryFormula="1 \text{ Nm} = 8{,}85075 \text{ lbf}\cdot\text{in} \quad \text{och} \quad 1 \text{ lbf}\cdot\text{in} = 0{,}11298 \text{ Nm}"
            substitution={`Inmatat moment: ${currentNm} Nm\nPound-force inch: ${currentNm} · 8.85075 = ${calcLbfIn.toFixed(2)} lbf·in\nPound-force foot: ${currentNm} · 0.73756 = ${calcLbfFt.toFixed(2)} lbf·ft\nKilopond-centimeter: ${currentNm} · 10.197 = ${calcKgfCm.toFixed(1)} kgf·cm`}
            variables={[
              {
                symbol: 'M (eller T)',
                name: 'Vridmoment (Torque)',
                unit: 'Nm (Newtonmeter)',
                description: 'Den vridande kraften som anbringas på en skruv, bult eller motoraxel.',
              },
              {
                symbol: 'F',
                name: 'Kraft',
                unit: 'N (Newton)',
                description: 'Kraften vinkelrät mot hävarmen.',
              },
              {
                symbol: 'r',
                name: 'Hävarmens längd',
                unit: 'm (meter)',
                description: 'Avståndet från skruvens centrum till kraftens angreppspunkt.',
              },
            ]}
            theory="Vid elektriska anslutningar skapar vridmomentet ett kontakttryck mellan ledaren och kontaktblecket. För lågt moment leder till mikroskopiska oxidskikt, ökad övergångsresistans (R_kontakt) och värmeutveckling (P = I² · R). För högt moment kan klippa av kardelerna i mångtrådig kabel eller deformera skruvgängan så att fjäderspänningen förloras när metallen expanderar vid temperaturväxlingar."
            practicalRules={[
              'Använd alltid momentmejsel eller momentnyckel vid montage av huvudcentraler och kablar ≥ 6 mm².',
              'Efterdra anslutningar efter ca 24 timmars drift vid nydragning av grov aluminiumkabel (Al kryper under tryck).',
              'Använd Pozidriv PZ2 eller PZ/FL (PlusMinus-mejsel) för automatsäkringarnas skruvar för att inte slinta.',
            ]}
          />
        </div>
      )}

      {/* --- TAB 4: TEMPERATURE & CABLE HEATING --- */}
      {activeSubTab === 'temperature' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Temperature converter */}
            <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 shadow-sm">
              <div className="border-b border-slate-800 pb-3">
                <h2 className="text-base font-semibold text-white flex items-center gap-2">
                  <Thermometer className="w-5 h-5 text-amber-400" />
                  <span>Temperaturomvandlare (°C ⇄ °F ⇄ K)</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Konvertera mellan Celsius, Fahrenheit och Kelvin för termografering och mätinstrument.
                </p>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 mb-1 flex items-center justify-between">
                  <span>Temperatur i Celsius (°C)</span>
                  <span className="text-[11px] text-amber-400 font-mono">Referens 20°C</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    value={celsiusInput}
                    onChange={(e) => setCelsiusInput(e.target.value)}
                    placeholder="t.ex. 70"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-base sm:text-lg font-mono font-bold text-white focus:outline-none transition shadow-inner"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-semibold text-slate-400 pointer-events-none">
                    °C
                  </span>
                </div>
              </div>

              {/* Temperature presets */}
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-2">
                  Typiska temperaturer i elanläggningar:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: 'Rumstemp (20°C)', val: 20 },
                    { label: 'Kabeldrift normal (40°C)', val: 40 },
                    { label: 'PVC Max drift (70°C)', val: 70 },
                    { label: 'PEX/XLPE Max (90°C)', val: 90 },
                    { label: 'Kokpunkt (100°C)', val: 100 },
                    { label: 'Kortslutning PVC (160°C)', val: 160 },
                  ].map((p) => (
                    <button
                      key={p.val}
                      onClick={() => setCelsiusInput(p.val.toString())}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono transition cursor-pointer ${
                        currentCelsius === p.val
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-slate-950/70 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Output values */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5">
                  <span className="text-[10px] text-slate-400 block">Fahrenheit (°F)</span>
                  <span className="text-xl font-bold font-mono text-sky-400">
                    {currentFahrenheit.toFixed(1)} °F
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Amerikanska värmekameror</span>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5">
                  <span className="text-[10px] text-slate-400 block">Kelvin (K)</span>
                  <span className="text-xl font-bold font-mono text-emerald-400">
                    {currentKelvin.toFixed(1)} K
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Fysikalisk absolut skala</span>
                </div>
              </div>
            </div>

            {/* Right: Conductor Resistance Change at Operating Temperature */}
            <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Flame className="w-4 h-4 text-rose-400" />
                    <span>Ledarresistans vid drifttemperatur</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Se hur kabelns resistans och spänningsfall ökar när den blir varm!
                  </p>
                </div>
                <div className="flex gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px]">
                  <button
                    onClick={() => setCableMaterial('copper')}
                    className={`px-2 py-0.5 rounded cursor-pointer transition ${
                      cableMaterial === 'copper' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
                    }`}
                  >
                    Koppar (Cu)
                  </button>
                  <button
                    onClick={() => setCableMaterial('aluminum')}
                    className={`px-2 py-0.5 rounded cursor-pointer transition ${
                      cableMaterial === 'aluminum' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
                    }`}
                  >
                    Aluminium (Al)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 mb-1 flex items-center justify-between">
                  <span>Resistans vid kallt tillstånd (20°C)</span>
                  <span className="text-[11px] text-slate-400 font-mono">R₂₀ (Ohm)</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    min="0"
                    value={baseResistanceInput}
                    onChange={(e) => setBaseResistanceInput(e.target.value)}
                    placeholder="t.ex. 1.0"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2 text-sm font-mono text-white focus:outline-none transition shadow-inner"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-semibold text-slate-400 pointer-events-none">
                    Ω
                  </span>
                </div>
              </div>

              {/* Dynamic Resistance Result Card */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-300">Resistans vid {currentCelsius}°C:</span>
                  <span className="text-xl font-bold font-mono text-rose-400">
                    {tempCorrection.rTemp.toFixed(4)} Ω
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Resistansökning mot 20°C:</span>
                  <span
                    className={`font-mono font-bold ${
                      tempCorrection.percentageIncrease >= 0 ? 'text-amber-400' : 'text-emerald-400'
                    }`}
                  >
                    {tempCorrection.percentageIncrease >= 0 ? '+' : ''}
                    {tempCorrection.percentageIncrease.toFixed(1)} %
                  </span>
                </div>

                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      currentCelsius > 70 ? 'bg-rose-500' : currentCelsius > 40 ? 'bg-amber-400' : 'bg-emerald-400'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(5, (currentCelsius / 100) * 100))}%` }}
                  />
                </div>

                <p className="text-[11px] text-slate-400 pt-1 leading-relaxed">
                  Vid {currentCelsius}°C är kabelns inre resistans{' '}
                  <strong>{tempCorrection.percentageIncrease.toFixed(1)}% högre</strong> än i kallt tillstånd. Detta medför motsvarande ökning av kabelns spänningsfall och värmeförluster!
                </p>
              </div>
            </div>
          </div>

          {/* Formula Theory Card */}
          <FormulaTheoryCard
            title="Matematisk formel & fysikalisk lag – Resistansens temperaturberoende"
            badge="Termisk kretsteori"
            formula="R(T) = R_{20} \cdot [1 + \alpha_{20} \cdot (T - 20)]"
            secondaryFormula="T_F = T_C \cdot \frac{9}{5} + 32 \quad \text{och} \quad T_K = T_C + 273{,}15"
            substitution={`Inmatade värden:\nGrundresistans R₂₀ = ${baseR} Ω vid 20°C\nDrifttemperatur T = ${currentCelsius}°C\nMaterial: ${cableMaterial === 'copper' ? 'Koppar (α = 0,00393 / °C)' : 'Aluminium (α = 0,00403 / °C)'}\nR(${currentCelsius}°C) = ${baseR} · [1 + ${cableMaterial === 'copper' ? '0.00393' : '0.00403'} · (${currentCelsius} - 20)]\nR(${currentCelsius}°C) = ${baseR} · ${(1 + (cableMaterial === 'copper' ? 0.00393 : 0.00403) * (currentCelsius - 20)).toFixed(4)} = ${tempCorrection.rTemp.toFixed(4)} Ω (+${tempCorrection.percentageIncrease.toFixed(1)} %)`}
            variables={[
              {
                symbol: 'R(T)',
                name: 'Resistans vid drifttemperatur T',
                unit: 'Ω (Ohm)',
                description: 'Den faktiska ledarresistansen när kabeln eller motorn nått sin arbetstemperatur under last.',
              },
              {
                symbol: 'R₂₀',
                name: 'Referensresistans vid 20°C',
                unit: 'Ω (Ohm)',
                description: 'Kabeltillverkarens katalogvärde uppmätt i provrum vid standardtemperaturen 20°C.',
              },
              {
                symbol: 'α₂₀ (alfa)',
                name: 'Temperaturkoefficient',
                unit: '1 / °C (per grad Celsius)',
                description: 'Koppar: 0,00393 / °C. Aluminium: 0,00403 / °C. Ökar resistansen med ca 0,4 % per grads temperaturökning.',
              },
            ]}
            theory="Elektrisk ström i metaller består av fria elektroner som rör sig genom ett kristallgitter av metallatomer. När temperaturen stiger vibrerar atomerna kraftigare kring sina jämviktslägen, vilket gör att elektronerna kolliderar oftare. Denna ökade kollisionsfrekvens upplevs makroskopiskt som högre elektrisk resistans. Därför blir en hårt belastad kabel mindre effektiv och genererar mer förlustvärme ju varmare den blir."
            practicalRules={[
              'PVC-kablar (t.ex. EKK, EXQ, FQ) har max drifttemperatur 70°C vid full belastning.',
              'PEX- och halogenfria XLPE-kablar (t.ex. FXQ, N1XV) tål upp till 90°C kontinuerlig ledartemperatur.',
              'Vid 70°C drifttemperatur är spänningsfallet i en kopparkabel nästan 20 % större än vid 20°C! Säkerställ att kabelberäkningen tar hänsyn till varmt tillstånd.',
            ]}
          />
        </div>
      )}

      {/* --- TAB 5: CONDUIT & LENGTH --- */}
      {activeSubTab === 'conduit' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Length converter */}
            <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 shadow-sm">
              <div className="border-b border-slate-800 pb-3">
                <h2 className="text-base font-semibold text-white flex items-center gap-2">
                  <Ruler className="w-5 h-5 text-amber-400" />
                  <span>Längdomvandlare (m ⇄ fot / tum)</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Omvandla kabellängder och installationsavstånd mellan metersystemet och US imperial.
                </p>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 mb-1 flex items-center justify-between">
                  <span>Kabellängd i Meter (m)</span>
                  <span className="text-[11px] text-amber-400 font-mono">SI-enhet</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    min="0"
                    value={meterInput}
                    onChange={(e) => setMeterInput(e.target.value)}
                    placeholder="t.ex. 25"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-base sm:text-lg font-mono font-bold text-white focus:outline-none transition shadow-inner"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-semibold text-slate-400 pointer-events-none">
                    m
                  </span>
                </div>
              </div>

              {/* Presets */}
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-2">
                  Standard rullängder kabel:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[10, 25, 50, 100, 250, 500].map((m) => (
                    <button
                      key={m}
                      onClick={() => setMeterInput(m.toString())}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono transition cursor-pointer ${
                        currentMeters === m
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-slate-950/70 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      {m} m
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5">
                  <span className="text-[10px] text-slate-400 block">Fot (Feet / ft)</span>
                  <span className="text-lg font-bold font-mono text-sky-400">
                    {currentFeet.toFixed(2)} ft
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">1 m ≈ 3,281 ft</span>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5">
                  <span className="text-[10px] text-slate-400 block">Tum (Inches / in)</span>
                  <span className="text-lg font-bold font-mono text-amber-400">
                    {currentInches.toFixed(1)} &quot;
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">1 m ≈ 39,37 tum</span>
                </div>
              </div>
            </div>

            {/* Right: Conduit & VP-rör Guide */}
            <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Installationsrör: VP-rör vs US EMT Conduit</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Motsvarigheter och rekommenderat max antal FK/FQ ledare per rör.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-800 max-h-[360px] overflow-y-auto scrollbar-thin">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-950 text-slate-400 sticky top-0 border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3 font-semibold">VP-rör (Ø mm)</th>
                      <th className="py-2.5 px-3 font-semibold">US Conduit</th>
                      <th className="py-2.5 px-3 font-semibold">Max FK 1,5</th>
                      <th className="py-2.5 px-3 font-semibold">Max FK 2,5</th>
                      <th className="py-2.5 px-3 font-semibold font-sans">Användning</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-slate-300">
                    {CONDUIT_TABLE.map((c) => (
                      <tr key={c.metricVpMm} className="hover:bg-slate-800/50">
                        <td className="py-2 px-3 font-bold text-white">VP {c.metricVpMm} mm</td>
                        <td className="py-2 px-3 text-sky-400">{c.imperialNominalInch}</td>
                        <td className="py-2 px-3 text-emerald-400 font-bold">{c.maxFk15Count} st</td>
                        <td className="py-2 px-3 text-amber-400 font-bold">{c.maxFk25Count} st</td>
                        <td className="py-2 px-3 font-sans text-slate-400 text-[11px]">{c.typicalUsage}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="text-[11px] text-slate-400 bg-slate-950/40 p-3 rounded-xl border border-slate-800 flex items-start gap-2">
                <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Regel för dragning:</strong> Max fyllnadsgrad i rör är ca 40–50 % av innerarean för att möjliggöra dragning runt böjar utan att skada ledarisoleringen eller generera för mycket samlad värme.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 6: SI-PREFIX (µF, nF, pF etc.) --- */}
      {activeSubTab === 'prefix' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 shadow-sm">
            <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-white flex items-center gap-2">
                  <Hash className="w-5 h-5 text-amber-400" />
                  <span>SI-Prefix & Komponentomvandlare</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Snabbt omvandla mellan piko (p), nano (n), mikro (µ) och milli (m) för kondensatorer och motstånd.
                </p>
              </div>

              <div className="flex gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => {
                    setPrefixUnitType('farad');
                    setPrefixBaseVal('100');
                  }}
                  className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                    prefixUnitType === 'farad' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
                  }`}
                >
                  Kondensator (Farad)
                </button>
                <button
                  onClick={() => {
                    setPrefixUnitType('ohm');
                    setPrefixBaseVal('4700');
                  }}
                  className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                    prefixUnitType === 'ohm' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
                  }`}
                >
                  Resistans (Ohm)
                </button>
              </div>
            </div>

            {prefixUnitType === 'farad' ? (
              /* Farad Converter */
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-medium text-slate-300 mb-1 flex items-center justify-between">
                    <span>Kapacitans i Mikrofarad (µF)</span>
                    <span className="text-[11px] text-amber-400 font-mono">Typisk märkning startkondensatorer</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={prefixBaseVal}
                      onChange={(e) => setPrefixBaseVal(e.target.value)}
                      placeholder="t.ex. 100"
                      className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-base sm:text-lg font-mono font-bold text-white focus:outline-none transition shadow-inner"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-semibold text-amber-400 pointer-events-none">
                      µF
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Nanofarad (nF)</span>
                    <span className="text-lg font-bold font-mono text-cyan-400">
                      {formatElectrNumber(numPrefixBase * 1000, 2)} nF
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-1">1 µF = 1 000 nF</span>
                  </div>

                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Pikofarad (pF)</span>
                    <span className="text-lg font-bold font-mono text-emerald-400">
                      {formatElectrNumber(numPrefixBase * 1e6, 0)} pF
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-1">1 µF = 1 000 000 pF</span>
                  </div>

                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Farad (F)</span>
                    <span className="text-lg font-bold font-mono text-amber-400">
                      {formatElectrNumber(numPrefixBase * 1e-6, 8)} F
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-1">Grundläggande SI-enhet</span>
                  </div>
                </div>
              </div>
            ) : (
              /* Ohm Converter */
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-medium text-slate-300 mb-1 flex items-center justify-between">
                    <span>Resistans i Ohm (Ω)</span>
                    <span className="text-[11px] text-amber-400 font-mono">Basvärde</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={prefixBaseVal}
                      onChange={(e) => setPrefixBaseVal(e.target.value)}
                      placeholder="t.ex. 4700"
                      className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-base sm:text-lg font-mono font-bold text-white focus:outline-none transition shadow-inner"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-semibold text-amber-400 pointer-events-none">
                      Ω
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Milliohm (mΩ)</span>
                    <span className="text-lg font-bold font-mono text-cyan-400">
                      {formatElectrNumber(numPrefixBase * 1000, 2)} mΩ
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-1">Slingimpedans & kontakt</span>
                  </div>

                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Kiloohm (kΩ)</span>
                    <span className="text-lg font-bold font-mono text-emerald-400">
                      {formatElectrNumber(numPrefixBase / 1000, 3)} kΩ
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-1">Styrkretsar & sensorer</span>
                  </div>

                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Megaohm (MΩ)</span>
                    <span className="text-lg font-bold font-mono text-amber-400">
                      {formatElectrNumber(numPrefixBase / 1e6, 6)} MΩ
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-1">Isolationsresistansprov</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
