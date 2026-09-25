import React from 'react';
import { formatElectrNumber } from '../../utils/electricalMath';
import { ArrowLeftRight, Check, Zap } from 'lucide-react';

interface Props {
  voltage: number;
  resistance: number;
  uStarElem: number;
  iStarLine: number;
  pStarTotal: number;
  uDeltaElem: number;
  iDeltaLine: number;
  pDeltaTotal: number;
}

export const StarDeltaDiagram: React.FC<Props> = ({
  voltage,
  resistance,
  uStarElem,
  iStarLine,
  pStarTotal,
  uDeltaElem,
  iDeltaLine,
  pDeltaTotal,
}) => {
  return (
    <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <ArrowLeftRight className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Kopplingsschema: Stjärna (Y) vs Delta (Δ)
            </h4>
            <p className="text-[11px] text-slate-400">
              Visuell jämförelse av spänningsfördelning och strömmar vid samma elementresistans ({resistance} Ω).
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
          EFFEKTRATIO P_Δ / P_Y = 3.00
        </span>
      </div>

      {/* SVG Schematics for Y and Delta Side-by-Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. STAR (Y) SCHEMATIC */}
        <div className="p-3 rounded-xl bg-slate-900 border border-sky-500/30 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-sky-400 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded bg-sky-500/20 text-sky-300 flex items-center justify-center text-[10px] font-mono">Y</span>
              <span>Stjärnkoppling (Y)</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400">U_elem = 230 V (U_L / √3)</span>
          </div>

          <svg viewBox="0 0 320 180" className="w-full h-auto select-none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="320" height="180" rx="8" fill="#090d16" />
            <rect x="0" y="0" width="320" height="180" rx="8" fill="none" stroke="#1e293b" strokeWidth="1" />

            {/* Center Neutral Star Point */}
            <circle cx="160" cy="95" r="5" fill="#38bdf8" />
            <text x="160" y="112" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="bold">N (Stjärnpunkt)</text>

            {/* Top Leg: L1 (Brown) */}
            <line x1="160" y1="20" x2="160" y2="50" stroke="#8B4513" strokeWidth="2.5" />
            <rect x="148" y="50" width="24" height="28" rx="3" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="160" y="68" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="monospace">R</text>
            <line x1="160" y1="78" x2="160" y2="95" stroke="#38bdf8" strokeWidth="2" />
            <text x="160" y="14" textAnchor="middle" fill="#8B4513" fontSize="10" fontWeight="bold">L1</text>

            {/* Bottom-Left Leg: L2 (Black) */}
            <line x1="60" y1="150" x2="90" y2="132" stroke="#64748b" strokeWidth="2.5" />
            <g transform="translate(90, 132) rotate(-30)">
              <rect x="0" y="-12" width="28" height="24" rx="3" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
              <text x="14" y="5" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="monospace">R</text>
            </g>
            <line x1="115" y1="118" x2="160" y2="95" stroke="#38bdf8" strokeWidth="2" />
            <text x="50" y="155" textAnchor="middle" fill="#cbd5e1" fontSize="10" fontWeight="bold">L2</text>

            {/* Bottom-Right Leg: L3 (Grey) */}
            <line x1="260" y1="150" x2="230" y2="132" stroke="#94a3b8" strokeWidth="2.5" />
            <g transform="translate(205, 118) rotate(30)">
              <rect x="0" y="-12" width="28" height="24" rx="3" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
              <text x="14" y="5" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="monospace">R</text>
            </g>
            <line x1="205" y1="118" x2="160" y2="95" stroke="#38bdf8" strokeWidth="2" />
            <text x="270" y="155" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">L3</text>

            {/* Voltage Callout */}
            <rect x="195" y="45" width="115" height="28" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.4" />
            <text x="252" y="58" textAnchor="middle" fill="#38bdf8" fontSize="9" fontWeight="bold">U_elem = {formatElectrNumber(uStarElem, 1)} V</text>
            <text x="252" y="69" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="monospace">I_L = {formatElectrNumber(iStarLine, 2)} A</text>
          </svg>

          <div className="flex justify-between items-center text-xs font-mono p-2 bg-slate-950 rounded border border-slate-800">
            <span className="text-slate-400">Total Effekt (P_Y):</span>
            <span className="text-sky-300 font-bold text-sm">{formatElectrNumber(pStarTotal / 1000, 2)} kW</span>
          </div>
        </div>

        {/* 2. DELTA (Δ) SCHEMATIC */}
        <div className="p-3 rounded-xl bg-slate-900 border border-amber-500/30 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-amber-400 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded bg-amber-500/20 text-amber-300 flex items-center justify-center text-[10px] font-mono">Δ</span>
              <span>Deltakoppling (Δ)</span>
            </span>
            <span className="text-[10px] font-mono text-amber-300">U_elem = 400 V (Full U_L)</span>
          </div>

          <svg viewBox="0 0 320 180" className="w-full h-auto select-none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="320" height="180" rx="8" fill="#090d16" />
            <rect x="0" y="0" width="320" height="180" rx="8" fill="none" stroke="#1e293b" strokeWidth="1" />

            {/* Triangle Nodes: Top (160, 25), Bottom-Left (80, 145), Bottom-Right (240, 145) */}
            {/* L1 Feed to Top Node */}
            <line x1="160" y1="5" x2="160" y2="25" stroke="#8B4513" strokeWidth="2.5" />
            <circle cx="160" cy="25" r="4" fill="#fbbf24" />
            <text x="160" y="12" textAnchor="middle" fill="#8B4513" fontSize="10" fontWeight="bold">L1</text>

            {/* L2 Feed to Bottom-Left Node */}
            <line x1="45" y1="160" x2="80" y2="145" stroke="#64748b" strokeWidth="2.5" />
            <circle cx="80" cy="145" r="4" fill="#fbbf24" />
            <text x="35" y="165" textAnchor="middle" fill="#cbd5e1" fontSize="10" fontWeight="bold">L2</text>

            {/* L3 Feed to Bottom-Right Node */}
            <line x1="275" y1="160" x2="240" y2="145" stroke="#94a3b8" strokeWidth="2.5" />
            <circle cx="240" cy="145" r="4" fill="#fbbf24" />
            <text x="285" y="165" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">L3</text>

            {/* Leg 1: L1 to L2 */}
            <line x1="160" y1="25" x2="120" y2="85" stroke="#f59e0b" strokeWidth="2" />
            <g transform="translate(120, 85) rotate(56)">
              <rect x="-12" y="-12" width="24" height="24" rx="3" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" />
              <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="monospace">R</text>
            </g>
            <line x1="120" y1="85" x2="80" y2="145" stroke="#f59e0b" strokeWidth="2" />

            {/* Leg 2: L1 to L3 */}
            <line x1="160" y1="25" x2="200" y2="85" stroke="#f59e0b" strokeWidth="2" />
            <g transform="translate(200, 85) rotate(-56)">
              <rect x="-12" y="-12" width="24" height="24" rx="3" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" />
              <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="monospace">R</text>
            </g>
            <line x1="200" y1="85" x2="240" y2="145" stroke="#f59e0b" strokeWidth="2" />

            {/* Leg 3: L2 to L3 (Horizontal Bottom) */}
            <line x1="80" y1="145" x2="148" y2="145" stroke="#f59e0b" strokeWidth="2" />
            <rect x="148" y="133" width="24" height="24" rx="3" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" />
            <text x="160" y="149" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="monospace">R</text>
            <line x1="172" y1="145" x2="240" y2="145" stroke="#f59e0b" strokeWidth="2" />

            {/* Voltage Callout */}
            <rect x="195" y="45" width="115" height="28" rx="4" fill="#0f172a" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.4" />
            <text x="252" y="58" textAnchor="middle" fill="#f59e0b" fontSize="9" fontWeight="bold">U_elem = {voltage} V</text>
            <text x="252" y="69" textAnchor="middle" fill="#fcd34d" fontSize="8" fontFamily="monospace">I_L = {formatElectrNumber(iDeltaLine, 2)} A</text>
          </svg>

          <div className="flex justify-between items-center text-xs font-mono p-2 bg-slate-950 rounded border border-slate-800">
            <span className="text-slate-400">Total Effekt (P_Δ):</span>
            <span className="text-amber-300 font-bold text-sm">{formatElectrNumber(pDeltaTotal / 1000, 2)} kW</span>
          </div>
        </div>
      </div>
    </div>
  );
};
