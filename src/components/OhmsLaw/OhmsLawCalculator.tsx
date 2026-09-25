import React, { useState, useMemo } from 'react';
import {
  VoltageUnit,
  CurrentUnit,
  ResistanceUnit,
  PowerUnit,
  CalculationResult,
  SystemPhaseType,
  ThreePhaseConnection,
} from '../../types/electrical';
import {
  UNIT_MULTIPLIERS,
  solveOhmsLaw,
  solveThreePhaseOhmsLaw,
  formatElectrNumber,
  autoFormatVoltage,
  autoFormatCurrent,
  autoFormatResistance,
  autoFormatPower,
  OHMS_PRESETS,
  THREE_PHASE_PRESETS,
} from '../../utils/electricalMath';
import { OhmsWheel } from './OhmsWheel';
import { OhmsTriangle } from './OhmsTriangle';
import { FormulaTheoryCard, FormulaVariable } from '../FormulaTheoryCard';
import {
  Zap,
  RotateCcw,
  Copy,
  Check,
  BookmarkPlus,
  BookOpen,
  PieChart,
  Triangle,
  Flame,
  HelpCircle,
  Radio,
  SlidersHorizontal,
  FileText,
} from 'lucide-react';
import { CalculationPdfReportModal } from '../Report/CalculationPdfReportModal';
import { createOhmsLawReportData } from '../../utils/reportHelpers';

interface Props {
  onSaveToHistory: (res: CalculationResult & { name?: string }) => void;
}

export const OhmsLawCalculator: React.FC<Props> = ({ onSaveToHistory }) => {
  // 1-Phase vs 3-Phase system toggle
  const [phaseType, setPhaseType] = useState<SystemPhaseType>('1-phase');
  const [threePhaseConnection, setThreePhaseConnection] = useState<ThreePhaseConnection>('star');
  const [cosPhi, setCosPhi] = useState<string>('1.0');

  // Input values (raw strings for smooth typing)
  const [voltage, setVoltage] = useState<string>('230');
  const [voltageUnit, setVoltageUnit] = useState<VoltageUnit>('V');

  const [current, setCurrent] = useState<string>('10');
  const [currentUnit, setCurrentUnit] = useState<CurrentUnit>('A');

  const [resistance, setResistance] = useState<string>('');
  const [resistanceUnit, setResistanceUnit] = useState<ResistanceUnit>('Ohm');

  const [power, setPower] = useState<string>('');
  const [powerUnit, setPowerUnit] = useState<PowerUnit>('W');

  // Visualization mode
  const [visMode, setVisMode] = useState<'wheel' | 'triangle'>('wheel');
  const [copied, setCopied] = useState<boolean>(false);
  const [savedNotification, setSavedNotification] = useState<boolean>(false);
  const [customLabel, setCustomLabel] = useState<string>('');
  const [showPdfModal, setShowPdfModal] = useState<boolean>(false);

  // Active highlighted formula
  const [highlightedFormula, setHighlightedFormula] = useState<string | null>(null);

  // Compute base SI values
  const numVoltage = voltage.trim() !== '' ? parseFloat(voltage.replace(',', '.')) * UNIT_MULTIPLIERS[voltageUnit] : null;
  const numCurrent = current.trim() !== '' ? parseFloat(current.replace(',', '.')) * UNIT_MULTIPLIERS[currentUnit] : null;
  const numResistance = resistance.trim() !== '' ? parseFloat(resistance.replace(',', '.')) * UNIT_MULTIPLIERS[resistanceUnit] : null;
  const numPower = power.trim() !== '' ? parseFloat(power.replace(',', '.')) * UNIT_MULTIPLIERS[powerUnit] : null;
  const numCosPhi = Math.max(0.1, Math.min(1.0, parseFloat(cosPhi.replace(',', '.')) || 1.0));

  // Real-time calculation based on phaseType
  const result = useMemo(() => {
    if (phaseType === '3-phase') {
      return solveThreePhaseOhmsLaw(
        numVoltage,
        numCurrent,
        numResistance,
        numPower,
        threePhaseConnection,
        numCosPhi
      );
    } else {
      return solveOhmsLaw(numVoltage, numCurrent, numResistance, numPower);
    }
  }, [phaseType, threePhaseConnection, numCosPhi, numVoltage, numCurrent, numResistance, numPower]);

  // Count how many valid inputs are currently typed
  const inputCount = [voltage, current, resistance, power].filter((v) => v.trim() !== '' && !isNaN(parseFloat(v.replace(',', '.')))).length;

  const handleClear = () => {
    setVoltage('');
    setCurrent('');
    setResistance('');
    setPower('');
    setCustomLabel('');
    setHighlightedFormula(null);
  };

  const handleSwitchSystem = (targetPhase: SystemPhaseType) => {
    setPhaseType(targetPhase);
    handleClear();
    if (targetPhase === '3-phase') {
      setVoltage('400');
      setVoltageUnit('V');
      setCurrent('16');
      setCurrentUnit('A');
      setCosPhi('1.0');
      setCustomLabel('Trefas 400V CEE 16A');
    } else {
      setVoltage('230');
      setVoltageUnit('V');
      setCurrent('10');
      setCurrentUnit('A');
      setCustomLabel('Enfas 230V 10A');
    }
  };

  const handleApplyPreset = (preset: typeof OHMS_PRESETS[0] | typeof THREE_PHASE_PRESETS[0]) => {
    handleClear();
    if (preset.phaseType) {
      setPhaseType(preset.phaseType);
    }
    if (preset.connection) {
      setThreePhaseConnection(preset.connection);
    }
    if (preset.cosPhi !== undefined) {
      setCosPhi(preset.cosPhi.toString());
    }
    if (preset.knowns.voltage) {
      setVoltage(preset.knowns.voltage.value.toString());
      setVoltageUnit(preset.knowns.voltage.unit);
    }
    if (preset.knowns.current) {
      setCurrent(preset.knowns.current.value.toString());
      setCurrentUnit(preset.knowns.current.unit);
    }
    if (preset.knowns.resistance) {
      setResistance(preset.knowns.resistance.value.toString());
      setResistanceUnit(preset.knowns.resistance.unit);
    }
    if (preset.knowns.power) {
      setPower(preset.knowns.power.value.toString());
      setPowerUnit(preset.knowns.power.unit);
    }
    setCustomLabel(preset.name);
  };

  const handleCopyResult = async () => {
    if (!result) return;
    const is3P = result.phaseType === '3-phase';
    const text = is3P
      ? `--- EDA Toolbox: 3-Fas Ohms lag & Effekt ---
${customLabel ? `Märkning: ${customLabel}\n` : ''}Koppling: ${result.threePhaseConnection === 'star' ? 'Y-koppling (Stjärna)' : 'D-koppling (Delta / Triangel)'}
Effektfaktor (cos φ): ${result.cosPhi?.toFixed(2) ?? '1.00'}
Huvudspänning (U_L): ${formatElectrNumber(result.voltage)} V (${autoFormatVoltage(result.voltage).formatted})
Fasspänning (U_f): ${result.phaseVoltage ? `${formatElectrNumber(result.phaseVoltage)} V` : '–'}
Linjeström (I_L): ${formatElectrNumber(result.current)} A (${autoFormatCurrent(result.current).formatted})
Fasström (I_f): ${result.phaseCurrent ? `${formatElectrNumber(result.phaseCurrent)} A` : '–'}
Fasresistans (R_fas): ${formatElectrNumber(result.resistance)} Ω (${autoFormatResistance(result.resistance).formatted})
Total aktiv effekt (P): ${formatElectrNumber(result.power)} W (${autoFormatPower(result.power).formatted})
Skenbar effekt (S): ${result.apparentPower ? `${formatElectrNumber(result.apparentPower / 1000, 2)} kVA` : '–'}
Formler: ${result.formulasUsed.map((f) => f.formula).join(', ')}`
      : `--- EDA Toolbox: 1-Fas Ohms lag & Effekt ---
${customLabel ? `Märkning: ${customLabel}\n` : ''}Spänning (U): ${formatElectrNumber(result.voltage)} V (${autoFormatVoltage(result.voltage).formatted})
Ström (I): ${formatElectrNumber(result.current)} A (${autoFormatCurrent(result.current).formatted})
Resistans (R): ${formatElectrNumber(result.resistance)} Ω (${autoFormatResistance(result.resistance).formatted})
Effekt (P): ${formatElectrNumber(result.power)} W (${autoFormatPower(result.power).formatted})
Formler: ${result.formulasUsed.map((f) => f.formula).join(', ')}`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleSave = () => {
    if (!result) return;
    onSaveToHistory({
      ...result,
      label: customLabel.trim() || undefined,
    });
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2000);
  };

  const currentPresets = phaseType === '3-phase' ? THREE_PHASE_PRESETS : OHMS_PRESETS;

  return (
    <div className="space-y-6">
      {/* System Selector Header: 1-Fas vs 3-Fas */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Välj systemkonfiguration</h3>
            <p className="text-xs text-slate-400">
              Växla mellan enfas/likström och symmetriskt trefassystem (400V/230V)
            </p>
          </div>
        </div>

        {/* Phase Toggle Buttons */}
        <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => handleSwitchSystem('1-phase')}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition cursor-pointer ${
              phaseType === '1-phase'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            1-Fas / DC (230V)
          </button>
          <button
            onClick={() => handleSwitchSystem('3-phase')}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
              phaseType === '3-phase'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>3-Fas (400V)</span>
          </button>
        </div>
      </div>

      {/* 3-Phase Specific Settings: Y vs Delta + cos phi */}
      {phaseType === '3-phase' && (
        <div className="bg-slate-900/60 border border-amber-500/30 rounded-2xl p-4 shadow-sm animate-in fade-in duration-200">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Kopplingsart */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
                <span>Kopplingsart för belastningen</span>
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setThreePhaseConnection('star')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                    threePhaseConnection === 'star'
                      ? 'bg-amber-500 text-slate-950 border-amber-500 font-semibold'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  Y-koppling (Stjärna) – 230V över element
                </button>
                <button
                  type="button"
                  onClick={() => setThreePhaseConnection('delta')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                    threePhaseConnection === 'delta'
                      ? 'bg-amber-500 text-slate-950 border-amber-500 font-semibold'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  D-koppling (Delta / Triangel) – 400V över element
                </button>
              </div>
            </div>

            {/* Effektfaktor cos phi */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-300">
                  Effektfaktor (cos φ)
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  {cosPhi === '1.0' || cosPhi === '1' ? 'Resistiv last (1.0)' : 'Induktiv motor/last'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  inputMode="decimal"
                  value={cosPhi}
                  onChange={(e) => setCosPhi(e.target.value)}
                  className="w-24 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white text-center focus:outline-none focus:border-amber-500"
                  placeholder="1.0"
                />
                <button
                  type="button"
                  onClick={() => setCosPhi('1.0')}
                  className="text-[11px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                >
                  Värme (1.0)
                </button>
                <button
                  type="button"
                  onClick={() => setCosPhi('0.85')}
                  className="text-[11px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                >
                  Motor (0.85)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Presets Banner */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Snabbval för {phaseType === '3-phase' ? 'trefasinstallationer (400V)' : 'enfas & hushåll'}</span>
          </div>
          <span className="text-[11px] text-slate-500 hidden sm:inline">Klicka för att ladda förinställda värden</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {currentPresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleApplyPreset(preset)}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/50 hover:border-amber-500/50 transition cursor-pointer flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Inputs & Visual Wheel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: The 4 Input Fields */}
        <div className="lg:col-span-7 bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <span>
                  {phaseType === '3-phase' ? 'Ohms lag för 3-Fas System' : 'Ohms lag & Effektberäkning'}
                </span>
                {phaseType === '3-phase' && (
                  <span className="text-[11px] px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono">
                    √3 · U · I
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Fyll i <strong className="text-amber-400">två valfria värden</strong> så beräknas de övriga två med {phaseType === '3-phase' ? 'trefasformlerna' : 'enfasformlerna'}.
              </p>
            </div>
            <button
              onClick={handleClear}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
              title="Rensa fält"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Rensa</span>
            </button>
          </div>

          {/* 4 Interactive Inputs */}
          <div className="space-y-3.5">
            {/* 1. Spänning (U) */}
            <div className={`p-3 rounded-xl border transition ${
              voltage.trim() !== ''
                ? 'bg-sky-950/20 border-sky-500/40'
                : result && result.calculatedVars.includes('U')
                ? 'bg-slate-900 border-sky-500/30'
                : 'bg-slate-950/40 border-slate-800'
            }`}>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <label className="font-medium text-sky-400 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-md bg-sky-500/10 border border-sky-500/30 flex items-center justify-center font-mono font-bold text-sky-300">
                    {phaseType === '3-phase' ? 'U_L' : 'U'}
                  </span>
                  <span>{phaseType === '3-phase' ? 'Huvudspänning U_L (Mellan faser)' : 'Spänning (Volt)'}</span>
                </label>
                {result && result.calculatedVars.includes('U') && (
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300">
                    Beräknat
                  </span>
                )}
                {voltage.trim() !== '' && (
                  <span className="text-[10px] text-slate-500 font-mono">Inmatat</span>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder={result && result.calculatedVars.includes('U') ? formatElectrNumber(result.voltage) : phaseType === '3-phase' ? 't.ex. 400' : 't.ex. 230'}
                  value={voltage}
                  onChange={(e) => setVoltage(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
                <select
                  value={voltageUnit}
                  onChange={(e) => setVoltageUnit(e.target.value as VoltageUnit)}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-sky-500 cursor-pointer"
                >
                  <option value="V">V (Volt)</option>
                  <option value="kV">kV (Kilo)</option>
                  <option value="mV">mV (Milli)</option>
                  <option value="uV">µV (Mikro)</option>
                </select>
              </div>
              {phaseType === '3-phase' && (
                <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-400">
                  <span>Snabbval spänning:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setVoltage('400');
                      setVoltageUnit('V');
                    }}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 font-mono"
                  >
                    400V (Huvudspänning)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      // 230V phase-to-neutral translates to ~400V line-to-line
                      setVoltage('400');
                      setVoltageUnit('V');
                    }}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono"
                  >
                    230/400V Nät
                  </button>
                </div>
              )}
            </div>

            {/* 2. Ström (I) */}
            <div className={`p-3 rounded-xl border transition ${
              current.trim() !== ''
                ? 'bg-emerald-950/20 border-emerald-500/40'
                : result && result.calculatedVars.includes('I')
                ? 'bg-slate-900 border-emerald-500/30'
                : 'bg-slate-950/40 border-slate-800'
            }`}>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <label className="font-medium text-emerald-400 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-md bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-mono font-bold text-emerald-300">
                    {phaseType === '3-phase' ? 'I_L' : 'I'}
                  </span>
                  <span>{phaseType === '3-phase' ? 'Linjeström I_L (I ledare L1, L2, L3)' : 'Ström (Ampere)'}</span>
                </label>
                {result && result.calculatedVars.includes('I') && (
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    Beräknat
                  </span>
                )}
                {current.trim() !== '' && (
                  <span className="text-[10px] text-slate-500 font-mono">Inmatat</span>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder={result && result.calculatedVars.includes('I') ? formatElectrNumber(result.current) : phaseType === '3-phase' ? 't.ex. 16' : 't.ex. 10'}
                  value={current}
                  onChange={(e) => setCurrent(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
                <select
                  value={currentUnit}
                  onChange={(e) => setCurrentUnit(e.target.value as CurrentUnit)}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="A">A (Ampere)</option>
                  <option value="mA">mA (Milli)</option>
                  <option value="uA">µA (Mikro)</option>
                  <option value="kA">kA (Kilo)</option>
                </select>
              </div>
            </div>

            {/* 3. Resistans (R) */}
            <div className={`p-3 rounded-xl border transition ${
              resistance.trim() !== ''
                ? 'bg-amber-950/20 border-amber-500/40'
                : result && result.calculatedVars.includes('R')
                ? 'bg-slate-900 border-amber-500/30'
                : 'bg-slate-950/40 border-slate-800'
            }`}>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <label className="font-medium text-amber-400 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-md bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-mono font-bold text-amber-300">
                    {phaseType === '3-phase' ? 'R_fas' : 'R'}
                  </span>
                  <span>{phaseType === '3-phase' ? 'Fasresistans R_fas (Resistans per element)' : 'Resistans (Ohm)'}</span>
                </label>
                {result && result.calculatedVars.includes('R') && (
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                    Beräknat
                  </span>
                )}
                {resistance.trim() !== '' && (
                  <span className="text-[10px] text-slate-500 font-mono">Inmatat</span>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder={result && result.calculatedVars.includes('R') ? formatElectrNumber(result.resistance) : 't.ex. 14.4'}
                  value={resistance}
                  onChange={(e) => setResistance(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
                <select
                  value={resistanceUnit}
                  onChange={(e) => setResistanceUnit(e.target.value as ResistanceUnit)}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="Ohm">Ω (Ohm)</option>
                  <option value="kOhm">kΩ (Kilo)</option>
                  <option value="MOhm">MΩ (Mega)</option>
                  <option value="mOhm">mΩ (Milli)</option>
                </select>
              </div>
            </div>

            {/* 4. Effekt (P) */}
            <div className={`p-3 rounded-xl border transition ${
              power.trim() !== ''
                ? 'bg-rose-950/20 border-rose-500/40'
                : result && result.calculatedVars.includes('P')
                ? 'bg-slate-900 border-rose-500/30'
                : 'bg-slate-950/40 border-slate-800'
            }`}>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <label className="font-medium text-rose-400 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-md bg-rose-500/10 border border-rose-500/30 flex items-center justify-center font-mono font-bold text-rose-300">
                    {phaseType === '3-phase' ? 'P_tot' : 'P'}
                  </span>
                  <span>{phaseType === '3-phase' ? 'Total Aktiv Trefaseffekt (Watt)' : 'Effekt (Watt)'}</span>
                </label>
                {result && result.calculatedVars.includes('P') && (
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">
                    Beräknat
                  </span>
                )}
                {power.trim() !== '' && (
                  <span className="text-[10px] text-slate-500 font-mono">Inmatat</span>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder={result && result.calculatedVars.includes('P') ? formatElectrNumber(result.power) : phaseType === '3-phase' ? 't.ex. 11000' : 't.ex. 2300'}
                  value={power}
                  onChange={(e) => setPower(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                />
                <select
                  value={powerUnit}
                  onChange={(e) => setPowerUnit(e.target.value as PowerUnit)}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-rose-500 cursor-pointer"
                >
                  <option value="W">W (Watt)</option>
                  <option value="kW">kW (Kilo)</option>
                  <option value="mW">mW (Milli)</option>
                  <option value="MW">MW (Mega)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Prompt if fewer than 2 inputs */}
          {inputCount < 2 && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-2.5 text-xs text-amber-300">
              <HelpCircle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>
                Fyll i ytterligare {2 - inputCount} värde{inputCount === 0 ? 'n' : ''} för att beräkna resterande storheter.
              </span>
            </div>
          )}

          {/* Quick Note / Project label */}
          <div className="pt-2">
            <label className="block text-[11px] text-slate-400 mb-1">
              Valfri märkning för sparad beräkning (t.ex. "Bastu 9kW", "Fläktmotor M1", "Elbilsladdare 11kW")
            </label>
            <input
              type="text"
              value={customLabel}
              onChange={(e) => setCustomLabel(e.target.value)}
              placeholder="Märkning för sparad beräkning..."
              className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-slate-600"
            />
          </div>
        </div>

        {/* Right Column: Interactive Wheel / Triangle */}
        <div className="lg:col-span-5 bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col items-center">
          {/* View switcher tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-950/80 border border-slate-800 rounded-xl mb-4 w-full max-w-xs justify-center">
            <button
              onClick={() => setVisMode('wheel')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium transition cursor-pointer ${
                visMode === 'wheel'
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <PieChart className="w-3.5 h-3.5" />
              <span>Formelhjul</span>
            </button>
            <button
              onClick={() => setVisMode('triangle')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium transition cursor-pointer ${
                visMode === 'triangle'
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Triangle className="w-3.5 h-3.5" />
              <span>Triangel</span>
            </button>
          </div>

          {visMode === 'wheel' ? (
            <OhmsWheel
              phaseType={phaseType}
              connection={threePhaseConnection}
              activeVariable={result ? result.calculatedVars[0] : null}
              highlightFormula={highlightedFormula || (result?.formulasUsed[0]?.formula ?? null)}
              onSelectSlice={(slice) => {
                setHighlightedFormula(slice.formula);
              }}
            />
          ) : (
            <OhmsTriangle
              phaseType={phaseType}
              connection={threePhaseConnection}
              activeVariable={result ? result.calculatedVars[0] : null}
            />
          )}
        </div>
      </div>

      {/* Results Summary Card (When Calculated) */}
      {result && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="text-base font-semibold text-white">
                  Beräknat resultat {customLabel && `– ${customLabel}`}
                </h3>
                {result.phaseType === '3-phase' && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 font-semibold">
                    3-Fas ({result.threePhaseConnection === 'star' ? 'Y-Stjärna' : 'D-Delta'})
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Baserat på {result.givenVars.join(' och ')} enligt {result.phaseType === '3-phase' ? 'trefas Ohms lag' : 'Ohms lag & Effektlagen'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowPdfModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold transition cursor-pointer"
                title="Generera professionell A4 PDF-rapport med källor och teknisk analys"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>PDF-rapport (A4)</span>
              </button>

              <button
                onClick={handleCopyResult}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium transition cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Kopierat!' : 'Kopiera'}</span>
              </button>

              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold transition cursor-pointer shadow-sm shadow-amber-500/20"
              >
                {savedNotification ? <Check className="w-3.5 h-3.5" /> : <BookmarkPlus className="w-3.5 h-3.5" />}
                <span>{savedNotification ? 'Sparad!' : 'Spara beräkning'}</span>
              </button>
            </div>
          </div>

          {/* 4 Primary Big Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Spänning */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 flex flex-col justify-between">
              <span className="text-[11px] font-medium text-sky-400">
                {result.phaseType === '3-phase' ? 'Huvudspänning (U_L)' : 'Spänning (U)'}
              </span>
              <div className="my-1">
                <span className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums">
                  {formatElectrNumber(result.voltage)}
                </span>
                <span className="text-xs font-mono text-sky-400 ml-1">V</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                {result.phaseType === '3-phase' && result.phaseVoltage
                  ? `Fasspänning U_f: ${formatElectrNumber(result.phaseVoltage, 1)} V`
                  : autoFormatVoltage(result.voltage).formatted}
              </span>
            </div>

            {/* Ström */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 flex flex-col justify-between">
              <span className="text-[11px] font-medium text-emerald-400">
                {result.phaseType === '3-phase' ? 'Linjeström (I_L)' : 'Ström (I)'}
              </span>
              <div className="my-1">
                <span className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums">
                  {formatElectrNumber(result.current)}
                </span>
                <span className="text-xs font-mono text-emerald-400 ml-1">A</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                {result.phaseType === '3-phase' && result.phaseCurrent
                  ? `Fasström I_f: ${formatElectrNumber(result.phaseCurrent, 2)} A`
                  : autoFormatCurrent(result.current).formatted}
              </span>
            </div>

            {/* Resistans */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 flex flex-col justify-between">
              <span className="text-[11px] font-medium text-amber-400">
                {result.phaseType === '3-phase' ? 'Fasresistans (R_fas)' : 'Resistans (R)'}
              </span>
              <div className="my-1">
                <span className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums">
                  {formatElectrNumber(result.resistance)}
                </span>
                <span className="text-xs font-mono text-amber-400 ml-1">Ω</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                {result.phaseType === '3-phase'
                  ? `Per lastgren (${result.threePhaseConnection === 'star' ? 'Y' : 'Δ'})`
                  : autoFormatResistance(result.resistance).formatted}
              </span>
            </div>

            {/* Effekt */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 flex flex-col justify-between">
              <span className="text-[11px] font-medium text-rose-400">
                {result.phaseType === '3-phase' ? 'Total Aktiv Effekt (P)' : 'Effekt (P)'}
              </span>
              <div className="my-1">
                <span className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums">
                  {formatElectrNumber(result.power)}
                </span>
                <span className="text-xs font-mono text-rose-400 ml-1">W</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                {autoFormatPower(result.power).formatted}
              </span>
            </div>
          </div>

          {/* If 3-Phase: Show Secondary Power Metrics (S, Q, cos phi) */}
          {result.phaseType === '3-phase' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 text-xs">
                <span className="text-slate-400 block text-[10px]">Skenbar Effekt (S = √3 · U_L · I_L)</span>
                <span className="text-sky-300 font-mono font-bold text-sm">
                  {result.apparentPower ? `${formatElectrNumber(result.apparentPower / 1000, 2)} kVA` : '–'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 text-xs">
                <span className="text-slate-400 block text-[10px]">Reaktiv Effekt (Q = √3 · U_L · I_L · sin φ)</span>
                <span className="text-amber-300 font-mono font-bold text-sm">
                  {result.reactivePower ? `${formatElectrNumber(result.reactivePower / 1000, 2)} kVAr` : '–'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 text-xs">
                <span className="text-slate-400 block text-[10px]">Effektfaktor & Fasvinkel</span>
                <span className="text-emerald-300 font-mono font-bold text-sm">
                  cos φ = {result.cosPhi?.toFixed(2) ?? '1.00'}
                  {result.cosPhi && result.cosPhi < 1
                    ? ` (φ = ${formatElectrNumber((Math.acos(result.cosPhi) * 180) / Math.PI, 1)}°)`
                    : ' (Ren resistans)'}
                </span>
              </div>
            </div>
          )}

          {/* Thermal / Safety Note if high power */}
          {result.power > 1000 && (
            <div className="bg-slate-950/40 border border-orange-500/20 rounded-xl p-3 flex items-start gap-2.5 text-xs text-orange-300">
              <Flame className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold text-orange-200">
                  {result.phaseType === '3-phase' ? 'Trefasbelastning: ' : 'Värmeutveckling: '}
                </strong>
                <span>
                  Med {autoFormatPower(result.power).formatted} utvecklas kontinuerlig energi.
                  {result.phaseType === '3-phase'
                    ? ` Vid linjeström ${formatElectrNumber(result.current, 1)} A krävs CEE-don och säkring på minst ${
                        result.current > 32 ? '63A' : result.current > 25 ? '32A' : result.current > 16 ? '20A/25A' : '16A'
                      } samt minst ${result.current > 20 ? '4 mm²' : result.current > 13 ? '2.5 mm²' : '1.5 mm²'} kabel.`
                    : ` Säkerställ att säkring och kabel (minst ${result.current > 10 ? '2.5 mm²' : '1.5 mm²'}) tål belastningen.`}
                </span>
              </div>
            </div>
          )}

          {/* Detailed step-by-step breakdown */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wide">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {result.phaseType === '3-phase' ? 'Trefasuträkning steg-för-steg (√3 = 1,732)' : 'Uträkning steg-för-steg'}
              </span>
            </div>
            <div className="space-y-1.5 pt-1">
              {result.steps.map((step, idx) => (
                <div key={idx} className="text-xs font-mono text-slate-300 bg-slate-900/60 px-3 py-2 rounded-lg border border-slate-800">
                  {step}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Dedicated Educational Formula & Theory Section */}
      <FormulaTheoryCard
        title={phaseType === '3-phase' ? '3-Fas Ohms lag & Effektformler' : 'Ohms lag & Joules Effektlag'}
        subtitle={
          phaseType === '3-phase'
            ? `Matematisk härledning för trefassystem i ${threePhaseConnection === 'star' ? 'stjärnkoppling (Y)' : 'deltakoppling (Δ)'}`
            : 'Matematiska formler, samband och fysikalisk bakgrund för likström och enfas växelström'
        }
        primaryFormula={
          phaseType === '3-phase'
            ? threePhaseConnection === 'star'
              ? 'P = √3 · U_L · I_L · cos φ   |   U_f = U_L / √3   |   R_fas = U_L / (√3 · I_L)'
              : 'P = √3 · U_L · I_L · cos φ   |   U_f = U_L   |   R_fas = √3 · U_L / I_L'
            : 'U = I · R     |     P = U · I = I² · R = U² / R'
        }
        secondaryFormulas={
          phaseType === '3-phase'
            ? [
                'I_L = P / (√3 · U_L · cos φ)',
                threePhaseConnection === 'star' ? 'P_Y = U_L² / R_fas' : 'P_Δ = 3 · U_L² / R_fas',
                'S = √3 · U_L · I_L (kVA)',
                'Q = √3 · U_L · I_L · sin φ (kVAr)',
              ]
            : [
                'I = U / R',
                'R = U / I',
                'I = P / U',
                'R = U² / P',
                'U = √(P · R)',
                'I = √(P / R)',
              ]
        }
        activeSubstitution={
          result
            ? result.formulasUsed
                .map((f) => `${f.formula}: ${f.explanation}`)
                .join('   •   ')
            : undefined
        }
        variables={
          phaseType === '3-phase'
            ? [
                {
                  symbol: 'U_L',
                  name: 'Huvudspänning',
                  unit: 'V (Volt)',
                  description: 'Spänning mellan två fasledare (L1-L2, L2-L3, L3-L1). Svensk standard är 400 V.',
                  currentValue: result ? `${formatElectrNumber(result.voltage)} V` : voltage ? `${voltage} ${voltageUnit}` : undefined,
                },
                {
                  symbol: 'U_f',
                  name: 'Fasspänning',
                  unit: 'V (Volt)',
                  description: threePhaseConnection === 'star' ? 'Spänning över element i stjärna: U_f = U_L / √3 (230 V vid 400 V nät).' : 'Spänning över element i delta: U_f = U_L (400 V).',
                  currentValue: result?.phaseVoltage ? `${formatElectrNumber(result.phaseVoltage, 1)} V` : undefined,
                },
                {
                  symbol: 'I_L',
                  name: 'Linjeström',
                  unit: 'A (Ampere)',
                  description: 'Strömmen som flyter i matarledarna L1, L2 och L3 från centralen.',
                  currentValue: result ? `${formatElectrNumber(result.current)} A` : current ? `${current} ${currentUnit}` : undefined,
                },
                {
                  symbol: 'R_fas',
                  name: 'Fasresistans',
                  unit: 'Ω (Ohm)',
                  description: 'Resistansen i vardera av de tre symmetriska lastelementen (värmeslinga, motorlindning).',
                  currentValue: result ? `${formatElectrNumber(result.resistance)} Ω` : resistance ? `${resistance} ${resistanceUnit}` : undefined,
                },
                {
                  symbol: 'P',
                  name: 'Total Aktiv Effekt',
                  unit: 'W (Watt)',
                  description: 'Verklig energiomsättning per sekund: P = √3 · U_L · I_L · cos φ.',
                  currentValue: result ? `${formatElectrNumber(result.power)} W` : power ? `${power} ${powerUnit}` : undefined,
                },
                {
                  symbol: 'cos φ',
                  name: 'Effektfaktor',
                  unit: 'Dimensionslös (0–1)',
                  description: 'Fasvinkelskillnad mellan spänning och ström (1.0 vid rent resistiv värme, ~0.80–0.88 för motorer).',
                  currentValue: cosPhi,
                },
              ]
            : [
                {
                  symbol: 'U',
                  name: 'Elektrisk Spänning',
                  unit: 'V (Volt)',
                  description: 'Potentialskillnaden i kretsen som driver elektronerna framåt (1 V = 1 J/C).',
                  currentValue: result ? `${formatElectrNumber(result.voltage)} V` : voltage ? `${voltage} ${voltageUnit}` : undefined,
                },
                {
                  symbol: 'I',
                  name: 'Elektrisk Ström',
                  unit: 'A (Ampere)',
                  description: 'Mängden elektrisk laddning som passerar en ledare per sekund (1 A = 1 C/s).',
                  currentValue: result ? `${formatElectrNumber(result.current)} A` : current ? `${current} ${currentUnit}` : undefined,
                },
                {
                  symbol: 'R',
                  name: 'Elektrisk Resistans',
                  unit: 'Ω (Ohm)',
                  description: 'Ledarens motstånd mot elektronflödet (1 Ω = 1 V / 1 A).',
                  currentValue: result ? `${formatElectrNumber(result.resistance)} Ω` : resistance ? `${resistance} ${resistanceUnit}` : undefined,
                },
                {
                  symbol: 'P',
                  name: 'Elektrisk Effekt',
                  unit: 'W (Watt)',
                  description: 'Hastigheten med vilken elektrisk energi omsätts till värme, ljus eller arbete (1 W = 1 J/s).',
                  currentValue: result ? `${formatElectrNumber(result.power)} W` : power ? `${power} ${powerUnit}` : undefined,
                },
              ]
        }
        theoryNotes={
          phaseType === '3-phase'
            ? [
                'Faktorn √3 ≈ 1,73205 uppstår ur trigonometrin i ett symmetriskt trefassystem där de tre sinusformade spänningsvågorna är förskjutna med 120° (2π/3 radianer). Huvudspänningen mellan två fasledare är vektordifferensen mellan deras fasspänningar: 2 · sin(60°) = √3.',
                threePhaseConnection === 'star'
                  ? 'I Stjärnkoppling (Y) binds elementens ena ände samman i en neutralpunkt (N). Varje element matas med fasspänningen U_f = 400 / √3 = 230 V. Linjeströmmen är identisk med fasströmmen genom elementet (I_L = I_f).'
                  : 'I Deltakoppling (Δ) kopplas varje element direkt mellan två fasledare och utsätts för full huvudspänning U_L = 400 V. Fasströmmen genom elementet är I_f = U_L / R, och linjeströmmen i matarkabeln blir √3 gånger större (I_L = √3 · I_f).',
                'Total aktiv effekt är summan av de tre fasernas effekter: P_tot = 3 · P_fas = 3 · U_f · I_f · cos φ = √3 · U_L · I_L · cos φ.',
              ]
            : [
                'Ohms lag (uppkallad efter den tyske fysikern Georg Simon Ohm, 1827) fastställer att strömmen genom en resistiv ledare är direkt proportionell mot spänningen över den och omvänt proportionell mot resistansen (I = U / R).',
                'Joules effektlag beskriver att effektförlusten i en resistans beror på spänningen och strömmen (P = U · I). Genom att substituera in Ohms lag (U = I · R) kan effekten beräknas utan spänning (P = I² · R) eller utan ström (P = U² / R).',
                'Vid konstant spänning innebär en halverad resistans att strömmen fördubblas och effekten fyrdubblas (P ∝ 1/R). Vid konstant ström är effekten istället direkt proportionell mot resistansen (P ∝ R).',
              ]
        }
        practicalRule={
          phaseType === '3-phase'
            ? 'En trefaslast kopplad i Delta ger exakt 3 gånger så hög effekt och drar 3 gånger så mycket ström som samma last kopplad i Stjärna (P_Δ = 3 · P_Y). Därför används Y/D-start för att begränsa startströmmar på stora asynkronmotorer.'
            : 'För 230V vägguttag: En 10A säkring medger max 2 300 W (230 V · 10 A). En 16A säkring medger max 3 680 W. Överskrids detta löser dvärgbrytarens termiska utlösare ut efter en viss tid.'
        }
      />

      {/* PDF Report Modal */}
      {showPdfModal && result && (
        <CalculationPdfReportModal
          isOpen={showPdfModal}
          onClose={() => setShowPdfModal(false)}
          reportData={createOhmsLawReportData({
            result,
            label: customLabel,
          })}
        />
      )}
    </div>
  );
};
