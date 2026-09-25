/**
 * Types for electrical calculations and PWA application state
 */

export type ElectricalVariable = 'U' | 'I' | 'R' | 'P';

export type SystemPhaseType = '1-phase' | '3-phase';
export type ThreePhaseConnection = 'star' | 'delta'; // Y (Stjärna) vs Delta (Triangel)

export type VoltageUnit = 'uV' | 'mV' | 'V' | 'kV';
export type CurrentUnit = 'uA' | 'mA' | 'A' | 'kA';
export type ResistanceUnit = 'mOhm' | 'Ohm' | 'kOhm' | 'MOhm';
export type PowerUnit = 'uW' | 'mW' | 'W' | 'kW' | 'MW';

export interface OhmsLawInput {
  voltage: string;
  voltageUnit: VoltageUnit;
  current: string;
  currentUnit: CurrentUnit;
  resistance: string;
  resistanceUnit: ResistanceUnit;
  power: string;
  powerUnit: PowerUnit;
}

export interface CalculationResult {
  voltage: number; // in Volts (Huvudspänning i 3-fas eller enfasspänning)
  current: number; // in Amperes (Linjeström i 3-fas eller enfasström)
  resistance: number; // in Ohms (Fasresistans / elementresistans)
  power: number; // in Watts (Total aktiv effekt P)
  calculatedVars: ElectricalVariable[];
  givenVars: ElectricalVariable[];
  steps: string[];
  formulasUsed: {
    target: ElectricalVariable;
    formula: string;
    explanation: string;
  }[];
  timestamp: number;
  label?: string;

  // 3-Phase specific properties
  phaseType?: SystemPhaseType;
  threePhaseConnection?: ThreePhaseConnection;
  lineVoltage?: number;      // UL (t.ex. 400V)
  phaseVoltage?: number;     // Uf (t.ex. 230V)
  lineCurrent?: number;      // IL
  phaseCurrent?: number;     // If
  cosPhi?: number;
  apparentPower?: number;    // S (VA)
  reactivePower?: number;    // Q (VAr)
}

export interface PresetScenario {
  id: string;
  name: string;
  description: string;
  category: 'Hushåll' | 'Fordon' | 'Industri' | 'Elektronik' | 'Trefas';
  phaseType?: SystemPhaseType;
  connection?: ThreePhaseConnection;
  cosPhi?: number;
  knowns: {
    voltage?: { value: number; unit: VoltageUnit };
    current?: { value: number; unit: CurrentUnit };
    resistance?: { value: number; unit: ResistanceUnit };
    power?: { value: number; unit: PowerUnit };
  };
}

export type ActiveTab = 'dashboard' | 'ohms' | 'series_parallel' | 'voltage_drop' | 'three_phase' | 'converter' | 'reference';
