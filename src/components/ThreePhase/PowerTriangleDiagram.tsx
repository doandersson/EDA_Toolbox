import React, { useState } from 'react';
import { formatElectrNumber } from '../../utils/electricalMath';
import { Triangle, Zap, Sparkles, Sliders } from 'lucide-react';

interface Props {
  voltage: number;
  current: number;
  activePowerW: number;
  apparentPowerVA: number;
  reactivePowerVAr: number;
  cosPhi: number;
  efficiency: number;
}

export const PowerTriangleDiagram: React.FC<Props> = ({
  voltage,
  current,
  activePowerW,
  apparentPowerVA,
  reactivePowerVAr,
  cosPhi,
  efficiency,
}) => {
  const [showCompensated, setShowCompensated] = useState(false);
  const [targetCosPhi, setTargetCosPhi] = useState(0.95);

  const P_kW = activePowerW / 1000;
  const S_kVA = apparentPowerVA / 1000;
  const Q_kVAr = reactivePowerVAr / 1000;

  // Phi in degrees
  const phiRad = Math.acos(Math.min(1.0, Math.max(0.1, cosPhi)));
  const phiDeg = (phiRad * 180) / Math.PI;

  // Compensated calculations
  const targetPhiRad = Math.acos(targetCosPhi);
  const Q_target_kVAr = P_kW * Math.tan(targetPhiRad);
  const Qc_needed_kVAr = Math.max(0, Q_kVAr - Q_target_kVAr);
  const S_comp_kVA = Math.sqrt(P_kW * P_kW + Q_target_kVAr * Q_target_kVAr);
  const I_comp_A = (S_comp_kVA * 1000) / (Math.sqrt(3) * voltage);
  const currentReductionPct = current > 0 ? ((current - I_comp_A) / current) * 100 : 0;

  // SVG Scaled coordinates (base width 280, max height 180)
  const svgWidth = 480;
  const svgHeight = 220;
  const originX = 60;
  const originY = 180;

  // Scale factors
  const maxDim = Math.max(P_kW, Q_kVAr, 1);
  const scale = 170 / maxDim;
  const pPx = Math.max(80, Math.min(260, P_kW * scale));
  const qPx = Math.max(40, Math.min(130, Q_kVAr * scale));
  const qCompPx = Math.max(20, Math.min(130, Q_target_kVAr * scale));

  const cornerX = originX + pPx;
  const cornerY = originY;
  const topX = cornerX;
  const topY = originY - qPx;
  const topCompY = originY - qCompPx;

  return (
    <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Triangle className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Effekttriangel & Faskompensering (P, Q, S)
            </h4>
            <p className="text-[11px] text-slate-400">
              Vektoriell relation mellan aktiv effekt (P), reaktiv effekt (Q) och skenbar effekt (S).
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowCompensated(!showCompensated)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
            showCompensated
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold'
              : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>{showCompensated ? 'Dölj faskompensering' : 'Simulera Faskompensering'}</span>
        </button>
      </div>

      {/* SVG Vector Power Triangle */}
      <div className="w-full overflow-x-auto py-1">
        <div className="min-w-[480px]">
          <svg viewBox="0 0 540 220" className="w-full h-auto select-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              {/* Markers */}
              <marker id="arrowRose" markerWidth="6" markerHeight="6" refX="5" refY="3" orientation="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#f43f5e" />
              </marker>
              <marker id="arrowAmber" markerWidth="6" markerHeight="6" refX="5" refY="3" orientation="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#f59e0b" />
              </marker>
              <marker id="arrowSky" markerWidth="6" markerHeight="6" refX="5" refY="3" orientation="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#38bdf8" />
              </marker>
              <marker id="arrowEmerald" markerWidth="6" markerHeight="6" refX="5" refY="3" orientation="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#10b981" />
              </marker>
            </defs>

            {/* Background Canvas */}
            <rect x="0" y="0" width="540" height="220" rx="12" fill="#090d16" />
            <rect x="0" y="0" width="540" height="220" rx="12" fill="none" stroke="#1e293b" strokeWidth="1" />

            {/* Right Angle Symbol at (cornerX, cornerY) */}
            <path
              d={`M ${cornerX - 12},${cornerY} L ${cornerX - 12},${cornerY - 12} L ${cornerX},${cornerY - 12}`}
              fill="none"
              stroke="#475569"
              strokeWidth="1.5"
            />

            {/* Angle Phi Arc at Origin */}
            <path
              d={`M ${originX + 35},${originY} A 35 35 0 0 0 ${originX + 35 * Math.cos(phiRad)},${originY - 35 * Math.sin(phiRad)}`}
              fill="none"
              stroke="#fbbf24"
              strokeWidth="1.5"
            />
            <text x={originX + 42} y={originY - 10} fill="#fbbf24" fontSize="11" fontWeight="bold" fontFamily="monospace">
              φ = {formatElectrNumber(phiDeg, 1)}°
            </text>

            {/* 1. Base Leg: Active Power P (Horizontal, Rose/Amber) */}
            <line
              x1={originX}
              y1={originY}
              x2={cornerX}
              y2={cornerY}
              stroke="#f43f5e"
              strokeWidth="3.5"
              strokeLinecap="round"
              markerEnd="url(#arrowRose)"
            />
            <text x={originX + pPx / 2} y={originY + 18} textAnchor="middle" fill="#f43f5e" fontSize="12" fontWeight="bold" fontFamily="monospace">
              P = {formatElectrNumber(P_kW, 2)} kW (Aktiv effekt)
            </text>

            {/* 2. Vertical Leg: Reactive Power Q (Amber/Sky) */}
            <line
              x1={cornerX}
              y1={cornerY}
              x2={topX}
              y2={topY}
              stroke="#f59e0b"
              strokeWidth="3.5"
              strokeLinecap="round"
              markerEnd="url(#arrowAmber)"
            />
            <text x={cornerX + 10} y={originY - qPx / 2} fill="#f59e0b" fontSize="12" fontWeight="bold" fontFamily="monospace">
              Q = {formatElectrNumber(Q_kVAr, 2)} kVAr (Reaktiv effekt)
            </text>

            {/* 3. Hypotenuse: Apparent Power S (Sky Blue) */}
            <line
              x1={originX}
              y1={originY}
              x2={topX}
              y2={topY}
              stroke="#38bdf8"
              strokeWidth="3.5"
              strokeLinecap="round"
              markerEnd="url(#arrowSky)"
            />
            <text
              x={originX + pPx / 2 - 25}
              y={originY - qPx / 2 - 12}
              fill="#38bdf8"
              fontSize="12"
              fontWeight="bold"
              fontFamily="monospace"
              transform={`rotate(-${phiDeg / 2}, ${originX + pPx / 2}, ${originY - qPx / 2})`}
            >
              S = {formatElectrNumber(S_kVA, 2)} kVA (Skenbar effekt)
            </text>

            {/* 4. If Compensation is Active: Draw Compensated Hypotenuse & Reduced Q */}
            {showCompensated && (
              <g>
                {/* Compensated S */}
                <line
                  x1={originX}
                  y1={originY}
                  x2={topX}
                  y2={topCompY}
                  stroke="#10b981"
                  strokeWidth="2.5"
                  strokeDasharray="5,4"
                  markerEnd="url(#arrowEmerald)"
                />
                <text x={cornerX + 10} y={originY - qCompPx / 2 + 5} fill="#10b981" fontSize="10" fontWeight="bold" fontFamily="monospace">
                  Q_ny = {formatElectrNumber(Q_target_kVAr, 2)} kVAr
                </text>

                {/* Capacitor Compensation Vector Qc */}
                <line
                  x1={topX + 25}
                  y1={topY}
                  x2={topX + 25}
                  y2={topCompY}
                  stroke="#34d399"
                  strokeWidth="2.5"
                  markerEnd="url(#arrowEmerald)"
                />
                <text x={topX + 35} y={(topY + topCompY) / 2 + 4} fill="#34d399" fontSize="10" fontWeight="bold" fontFamily="monospace">
                  Q_c = {formatElectrNumber(Qc_needed_kVAr, 2)} kVAr (Kondensator)
                </text>
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* Numerical Data Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Effektfaktor cos φ</span>
          <div className="text-base font-bold font-mono text-amber-400 my-0.5">{formatElectrNumber(cosPhi, 2)}</div>
          <span className="text-[10px] text-slate-500 font-mono">tan φ = {formatElectrNumber(Math.tan(phiRad), 2)}</span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Fasvinkel φ</span>
          <div className="text-base font-bold font-mono text-white my-0.5">{formatElectrNumber(phiDeg, 1)}°</div>
          <span className="text-[10px] text-slate-500 font-mono">sin φ = {formatElectrNumber(Math.sin(phiRad), 3)}</span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Pythagoras Förhållande</span>
          <div className="text-base font-bold font-mono text-sky-400 my-0.5">S = √(P² + Q²)</div>
          <span className="text-[10px] text-slate-500 font-mono">P/S = {formatElectrNumber(cosPhi, 2)}</span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Linjeström i Nät</span>
          <div className="text-base font-bold font-mono text-emerald-400 my-0.5">{formatElectrNumber(current, 2)} A</div>
          <span className="text-[10px] text-slate-500 font-mono">Vid {voltage} V huvudspänning</span>
        </div>
      </div>

      {/* Interactive Compensation Box */}
      {showCompensated && (
        <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs space-y-3 animate-in fade-in duration-150">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-500/20 pb-2">
            <span className="font-semibold text-emerald-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Resultat av Faskompensering med Kondensatorbatteri:</span>
            </span>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-[11px]">Önskad cos φ:</span>
              <select
                value={targetCosPhi}
                onChange={(e) => setTargetCosPhi(parseFloat(e.target.value))}
                className="bg-slate-900 border border-emerald-500/40 rounded px-2 py-0.5 text-xs font-mono text-white cursor-pointer"
              >
                <option value="0.92">0.92</option>
                <option value="0.95">0.95 (Svensk elnätsstandard)</option>
                <option value="0.98">0.98</option>
                <option value="1.00">1.00 (Full kompensation)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-300 font-mono">
            <div className="p-2 bg-slate-900/80 rounded border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-sans">Krävd Kondensatoreffekt (Qc):</span>
              <span className="text-base font-bold text-amber-400">{formatElectrNumber(Qc_needed_kVAr, 2)} kVAr</span>
            </div>
            <div className="p-2 bg-slate-900/80 rounded border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-sans">Reducerad Linjeström:</span>
              <span className="text-base font-bold text-emerald-400">{formatElectrNumber(I_comp_A, 2)} A</span>
              <span className="text-[10px] text-slate-400 ml-1">({formatElectrNumber(currentReductionPct, 1)}% lägre)</span>
            </div>
            <div className="p-2 bg-slate-900/80 rounded border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-sans">Ny Skenbar Belastning:</span>
              <span className="text-base font-bold text-sky-400">{formatElectrNumber(S_comp_kVA, 2)} kVA</span>
              <span className="text-[10px] text-slate-400 ml-1">(Tidigare: {formatElectrNumber(S_kVA, 2)} kVA)</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 leading-normal">
            Genom att installera faskompensering på <strong>{formatElectrNumber(Qc_needed_kVAr, 2)} kVAr</strong> minskar den reaktiva strömmen i matningskabeln, vilket frigör transformatorkapacitet, sänker spänningsfallet och eliminerar straffavgifter för reaktiv effekt från elnätsbolaget.
          </p>
        </div>
      )}
    </div>
  );
};
