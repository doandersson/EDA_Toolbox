import React, { useState } from 'react';
import { ElectricalVariable, SystemPhaseType, ThreePhaseConnection } from '../../types/electrical';

export interface FormulaSlice {
  id: string;
  variable: ElectricalVariable;
  name: string;
  formula: string;
  formulaLatex: string;
  angleStart: number;
  angleEnd: number;
  knownVars: [ElectricalVariable, ElectricalVariable];
}

const SINGLE_PHASE_SLICES: FormulaSlice[] = [
  // Top-Right: U (Spänning) [0 deg to 90 deg]
  { id: 'u-ir', variable: 'U', name: 'Spänning ur I & R', formula: 'U = I · R', formulaLatex: 'I · R', angleStart: 0, angleEnd: 30, knownVars: ['I', 'R'] },
  { id: 'u-pi', variable: 'U', name: 'Spänning ur P & I', formula: 'U = P / I', formulaLatex: 'P / I', angleStart: 30, angleEnd: 60, knownVars: ['P', 'I'] },
  { id: 'u-pr', variable: 'U', name: 'Spänning ur P & R', formula: 'U = √(P · R)', formulaLatex: '√(P · R)', angleStart: 60, angleEnd: 90, knownVars: ['P', 'R'] },

  // Bottom-Right: I (Ström) [90 deg to 180 deg]
  { id: 'i-ur', variable: 'I', name: 'Ström ur U & R', formula: 'I = U / R', formulaLatex: 'U / R', angleStart: 90, angleEnd: 120, knownVars: ['U', 'R'] },
  { id: 'i-pu', variable: 'I', name: 'Ström ur P & U', formula: 'I = P / U', formulaLatex: 'P / U', angleStart: 120, angleEnd: 150, knownVars: ['P', 'U'] },
  { id: 'i-pr', variable: 'I', name: 'Ström ur P & R', formula: 'I = √(P / R)', formulaLatex: '√(P / R)', angleStart: 150, angleEnd: 180, knownVars: ['P', 'R'] },

  // Bottom-Left: R (Resistans) [180 deg to 270 deg]
  { id: 'r-ui', variable: 'R', name: 'Resistans ur U & I', formula: 'R = U / I', formulaLatex: 'U / I', angleStart: 180, angleEnd: 210, knownVars: ['U', 'I'] },
  { id: 'r-up', variable: 'R', name: 'Resistans ur U & P', formula: 'R = U² / P', formulaLatex: 'U² / P', angleStart: 210, angleEnd: 240, knownVars: ['U', 'P'] },
  { id: 'r-pi', variable: 'R', name: 'Resistans ur P & I', formula: 'R = P / I²', formulaLatex: 'P / I²', angleStart: 240, angleEnd: 270, knownVars: ['P', 'I'] },

  // Top-Left: P (Effekt) [270 deg to 360 deg]
  { id: 'p-ui', variable: 'P', name: 'Effekt ur U & I', formula: 'P = U · I', formulaLatex: 'U · I', angleStart: 270, angleEnd: 300, knownVars: ['U', 'I'] },
  { id: 'p-ir', variable: 'P', name: 'Effekt ur I & R', formula: 'P = I² · R', formulaLatex: 'I² · R', angleStart: 300, angleEnd: 330, knownVars: ['I', 'R'] },
  { id: 'p-ur', variable: 'P', name: 'Effekt ur U & R', formula: 'P = U² / R', formulaLatex: 'U² / R', angleStart: 330, angleEnd: 360, knownVars: ['U', 'R'] },
];

const THREE_PHASE_SLICES_STAR: FormulaSlice[] = [
  // Top-Right: U_L [0 to 90]
  { id: '3u-ir', variable: 'U', name: 'Huvudspänning ur I_L & R_Y', formula: 'U_L = √3 · I_L · R_fas', formulaLatex: '√3·I·R', angleStart: 0, angleEnd: 30, knownVars: ['I', 'R'] },
  { id: '3u-pi', variable: 'U', name: 'Huvudspänning ur P & I_L', formula: 'U_L = P / (√3 · I_L · cos φ)', formulaLatex: 'P/(√3·I)', angleStart: 30, angleEnd: 60, knownVars: ['P', 'I'] },
  { id: '3u-pr', variable: 'U', name: 'Huvudspänning ur P & R_Y', formula: 'U_L = √(P · R_fas)', formulaLatex: '√(P·R)', angleStart: 60, angleEnd: 90, knownVars: ['P', 'R'] },

  // Bottom-Right: I_L [90 to 180]
  { id: '3i-ur', variable: 'I', name: 'Linjeström ur U_L & R_Y', formula: 'I_L = U_L / (√3 · R_fas)', formulaLatex: 'U/(√3·R)', angleStart: 90, angleEnd: 120, knownVars: ['U', 'R'] },
  { id: '3i-pu', variable: 'I', name: 'Linjeström ur P & U_L', formula: 'I_L = P / (√3 · U_L · cos φ)', formulaLatex: 'P/(√3·U)', angleStart: 120, angleEnd: 150, knownVars: ['P', 'U'] },
  { id: '3i-pr', variable: 'I', name: 'Linjeström ur P & R_Y', formula: 'I_L = √(P / (3 · R_fas))', formulaLatex: '√(P/3R)', angleStart: 150, angleEnd: 180, knownVars: ['P', 'R'] },

  // Bottom-Left: R_Y [180 to 270]
  { id: '3r-ui', variable: 'R', name: 'Fasresistans (Y) ur U_L & I_L', formula: 'R_fas = U_L / (√3 · I_L)', formulaLatex: 'U/(√3·I)', angleStart: 180, angleEnd: 210, knownVars: ['U', 'I'] },
  { id: '3r-up', variable: 'R', name: 'Fasresistans (Y) ur U_L & P', formula: 'R_fas = U_L² / P', formulaLatex: 'U_L² / P', angleStart: 210, angleEnd: 240, knownVars: ['U', 'P'] },
  { id: '3r-pi', variable: 'R', name: 'Fasresistans (Y) ur P & I_L', formula: 'R_fas = P / (3 · I_L²)', formulaLatex: 'P/(3·I²)', angleStart: 240, angleEnd: 270, knownVars: ['P', 'I'] },

  // Top-Left: P [270 to 360]
  { id: '3p-ui', variable: 'P', name: 'Effekt ur U_L & I_L', formula: 'P = √3 · U_L · I_L · cos φ', formulaLatex: '√3·U·I', angleStart: 270, angleEnd: 300, knownVars: ['U', 'I'] },
  { id: '3p-ir', variable: 'P', name: 'Effekt ur I_L & R_Y', formula: 'P = 3 · I_L² · R_fas', formulaLatex: '3·I²·R', angleStart: 300, angleEnd: 330, knownVars: ['I', 'R'] },
  { id: '3p-ur', variable: 'P', name: 'Effekt ur U_L & R_Y', formula: 'P = U_L² / R_fas', formulaLatex: 'U_L²/R', angleStart: 330, angleEnd: 360, knownVars: ['U', 'R'] },
];

const THREE_PHASE_SLICES_DELTA: FormulaSlice[] = [
  // Top-Right: U_L [0 to 90]
  { id: '3du-ir', variable: 'U', name: 'Huvudspänning ur I_L & R_Δ', formula: 'U_L = (I_L / √3) · R_fas', formulaLatex: '(I/√3)·R', angleStart: 0, angleEnd: 30, knownVars: ['I', 'R'] },
  { id: '3du-pi', variable: 'U', name: 'Huvudspänning ur P & I_L', formula: 'U_L = P / (√3 · I_L · cos φ)', formulaLatex: 'P/(√3·I)', angleStart: 30, angleEnd: 60, knownVars: ['P', 'I'] },
  { id: '3du-pr', variable: 'U', name: 'Huvudspänning ur P & R_Δ', formula: 'U_L = √(P · R_fas / 3)', formulaLatex: '√(PR/3)', angleStart: 60, angleEnd: 90, knownVars: ['P', 'R'] },

  // Bottom-Right: I_L [90 to 180]
  { id: '3di-ur', variable: 'I', name: 'Linjeström ur U_L & R_Δ', formula: 'I_L = √3 · U_L / R_fas', formulaLatex: '√3·U/R', angleStart: 90, angleEnd: 120, knownVars: ['U', 'R'] },
  { id: '3di-pu', variable: 'I', name: 'Linjeström ur P & U_L', formula: 'I_L = P / (√3 · U_L · cos φ)', formulaLatex: 'P/(√3·U)', angleStart: 120, angleEnd: 150, knownVars: ['P', 'U'] },
  { id: '3di-pr', variable: 'I', name: 'Linjeström ur P & R_Δ', formula: 'I_L = √(P / R_fas)', formulaLatex: '√(P/R)', angleStart: 150, angleEnd: 180, knownVars: ['P', 'R'] },

  // Bottom-Left: R_Δ [180 to 270]
  { id: '3dr-ui', variable: 'R', name: 'Fasresistans (Δ) ur U_L & I_L', formula: 'R_fas = √3 · U_L / I_L', formulaLatex: '√3·U/I', angleStart: 180, angleEnd: 210, knownVars: ['U', 'I'] },
  { id: '3dr-up', variable: 'R', name: 'Fasresistans (Δ) ur U_L & P', formula: 'R_fas = 3 · U_L² / P', formulaLatex: '3·U_L²/P', angleStart: 210, angleEnd: 240, knownVars: ['U', 'P'] },
  { id: '3dr-pi', variable: 'R', name: 'Fasresistans (Δ) ur P & I_L', formula: 'R_fas = P / I_L²', formulaLatex: 'P/I_L²', angleStart: 240, angleEnd: 270, knownVars: ['P', 'I'] },

  // Top-Left: P [270 to 360]
  { id: '3dp-ui', variable: 'P', name: 'Effekt ur U_L & I_L', formula: 'P = √3 · U_L · I_L · cos φ', formulaLatex: '√3·U·I', angleStart: 270, angleEnd: 300, knownVars: ['U', 'I'] },
  { id: '3dp-ir', variable: 'P', name: 'Effekt ur I_L & R_Δ', formula: 'P = I_L² · R_fas', formulaLatex: 'I_L²·R', angleStart: 300, angleEnd: 330, knownVars: ['I', 'R'] },
  { id: '3dp-ur', variable: 'P', name: 'Effekt ur U_L & R_Δ', formula: 'P = 3 · U_L² / R_fas', formulaLatex: '3·U²/R', angleStart: 330, angleEnd: 360, knownVars: ['U', 'R'] },
];

interface Props {
  phaseType?: SystemPhaseType;
  connection?: ThreePhaseConnection;
  activeVariable?: ElectricalVariable | null;
  highlightFormula?: string | null;
  onSelectSlice?: (slice: FormulaSlice) => void;
}

export const OhmsWheel: React.FC<Props> = ({
  phaseType = '1-phase',
  connection = 'star',
  activeVariable,
  highlightFormula,
  onSelectSlice,
}) => {
  const [hoveredSlice, setHoveredSlice] = useState<FormulaSlice | null>(null);

  const isThreePhase = phaseType === '3-phase';
  const slices = isThreePhase
    ? connection === 'delta'
      ? THREE_PHASE_SLICES_DELTA
      : THREE_PHASE_SLICES_STAR
    : SINGLE_PHASE_SLICES;

  // SVG parameters
  const size = 320;
  const center = size / 2;
  const outerR = 150;
  const innerR = 85;
  const coreR = 50;

  // Helper to calculate arc path
  const polarToCartesian = (cx: number, cy: number, r: number, angleDeg: number) => {
    const angleRad = ((angleDeg - 90) * Math.PI) / 180.0;
    return {
      x: cx + r * Math.cos(angleRad),
      y: cy + r * Math.sin(angleRad),
    };
  };

  const createArc = (startDeg: number, endDeg: number, r1: number, r2: number) => {
    const p1 = polarToCartesian(center, center, r2, startDeg);
    const p2 = polarToCartesian(center, center, r2, endDeg);
    const p3 = polarToCartesian(center, center, r1, endDeg);
    const p4 = polarToCartesian(center, center, r1, startDeg);

    const largeArc = endDeg - startDeg > 180 ? 1 : 0;

    return `M ${p1.x} ${p1.y} A ${r2} ${r2} 0 ${largeArc} 1 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${r1} ${r1} 0 ${largeArc} 0 ${p4.x} ${p4.y} Z`;
  };

  return (
    <div className="flex flex-col items-center select-none w-full">
      <div className="relative">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-72 h-72 sm:w-80 sm:h-80 drop-shadow-xl"
        >
          <defs>
            <radialGradient id="wheelCoreGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </radialGradient>
            <filter id="activeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer circle track */}
          <circle cx={center} cy={center} r={outerR + 2} fill="#090d16" stroke="#334155" strokeWidth="1.5" />

          {/* Slices for all 12 formulas */}
          {slices.map((slice) => {
            const isHovered = hoveredSlice?.id === slice.id;
            const isTargetVar = activeVariable === slice.variable;
            const isHighlighted =
              highlightFormula &&
              (slice.formula.includes(highlightFormula) || highlightFormula.includes(slice.formula));

            let fillColor = '#0f172a';
            let strokeColor = '#1e293b';
            let textColor = '#94a3b8';

            if (isHighlighted) {
              fillColor = '#b45309';
              strokeColor = '#f59e0b';
              textColor = '#ffffff';
            } else if (isHovered) {
              fillColor = '#1e293b';
              strokeColor = '#38bdf8';
              textColor = '#38bdf8';
            } else if (isTargetVar) {
              fillColor = '#132038';
              strokeColor = '#2563eb';
              textColor = '#93c5fd';
            }

            const arcPath = createArc(slice.angleStart, slice.angleEnd, innerR, outerR);
            const textAngle = (slice.angleStart + slice.angleEnd) / 2;
            const textPos = polarToCartesian(center, center, (innerR + outerR) / 2, textAngle);

            return (
              <g
                key={slice.id}
                className="cursor-pointer transition-all duration-150"
                onMouseEnter={() => setHoveredSlice(slice)}
                onMouseLeave={() => setHoveredSlice(null)}
                onClick={() => onSelectSlice && onSelectSlice(slice)}
              >
                <path
                  d={arcPath}
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth={isHighlighted || isHovered ? 2 : 1}
                  className="transition-colors duration-150"
                />
                <text
                  x={textPos.x}
                  y={textPos.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={textColor}
                  fontSize={isThreePhase ? '9' : '10'}
                  fontWeight={isHighlighted || isHovered ? 'bold' : 'normal'}
                  className="pointer-events-none font-mono tracking-tight"
                >
                  {slice.formulaLatex}
                </text>
              </g>
            );
          })}

          {/* Quadrant Dividers & Outer Ring */}
          <line x1={center} y1={center - outerR} x2={center} y2={center - innerR} stroke="#475569" strokeWidth="2" />
          <line x1={center + innerR} y1={center} x2={center + outerR} y2={center} stroke="#475569" strokeWidth="2" />
          <line x1={center} y1={center + innerR} x2={center} y2={center + outerR} stroke="#475569" strokeWidth="2" />
          <line x1={center - outerR} y1={center} x2={center - innerR} y2={center} stroke="#475569" strokeWidth="2" />

          {/* 4 Quadrants Inner Ring: U, I, R, P labels */}
          {[
            { var: 'U', deg: 45, label: isThreePhase ? 'U_L (400V)' : 'U (Volt)', desc: 'Spänning', color: '#38bdf8' },
            { var: 'I', deg: 135, label: isThreePhase ? 'I_L (Ampere)' : 'I (Ampere)', desc: 'Ström', color: '#34d399' },
            { var: 'R', deg: 225, label: isThreePhase ? (connection === 'star' ? 'R_Y (Ohm)' : 'R_Δ (Ohm)') : 'R (Ohm)', desc: 'Resistans', color: '#fbbf24' },
            { var: 'P', deg: 315, label: isThreePhase ? 'P_tot (Watt)' : 'P (Watt)', desc: 'Effekt', color: '#f43f5e' },
          ].map((q) => {
            const qArc = createArc(q.deg - 45, q.deg + 45, coreR, innerR);
            const pos = polarToCartesian(center, center, (coreR + innerR) / 2, q.deg);
            const isActive = activeVariable === q.var;

            return (
              <g
                key={q.var}
                className="cursor-pointer"
                onClick={() => onSelectSlice && onSelectSlice(slices.find((s) => s.variable === q.var)!)}
              >
                <path
                  d={qArc}
                  fill={isActive ? '#1e293b' : '#0b1329'}
                  stroke={isActive ? q.color : '#334155'}
                  strokeWidth={isActive ? '2' : '1'}
                />
                <text
                  x={pos.x}
                  y={pos.y - 4}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={isActive ? q.color : '#e2e8f0'}
                  fontSize="14"
                  fontWeight="bold"
                  className="font-mono pointer-events-none"
                >
                  {isThreePhase && q.var === 'U' ? 'U_L' : isThreePhase && q.var === 'I' ? 'I_L' : isThreePhase && q.var === 'R' ? 'R_fas' : q.var}
                </text>
                <text
                  x={pos.x}
                  y={pos.y + 10}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#94a3b8"
                  fontSize="7.5"
                  className="pointer-events-none uppercase tracking-wider"
                >
                  {q.var === 'U' ? (isThreePhase ? 'Huvudspänning' : 'Volt') : q.var === 'I' ? (isThreePhase ? 'Linjeström' : 'Ampere') : q.var === 'R' ? 'Fasresistans' : (isThreePhase ? 'Total Effekt' : 'Watt')}
                </text>
              </g>
            );
          })}

          {/* Center Hub */}
          <circle cx={center} cy={center} r={coreR} fill="url(#wheelCoreGrad)" stroke="#475569" strokeWidth="2" />
          <text
            x={center}
            y={center - 7}
            textAnchor="middle"
            fill="#f59e0b"
            fontSize="10"
            fontWeight="bold"
            className="tracking-wider"
          >
            {isThreePhase ? (connection === 'star' ? '3-FAS (Y)' : '3-FAS (Δ)') : '1-FAS / DC'}
          </text>
          <text
            x={center}
            y={center + 7}
            textAnchor="middle"
            fill="#e2e8f0"
            fontSize="8.5"
            className="tracking-wider"
          >
            FORMELHJUL
          </text>
        </svg>
      </div>

      {/* Info tooltip / Active formula display */}
      <div className="mt-3 text-center min-h-[38px] px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs w-full max-w-sm">
        {hoveredSlice ? (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
            <span className="font-semibold text-amber-400 font-mono text-sm">{hoveredSlice.formula}</span>
            <span className="text-slate-400 text-[11px]">({hoveredSlice.name})</span>
          </div>
        ) : (
          <p className="text-slate-400">
            {isThreePhase
              ? `Formler för 3-Fas (${connection === 'star' ? 'Stjärnkoppling Y' : 'Deltakoppling Δ'}) med √3`
              : 'Klicka på en formelsektor i hjulet för att beräkna med den formeln'}
          </p>
        )}
      </div>
    </div>
  );
};
