import {
  ElectricalVariable,
  VoltageUnit,
  CurrentUnit,
  ResistanceUnit,
  PowerUnit,
  CalculationResult,
  PresetScenario,
} from '../types/electrical';

export const UNIT_MULTIPLIERS = {
  // Voltage
  uV: 1e-6,
  mV: 1e-3,
  V: 1,
  kV: 1e3,

  // Current
  uA: 1e-6,
  mA: 1e-3,
  A: 1,
  kA: 1e3,

  // Resistance
  mOhm: 1e-3,
  Ohm: 1,
  kOhm: 1e3,
  MOhm: 1e6,

  // Power
  uW: 1e-6,
  mW: 1e-3,
  W: 1,
  kW: 1e3,
  MW: 1e6,
};

export const UNIT_SYMBOLS = {
  uV: 'µV',
  mV: 'mV',
  V: 'V',
  kV: 'kV',
  uA: 'µA',
  mA: 'mA',
  A: 'A',
  kA: 'kA',
  mOhm: 'mΩ',
  Ohm: 'Ω',
  kOhm: 'kΩ',
  MOhm: 'MΩ',
  uW: 'µW',
  mW: 'mW',
  W: 'W',
  kW: 'kW',
  MW: 'MW',
};

/**
 * Format a number nicely into engineering notation or standard decimal
 */
export function formatElectrNumber(val: number, maxDecimals: number = 4): string {
  if (isNaN(val) || !isFinite(val)) return '–';
  if (val === 0) return '0';

  const absVal = Math.abs(val);
  if (absVal >= 1000000 || (absVal < 0.001 && absVal > 0)) {
    return val.toExponential(3);
  }

  // Avoid unnecessary trailing zeros
  const rounded = Number(val.toFixed(maxDecimals));
  return new Intl.NumberFormat('sv-SE', {
    maximumFractionDigits: maxDecimals,
  }).format(rounded);
}

/**
 * Auto-select the most readable SI unit for a base value
 */
export function autoFormatVoltage(volts: number): { value: number; unit: string; formatted: string } {
  const abs = Math.abs(volts);
  if (abs >= 1000) {
    const val = volts / 1000;
    return { value: val, unit: 'kV', formatted: `${formatElectrNumber(val)} kV` };
  } else if (abs >= 1 || abs === 0) {
    return { value: volts, unit: 'V', formatted: `${formatElectrNumber(volts)} V` };
  } else if (abs >= 0.001) {
    const val = volts * 1000;
    return { value: val, unit: 'mV', formatted: `${formatElectrNumber(val)} mV` };
  } else {
    const val = volts * 1e6;
    return { value: val, unit: 'µV', formatted: `${formatElectrNumber(val)} µV` };
  }
}

export function autoFormatCurrent(amps: number): { value: number; unit: string; formatted: string } {
  const abs = Math.abs(amps);
  if (abs >= 1000) {
    const val = amps / 1000;
    return { value: val, unit: 'kA', formatted: `${formatElectrNumber(val)} kA` };
  } else if (abs >= 1 || abs === 0) {
    return { value: amps, unit: 'A', formatted: `${formatElectrNumber(amps)} A` };
  } else if (abs >= 0.001) {
    const val = amps * 1000;
    return { value: val, unit: 'mA', formatted: `${formatElectrNumber(val)} mA` };
  } else {
    const val = amps * 1e6;
    return { value: val, unit: 'µA', formatted: `${formatElectrNumber(val)} µA` };
  }
}

export function autoFormatResistance(ohms: number): { value: number; unit: string; formatted: string } {
  const abs = Math.abs(ohms);
  if (abs >= 1e6) {
    const val = ohms / 1e6;
    return { value: val, unit: 'MΩ', formatted: `${formatElectrNumber(val)} MΩ` };
  } else if (abs >= 1000) {
    const val = ohms / 1000;
    return { value: val, unit: 'kΩ', formatted: `${formatElectrNumber(val)} kΩ` };
  } else if (abs >= 1 || abs === 0) {
    return { value: ohms, unit: 'Ω', formatted: `${formatElectrNumber(ohms)} Ω` };
  } else {
    const val = ohms * 1000;
    return { value: val, unit: 'mΩ', formatted: `${formatElectrNumber(val)} mΩ` };
  }
}

export function autoFormatPower(watts: number): { value: number; unit: string; formatted: string } {
  const abs = Math.abs(watts);
  if (abs >= 1e6) {
    const val = watts / 1e6;
    return { value: val, unit: 'MW', formatted: `${formatElectrNumber(val)} MW` };
  } else if (abs >= 1000) {
    const val = watts / 1000;
    return { value: val, unit: 'kW', formatted: `${formatElectrNumber(val)} kW` };
  } else if (abs >= 1 || abs === 0) {
    return { value: watts, unit: 'W', formatted: `${formatElectrNumber(watts)} W` };
  } else if (abs >= 0.001) {
    const val = watts * 1000;
    return { value: val, unit: 'mW', formatted: `${formatElectrNumber(val)} mW` };
  } else {
    const val = watts * 1e6;
    return { value: val, unit: 'µW', formatted: `${formatElectrNumber(val)} µW` };
  }
}

/**
 * Solve Ohm's Law and Watt's Law when any 2 values are provided
 */
export function solveOhmsLaw(
  uInput: number | null,
  iInput: number | null,
  rInput: number | null,
  pInput: number | null
): CalculationResult | null {
  const given: ElectricalVariable[] = [];
  if (uInput !== null && !isNaN(uInput) && uInput >= 0) given.push('U');
  if (iInput !== null && !isNaN(iInput) && iInput >= 0) given.push('I');
  if (rInput !== null && !isNaN(rInput) && rInput > 0) given.push('R');
  if (pInput !== null && !isNaN(pInput) && pInput >= 0) given.push('P');

  if (given.length < 2) return null;

  // Take the first two valid inputs
  const [first, second] = given;
  const pair = [first, second].sort().join('');

  let U = 0;
  let I = 0;
  let R = 0;
  let P = 0;

  const steps: string[] = [];
  const formulasUsed: {
    target: ElectricalVariable;
    formula: string;
    explanation: string;
  }[] = [];

  switch (pair) {
    case 'IU': {
      U = uInput!;
      I = iInput!;
      R = I > 0 ? U / I : 0;
      P = U * I;

      formulasUsed.push({
        target: 'R',
        formula: 'R = U / I',
        explanation: `Resistans = Spänning (${formatElectrNumber(U)} V) dividerat med Ström (${formatElectrNumber(I)} A) = ${formatElectrNumber(R)} Ω`,
      });
      formulasUsed.push({
        target: 'P',
        formula: 'P = U · I',
        explanation: `Effekt = Spänning (${formatElectrNumber(U)} V) multiplicerat med Ström (${formatElectrNumber(I)} A) = ${formatElectrNumber(P)} W`,
      });

      steps.push(`Givet: Spänning U = ${formatElectrNumber(U)} V och Ström I = ${formatElectrNumber(I)} A`);
      steps.push(`1. Beräkna resistans enligt Ohms lag: R = U / I = ${formatElectrNumber(U)} / ${formatElectrNumber(I)} = ${formatElectrNumber(R)} Ω`);
      steps.push(`2. Beräkna effekt enligt Effektlagen: P = U · I = ${formatElectrNumber(U)} · ${formatElectrNumber(I)} = ${formatElectrNumber(P)} W`);
      break;
    }

    case 'RU': {
      U = uInput!;
      R = rInput!;
      I = R > 0 ? U / R : 0;
      P = (U * U) / R;

      formulasUsed.push({
        target: 'I',
        formula: 'I = U / R',
        explanation: `Ström = Spänning (${formatElectrNumber(U)} V) dividerat med Resistans (${formatElectrNumber(R)} Ω) = ${formatElectrNumber(I)} A`,
      });
      formulasUsed.push({
        target: 'P',
        formula: 'P = U² / R',
        explanation: `Effekt = Spänning i kvadrat (${formatElectrNumber(U)}² V²) delat med Resistans (${formatElectrNumber(R)} Ω) = ${formatElectrNumber(P)} W`,
      });

      steps.push(`Givet: Spänning U = ${formatElectrNumber(U)} V och Resistans R = ${formatElectrNumber(R)} Ω`);
      steps.push(`1. Beräkna ström: I = U / R = ${formatElectrNumber(U)} / ${formatElectrNumber(R)} = ${formatElectrNumber(I)} A`);
      steps.push(`2. Beräkna effekt: P = U² / R = (${formatElectrNumber(U)})² / ${formatElectrNumber(R)} = ${formatElectrNumber(P)} W`);
      break;
    }

    case 'PU': {
      U = uInput!;
      P = pInput!;
      I = U > 0 ? P / U : 0;
      R = I > 0 ? U / I : (P > 0 ? (U * U) / P : 0);

      formulasUsed.push({
        target: 'I',
        formula: 'I = P / U',
        explanation: `Ström = Effekt (${formatElectrNumber(P)} W) delat med Spänning (${formatElectrNumber(U)} V) = ${formatElectrNumber(I)} A`,
      });
      formulasUsed.push({
        target: 'R',
        formula: 'R = U² / P',
        explanation: `Resistans = Spänning i kvadrat (${formatElectrNumber(U)}² V²) delat med Effekt (${formatElectrNumber(P)} W) = ${formatElectrNumber(R)} Ω`,
      });

      steps.push(`Givet: Spänning U = ${formatElectrNumber(U)} V och Effekt P = ${formatElectrNumber(P)} W`);
      steps.push(`1. Beräkna ström: I = P / U = ${formatElectrNumber(P)} / ${formatElectrNumber(U)} = ${formatElectrNumber(I)} A`);
      steps.push(`2. Beräkna resistans: R = U² / P = (${formatElectrNumber(U)})² / ${formatElectrNumber(P)} = ${formatElectrNumber(R)} Ω`);
      break;
    }

    case 'IR': {
      I = iInput!;
      R = rInput!;
      U = I * R;
      P = I * I * R;

      formulasUsed.push({
        target: 'U',
        formula: 'U = I · R',
        explanation: `Spänning = Ström (${formatElectrNumber(I)} A) multiplicerat med Resistans (${formatElectrNumber(R)} Ω) = ${formatElectrNumber(U)} V`,
      });
      formulasUsed.push({
        target: 'P',
        formula: 'P = I² · R',
        explanation: `Effekt = Ström i kvadrat (${formatElectrNumber(I)}² A²) multiplicerat med Resistans (${formatElectrNumber(R)} Ω) = ${formatElectrNumber(P)} W`,
      });

      steps.push(`Givet: Ström I = ${formatElectrNumber(I)} A och Resistans R = ${formatElectrNumber(R)} Ω`);
      steps.push(`1. Beräkna spänning enligt Ohms lag: U = I · R = ${formatElectrNumber(I)} · ${formatElectrNumber(R)} = ${formatElectrNumber(U)} V`);
      steps.push(`2. Beräkna effektförlust: P = I² · R = (${formatElectrNumber(I)})² · ${formatElectrNumber(R)} = ${formatElectrNumber(P)} W`);
      break;
    }

    case 'IP': {
      I = iInput!;
      P = pInput!;
      U = I > 0 ? P / I : 0;
      R = I > 0 ? P / (I * I) : 0;

      formulasUsed.push({
        target: 'U',
        formula: 'U = P / I',
        explanation: `Spänning = Effekt (${formatElectrNumber(P)} W) delat med Ström (${formatElectrNumber(I)} A) = ${formatElectrNumber(U)} V`,
      });
      formulasUsed.push({
        target: 'R',
        formula: 'R = P / I²',
        explanation: `Resistans = Effekt (${formatElectrNumber(P)} W) delat med Ström i kvadrat (${formatElectrNumber(I)}² A²) = ${formatElectrNumber(R)} Ω`,
      });

      steps.push(`Givet: Ström I = ${formatElectrNumber(I)} A och Effekt P = ${formatElectrNumber(P)} W`);
      steps.push(`1. Beräkna spänning: U = P / I = ${formatElectrNumber(P)} / ${formatElectrNumber(I)} = ${formatElectrNumber(U)} V`);
      steps.push(`2. Beräkna resistans: R = P / I² = ${formatElectrNumber(P)} / (${formatElectrNumber(I)})² = ${formatElectrNumber(R)} Ω`);
      break;
    }

    case 'PR': {
      P = pInput!;
      R = rInput!;
      U = Math.sqrt(P * R);
      I = R > 0 ? Math.sqrt(P / R) : 0;

      formulasUsed.push({
        target: 'U',
        formula: 'U = √(P · R)',
        explanation: `Spänning = Kvadratroten ur (${formatElectrNumber(P)} W · ${formatElectrNumber(R)} Ω) = ${formatElectrNumber(U)} V`,
      });
      formulasUsed.push({
        target: 'I',
        formula: 'I = √(P / R)',
        explanation: `Ström = Kvadratroten ur (${formatElectrNumber(P)} W / ${formatElectrNumber(R)} Ω) = ${formatElectrNumber(I)} A`,
      });

      steps.push(`Givet: Effekt P = ${formatElectrNumber(P)} W och Resistans R = ${formatElectrNumber(R)} Ω`);
      steps.push(`1. Beräkna spänning: U = √(P · R) = √(${formatElectrNumber(P)} · ${formatElectrNumber(R)}) = ${formatElectrNumber(U)} V`);
      steps.push(`2. Beräkna ström: I = √(P / R) = √(${formatElectrNumber(P)} / ${formatElectrNumber(R)}) = ${formatElectrNumber(I)} A`);
      break;
    }

    default:
      return null;
  }

  const allVars: ElectricalVariable[] = ['U', 'I', 'R', 'P'];
  const calculatedVars = allVars.filter((v) => !given.includes(v));

  return {
    voltage: U,
    current: I,
    resistance: R,
    power: P,
    calculatedVars,
    givenVars: [first, second],
    steps,
    formulasUsed,
    timestamp: Date.now(),
    phaseType: '1-phase',
  };
}

/**
 * Solve Ohm's Law and Power in a 3-Phase balanced system (Y or Delta)
 * U is line-to-line voltage (Huvudspänning, standard 400V)
 * I is line current (Linjeström i L1, L2, L3)
 * R is resistance per phase element (Fasresistans)
 * P is total 3-phase active power
 */
export function solveThreePhaseOhmsLaw(
  uLineInput: number | null,
  iLineInput: number | null,
  rPhaseInput: number | null,
  pTotalInput: number | null,
  connection: 'star' | 'delta' = 'star',
  cosPhi: number = 1.0
): CalculationResult | null {
  const given: ElectricalVariable[] = [];
  if (uLineInput !== null && !isNaN(uLineInput) && uLineInput > 0) given.push('U');
  if (iLineInput !== null && !isNaN(iLineInput) && iLineInput >= 0) given.push('I');
  if (rPhaseInput !== null && !isNaN(rPhaseInput) && rPhaseInput > 0) given.push('R');
  if (pTotalInput !== null && !isNaN(pTotalInput) && pTotalInput >= 0) given.push('P');

  if (given.length < 2) return null;

  const [first, second] = given;
  const pair = [first, second].sort().join('');

  const SQRT3 = Math.sqrt(3);
  const pf = Math.max(0.01, Math.min(1.0, cosPhi));
  const isStar = connection === 'star';
  const connName = isStar ? 'Y-koppling (Stjärna)' : 'D-koppling (Delta / Triangel)';

  let UL = 0;
  let IL = 0;
  let R_phase = 0;
  let P_tot = 0;

  const steps: string[] = [
    `Kopplingsart: ${connName}, Effektfaktor cos φ = ${pf.toFixed(2)}`,
  ];
  const formulasUsed: {
    target: ElectricalVariable;
    formula: string;
    explanation: string;
  }[] = [];

  switch (pair) {
    case 'IU': {
      UL = uLineInput!;
      IL = iLineInput!;
      P_tot = SQRT3 * UL * IL * pf;

      if (isStar) {
        // Y-connection: U_phase = UL / sqrt(3), I_phase = IL => R_phase = (UL / sqrt(3)) / IL
        const U_phase = UL / SQRT3;
        R_phase = IL > 0 ? U_phase / IL : 0;
        formulasUsed.push({
          target: 'P',
          formula: 'P = √3 · U_L · I_L · cos φ',
          explanation: `Total aktiv effekt = √3 · ${formatElectrNumber(UL)} V · ${formatElectrNumber(IL)} A · ${pf} = ${formatElectrNumber(P_tot)} W`,
        });
        formulasUsed.push({
          target: 'R',
          formula: 'R_fas = U_L / (√3 · I_L)',
          explanation: `Fasresistans (Y) = Fasspänning (${formatElectrNumber(U_phase)} V) / Linjeström (${formatElectrNumber(IL)} A) = ${formatElectrNumber(R_phase)} Ω`,
        });
        steps.push(`1. Beräkna total effekt: P = √3 · U_L · I_L · cos φ = 1,732 · ${formatElectrNumber(UL)} · ${formatElectrNumber(IL)} · ${pf} = ${formatElectrNumber(P_tot)} W`);
        steps.push(`2. Beräkna fasspänning: U_f = U_L / √3 = ${formatElectrNumber(UL)} / 1,732 = ${formatElectrNumber(U_phase)} V`);
        steps.push(`3. Beräkna fasresistans i stjärna: R_fas = U_f / I_L = ${formatElectrNumber(U_phase)} / ${formatElectrNumber(IL)} = ${formatElectrNumber(R_phase)} Ω`);
      } else {
        // Delta connection: U_phase = UL, I_phase = IL / sqrt(3) => R_phase = UL / (IL / sqrt(3)) = sqrt(3) * UL / IL
        const I_phase = IL / SQRT3;
        R_phase = IL > 0 ? (SQRT3 * UL) / IL : 0;
        formulasUsed.push({
          target: 'P',
          formula: 'P = √3 · U_L · I_L · cos φ',
          explanation: `Total aktiv effekt = √3 · ${formatElectrNumber(UL)} V · ${formatElectrNumber(IL)} A · ${pf} = ${formatElectrNumber(P_tot)} W`,
        });
        formulasUsed.push({
          target: 'R',
          formula: 'R_fas = √3 · U_L / I_L',
          explanation: `Fasresistans (Δ) = Huvudspänning (${formatElectrNumber(UL)} V) / Fasström (${formatElectrNumber(I_phase)} A) = ${formatElectrNumber(R_phase)} Ω`,
        });
        steps.push(`1. Beräkna total effekt: P = √3 · U_L · I_L · cos φ = 1,732 · ${formatElectrNumber(UL)} · ${formatElectrNumber(IL)} · ${pf} = ${formatElectrNumber(P_tot)} W`);
        steps.push(`2. Beräkna fasström i triangel: I_f = I_L / √3 = ${formatElectrNumber(IL)} / 1,732 = ${formatElectrNumber(I_phase)} A`);
        steps.push(`3. Beräkna fasresistans i delta: R_fas = U_L / I_f = ${formatElectrNumber(UL)} / ${formatElectrNumber(I_phase)} = ${formatElectrNumber(R_phase)} Ω`);
      }
      break;
    }

    case 'RU': {
      UL = uLineInput!;
      R_phase = rPhaseInput!;

      if (isStar) {
        // Y-connection
        const U_phase = UL / SQRT3;
        IL = R_phase > 0 ? U_phase / R_phase : 0;
        P_tot = SQRT3 * UL * IL * pf;

        formulasUsed.push({
          target: 'I',
          formula: 'I_L = U_L / (√3 · R_fas)',
          explanation: `Linjeström (Y) = ${formatElectrNumber(UL)} V / (√3 · ${formatElectrNumber(R_phase)} Ω) = ${formatElectrNumber(IL)} A`,
        });
        formulasUsed.push({
          target: 'P',
          formula: 'P = U_L² / R_fas · cos φ',
          explanation: `Effekt (Y) = (${formatElectrNumber(UL)} V)² / ${formatElectrNumber(R_phase)} Ω = ${formatElectrNumber(P_tot)} W`,
        });
        steps.push(`1. Beräkna fasspänning: U_f = U_L / √3 = ${formatElectrNumber(UL)} / 1,732 = ${formatElectrNumber(U_phase)} V`);
        steps.push(`2. Beräkna linjeström (samma som fasström i Y): I_L = U_f / R_fas = ${formatElectrNumber(U_phase)} / ${formatElectrNumber(R_phase)} = ${formatElectrNumber(IL)} A`);
        steps.push(`3. Beräkna total effekt: P = √3 · U_L · I_L · cos φ = ${formatElectrNumber(P_tot)} W`);
      } else {
        // Delta connection
        const I_phase = R_phase > 0 ? UL / R_phase : 0;
        IL = SQRT3 * I_phase;
        P_tot = SQRT3 * UL * IL * pf;

        formulasUsed.push({
          target: 'I',
          formula: 'I_L = √3 · (U_L / R_fas)',
          explanation: `Linjeström (Δ) = √3 · (${formatElectrNumber(UL)} V / ${formatElectrNumber(R_phase)} Ω) = ${formatElectrNumber(IL)} A`,
        });
        formulasUsed.push({
          target: 'P',
          formula: 'P = 3 · U_L² / R_fas · cos φ',
          explanation: `Effekt (Δ) = 3 · (${formatElectrNumber(UL)} V)² / ${formatElectrNumber(R_phase)} Ω = ${formatElectrNumber(P_tot)} W`,
        });
        steps.push(`1. Beräkna fasström i triangel: I_f = U_L / R_fas = ${formatElectrNumber(UL)} / ${formatElectrNumber(R_phase)} = ${formatElectrNumber(I_phase)} A`);
        steps.push(`2. Beräkna linjeström: I_L = √3 · I_f = 1,732 · ${formatElectrNumber(I_phase)} = ${formatElectrNumber(IL)} A`);
        steps.push(`3. Beräkna total effekt: P = 3 · U_L · I_f · cos φ = ${formatElectrNumber(P_tot)} W`);
      }
      break;
    }

    case 'PU': {
      UL = uLineInput!;
      P_tot = pTotalInput!;

      // IL = P / (sqrt(3) * UL * cosPhi)
      const denom = SQRT3 * UL * pf;
      IL = denom > 0 ? P_tot / denom : 0;

      if (isStar) {
        const U_phase = UL / SQRT3;
        R_phase = IL > 0 ? U_phase / IL : 0;
        formulasUsed.push({
          target: 'I',
          formula: 'I_L = P / (√3 · U_L · cos φ)',
          explanation: `Linjeström = ${formatElectrNumber(P_tot)} W / (√3 · ${formatElectrNumber(UL)} V · ${pf}) = ${formatElectrNumber(IL)} A`,
        });
        formulasUsed.push({
          target: 'R',
          formula: 'R_fas = U_L² / P · cos φ',
          explanation: `Fasresistans (Y) = (${formatElectrNumber(UL)} V)² / ${formatElectrNumber(P_tot)} W = ${formatElectrNumber(R_phase)} Ω`,
        });
        steps.push(`1. Beräkna linjeström: I_L = P / (√3 · U_L · cos φ) = ${formatElectrNumber(P_tot)} / (1,732 · ${formatElectrNumber(UL)} · ${pf}) = ${formatElectrNumber(IL)} A`);
        steps.push(`2. Beräkna fasspänning: U_f = U_L / √3 = ${formatElectrNumber(U_phase)} V`);
        steps.push(`3. Beräkna fasresistans i Y: R_fas = U_f / I_L = ${formatElectrNumber(R_phase)} Ω`);
      } else {
        const I_phase = IL / SQRT3;
        R_phase = I_phase > 0 ? UL / I_phase : 0;
        formulasUsed.push({
          target: 'I',
          formula: 'I_L = P / (√3 · U_L · cos φ)',
          explanation: `Linjeström = ${formatElectrNumber(P_tot)} W / (√3 · ${formatElectrNumber(UL)} V · ${pf}) = ${formatElectrNumber(IL)} A`,
        });
        formulasUsed.push({
          target: 'R',
          formula: 'R_fas = 3 · U_L² / P · cos φ',
          explanation: `Fasresistans (Δ) = 3 · (${formatElectrNumber(UL)} V)² / ${formatElectrNumber(P_tot)} W = ${formatElectrNumber(R_phase)} Ω`,
        });
        steps.push(`1. Beräkna linjeström: I_L = P / (√3 · U_L · cos φ) = ${formatElectrNumber(IL)} A`);
        steps.push(`2. Beräkna fasström i delta: I_f = I_L / √3 = ${formatElectrNumber(I_phase)} A`);
        steps.push(`3. Beräkna fasresistans i delta: R_fas = U_L / I_f = ${formatElectrNumber(R_phase)} Ω`);
      }
      break;
    }

    case 'IR': {
      IL = iLineInput!;
      R_phase = rPhaseInput!;

      if (isStar) {
        // Y-connection: I_phase = IL, U_phase = IL * R_phase, UL = sqrt(3) * U_phase
        const U_phase = IL * R_phase;
        UL = SQRT3 * U_phase;
        P_tot = 3 * (IL * IL) * R_phase * pf;

        formulasUsed.push({
          target: 'U',
          formula: 'U_L = √3 · I_L · R_fas',
          explanation: `Huvudspänning (Y) = √3 · ${formatElectrNumber(IL)} A · ${formatElectrNumber(R_phase)} Ω = ${formatElectrNumber(UL)} V`,
        });
        formulasUsed.push({
          target: 'P',
          formula: 'P = 3 · I_L² · R_fas · cos φ',
          explanation: `Effekt = 3 · (${formatElectrNumber(IL)} A)² · ${formatElectrNumber(R_phase)} Ω = ${formatElectrNumber(P_tot)} W`,
        });
        steps.push(`1. Beräkna fasspänning: U_f = I_L · R_fas = ${formatElectrNumber(IL)} · ${formatElectrNumber(R_phase)} = ${formatElectrNumber(U_phase)} V`);
        steps.push(`2. Beräkna huvudspänning: U_L = √3 · U_f = 1,732 · ${formatElectrNumber(U_phase)} = ${formatElectrNumber(UL)} V`);
        steps.push(`3. Beräkna total aktiv effekt: P = 3 · I_L² · R_fas · cos φ = ${formatElectrNumber(P_tot)} W`);
      } else {
        // Delta connection: I_phase = IL / sqrt(3), UL = I_phase * R_phase = (IL / sqrt(3)) * R_phase
        const I_phase = IL / SQRT3;
        UL = I_phase * R_phase;
        P_tot = (IL * IL) * R_phase * pf;

        formulasUsed.push({
          target: 'U',
          formula: 'U_L = (I_L / √3) · R_fas',
          explanation: `Huvudspänning (Δ) = (${formatElectrNumber(IL)} A / √3) · ${formatElectrNumber(R_phase)} Ω = ${formatElectrNumber(UL)} V`,
        });
        formulasUsed.push({
          target: 'P',
          formula: 'P = I_L² · R_fas · cos φ',
          explanation: `Effekt (Δ) = (${formatElectrNumber(IL)} A)² · ${formatElectrNumber(R_phase)} Ω = ${formatElectrNumber(P_tot)} W`,
        });
        steps.push(`1. Beräkna fasström: I_f = I_L / √3 = ${formatElectrNumber(I_phase)} A`);
        steps.push(`2. Beräkna huvudspänning: U_L = I_f · R_fas = ${formatElectrNumber(UL)} V`);
        steps.push(`3. Beräkna total effekt: P = √3 · U_L · I_L · cos φ = ${formatElectrNumber(P_tot)} W`);
      }
      break;
    }

    case 'IP': {
      IL = iLineInput!;
      P_tot = pTotalInput!;

      // UL = P / (sqrt(3) * IL * cosPhi)
      const denom = SQRT3 * IL * pf;
      UL = denom > 0 ? P_tot / denom : 0;

      if (isStar) {
        const U_phase = UL / SQRT3;
        R_phase = IL > 0 ? U_phase / IL : 0;
        formulasUsed.push({
          target: 'U',
          formula: 'U_L = P / (√3 · I_L · cos φ)',
          explanation: `Huvudspänning = ${formatElectrNumber(P_tot)} W / (√3 · ${formatElectrNumber(IL)} A · ${pf}) = ${formatElectrNumber(UL)} V`,
        });
        formulasUsed.push({
          target: 'R',
          formula: 'R_fas = P / (3 · I_L² · cos φ)',
          explanation: `Fasresistans (Y) = ${formatElectrNumber(P_tot)} W / (3 · (${formatElectrNumber(IL)})² · ${pf}) = ${formatElectrNumber(R_phase)} Ω`,
        });
        steps.push(`1. Beräkna huvudspänning: U_L = P / (√3 · I_L · cos φ) = ${formatElectrNumber(UL)} V`);
        steps.push(`2. Beräkna fasresistans: R_fas = (U_L / √3) / I_L = ${formatElectrNumber(R_phase)} Ω`);
      } else {
        const I_phase = IL / SQRT3;
        R_phase = I_phase > 0 ? UL / I_phase : 0;
        formulasUsed.push({
          target: 'U',
          formula: 'U_L = P / (√3 · I_L · cos φ)',
          explanation: `Huvudspänning = ${formatElectrNumber(P_tot)} W / (√3 · ${formatElectrNumber(IL)} A · ${pf}) = ${formatElectrNumber(UL)} V`,
        });
        formulasUsed.push({
          target: 'R',
          formula: 'R_fas = P / (I_L² · cos φ)',
          explanation: `Fasresistans (Δ) = ${formatElectrNumber(P_tot)} W / ((${formatElectrNumber(IL)})² · ${pf}) = ${formatElectrNumber(R_phase)} Ω`,
        });
        steps.push(`1. Beräkna huvudspänning: U_L = P / (√3 · I_L · cos φ) = ${formatElectrNumber(UL)} V`);
        steps.push(`2. Beräkna fasresistans i delta: R_fas = U_L / (I_L / √3) = ${formatElectrNumber(R_phase)} Ω`);
      }
      break;
    }

    case 'PR': {
      P_tot = pTotalInput!;
      R_phase = rPhaseInput!;

      if (isStar) {
        // P = UL^2 / R_phase * cosPhi => UL = sqrt(P * R_phase / cosPhi)
        UL = Math.sqrt((P_tot * R_phase) / pf);
        IL = R_phase > 0 ? (UL / SQRT3) / R_phase : 0;

        formulasUsed.push({
          target: 'U',
          formula: 'U_L = √(P · R_fas / cos φ)',
          explanation: `Huvudspänning (Y) = √(${formatElectrNumber(P_tot)} · ${formatElectrNumber(R_phase)} / ${pf}) = ${formatElectrNumber(UL)} V`,
        });
        formulasUsed.push({
          target: 'I',
          formula: 'I_L = √(P / (3 · R_fas · cos φ))',
          explanation: `Linjeström (Y) = √(${formatElectrNumber(P_tot)} / (3 · ${formatElectrNumber(R_phase)} · ${pf})) = ${formatElectrNumber(IL)} A`,
        });
        steps.push(`1. Beräkna huvudspänning: U_L = √(P · R_fas / cos φ) = ${formatElectrNumber(UL)} V`);
        steps.push(`2. Beräkna linjeström: I_L = (U_L / √3) / R_fas = ${formatElectrNumber(IL)} A`);
      } else {
        // P = 3 * UL^2 / R_phase * cosPhi => UL = sqrt(P * R_phase / (3 * cosPhi))
        UL = Math.sqrt((P_tot * R_phase) / (3 * pf));
        const I_phase = R_phase > 0 ? UL / R_phase : 0;
        IL = SQRT3 * I_phase;

        formulasUsed.push({
          target: 'U',
          formula: 'U_L = √(P · R_fas / (3 · cos φ))',
          explanation: `Huvudspänning (Δ) = √(${formatElectrNumber(P_tot)} · ${formatElectrNumber(R_phase)} / (3 · ${pf})) = ${formatElectrNumber(UL)} V`,
        });
        formulasUsed.push({
          target: 'I',
          formula: 'I_L = √(P / (R_fas · cos φ))',
          explanation: `Linjeström (Δ) = √(${formatElectrNumber(P_tot)} / (${formatElectrNumber(R_phase)} · ${pf})) = ${formatElectrNumber(IL)} A`,
        });
        steps.push(`1. Beräkna huvudspänning: U_L = √(P · R_fas / (3 · cos φ)) = ${formatElectrNumber(UL)} V`);
        steps.push(`2. Beräkna linjeström: I_L = √3 · (U_L / R_fas) = ${formatElectrNumber(IL)} A`);
      }
      break;
    }

    default:
      return null;
  }

  const allVars: ElectricalVariable[] = ['U', 'I', 'R', 'P'];
  const calculatedVars = allVars.filter((v) => !given.includes(v));

  const U_phase = isStar ? UL / SQRT3 : UL;
  const I_phase = isStar ? IL : IL / SQRT3;
  const S_tot = SQRT3 * UL * IL;
  const sinPhi = Math.sqrt(Math.max(0, 1 - pf * pf));
  const Q_tot = SQRT3 * UL * IL * sinPhi;

  return {
    voltage: UL,
    current: IL,
    resistance: R_phase,
    power: P_tot,
    calculatedVars,
    givenVars: [first, second],
    steps,
    formulasUsed,
    timestamp: Date.now(),
    phaseType: '3-phase',
    threePhaseConnection: connection,
    lineVoltage: UL,
    phaseVoltage: U_phase,
    lineCurrent: IL,
    phaseCurrent: I_phase,
    cosPhi: pf,
    apparentPower: S_tot,
    reactivePower: Q_tot,
  };
}

/**
 * Standard Presets for Swedish electricians and hobbyists (1-Phase and 3-Phase)
 */
export const OHMS_PRESETS: PresetScenario[] = [
  {
    id: 'socket-230-10a',
    name: '230V Vägguttag (10A)',
    description: 'Maximal belastning för 10A dvärgbrytare i bostad',
    category: 'Hushåll',
    phaseType: '1-phase',
    knowns: {
      voltage: { value: 230, unit: 'V' },
      current: { value: 10, unit: 'A' },
    },
  },
  {
    id: 'socket-230-16a',
    name: '230V Vägguttag (16A)',
    description: 'Maximal belastning för tvättmaskin/spis/elbil med 16A säkring',
    category: 'Hushåll',
    phaseType: '1-phase',
    knowns: {
      voltage: { value: 230, unit: 'V' },
      current: { value: 16, unit: 'A' },
    },
  },
  {
    id: 'heater-2000w',
    name: '230V El-element (2000W)',
    description: 'Konvektorelement / värmefläkt för inomhusbruk',
    category: 'Hushåll',
    phaseType: '1-phase',
    knowns: {
      voltage: { value: 230, unit: 'V' },
      power: { value: 2000, unit: 'W' },
    },
  },
  {
    id: 'car-12v-headlight',
    name: '12V Bilstrålkastare (55W H7)',
    description: 'Typisk H7 halogenlampa i personbilar',
    category: 'Fordon',
    phaseType: '1-phase',
    knowns: {
      voltage: { value: 12, unit: 'V' },
      power: { value: 55, unit: 'W' },
    },
  },
  {
    id: 'industrial-sensor-24v',
    name: '24V DC Industri / PLC (4-20mA)',
    description: 'Industriell strömslinga och sensorslinga',
    category: 'Industri',
    phaseType: '1-phase',
    knowns: {
      voltage: { value: 24, unit: 'V' },
      current: { value: 20, unit: 'mA' },
    },
  },
  {
    id: 'led-resistor-5v',
    name: '5V USB / Arduino LED',
    description: 'Typisk röd lysdiod (2V framspänning, 20mA)',
    category: 'Elektronik',
    phaseType: '1-phase',
    knowns: {
      voltage: { value: 3, unit: 'V' }, // 5V - 2V drop
      current: { value: 20, unit: 'mA' },
    },
  },
];

export const THREE_PHASE_PRESETS: PresetScenario[] = [
  {
    id: 'cee-16a-max',
    name: '400V 16A CEE-uttag (11 kW max)',
    description: 'Standard rött 16A trefasuttag i verkstad, garage och byggcentral',
    category: 'Trefas',
    phaseType: '3-phase',
    connection: 'star',
    cosPhi: 1.0,
    knowns: {
      voltage: { value: 400, unit: 'V' },
      current: { value: 16, unit: 'A' },
    },
  },
  {
    id: 'cee-32a-max',
    name: '400V 32A CEE-uttag (22 kW max)',
    description: 'Kraftuttag för större maskiner, elbilssnabbladdare & byggfläktar',
    category: 'Trefas',
    phaseType: '3-phase',
    connection: 'star',
    cosPhi: 1.0,
    knowns: {
      voltage: { value: 400, unit: 'V' },
      current: { value: 32, unit: 'A' },
    },
  },
  {
    id: 'sauna-heater-9kw',
    name: '400V 9 kW Bastuaggregat (Y-kopplat)',
    description: 'Vanligt trefas bastuaggregat med 3 st 3 kW element i stjärna',
    category: 'Trefas',
    phaseType: '3-phase',
    connection: 'star',
    cosPhi: 1.0,
    knowns: {
      voltage: { value: 400, unit: 'V' },
      power: { value: 9, unit: 'kW' },
    },
  },
  {
    id: 'heating-element-6kw-delta',
    name: '400V 6 kW Elpatron (D-kopplad)',
    description: 'Ackumulatortank elpatron kopplad i triangel (400V per element)',
    category: 'Trefas',
    phaseType: '3-phase',
    connection: 'delta',
    cosPhi: 1.0,
    knowns: {
      voltage: { value: 400, unit: 'V' },
      power: { value: 6, unit: 'kW' },
    },
  },
  {
    id: 'motor-11kw-pump',
    name: '400V 11 kW Asynkronmotor (Pump/Fläkt)',
    description: 'Trefas industrimotor vid full last (cos φ = 0.86)',
    category: 'Trefas',
    phaseType: '3-phase',
    connection: 'delta',
    cosPhi: 0.86,
    knowns: {
      voltage: { value: 400, unit: 'V' },
      power: { value: 11, unit: 'kW' },
    },
  },
  {
    id: 'motor-4kw-workshop',
    name: '400V 4 kW Kompressor / Såg',
    description: 'Mindre verkstadsmotor (cos φ = 0.84)',
    category: 'Trefas',
    phaseType: '3-phase',
    connection: 'star',
    cosPhi: 0.84,
    knowns: {
      voltage: { value: 400, unit: 'V' },
      power: { value: 4, unit: 'kW' },
    },
  },
];

/**
 * Calculate neutral current I_N in unbalanced 3-phase system with 120° phase angles
 * I_N = sqrt(I1^2 + I2^2 + I3^2 - I1*I2 - I2*I3 - I3*I1)
 */
export function calculateNeutralCurrent(i1: number, i2: number, i3: number): number {
  const sumSq = i1 * i1 + i2 * i2 + i3 * i3;
  const cross = i1 * i2 + i2 * i3 + i3 * i1;
  const inside = Math.max(0, sumSq - cross);
  return Math.sqrt(inside);
}

