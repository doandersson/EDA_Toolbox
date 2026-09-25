/**
 * Mathematical utilities and lookup tables for electrical and physical unit conversions
 * tailored for electricians, field engineers, and industrial technicians.
 */

// --- 1. POWER CONVERSIONS (kW, hk/PS, hp, W, BTU/h) ---

export const METRIC_HP_FACTOR = 0.73549875; // 1 hk (metrisk hästkraft / PS) = 735.49875 W
export const MECHANICAL_HP_FACTOR = 0.74569987; // 1 hp (imperial / mekanisk hästkraft) = 745.69987 W
export const BTU_PER_HOUR_PER_KW = 3412.142; // 1 kW = 3412.142 BTU/h
export const KCAL_PER_HOUR_PER_KW = 859.845; // 1 kW = 859.845 kcal/h

export interface StandardMotorRating {
  kw: number;
  metricHk: number;
  imperialHp: number;
  typicalCurrent400V: number; // Cirka märkström vid 400V trefas (A)
  typicalRpm: string;
}

export const STANDARD_MOTOR_RATINGS: StandardMotorRating[] = [
  { kw: 0.18, metricHk: 0.25, imperialHp: 0.24, typicalCurrent400V: 0.58, typicalRpm: '1400 rpm' },
  { kw: 0.25, metricHk: 0.34, imperialHp: 0.34, typicalCurrent400V: 0.75, typicalRpm: '1400 rpm' },
  { kw: 0.37, metricHk: 0.50, imperialHp: 0.50, typicalCurrent400V: 1.05, typicalRpm: '1400 rpm' },
  { kw: 0.55, metricHk: 0.75, imperialHp: 0.74, typicalCurrent400V: 1.50, typicalRpm: '1400 rpm' },
  { kw: 0.75, metricHk: 1.02, imperialHp: 1.01, typicalCurrent400V: 1.90, typicalRpm: '1420 rpm' },
  { kw: 1.1, metricHk: 1.50, imperialHp: 1.48, typicalCurrent400V: 2.65, typicalRpm: '1430 rpm' },
  { kw: 1.5, metricHk: 2.04, imperialHp: 2.01, typicalCurrent400V: 3.50, typicalRpm: '1435 rpm' },
  { kw: 2.2, metricHk: 2.99, imperialHp: 2.95, typicalCurrent400V: 4.90, typicalRpm: '1440 rpm' },
  { kw: 3.0, metricHk: 4.08, imperialHp: 4.02, typicalCurrent400V: 6.40, typicalRpm: '1440 rpm' },
  { kw: 4.0, metricHk: 5.44, imperialHp: 5.36, typicalCurrent400V: 8.30, typicalRpm: '1450 rpm' },
  { kw: 5.5, metricHk: 7.48, imperialHp: 7.38, typicalCurrent400V: 11.2, typicalRpm: '1455 rpm' },
  { kw: 7.5, metricHk: 10.2, imperialHp: 10.1, typicalCurrent400V: 14.8, typicalRpm: '1460 rpm' },
  { kw: 11.0, metricHk: 15.0, imperialHp: 14.8, typicalCurrent400V: 21.5, typicalRpm: '1465 rpm' },
  { kw: 15.0, metricHk: 20.4, imperialHp: 20.1, typicalCurrent400V: 29.0, typicalRpm: '1470 rpm' },
  { kw: 18.5, metricHk: 25.2, imperialHp: 24.8, typicalCurrent400V: 35.0, typicalRpm: '1470 rpm' },
  { kw: 22.0, metricHk: 29.9, imperialHp: 29.5, typicalCurrent400V: 41.5, typicalRpm: '1475 rpm' },
  { kw: 30.0, metricHk: 40.8, imperialHp: 40.2, typicalCurrent400V: 56.0, typicalRpm: '1475 rpm' },
  { kw: 37.0, metricHk: 50.3, imperialHp: 49.6, typicalCurrent400V: 69.0, typicalRpm: '1480 rpm' },
  { kw: 45.0, metricHk: 61.2, imperialHp: 60.3, typicalCurrent400V: 83.0, typicalRpm: '1480 rpm' },
  { kw: 55.0, metricHk: 74.8, imperialHp: 73.8, typicalCurrent400V: 100.0, typicalRpm: '1485 rpm' },
  { kw: 75.0, metricHk: 102.0, imperialHp: 100.6, typicalCurrent400V: 135.0, typicalRpm: '1485 rpm' },
  { kw: 90.0, metricHk: 122.4, imperialHp: 120.7, typicalCurrent400V: 162.0, typicalRpm: '1490 rpm' },
  { kw: 110.0, metricHk: 149.6, imperialHp: 147.5, typicalCurrent400V: 198.0, typicalRpm: '1490 rpm' },
  { kw: 132.0, metricHk: 179.5, imperialHp: 177.0, typicalCurrent400V: 236.0, typicalRpm: '1490 rpm' },
  { kw: 160.0, metricHk: 217.5, imperialHp: 214.6, typicalCurrent400V: 285.0, typicalRpm: '1492 rpm' },
];

// --- 2. AWG (AMERICAN WIRE GAUGE) & METRIC CABLE AREA (mm²) ---

export interface AwgTableEntry {
  awg: string;
  gaugeIndex: number; // -3 for 4/0, -2 for 3/0, -1 for 2/0, 0 for 1/0, 1 for 1, etc.
  diameterMm: number;
  areaMm2: number;
  resistanceOhmPerKm: number; // Koppar vid 20°C
  swedishEquivalent: string; // Närmaste svenska standardarea
  typicalFuseAmps: string; // Typisk NEC säkring / strömvärde
}

export const AWG_TABLE: AwgTableEntry[] = [
  { awg: '4/0 (0000)', gaugeIndex: -3, diameterMm: 11.684, areaMm2: 107.22, resistanceOhmPerKm: 0.1608, swedishEquivalent: '120 mm²', typicalFuseAmps: '230 A' },
  { awg: '3/0 (000)', gaugeIndex: -2, diameterMm: 10.404, areaMm2: 85.01, resistanceOhmPerKm: 0.2028, swedishEquivalent: '95 mm²', typicalFuseAmps: '200 A' },
  { awg: '2/0 (00)', gaugeIndex: -1, diameterMm: 9.266, areaMm2: 67.43, resistanceOhmPerKm: 0.2557, swedishEquivalent: '70 mm²', typicalFuseAmps: '175 A' },
  { awg: '1/0 (0)', gaugeIndex: 0, diameterMm: 8.251, areaMm2: 53.49, resistanceOhmPerKm: 0.3224, swedishEquivalent: '50 eller 70 mm²', typicalFuseAmps: '150 A' },
  { awg: '1', gaugeIndex: 1, diameterMm: 7.348, areaMm2: 42.41, resistanceOhmPerKm: 0.4066, swedishEquivalent: '50 mm²', typicalFuseAmps: '130 A' },
  { awg: '2', gaugeIndex: 2, diameterMm: 6.544, areaMm2: 33.62, resistanceOhmPerKm: 0.5127, swedishEquivalent: '35 mm²', typicalFuseAmps: '115 A' },
  { awg: '3', gaugeIndex: 3, diameterMm: 5.827, areaMm2: 26.67, resistanceOhmPerKm: 0.6465, swedishEquivalent: '25 mm² / 35 mm²', typicalFuseAmps: '100 A' },
  { awg: '4', gaugeIndex: 4, diameterMm: 5.189, areaMm2: 21.15, resistanceOhmPerKm: 0.8152, swedishEquivalent: '25 mm²', typicalFuseAmps: '85 A' },
  { awg: '6', gaugeIndex: 6, diameterMm: 4.115, areaMm2: 13.30, resistanceOhmPerKm: 1.296, swedishEquivalent: '16 mm²', typicalFuseAmps: '65 A' },
  { awg: '8', gaugeIndex: 8, diameterMm: 3.264, areaMm2: 8.366, resistanceOhmPerKm: 2.061, swedishEquivalent: '10 mm²', typicalFuseAmps: '45 A' },
  { awg: '10', gaugeIndex: 10, diameterMm: 2.588, areaMm2: 5.261, resistanceOhmPerKm: 3.277, swedishEquivalent: '6.0 mm²', typicalFuseAmps: '30 A' },
  { awg: '12', gaugeIndex: 12, diameterMm: 2.053, areaMm2: 3.309, resistanceOhmPerKm: 5.211, swedishEquivalent: '4.0 mm²', typicalFuseAmps: '20 A' },
  { awg: '14', gaugeIndex: 14, diameterMm: 1.628, areaMm2: 2.081, resistanceOhmPerKm: 8.286, swedishEquivalent: '2.5 mm² (el. 1.5)', typicalFuseAmps: '15 A' },
  { awg: '16', gaugeIndex: 16, diameterMm: 1.291, areaMm2: 1.309, resistanceOhmPerKm: 13.17, swedishEquivalent: '1.5 mm²', typicalFuseAmps: '10 A' },
  { awg: '18', gaugeIndex: 18, diameterMm: 1.024, areaMm2: 0.823, resistanceOhmPerKm: 20.95, swedishEquivalent: '0.75 el. 1.0 mm²', typicalFuseAmps: '7 A' },
  { awg: '20', gaugeIndex: 20, diameterMm: 0.812, areaMm2: 0.518, resistanceOhmPerKm: 33.31, swedishEquivalent: '0.5 mm²', typicalFuseAmps: '5 A' },
  { awg: '22', gaugeIndex: 22, diameterMm: 0.644, areaMm2: 0.326, resistanceOhmPerKm: 52.96, swedishEquivalent: '0.34 mm²', typicalFuseAmps: '3 A' },
  { awg: '24', gaugeIndex: 24, diameterMm: 0.511, areaMm2: 0.205, resistanceOhmPerKm: 84.22, swedishEquivalent: '0.22 mm²', typicalFuseAmps: '2 A' },
  { awg: '26', gaugeIndex: 26, diameterMm: 0.405, areaMm2: 0.129, resistanceOhmPerKm: 133.9, swedishEquivalent: '0.14 mm²', typicalFuseAmps: '1 A' },
];

export const SWEDISH_STANDARD_AREAS = [
  0.5, 0.75, 1.0, 1.5, 2.5, 4.0, 6.0, 10.0, 16.0, 25.0, 35.0, 50.0, 70.0, 95.0, 120.0, 150.0, 185.0, 240.0,
];

/**
 * Calculate AWG diameter in mm using exact mathematical formula:
 * d_n = 0.127 * 92^((36 - n) / 39)
 */
export function calculateAwgDiameterMm(gauge: number): number {
  return 0.127 * Math.pow(92, (36 - gauge) / 39);
}

/**
 * Calculate AWG cross-sectional area in mm²:
 * A = (pi / 4) * d^2
 */
export function calculateAwgAreaMm2(gauge: number): number {
  const d = calculateAwgDiameterMm(gauge);
  return (Math.PI / 4) * Math.pow(d, 2);
}

/**
 * Given area in mm², calculate equivalent mathematical AWG:
 * n = -39 * log92(d / 0.127) + 36
 */
export function calculateExactAwgFromAreaMm2(areaMm2: number): number {
  if (areaMm2 <= 0) return 0;
  const d = Math.sqrt((4 * areaMm2) / Math.PI);
  const log92 = Math.log(92);
  const n = 36 - 39 * (Math.log(d / 0.127) / log92);
  return n;
}

/**
 * Find nearest standard Swedish cable area (mm²)
 */
export function findNearestSwedishCableArea(areaMm2: number): number {
  let closest = SWEDISH_STANDARD_AREAS[0];
  let minDiff = Math.abs(areaMm2 - closest);
  for (const a of SWEDISH_STANDARD_AREAS) {
    const diff = Math.abs(areaMm2 - a);
    if (diff < minDiff) {
      minDiff = diff;
      closest = a;
    }
  }
  return closest;
}

// --- 3. TORQUE (MOMENT) CONVERSIONS ---
// 1 Nm = 8.85074579 lbf·in
// 1 Nm = 0.73756215 lbf·ft
// 1 Nm = 10.19716213 kgf·cm

export const TORQUE_FACTORS = {
  nm_to_lbfin: 8.85074579,
  nm_to_lbfft: 0.73756215,
  nm_to_kgfcm: 10.19716213,
};

export interface TorqueReferenceItem {
  component: string;
  nmRange: string;
  lbfInRange: string;
  notes: string;
}

export const TYPICAL_ELECTRICAL_TORQUES: TorqueReferenceItem[] = [
  { component: 'Radplintar (DIN-skena, skruvanslutning 2.5–4 mm²)', nmRange: '0.6 – 0.8 Nm', lbfInRange: '5.3 – 7.1 lbf·in', notes: 'Dra ej för hårt; risk för gängpaj i mässingskropp.' },
  { component: 'Dvärgbrytare (MCB, 10–25A)', nmRange: '2.0 – 2.8 Nm', lbfInRange: '17.7 – 24.8 lbf·in', notes: 'Typisk tillverkarspec (t.ex. Hager, Schneider, ABB). Förhindrar varmgång.' },
  { component: 'Jordfelsbrytare (JFB, 25–63A)', nmRange: '2.5 – 3.0 Nm', lbfInRange: '22.1 – 26.5 lbf·in', notes: 'Kräver PZ2 eller Pozidriv-spårskruvmejsel.' },
  { component: 'Diazed passdel & huvudsäkringssockel (GII/GIII)', nmRange: '3.0 – 4.5 Nm', lbfInRange: '26.5 – 39.8 lbf·in', notes: 'Viktigt att bottenkontakten bottnar ordentligt.' },
  { component: 'Motorklämplint M4 skruv', nmRange: '1.2 – 1.5 Nm', lbfInRange: '10.6 – 13.3 lbf·in', notes: 'Små asynkronmotorer upp till ca 2.2 kW.' },
  { component: 'Motorklämplint M5 skruv', nmRange: '2.0 – 2.5 Nm', lbfInRange: '17.7 – 22.1 lbf·in', notes: 'Motorer 3.0 kW – 7.5 kW.' },
  { component: 'Motorklämplint M6 skruv', nmRange: '3.5 – 4.0 Nm', lbfInRange: '31.0 – 35.4 lbf·in', notes: 'Motorer 11 kW – 22 kW.' },
  { component: 'Motorklämplint M8 skruv / Kabelskor', nmRange: '6.0 – 8.0 Nm', lbfInRange: '53.1 – 70.8 lbf·in', notes: 'Större industrimotorer och fasskenor.' },
  { component: 'PEN / Huvudjordningsskena M10', nmRange: '15 – 20 Nm', lbfInRange: '133 – 177 lbf·in', notes: 'Kräver momentnyckel och korrekt bricka.' },
];

// --- 4. TEMPERATURE & CONDUCTOR RESISTANCE CORRECTION ---
// R(T) = R20 * (1 + alpha * (T - 20))
export const TEMP_COEFF_COPPER = 0.00393; // 1 / °C vid 20°C
export const TEMP_COEFF_ALUMINUM = 0.00403; // 1 / °C vid 20°C

export function celsiusToFahrenheit(c: number): number {
  return (c * 9) / 5 + 32;
}

export function fahrenheitToCelsius(f: number): number {
  return ((f - 32) * 5) / 9;
}

export function celsiusToKelvin(c: number): number {
  return c + 273.15;
}

export function kelvinToCelsius(k: number): number {
  return k - 273.15;
}

export function calculateResistanceAtTemp(
  r20: number,
  targetTempC: number,
  material: 'copper' | 'aluminum' = 'copper'
): { rTemp: number; percentageIncrease: number } {
  const alpha = material === 'copper' ? TEMP_COEFF_COPPER : TEMP_COEFF_ALUMINUM;
  const factor = 1 + alpha * (targetTempC - 20);
  const rTemp = r20 * factor;
  const percentageIncrease = (factor - 1) * 100;
  return { rTemp, percentageIncrease };
}

// --- 5. CONDUIT & PIPE DIMENSIONS (VP-RÖR vs IMPERIAL CONDUIT) ---

export interface ConduitEntry {
  metricVpMm: number; // VP-rör ytterdiameter (mm)
  metricInnerMm: number; // Cirka innerdiameter (mm)
  imperialNominalInch: string; // US Trade size / EMT conduit
  imperialInnerMm: number;
  maxFk15Count: number; // Rekommenderat max antal 1.5 mm² FK/FQ-ledare
  maxFk25Count: number; // Rekommenderat max antal 2.5 mm² FK/FQ-ledare
  typicalUsage: string;
}

export const CONDUIT_TABLE: ConduitEntry[] = [
  { metricVpMm: 16, metricInnerMm: 14.0, imperialNominalInch: '1/2" (EMT)', imperialInnerMm: 15.8, maxFk15Count: 5, maxFk25Count: 3, typicalUsage: 'Standard för belysning och enfasuttag i bostadsväggar.' },
  { metricVpMm: 20, metricInnerMm: 17.5, imperialNominalInch: '3/4" (EMT)', imperialInnerMm: 20.9, maxFk15Count: 9, maxFk25Count: 6, typicalUsage: 'Trefasgrupper (spis, ugn, tvätt, billaddare 11 kW).' },
  { metricVpMm: 25, metricInnerMm: 22.0, imperialNominalInch: '1" (EMT)', imperialInnerMm: 26.6, maxFk15Count: 14, maxFk25Count: 10, typicalUsage: 'Matning till undercentraler eller flera grupper samtidigt.' },
  { metricVpMm: 32, metricInnerMm: 28.5, imperialNominalInch: '1-1/4" (EMT)', imperialInnerMm: 35.1, maxFk15Count: 22, maxFk25Count: 16, typicalUsage: 'Större matarledningar, data/tele och larmstammar.' },
  { metricVpMm: 40, metricInnerMm: 36.0, imperialNominalInch: '1-1/2" (EMT)', imperialInnerMm: 40.9, maxFk15Count: 32, maxFk25Count: 24, typicalUsage: 'Huvudledning från mätarskåp till elcentral.' },
  { metricVpMm: 50, metricInnerMm: 45.0, imperialNominalInch: '2" (EMT)', imperialInnerMm: 52.5, maxFk15Count: 48, maxFk25Count: 36, typicalUsage: 'Markrör, servisledning och industriella kabelskyddsrör.' },
];
