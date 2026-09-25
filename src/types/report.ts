export interface PdfReportInputItem {
  label: string;
  value: string;
  unit?: string;
  description?: string;
}

export interface PdfReportResultItem {
  label: string;
  value: string;
  unit?: string;
  highlight?: boolean;
  status?: 'ok' | 'warning' | 'error' | 'info';
  description?: string;
}

export interface PdfReportSource {
  standard: string;
  title: string;
  section?: string;
  requirement: string;
}

export interface PdfReportFormula {
  name: string;
  formulaText: string;
  secondaryFormula?: string;
  substitutionText?: string;
  steps?: string[];
  variableExplanations?: {
    symbol: string;
    meaning: string;
  }[];
}

export interface PdfReportDescription {
  summary: string;
  technicalAssessment: string;
  recommendations: string[];
}

export interface PdfReportDiagram {
  type: 'voltage_drop' | 'power_triangle' | 'star_delta' | 'neutral_phasor' | 'ohms_circle';
  data: Record<string, any>;
}

export interface PdfReportData {
  calculationType: 'voltage_drop' | 'ohms_law' | 'three_phase' | 'series_parallel';
  title: string;
  subtitle: string;
  docCode?: string; // IEC 61355 doc code, e.g. "&BD01"
  systemTag?: string; // IEC 81346 tag, e.g. "=P1 +W1 -QM1"
  projectName: string;
  authorName: string;
  clientName: string;
  dateStr: string;
  notes?: string;

  // Status / Compliance
  statusBadge?: {
    text: string;
    type: 'success' | 'warning' | 'error' | 'info';
  };

  // Structured content
  inputs: PdfReportInputItem[];
  results: PdfReportResultItem[];
  formula: PdfReportFormula;
  description: PdfReportDescription;
  sources: PdfReportSource[];

  // Optional diagram / schematic graphics data
  diagram?: PdfReportDiagram;
}
