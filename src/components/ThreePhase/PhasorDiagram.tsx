import React from 'react';
import { formatElectrNumber } from '../../utils/electricalMath';
import { Activity, Compass, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface Props {
  iL1: number;
  iL2: number;
  iL3: number;
  iNeutral: number;
}

export const PhasorDiagram: React.FC<Props> = ({ iL1, iL2, iL3, iNeutral }) => {
  // Symmetrical angles for 3 phases:
  // L1: 0 deg (pointing along positive X)
  // L2: 240 deg or -120 deg
  // L3: 120 deg
  // In Swedish/IEC 3-phase standards, sequence L1 -> L2 -> L3:
  // Angle L1 = 0 rad
  // Angle L2 = 240 deg = (4*pi/3) rad
  // Angle L3 = 120 deg = (2*pi/3) rad

  // Vector components:
  const L1_x = iL1 * 1.0;
  const L1_y = 0;

  const L2_rad = (240 * Math.PI) / 180;
  const L2_x = iL2 * Math.cos(L2_rad);
  const L2_y = iL2 * Math.sin(L2_rad);

  const L3_rad = (120 * Math.PI) / 180;
  const L3_x = iL3 * Math.cos(L3_rad);
  const L3_y = iL3 * Math.sin(L3_rad);

  // Kirchhoff's Current Law: I_L1 + I_L2 + I_L3 + I_N = 0  => I_N = -(I_L1 + I_L2 + I_L3)
  // The magnitude is |I_N|
  const sum_x = L1_x + L2_x + L3_x;
  const sum_y = L1_y + L2_y + L3_y;
  const in_vec_x = -sum_x;
  const in_vec_y = -sum_y;

  // Coordinate center in SVG
  const cX = 170;
  const cY = 130;
  const maxI = Math.max(iL1, iL2, iL3, iNeutral, 5);
  const scale = 95 / maxI;

  // End coordinates
  const p1X = cX + L1_x * scale;
  const p1Y = cY - L1_y * scale; // Inverted SVG Y

  const p2X = cX + L2_x * scale;
  const p2Y = cY - L2_y * scale;

  const p3X = cX + L3_x * scale;
  const p3Y = cY - L3_y * scale;

  const pnX = cX + in_vec_x * scale;
  const pnY = cY - in_vec_y * scale;

  const isBalanced = iNeutral < 0.05 && iL1 > 0;
  const isHighNeutral = iNeutral > Math.max(iL1, iL2, iL3) * 0.8;

  return (
    <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Visardiagram för Fasströmmar & Nollström (120°)
            </h4>
            <p className="text-[11px] text-slate-400">
              Vektorsummering av fasströmmarna L1, L2, L3 i det komplexa planet för att härleda returströmmen i nollan (I_N).
            </p>
          </div>
        </div>

        <div className={`px-2.5 py-1 rounded-lg border text-xs font-mono font-semibold flex items-center gap-1.5 ${
          isBalanced
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            : isHighNeutral
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
            : 'bg-sky-500/10 border-sky-500/30 text-sky-300'
        }`}>
          {isBalanced ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          )}
          <span>I_N = {formatElectrNumber(iNeutral, 2)} A ({isBalanced ? 'Balanserad' : 'Obalanserad'})</span>
        </div>
      </div>

      {/* SVG Phasor Canvas and Data side by side */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* SVG Canvas (7 cols) */}
        <div className="md:col-span-7 flex justify-center">
          <svg viewBox="0 0 340 260" className="w-full max-w-[360px] h-auto select-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <marker id="arrowL1" markerWidth="6" markerHeight="6" refX="5" refY="3" orientation="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#b45309" />
              </marker>
              <marker id="arrowL2" markerWidth="6" markerHeight="6" refX="5" refY="3" orientation="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#94a3b8" />
              </marker>
              <marker id="arrowL3" markerWidth="6" markerHeight="6" refX="5" refY="3" orientation="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#64748b" />
              </marker>
              <marker id="arrowIN" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orientation="auto">
                <path d="M0,0 L7,3.5 L0,7 Z" fill="#38bdf8" />
              </marker>
            </defs>

            {/* Background & Circular Grids */}
            <rect x="0" y="0" width="340" height="260" rx="12" fill="#090d16" />
            <circle cx={cX} cy={cY} r="100" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="3,3" />
            <circle cx={cX} cy={cY} r="65" fill="none" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="2,2" />
            <circle cx={cX} cy={cY} r="30" fill="none" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="2,2" />

            {/* Center Origin Crosshair */}
            <line x1={cX - 110} y1={cY} x2={cX + 110} y2={cY} stroke="#1e293b" strokeWidth="1" />
            <line x1={cX} y1={cY - 110} x2={cX} y2={cY + 110} stroke="#1e293b" strokeWidth="1" />

            {/* Reference 120 deg dashed guidelines */}
            <line x1={cX} y1={cY} x2={cX + 105 * Math.cos(0)} y2={cY - 105 * Math.sin(0)} stroke="#334155" strokeWidth="1" strokeDasharray="4,4" />
            <line x1={cX} y1={cY} x2={cX + 105 * Math.cos(L3_rad)} y2={cY - 105 * Math.sin(L3_rad)} stroke="#334155" strokeWidth="1" strokeDasharray="4,4" />
            <line x1={cX} y1={cY} x2={cX + 105 * Math.cos(L2_rad)} y2={cY - 105 * Math.sin(L2_rad)} stroke="#334155" strokeWidth="1" strokeDasharray="4,4" />

            {/* Axis labels */}
            <text x={cX + 115} y={cY + 3} fill="#b45309" fontSize="9" fontWeight="bold">0° (L1)</text>
            <text x={cX - 65} y={cY - 95} fill="#64748b" fontSize="9" fontWeight="bold">120° (L3)</text>
            <text x={cX - 65} y={cY + 105} fill="#94a3b8" fontSize="9" fontWeight="bold">240° (L2)</text>

            {/* Vector L1 (Brun) */}
            {iL1 > 0 && (
              <line x1={cX} y1={cY} x2={p1X} y2={p1Y} stroke="#d97706" strokeWidth="3" markerEnd="url(#arrowL1)" />
            )}
            {/* Vector L2 (Svart/Ljusgrå för synlighet) */}
            {iL2 > 0 && (
              <line x1={cX} y1={cY} x2={p2X} y2={p2Y} stroke="#cbd5e1" strokeWidth="3" markerEnd="url(#arrowL2)" />
            )}
            {/* Vector L3 (Mörkgrå) */}
            {iL3 > 0 && (
              <line x1={cX} y1={cY} x2={p3X} y2={p3Y} stroke="#94a3b8" strokeWidth="3" markerEnd="url(#arrowL3)" />
            )}

            {/* Vector I_N (Cyan/Sky) */}
            {iNeutral > 0.1 && (
              <line
                x1={cX}
                y1={cY}
                x2={pnX}
                y2={pnY}
                stroke="#38bdf8"
                strokeWidth="3.5"
                strokeDasharray="6,2"
                markerEnd="url(#arrowIN)"
              />
            )}

            {/* Center Origin Dot */}
            <circle cx={cX} cy={cY} r="4" fill="#fbbf24" stroke="#090d16" strokeWidth="1.5" />
          </svg>
        </div>

        {/* Phasor Data & Explanation (5 cols) */}
        <div className="md:col-span-5 space-y-3">
          <div className="space-y-1.5 text-xs font-mono">
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-[#b45309]/40">
              <span className="flex items-center gap-1.5 text-amber-500 font-sans">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8B4513]" />
                <span>Ström L1:</span>
              </span>
              <span className="font-bold text-white">{formatElectrNumber(iL1, 1)} A</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-700">
              <span className="flex items-center gap-1.5 text-slate-300 font-sans">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                <span>Ström L2:</span>
              </span>
              <span className="font-bold text-white">{formatElectrNumber(iL2, 1)} A</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-700">
              <span className="flex items-center gap-1.5 text-slate-400 font-sans">
                <span className="w-2.5 h-2.5 rounded-full bg-gray-500" />
                <span>Ström L3:</span>
              </span>
              <span className="font-bold text-white">{formatElectrNumber(iL3, 1)} A</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-sky-950/40 border border-sky-500/40">
              <span className="flex items-center gap-1.5 text-sky-300 font-sans font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                <span>Nollström (I_N):</span>
              </span>
              <span className="font-bold text-sky-400 text-sm">{formatElectrNumber(iNeutral, 2)} A</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-normal">
            Eftersom de tre faserna är förskjutna med 120° tar strömmarna helt ut varandra om <code className="text-white">I1 = I2 = I3</code>. Vid olikformig belastning uppstår den blå visaren som returström genom nollan.
          </p>
        </div>
      </div>
    </div>
  );
};
