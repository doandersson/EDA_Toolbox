import React from 'react';
import { Cable, Zap, ArrowRight, Gauge, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { formatElectrNumber } from '../../utils/electricalMath';

interface Props {
  voltage: number;
  endVoltage: number;
  current: number;
  length: number;
  area: number;
  material: 'cu' | 'al';
  deltaU: number;
  dropPercent: number;
  maxDropPct: number;
  isWithinLimit: boolean;
  phaseType: '1-phase' | '3-phase';
  rCable: number;
  powerLoss: number;
}

export const VoltageDropDiagram: React.FC<Props> = ({
  voltage,
  endVoltage,
  current,
  length,
  area,
  material,
  deltaU,
  dropPercent,
  maxDropPct,
  isWithinLimit,
  phaseType,
  rCable,
  powerLoss,
}) => {
  const is1P = phaseType === '1-phase';

  // Tolerance meter percentage for cursor position (clamped 0 to 6%)
  const gaugeMax = 6.0;
  const cursorClampedPct = Math.min(100, Math.max(0, (dropPercent / gaugeMax) * 100));

  // Determine status color
  const statusColor = dropPercent <= 3.0
    ? 'text-emerald-400'
    : dropPercent <= maxDropPct
    ? 'text-amber-400'
    : 'text-rose-400';

  const statusBg = dropPercent <= 3.0
    ? 'bg-emerald-500/10 border-emerald-500/30'
    : dropPercent <= maxDropPct
    ? 'bg-amber-500/10 border-amber-500/30'
    : 'bg-rose-500/10 border-rose-500/30';

  return (
    <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Kretsschema & Spänningsgradient
            </h4>
            <p className="text-[11px] text-slate-400">
              Visuell representation av spänningsfall längs kabelsträckan från central till last.
            </p>
          </div>
        </div>

        <div className={`px-2.5 py-1 rounded-lg border text-xs font-mono font-semibold flex items-center gap-1.5 ${statusBg} ${statusColor}`}>
          {dropPercent <= 3.0 ? (
            <CheckCircle2 className="w-3.5 h-3.5" />
          ) : dropPercent <= maxDropPct ? (
            <AlertTriangle className="w-3.5 h-3.5" />
          ) : (
            <ShieldAlert className="w-3.5 h-3.5" />
          )}
          <span>ΔU = {formatElectrNumber(dropPercent, 2)}% ({isWithinLimit ? 'Godkänd' : 'Underkänd'})</span>
        </div>
      </div>

      {/* Modern Circuit Schematic (SVG Graphic) */}
      <div className="w-full overflow-x-auto py-1">
        <div className="min-w-[620px]">
          <svg viewBox="0 0 760 140" className="w-full h-auto select-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="cableGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="70%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor={isWithinLimit ? '#10b981' : '#f43f5e'} />
              </linearGradient>

              <marker id="arrowHead" markerWidth="6" markerHeight="6" refX="5" refY="3" orientation="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#94a3b8" />
              </marker>

              <pattern id="gridDots" width="16" height="16" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="#334155" opacity="0.4" />
              </pattern>
            </defs>

            {/* Background grid */}
            <rect x="0" y="0" width="760" height="140" rx="12" fill="#090d16" />
            <rect x="0" y="0" width="760" height="140" rx="12" fill="url(#gridDots)" />
            <rect x="0" y="0" width="760" height="140" rx="12" fill="none" stroke="#1e293b" strokeWidth="1" />

            {/* 1. SOURCE NODE (Huvudcentral) */}
            <g transform="translate(20, 20)">
              <rect x="0" y="0" width="130" height="96" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
              <rect x="0" y="0" width="130" height="22" rx="8" fill="#1e293b" />
              <rect x="0" y="16" width="130" height="6" fill="#1e293b" />

              <text x="65" y="15" textAnchor="middle" fill="#94a3b8" fontSize="9.5" fontWeight="bold" letterSpacing="0.5">
                MATNING / CENTRAL
              </text>

              {/* Voltage & Phase badge */}
              <text x="65" y="44" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="bold" fontFamily="monospace">
                {voltage} V
              </text>
              <text x="65" y="60" textAnchor="middle" fill="#38bdf8" fontSize="9" fontWeight="600">
                {is1P ? '1-Fas (L + N)' : '3-Fas (L1,L2,L3)'}
              </text>

              {/* Terminal dots */}
              <circle cx="130" cy="40" r="4" fill="#38bdf8" stroke="#0f172a" strokeWidth="1.5" />
              <circle cx="130" cy="65" r="4" fill="#94a3b8" stroke="#0f172a" strokeWidth="1.5" />
              <text x="65" y="84" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">
                U_nominell = {voltage} V
              </text>
            </g>

            {/* 2. CABLE RUN (Center Line) */}
            <g transform="translate(150, 20)">
              {/* Cable Lines */}
              <line x1="0" y1="40" x2="430" y2="40" stroke="url(#cableGradient)" strokeWidth="3" strokeLinecap="round" />
              <line x1="0" y1="65" x2="430" y2="65" stroke="#475569" strokeWidth="2" strokeDasharray="5,4" />

              {/* Current flow arrows */}
              <path d="M 60,40 L 70,40" stroke="#ffffff" strokeWidth="2" markerEnd="url(#arrowHead)" opacity="0.8" />
              <path d="M 210,40 L 220,40" stroke="#ffffff" strokeWidth="2" markerEnd="url(#arrowHead)" opacity="0.8" />
              <path d="M 360,40 L 370,40" stroke="#ffffff" strokeWidth="2" markerEnd="url(#arrowHead)" opacity="0.8" />

              {/* Center Cable Specs Tag Box */}
              <rect x="135" y="10" width="160" height="42" rx="6" fill="#0f172a" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.5" />
              <text x="215" y="24" textAnchor="middle" fill="#f59e0b" fontSize="9.5" fontWeight="bold">
                KABEL: {length} m • {area} mm² ({material === 'cu' ? 'Cu' : 'Al'})
              </text>
              <text x="215" y="42" textAnchor="middle" fill="#cbd5e1" fontSize="9" fontFamily="monospace">
                I = {current} A  |  R = {formatElectrNumber(rCable, 3)} Ω
              </text>

              {/* Voltage Drop Callout under the cable */}
              <g transform="translate(145, 68)">
                <rect x="0" y="0" width="140" height="26" rx="5" fill={isWithinLimit ? '#064e3b' : '#881337'} stroke={isWithinLimit ? '#10b981' : '#f43f5e'} strokeWidth="1" />
                <text x="70" y="12" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                  ΔU = -{formatElectrNumber(deltaU, 2)} V (-{formatElectrNumber(dropPercent, 2)}%)
                </text>
                <text x="70" y="22" textAnchor="middle" fill={isWithinLimit ? '#a7f3d0' : '#fecdd3'} fontSize="7.5" fontFamily="monospace">
                  P_förlust = {formatElectrNumber(powerLoss, 1)} W
                </text>
              </g>
            </g>

            {/* 3. LOAD / RECEIVER NODE (Förbrukare) */}
            <g transform="translate(580, 20)">
              <rect x="0" y="0" width="150" height="96" rx="8" fill="#0f172a" stroke={isWithinLimit ? '#10b981' : '#f43f5e'} strokeWidth="1.5" />
              <rect x="0" y="0" width="150" height="22" rx="8" fill="#1e293b" />
              <rect x="0" y="16" width="150" height="6" fill="#1e293b" />

              <text x="75" y="15" textAnchor="middle" fill="#94a3b8" fontSize="9.5" fontWeight="bold" letterSpacing="0.5">
                FÖRBRUKARE / LAST
              </text>

              {/* Terminal dots */}
              <circle cx="0" cy="40" r="4" fill="#38bdf8" stroke="#0f172a" strokeWidth="1.5" />
              <circle cx="0" cy="65" r="4" fill="#94a3b8" stroke="#0f172a" strokeWidth="1.5" />

              {/* End Voltage */}
              <text x="75" y="44" textAnchor="middle" fill={isWithinLimit ? '#34d399' : '#fb7185'} fontSize="16" fontWeight="bold" fontFamily="monospace">
                {formatElectrNumber(endVoltage, 1)} V
              </text>
              <text x="75" y="60" textAnchor="middle" fill="#94a3b8" fontSize="8.5">
                Spänning vid plint
              </text>

              <text x="75" y="84" textAnchor="middle" fill={isWithinLimit ? '#10b981' : '#f43f5e'} fontSize="8" fontWeight="bold" letterSpacing="0.3">
                {isWithinLimit ? '✓ NOMINELL DRIFT' : '⚠ RISK FÖR FLIMMER/FEL'}
              </text>
            </g>
          </svg>
        </div>
      </div>

      {/* Modern Tolerance Gauge Bar */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold text-slate-300 flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-amber-400" />
            <span>Toleransmätare enligt SS 436 40 00 & SEK HB 444</span>
          </span>
          <span className="font-mono text-slate-400">
            Aktuell: <strong className={statusColor}>{formatElectrNumber(dropPercent, 2)}%</strong> (Gräns: {maxDropPct}%)
          </span>
        </div>

        {/* Multi-segment meter */}
        <div className="relative pt-6 pb-2">
          {/* Track Bar with 3 Zones */}
          <div className="h-3 w-full rounded-full bg-slate-900 border border-slate-800 flex overflow-hidden shadow-inner">
            {/* Zone 1: 0 to 3% (50% of 6% scale) */}
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all"
              style={{ width: '50%' }}
              title="0–3%: Rekommenderad nivå (belysning & allmänt)"
            />
            {/* Zone 2: 3 to 4% (16.67% of 6% scale) */}
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all"
              style={{ width: '16.67%' }}
              title="3–4%: Standardgräns SS 436 40 00"
            />
            {/* Zone 3: > 4% (33.33% of 6% scale) */}
            <div
              className="h-full bg-gradient-to-r from-rose-500 to-rose-600 transition-all"
              style={{ width: '33.33%' }}
              title="> 4%: Överskrider gräns (ej rekommenderat)"
            />
          </div>

          {/* Scale Threshold Markers */}
          <div className="absolute top-9 left-0 right-0 flex justify-between text-[10px] text-slate-500 font-mono">
            <span>0%</span>
            <span className="text-emerald-400 font-semibold" style={{ marginLeft: '45%' }}>3% (Rek.)</span>
            <span className="text-amber-400 font-semibold" style={{ marginLeft: '12%' }}>4% (Max SS)</span>
            <span>6%+</span>
          </div>

          {/* Dynamic Needle Indicator */}
          <div
            className="absolute top-0 -translate-x-1/2 flex flex-col items-center pointer-events-none transition-all duration-300"
            style={{ left: `${cursorClampedPct}%` }}
          >
            <div className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold text-slate-950 shadow-md ${
              dropPercent <= 3.0 ? 'bg-emerald-400' : dropPercent <= maxDropPct ? 'bg-amber-400' : 'bg-rose-400'
            }`}>
              {formatElectrNumber(dropPercent, 2)}%
            </div>
            <div className={`w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] ${
              dropPercent <= 3.0 ? 'border-t-emerald-400' : dropPercent <= maxDropPct ? 'border-t-amber-400' : 'border-t-rose-400'
            }`} />
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-5 text-[11px]">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-emerald-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
            <span><strong>≤ 3.0%:</strong> Optimal dimensionering</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-950/20 border border-amber-500/20 text-amber-300">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
            <span><strong>3.0 – 4.0%:</strong> Tillåtet (SS 436 40 00)</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-rose-950/20 border border-rose-500/20 text-rose-300">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400 shrink-0" />
            <span><strong>&gt; 4.0%:</strong> För klent tvärsnitt</span>
          </div>
        </div>
      </div>
    </div>
  );
};
