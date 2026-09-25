import React, { useState } from 'react';
import { BookOpen, GraduationCap, ChevronDown, ChevronUp, Lightbulb, Sparkles } from 'lucide-react';

export interface FormulaVariable {
  symbol: string;
  name: string;
  unit: string;
  description: string;
  currentValue?: string;
}

export interface FormulaTheoryCardProps {
  title: string;
  badge?: string;
  subtitle?: string;
  formula?: string;
  primaryFormula?: string;
  secondaryFormula?: string;
  secondaryFormulas?: string[];
  substitution?: string;
  activeSubstitution?: string;
  variables: FormulaVariable[];
  theory?: string;
  theoryNotes?: string[];
  practicalRule?: string;
  practicalRules?: string[];
  defaultOpen?: boolean;
}

export const FormulaTheoryCard: React.FC<FormulaTheoryCardProps> = ({
  title,
  badge,
  subtitle,
  formula,
  primaryFormula,
  secondaryFormula,
  secondaryFormulas,
  substitution,
  activeSubstitution,
  variables,
  theory,
  theoryNotes,
  practicalRule,
  practicalRules,
  defaultOpen = true,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const mainFormula = formula || primaryFormula || '';
  const resolvedSecondary: string[] = [
    ...(secondaryFormula ? [secondaryFormula] : []),
    ...(secondaryFormulas || []),
  ];
  const resolvedSubstitution = substitution || activeSubstitution;
  const resolvedTheory: string[] = [
    ...(theory ? [theory] : []),
    ...(theoryNotes || []),
  ];
  const resolvedRules: string[] = [
    ...(practicalRule ? [practicalRule] : []),
    ...(practicalRules || []),
  ];

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-sm transition-all duration-200">
      {/* Header Button (Collapsible) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between bg-slate-900 hover:bg-slate-850 transition cursor-pointer text-left"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white flex flex-wrap items-center gap-2">
              <span>{title}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 font-medium">
                {badge || 'Matematisk Formel'}
              </span>
            </h3>
            {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="hidden sm:inline">{isOpen ? 'Dölj formel & teori' : 'Visa formel & teori'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </button>

      {/* Expandable Body */}
      {isOpen && (
        <div className="p-5 border-t border-slate-800/80 space-y-4 text-xs text-slate-300 animate-in fade-in duration-150">
          {/* Active Formula Banner */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Matematisk Huvudformel</span>
              </span>
              <span className="font-mono text-slate-500">SI-enheter</span>
            </div>

            <div className="py-2 text-center overflow-x-auto">
              <span className="font-mono text-base sm:text-xl font-bold text-white tracking-wide bg-slate-900/90 px-4 py-2 rounded-xl border border-slate-800 inline-block shadow-inner">
                {mainFormula}
              </span>
            </div>

            {/* If secondary formulas exist */}
            {resolvedSecondary.length > 0 && (
              <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-2 text-xs font-mono text-slate-400">
                <span className="text-slate-500 text-[11px]">Härledda formler / varianter:</span>
                {resolvedSecondary.map((sf, idx) => (
                  <span key={idx} className="bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-sky-300">
                    {sf}
                  </span>
                ))}
              </div>
            )}

            {/* Active Numeric Substitution */}
            {resolvedSubstitution && (
              <div className="pt-2 border-t border-slate-800/80">
                <div className="text-[11px] text-slate-400 mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Insättning med dina aktuella inmatade värden:</span>
                </div>
                <div className="font-mono text-xs sm:text-sm text-emerald-300 bg-slate-900/90 px-3 py-2 rounded-lg border border-emerald-500/30 overflow-x-auto whitespace-pre-wrap">
                  {resolvedSubstitution}
                </div>
              </div>
            )}
          </div>

          {/* Variables Table */}
          {variables.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-200 uppercase tracking-wide block">
                Definition av ingående storheter
              </span>
              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/50">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/50">
                      <th className="py-2 px-3 font-semibold">Symbol</th>
                      <th className="py-2 px-3 font-semibold">Storhet</th>
                      <th className="py-2 px-3 font-semibold">Enhet</th>
                      <th className="py-2 px-3 font-semibold">Beskrivning</th>
                      {variables.some((v) => v.currentValue) && (
                        <th className="py-2 px-3 font-semibold text-right">Aktuellt värde</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                    {variables.map((v) => (
                      <tr key={v.symbol} className="hover:bg-slate-900/30 transition">
                        <td className="py-2 px-3 font-bold text-amber-400">{v.symbol}</td>
                        <td className="py-2 px-3 font-sans text-white">{v.name}</td>
                        <td className="py-2 px-3 text-sky-400">{v.unit}</td>
                        <td className="py-2 px-3 font-sans text-slate-400 text-[11px]">{v.description}</td>
                        {variables.some((item) => item.currentValue) && (
                          <td className="py-2 px-3 text-right font-bold text-emerald-400">
                            {v.currentValue || '–'}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Theory / Electrical Principles */}
          {resolvedTheory.length > 0 && (
            <div className="space-y-2 pt-1">
              <span className="text-xs font-semibold text-slate-200 uppercase tracking-wide block">
                Teoretisk bakgrund & Fysisk innebörd
              </span>
              <div className="space-y-2">
                {resolvedTheory.map((note, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">{note}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Practical Rule / Industry Tip */}
          {resolvedRules.length > 0 && (
            <div className="space-y-2 pt-1">
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-300 space-y-2">
                <div className="flex items-center gap-2 text-amber-200 font-semibold">
                  <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Praktiska elektrikerregler & God installationspraxis:</span>
                </div>
                <ul className="list-disc pl-5 space-y-1 font-sans text-amber-200/90 text-xs">
                  {resolvedRules.map((rule, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
