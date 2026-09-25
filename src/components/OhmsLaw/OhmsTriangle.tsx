import React, { useState } from 'react';
import { ElectricalVariable, SystemPhaseType, ThreePhaseConnection } from '../../types/electrical';

interface Props {
  phaseType?: SystemPhaseType;
  connection?: ThreePhaseConnection;
  onSelectVariable?: (variable: ElectricalVariable, triangle: 'ohms' | 'power') => void;
  activeVariable?: ElectricalVariable | null;
}

export const OhmsTriangle: React.FC<Props> = ({
  phaseType = '1-phase',
  connection = 'star',
  onSelectVariable,
  activeVariable,
}) => {
  const [selectedMnemonic, setSelectedMnemonic] = useState<'U' | 'I' | 'R' | 'P'>('U');
  const isThreePhase = phaseType === '3-phase';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
      {/* Triangel 1: Ohms Lag / Fasresistans */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col items-center">
        <span className="text-xs font-semibold text-slate-300 tracking-wide uppercase mb-1">
          {isThreePhase ? '3-Fas Ohms Triangel' : 'Ohms Triangel'}
        </span>
        <p className="text-[11px] text-slate-400 mb-3 text-center">
          {isThreePhase
            ? connection === 'star'
              ? 'Y: U_f = U_L / √3, I_L = I_f'
              : 'Δ: U_f = U_L, I_f = I_L / √3'
            : 'Klicka på den storhet du vill söka'}
        </p>

        <div className="relative w-44 h-36">
          <svg viewBox="0 0 200 160" className="w-full h-full drop-shadow-md">
            {/* Outer Triangle */}
            <polygon
              points="100,10 10,150 190,150"
              fill="#090d16"
              stroke="#334155"
              strokeWidth="2"
            />
            {/* Horizontal Divider */}
            <line x1="45" y1="85" x2="155" y2="85" stroke="#475569" strokeWidth="2.5" />
            {/* Vertical Divider */}
            <line x1="100" y1="85" x2="100" y2="150" stroke="#475569" strokeWidth="2.5" />

            {/* Top: U */}
            <g
              className="cursor-pointer group"
              onClick={() => {
                setSelectedMnemonic('U');
                onSelectVariable && onSelectVariable('U', 'ohms');
              }}
            >
              <polygon
                points="100,12 47,83 153,83"
                fill={activeVariable === 'U' || selectedMnemonic === 'U' ? '#1e293b' : 'transparent'}
                className="hover:fill-slate-800 transition"
              />
              <text
                x="100"
                y="58"
                textAnchor="middle"
                fontSize={isThreePhase ? '18' : '22'}
                fontWeight="bold"
                fill={activeVariable === 'U' || selectedMnemonic === 'U' ? '#38bdf8' : '#e2e8f0'}
                className="font-mono pointer-events-none"
              >
                {isThreePhase ? 'U_L' : 'U'}
              </text>
            </g>

            {/* Bottom Left: I */}
            <g
              className="cursor-pointer group"
              onClick={() => {
                setSelectedMnemonic('I');
                onSelectVariable && onSelectVariable('I', 'ohms');
              }}
            >
              <polygon
                points="43,87 13,148 98,148 98,87"
                fill={activeVariable === 'I' || selectedMnemonic === 'I' ? '#1e293b' : 'transparent'}
                className="hover:fill-slate-800 transition"
              />
              <text
                x="60"
                y="125"
                textAnchor="middle"
                fontSize={isThreePhase ? '16' : '20'}
                fontWeight="bold"
                fill={activeVariable === 'I' || selectedMnemonic === 'I' ? '#34d399' : '#e2e8f0'}
                className="font-mono pointer-events-none"
              >
                {isThreePhase ? (connection === 'star' ? '√3 · I_L' : 'I_L / √3') : 'I'}
              </text>
            </g>

            {/* Multiply Dot */}
            <circle cx="100" cy="120" r="3.5" fill="#f59e0b" />

            {/* Bottom Right: R */}
            <g
              className="cursor-pointer group"
              onClick={() => {
                setSelectedMnemonic('R');
                onSelectVariable && onSelectVariable('R', 'ohms');
              }}
            >
              <polygon
                points="157,87 102,87 102,148 187,148"
                fill={activeVariable === 'R' || selectedMnemonic === 'R' ? '#1e293b' : 'transparent'}
                className="hover:fill-slate-800 transition"
              />
              <text
                x="140"
                y="125"
                textAnchor="middle"
                fontSize={isThreePhase ? '17' : '20'}
                fontWeight="bold"
                fill={activeVariable === 'R' || selectedMnemonic === 'R' ? '#fbbf24' : '#e2e8f0'}
                className="font-mono pointer-events-none"
              >
                {isThreePhase ? 'R_fas' : 'R'}
              </text>
            </g>
          </svg>
        </div>

        {/* Current Formula Indicator */}
        <div className="mt-2 text-center text-xs font-mono font-semibold text-amber-400 bg-slate-950/70 px-3 py-1.5 rounded-lg border border-slate-800 w-full">
          {!isThreePhase && selectedMnemonic === 'U' && 'U = I · R'}
          {!isThreePhase && selectedMnemonic === 'I' && 'I = U / R'}
          {!isThreePhase && selectedMnemonic === 'R' && 'R = U / I'}
          {!isThreePhase && selectedMnemonic === 'P' && 'U = P / I'}

          {isThreePhase && connection === 'star' && selectedMnemonic === 'U' && 'U_L = √3 · I_L · R_fas'}
          {isThreePhase && connection === 'star' && selectedMnemonic === 'I' && 'I_L = U_L / (√3 · R_fas)'}
          {isThreePhase && connection === 'star' && selectedMnemonic === 'R' && 'R_fas = U_L / (√3 · I_L)'}
          {isThreePhase && connection === 'star' && selectedMnemonic === 'P' && 'R_fas = U_L² / P'}

          {isThreePhase && connection === 'delta' && selectedMnemonic === 'U' && 'U_L = (I_L / √3) · R_fas'}
          {isThreePhase && connection === 'delta' && selectedMnemonic === 'I' && 'I_L = √3 · U_L / R_fas'}
          {isThreePhase && connection === 'delta' && selectedMnemonic === 'R' && 'R_fas = √3 · U_L / I_L'}
          {isThreePhase && connection === 'delta' && selectedMnemonic === 'P' && 'R_fas = 3 · U_L² / P'}
        </div>
      </div>

      {/* Triangel 2: Effektlagen (P / (U * I * sqrt(3))) */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col items-center">
        <span className="text-xs font-semibold text-slate-300 tracking-wide uppercase mb-1">
          {isThreePhase ? '3-Fas Effekttriangel' : 'Effekttriangel'}
        </span>
        <p className="text-[11px] text-slate-400 mb-3 text-center">
          {isThreePhase ? 'P = √3 · U_L · I_L · cos φ' : 'Effektlagen P = U · I'}
        </p>

        <div className="relative w-44 h-36">
          <svg viewBox="0 0 200 160" className="w-full h-full drop-shadow-md">
            {/* Outer Triangle */}
            <polygon
              points="100,10 10,150 190,150"
              fill="#090d16"
              stroke="#334155"
              strokeWidth="2"
            />
            {/* Horizontal Divider */}
            <line x1="45" y1="85" x2="155" y2="85" stroke="#475569" strokeWidth="2.5" />
            {/* Vertical Divider */}
            <line x1="100" y1="85" x2="100" y2="150" stroke="#475569" strokeWidth="2.5" />

            {/* Top: P */}
            <g
              className="cursor-pointer group"
              onClick={() => {
                setSelectedMnemonic('P');
                onSelectVariable && onSelectVariable('P', 'power');
              }}
            >
              <polygon
                points="100,12 47,83 153,83"
                fill={activeVariable === 'P' || selectedMnemonic === 'P' ? '#1e293b' : 'transparent'}
                className="hover:fill-slate-800 transition"
              />
              <text
                x="100"
                y="58"
                textAnchor="middle"
                fontSize={isThreePhase ? '18' : '22'}
                fontWeight="bold"
                fill={activeVariable === 'P' || selectedMnemonic === 'P' ? '#f43f5e' : '#e2e8f0'}
                className="font-mono pointer-events-none"
              >
                {isThreePhase ? 'P_tot' : 'P'}
              </text>
            </g>

            {/* Bottom Left: U */}
            <g
              className="cursor-pointer group"
              onClick={() => {
                setSelectedMnemonic('U');
                onSelectVariable && onSelectVariable('U', 'power');
              }}
            >
              <polygon
                points="43,87 13,148 98,148 98,87"
                fill={activeVariable === 'U' || selectedMnemonic === 'U' ? '#1e293b' : 'transparent'}
                className="hover:fill-slate-800 transition"
              />
              <text
                x="55"
                y="125"
                textAnchor="middle"
                fontSize={isThreePhase ? '15' : '20'}
                fontWeight="bold"
                fill={activeVariable === 'U' || selectedMnemonic === 'U' ? '#38bdf8' : '#e2e8f0'}
                className="font-mono pointer-events-none"
              >
                {isThreePhase ? '√3 · U_L' : 'U'}
              </text>
            </g>

            {/* Multiply Dot */}
            <circle cx="100" cy="120" r="3.5" fill="#f59e0b" />

            {/* Bottom Right: I */}
            <g
              className="cursor-pointer group"
              onClick={() => {
                setSelectedMnemonic('I');
                onSelectVariable && onSelectVariable('I', 'power');
              }}
            >
              <polygon
                points="157,87 102,87 102,148 187,148"
                fill={activeVariable === 'I' || selectedMnemonic === 'I' ? '#1e293b' : 'transparent'}
                className="hover:fill-slate-800 transition"
              />
              <text
                x="142"
                y="125"
                textAnchor="middle"
                fontSize={isThreePhase ? '15' : '20'}
                fontWeight="bold"
                fill={activeVariable === 'I' || selectedMnemonic === 'I' ? '#34d399' : '#e2e8f0'}
                className="font-mono pointer-events-none"
              >
                {isThreePhase ? 'I_L · cosφ' : 'I'}
              </text>
            </g>
          </svg>
        </div>

        {/* Current Formula Indicator */}
        <div className="mt-2 text-center text-xs font-mono font-semibold text-rose-400 bg-slate-950/70 px-3 py-1.5 rounded-lg border border-slate-800 w-full">
          {!isThreePhase && selectedMnemonic === 'P' && 'P = U · I'}
          {!isThreePhase && selectedMnemonic === 'U' && 'U = P / I'}
          {!isThreePhase && selectedMnemonic === 'I' && 'I = P / U'}
          {!isThreePhase && selectedMnemonic === 'R' && 'P = I² · R'}

          {isThreePhase && selectedMnemonic === 'P' && 'P = √3 · U_L · I_L · cos φ'}
          {isThreePhase && selectedMnemonic === 'U' && 'U_L = P / (√3 · I_L · cos φ)'}
          {isThreePhase && selectedMnemonic === 'I' && 'I_L = P / (√3 · U_L · cos φ)'}
          {isThreePhase && selectedMnemonic === 'R' && (connection === 'star' ? 'P = 3 · I_L² · R_fas' : 'P = 3 · U_L² / R_fas')}
        </div>
      </div>
    </div>
  );
};
