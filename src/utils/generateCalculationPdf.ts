import { jsPDF } from 'jspdf';
import { PdfReportData } from '../types/report';
import { formatElectrNumber } from './electricalMath';

/**
 * Generates an authentic, professionally designed A4 PDF calculation report
 * compliant with Swedish electrical engineering documentation standards.
 *
 * Page constraints:
 * - Format: A4 (210 x 297 mm)
 * - Margins: 14 mm left/right (usable width: 182 mm)
 * - Margins: 14 mm top/bottom (usable height: 269 mm)
 * - Strict overflow control using splitTextToSize and dynamic page budgeting.
 */
export function generateCalculationPdf(data: PdfReportData): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const marginX = 14;
  const marginY = 14;
  const contentWidth = pageWidth - marginX * 2; // 182 mm
  const maxContentY = pageHeight - marginY - 12; // Leave room for footer

  let currentPage = 1;
  let currentY = marginY;

  // Helper to ensure we don't overflow the page
  const checkPageBreak = (neededHeight: number): void => {
    if (currentY + neededHeight > maxContentY) {
      doc.addPage();
      currentPage++;
      currentY = marginY;
      drawPageHeader(false);
    }
  };

  // Draw Header
  const drawPageHeader = (isFirstPage: boolean) => {
    // Header background bar
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(marginX, currentY, contentWidth, isFirstPage ? 20 : 12, 'F');

    // Amber accent stripe
    doc.setFillColor(245, 158, 11); // amber-500
    doc.rect(marginX, currentY + (isFirstPage ? 20 : 12) - 1.5, contentWidth, 1.5, 'F');

    // Brand title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(isFirstPage ? 13 : 10);
    doc.setTextColor(255, 255, 255);
    doc.text('EDA TOOLBOX', marginX + 4, currentY + (isFirstPage ? 8 : 7));

    // Subtitle
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(isFirstPage ? 8 : 7);
    doc.setTextColor(203, 213, 225); // slate-300
    doc.text(
      isFirstPage ? 'TEKNISK BERÄKNINGSRAPPORT & DIMENSIONERINGSUNDERLAG' : 'BERÄKNINGSRAPPORT',
      marginX + 4,
      currentY + (isFirstPage ? 14 : 10)
    );

    // Document Code badge (IEC 61355)
    const docCode = data.docCode || '&BD01';
    doc.setFont('courier', 'bold');
    doc.setFontSize(isFirstPage ? 10 : 8);
    doc.setTextColor(253, 224, 71); // amber-300
    doc.text(docCode, marginX + contentWidth - 4, currentY + (isFirstPage ? 9 : 7), { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text('IEC 61355', marginX + contentWidth - 4, currentY + (isFirstPage ? 15 : 10.5), { align: 'right' });

    currentY += (isFirstPage ? 24 : 16);
  };

  // Draw first page header
  drawPageHeader(true);

  // Document Title & Subtitle
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text(data.title, marginX, currentY);
  currentY += 5;

  if (data.subtitle) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105); // slate-600
    const subLines = doc.splitTextToSize(data.subtitle, contentWidth);
    doc.text(subLines, marginX, currentY);
    currentY += subLines.length * 4 + 2;
  } else {
    currentY += 2;
  }

  // Project Metadata Box (2x3 grid)
  const metaHeight = 22;
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(0.3);
  doc.roundedRect(marginX, currentY, contentWidth, metaHeight, 2, 2, 'FD');

  const colW = contentWidth / 3;
  const metaItems = [
    { label: 'Projekt', value: data.projectName || 'Standardprojekt' },
    { label: 'Anläggningspos (IEC 81346)', value: data.systemTag || '=P1 +W1' },
    { label: 'Datum', value: data.dateStr || new Date().toISOString().split('T')[0] },
    { label: 'Upprättad av', value: data.authorName || 'Elkonstruktör' },
    { label: 'Beställare / Kund', value: data.clientName || 'Fastighetsägare' },
    { label: 'Standard / Norm', value: 'SS 436 40 00 / SS-EN 60204' },
  ];

  metaItems.forEach((item, idx) => {
    const col = idx % 3;
    const row = Math.floor(idx / 3);
    const x = marginX + col * colW + 3;
    const y = currentY + 4 + row * 9;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text(item.label.toUpperCase(), x, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42); // slate-900
    const valText = doc.splitTextToSize(item.value, colW - 5)[0] || item.value;
    doc.text(valText, x, y + 4);
  });

  currentY += metaHeight + 5;

  // Status Badge (if provided)
  if (data.statusBadge) {
    const isSuccess = data.statusBadge.type === 'success';
    const isWarning = data.statusBadge.type === 'warning';
    const isError = data.statusBadge.type === 'error';

    if (isSuccess) {
      doc.setFillColor(236, 253, 245); // emerald-50
      doc.setDrawColor(16, 185, 129); // emerald-500
      doc.setTextColor(6, 95, 70); // emerald-800
    } else if (isWarning) {
      doc.setFillColor(254, 243, 199); // amber-50
      doc.setDrawColor(245, 158, 11); // amber-500
      doc.setTextColor(146, 64, 14); // amber-800
    } else if (isError) {
      doc.setFillColor(254, 242, 242); // rose-50
      doc.setDrawColor(239, 68, 68); // rose-500
      doc.setTextColor(153, 27, 27); // rose-800
    } else {
      doc.setFillColor(241, 245, 249); // slate-100
      doc.setDrawColor(100, 116, 139); // slate-500
      doc.setTextColor(30, 41, 59); // slate-800
    }

    doc.setLineWidth(0.4);
    doc.roundedRect(marginX, currentY, contentWidth, 8, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(`STATUS: ${data.statusBadge.text.toUpperCase()}`, marginX + 4, currentY + 5.2);

    currentY += 12;
  }

  // SECTION 1: Huvudresultat (Key Results Grid)
  checkPageBreak(38);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('1. HUVUDRESULTAT & BERÄKNADE NYCKELTAL', marginX, currentY);
  currentY += 3.5;

  const resultCount = Math.min(data.results.length, 4);
  const cardW = (contentWidth - (resultCount - 1) * 3) / resultCount;
  const cardH = 22;

  data.results.slice(0, 4).forEach((res, i) => {
    const cardX = marginX + i * (cardW + 3);

    // Box background
    if (res.highlight) {
      doc.setFillColor(240, 249, 255); // sky-50
      doc.setDrawColor(14, 165, 233); // sky-500
    } else {
      doc.setFillColor(248, 250, 252); // slate-50
      doc.setDrawColor(203, 213, 225); // slate-300
    }
    doc.setLineWidth(0.4);
    doc.roundedRect(cardX, currentY, cardW, cardH, 1.5, 1.5, 'FD');

    // Label
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text(res.label.toUpperCase(), cardX + 3, currentY + 4.5);

    // Value + Unit
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    if (res.highlight) {
      doc.setTextColor(2, 132, 199);
    } else {
      doc.setTextColor(15, 23, 42);
    }
    doc.text(res.value, cardX + 3, currentY + 12.5);

    if (res.unit) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      const valW = doc.getTextWidth(res.value);
      doc.text(res.unit, cardX + 3 + valW + 1.5, currentY + 12.5);
    }

    // Secondary note
    if (res.description) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(148, 163, 184);
      const descLine = doc.splitTextToSize(res.description, cardW - 5)[0] || '';
      doc.text(descLine, cardX + 3, currentY + 18);
    }
  });

  currentY += cardH + 7;

  // SECTION 1.5: Tekniskt Kretsschema & Grafisk Illustration (om tillgängligt)
  currentY = drawTechnicalDiagramPdf(doc, data, marginX, currentY, contentWidth, checkPageBreak);

  // SECTION 2: Inmatade förutsättningar (Input Parameters Table)
  checkPageBreak(40);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('2. DIMENSIONERINGSFÖRUTSÄTTNINGAR & INDATA', marginX, currentY);
  currentY += 3.5;

  // Inputs table header
  doc.setFillColor(241, 245, 249); // slate-100
  doc.setDrawColor(226, 232, 240);
  doc.rect(marginX, currentY, contentWidth, 6, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text('PARAMETER', marginX + 3, currentY + 4.2);
  doc.text('VÄRDE', marginX + 65, currentY + 4.2);
  doc.text('ENHET', marginX + 100, currentY + 4.2);
  doc.text('BESKRIVNING / STANDARDKRAV', marginX + 125, currentY + 4.2);
  currentY += 6;

  data.inputs.forEach((inp, idx) => {
    checkPageBreak(7);
    const rowH = 6;
    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(marginX, currentY, contentWidth, rowH, 'F');
    }
    doc.setDrawColor(241, 245, 249);
    doc.line(marginX, currentY + rowH, marginX + contentWidth, currentY + rowH);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(30, 41, 59);
    doc.text(inp.label, marginX + 3, currentY + 4.2);

    doc.setFont('courier', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text(inp.value, marginX + 65, currentY + 4.2);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(inp.unit || '-', marginX + 100, currentY + 4.2);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(71, 85, 105);
    const descText = doc.splitTextToSize(inp.description || '', 54)[0] || '';
    doc.text(descText, marginX + 125, currentY + 4.2);

    currentY += rowH;
  });

  currentY += 6;

  // SECTION 3: Matematisk Formel & Beräkningsgång
  checkPageBreak(45);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('3. MATEMATISK MODELL & FORMELTILLÄMPNING', marginX, currentY);
  currentY += 3.5;

  // Formula Container Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);

  const formulaBoxStartY = currentY;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(data.formula.name.toUpperCase(), marginX + 4, currentY + 6);

  // Main formula
  doc.setFont('courier', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(180, 83, 9); // amber-700
  doc.text(data.formula.formulaText, marginX + 4, currentY + 12);
  currentY += 15;

  if (data.formula.secondaryFormula) {
    doc.setFont('courier', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text(data.formula.secondaryFormula, marginX + 4, currentY);
    currentY += 5;
  }

  // Numerical substitution
  if (data.formula.substitutionText) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text('INSATTA PROJEKTVÄRDEN & MELLANSTEG:', marginX + 4, currentY);
    currentY += 4;

    doc.setFont('courier', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    const subLines = doc.splitTextToSize(data.formula.substitutionText, contentWidth - 8);
    doc.text(subLines, marginX + 4, currentY);
    currentY += subLines.length * 3.5 + 2;
  }

  // Variable explanations
  if (data.formula.variableExplanations && data.formula.variableExplanations.length > 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    const varText = data.formula.variableExplanations
      .map((v) => `${v.symbol}: ${v.meaning}`)
      .join('  •  ');
    const varLines = doc.splitTextToSize(varText, contentWidth - 8);
    doc.text(varLines, marginX + 4, currentY);
    currentY += varLines.length * 3 + 2;
  }

  // Draw border around the formula block
  const formulaBoxHeight = currentY - formulaBoxStartY + 2;
  doc.rect(marginX, formulaBoxStartY, contentWidth, formulaBoxHeight, 'D');
  currentY += 6;

  // SECTION 4: Teknisk Beskrivning & Dimensioneringsanalys
  checkPageBreak(40);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('4. TEKNISK BESKRIVNING & DIMENSIONERINGSANALYS', marginX, currentY);
  currentY += 4;

  // Summary paragraph
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  const summaryLines = doc.splitTextToSize(data.description.summary, contentWidth);
  doc.text(summaryLines, marginX, currentY);
  currentY += summaryLines.length * 3.8 + 3;

  // Assessment paragraph
  if (data.description.technicalAssessment) {
    checkPageBreak(15);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text('TEKNISK BEDÖMNING & DRIFTSTILLFÖRLITLIGHET:', marginX, currentY);
    currentY += 3.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    const assessLines = doc.splitTextToSize(data.description.technicalAssessment, contentWidth);
    doc.text(assessLines, marginX, currentY);
    currentY += assessLines.length * 3.8 + 3;
  }

  // Recommendations bullets
  if (data.description.recommendations && data.description.recommendations.length > 0) {
    checkPageBreak(20);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text('REKOMMENDERADE ÅTGÄRDER FÖR ELKONSTRUKTÖREN:', marginX, currentY);
    currentY += 3.5;

    data.description.recommendations.forEach((rec) => {
      checkPageBreak(8);
      doc.setFillColor(245, 158, 11);
      doc.circle(marginX + 2, currentY - 0.8, 0.8, 'F');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(30, 41, 59);
      const recLines = doc.splitTextToSize(rec, contentWidth - 6);
      doc.text(recLines, marginX + 5, currentY);
      currentY += recLines.length * 3.5 + 1.5;
    });
    currentY += 3;
  }

  // SECTION 5: Normativa Källor & Standardreferenser
  checkPageBreak(40);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('5. NORMATIVA KÄLLOR & STANDARDREFERENSER', marginX, currentY);
  currentY += 3.5;

  data.sources.forEach((src, idx) => {
    checkPageBreak(14);
    doc.setFillColor(idx % 2 === 0 ? 248 : 255, idx % 2 === 0 ? 250 : 255, idx % 2 === 0 ? 252 : 255);
    doc.setDrawColor(226, 232, 240);
    doc.rect(marginX, currentY, contentWidth, 11, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(180, 83, 9); // amber-700
    doc.text(src.standard, marginX + 3, currentY + 3.8);

    if (src.section) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text(`(${src.section})`, marginX + 3 + doc.getTextWidth(src.standard) + 2, currentY + 3.8);
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(30, 41, 59);
    doc.text(src.title, marginX + 65, currentY + 3.8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(71, 85, 105);
    const reqLines = doc.splitTextToSize(src.requirement, contentWidth - 6);
    doc.text(reqLines[0] || '', marginX + 3, currentY + 8);

    currentY += 12;
  });

  currentY += 4;

  // Custom User Notes (if specified)
  if (data.notes && data.notes.trim() !== '') {
    checkPageBreak(20);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text('PROJEKTANTECKNINGAR & SPECIFIKA VILLKOR:', marginX, currentY);
    currentY += 3.5;

    doc.setFillColor(254, 252, 232); // yellow-50
    doc.setDrawColor(254, 240, 138); // yellow-200
    const noteLines = doc.splitTextToSize(data.notes, contentWidth - 6);
    const noteBoxH = noteLines.length * 3.5 + 4;
    doc.roundedRect(marginX, currentY, contentWidth, noteBoxH, 1, 1, 'FD');

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(113, 63, 18);
    doc.text(noteLines, marginX + 3, currentY + 3.5);

    currentY += noteBoxH + 5;
  }

  // SECTION 6: Signaturbås / Formell verifiering
  checkPageBreak(25);
  const signBoxH = 18;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.roundedRect(marginX, currentY, contentWidth, signBoxH, 1.5, 1.5, 'FD');

  const signColW = contentWidth / 3;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text('BERÄKNAD & UPPSTÄLLD AV:', marginX + 4, currentY + 4);
  doc.text('GRANSKAD & GODKÄND AV:', marginX + signColW + 4, currentY + 4);
  doc.text('DATUM & STATUS:', marginX + signColW * 2 + 4, currentY + 4);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text(data.authorName || 'Elkonstruktör', marginX + 4, currentY + 9);
  doc.text('Behörig installatör / Elansvarig', marginX + signColW + 4, currentY + 9);
  doc.text(`${data.dateStr || '2026-09-25'} – Slutgiltig`, marginX + signColW * 2 + 4, currentY + 9);

  // Signature line
  doc.setDrawColor(148, 163, 184);
  doc.line(marginX + 4, currentY + 14, marginX + signColW - 6, currentY + 14);
  doc.line(marginX + signColW + 4, currentY + 14, marginX + signColW * 2 - 6, currentY + 14);
  doc.line(marginX + signColW * 2 + 4, currentY + 14, marginX + contentWidth - 4, currentY + 14);

  // Now draw footers on all pages with actual total pages
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);

    const footerY = pageHeight - marginY + 4;

    doc.setDrawColor(226, 232, 240); // slate-200
    doc.setLineWidth(0.3);
    doc.line(marginX, footerY - 3, marginX + contentWidth, footerY - 3);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(148, 163, 184);
    doc.text('EDA Toolbox  •  Svensk Elstandard & Dimensionering (SS 436 40 00)', marginX, footerY);

    const docIdStr = `${data.docCode || '&BD01'}  •  ${data.projectName || 'EDA-Beräkning'}`;
    doc.text(docIdStr, marginX + contentWidth / 2, footerY, { align: 'center' });

    doc.setFont('courier', 'normal');
    doc.text(`Sida ${p} av ${totalPages}`, marginX + contentWidth, footerY, { align: 'right' });
  }

  return doc;
}

/**
 * Renders high-precision, vector-based technical schematics and tolerance gauges
 * directly onto the A4 PDF sheet, ensuring perfect scaling without edge clipping.
 */
function drawTechnicalDiagramPdf(
  doc: jsPDF,
  data: PdfReportData,
  marginX: number,
  currentY: number,
  contentWidth: number,
  checkPageBreak: (needed: number) => void
): number {
  if (!data.diagram) return currentY;

  if (data.diagram.type === 'voltage_drop') {
    checkPageBreak(50);
    // Draw Section header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text('KRETSSCHEMA & TOLERANSMÄTARE (SS 436 40 00)', marginX, currentY);
    currentY += 3.5;

    const d = data.diagram.data;
    const diagramH = 43;

    // Outer container
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.roundedRect(marginX, currentY, contentWidth, diagramH, 1.5, 1.5, 'FD');

    // 1. Source Node Box (Left)
    const boxW = 40;
    const boxH = 20;
    const boxY = currentY + 3;

    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(148, 163, 184);
    doc.roundedRect(marginX + 3, boxY, boxW, boxH, 1, 1, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text('MATNING / NÄT', marginX + 5, boxY + 4.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(`${d.voltage} V`, marginX + 5, boxY + 10.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(71, 85, 105);
    doc.text(d.phaseType === '1-phase' ? '1-Fas (L + N)' : '3-Fas (400V)', marginX + 5, boxY + 14.5);
    doc.text('U_nom vid central', marginX + 5, boxY + 18);

    // 2. Load Node Box (Right)
    const loadX = marginX + contentWidth - boxW - 3;
    const isOk = d.isWithinLimit;

    doc.setFillColor(isOk ? 236 : 254, isOk ? 253 : 242, isOk ? 245 : 242);
    doc.setDrawColor(isOk ? 16 : 239, isOk ? 185 : 68, isOk ? 129 : 68);
    doc.roundedRect(loadX, boxY, boxW, boxH, 1, 1, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(isOk ? 6 : 153, isOk ? 95 : 27, isOk ? 70 : 27);
    doc.text('FÖRBRUKARE / LAST', loadX + 3, boxY + 4.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(isOk ? 5 : 185, isOk ? 150 : 28, isOk ? 105 : 28);
    doc.text(`${formatElectrNumber(d.endVoltage, 1)} V`, loadX + 3, boxY + 10.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(71, 85, 105);
    doc.text('Spänning vid plint', loadX + 3, boxY + 14.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);
    doc.setTextColor(isOk ? 16 : 220, isOk ? 185 : 38, isOk ? 129 : 38);
    doc.text(isOk ? '✓ GODKÄND' : '⚠ FÖR HÖGT FALL', loadX + 3, boxY + 18);

    // 3. Center Cable Run
    const lineStartX = marginX + 3 + boxW;
    const lineEndX = loadX;
    const lineY1 = boxY + 8;
    const lineY2 = boxY + 13;

    doc.setDrawColor(14, 165, 233);
    doc.setLineWidth(0.6);
    doc.line(lineStartX, lineY1, lineEndX, lineY1);

    doc.setDrawColor(148, 163, 184);
    doc.setLineWidth(0.4);
    doc.line(lineStartX, lineY2, lineEndX, lineY2);

    // Cable specs banner in center
    const cableCenterW = lineEndX - lineStartX;
    const tagW = Math.min(84, cableCenterW - 8);
    const tagX = lineStartX + (cableCenterW - tagW) / 2;

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(245, 158, 11);
    doc.setLineWidth(0.3);
    doc.roundedRect(tagX, boxY + 1, tagW, 8.5, 0.8, 0.8, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(180, 83, 9);
    doc.text(
      `Kabel: ${d.length} m  •  ${d.area} mm² (${d.material === 'cu' ? 'Cu' : 'Al'})`,
      tagX + tagW / 2,
      boxY + 4.5,
      { align: 'center' }
    );

    doc.setFont('courier', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(71, 85, 105);
    doc.text(
      `I = ${d.current} A  •  R = ${formatElectrNumber(d.rCable, 3)} Ω`,
      tagX + tagW / 2,
      boxY + 7.8,
      { align: 'center' }
    );

    // Drop callout below cable
    doc.setFillColor(isOk ? 236 : 254, isOk ? 253 : 242, isOk ? 245 : 242);
    doc.setDrawColor(isOk ? 16 : 239, isOk ? 185 : 68, isOk ? 129 : 68);
    doc.roundedRect(tagX + 4, boxY + 13.5, tagW - 8, 6.5, 0.8, 0.8, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);
    doc.setTextColor(isOk ? 6 : 153, isOk ? 95 : 27, isOk ? 70 : 27);
    doc.text(
      `ΔU = -${formatElectrNumber(d.deltaU, 2)} V (-${formatElectrNumber(d.dropPercent, 2)}%)  •  P_förlust = ${formatElectrNumber(d.powerLoss, 1)} W`,
      tagX + tagW / 2,
      boxY + 17.8,
      { align: 'center' }
    );

    // 4. Tolerance Meter Bar (bottom of diagram)
    const meterY = currentY + 26;
    const meterW = contentWidth - 8;
    const meterX = marginX + 4;
    const meterH = 3.5;

    // Segment 1: 0 to 3% (half of 6% scale = 50%)
    const seg1W = meterW * 0.5;
    doc.setFillColor(52, 211, 153);
    doc.rect(meterX, meterY, seg1W, meterH, 'F');

    // Segment 2: 3 to 4% (1/6 = 16.67%)
    const seg2W = meterW * (1 / 6);
    doc.setFillColor(251, 191, 36);
    doc.rect(meterX + seg1W, meterY, seg2W, meterH, 'F');

    // Segment 3: 4 to 6%+ (2/6 = 33.33%)
    const seg3W = meterW - seg1W - seg2W;
    doc.setFillColor(244, 63, 94);
    doc.rect(meterX + seg1W + seg2W, meterY, seg3W, meterH, 'F');

    // Outline border
    doc.setDrawColor(100, 116, 139);
    doc.setLineWidth(0.2);
    doc.rect(meterX, meterY, meterW, meterH, 'D');

    // Scale labels below meter
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.5);
    doc.setTextColor(100, 116, 139);
    doc.text('0%', meterX, meterY + 6.5);
    doc.text('3% (SS 436 40 00 rekommendation)', meterX + seg1W, meterY + 6.5, { align: 'center' });
    doc.text(`4% (Max gräns)`, meterX + seg1W + seg2W, meterY + 6.5, { align: 'center' });
    doc.text('6%+', meterX + meterW, meterY + 6.5, { align: 'right' });

    // Cursor indicator needle
    const clampedPct = Math.min(6.0, Math.max(0, d.dropPercent));
    const cursorX = meterX + (clampedPct / 6.0) * meterW;

    // Triangle pointer
    doc.setFillColor(15, 23, 42);
    doc.triangle(cursorX - 1.5, meterY - 0.8, cursorX + 1.5, meterY - 0.8, cursorX, meterY + 0.5, 'F');

    // Text badge above pointer
    doc.setFillColor(isOk ? 16 : 239, isOk ? 185 : 68, isOk ? 129 : 68);
    doc.roundedRect(cursorX - 8, meterY - 4.2, 16, 3, 0.5, 0.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.5);
    doc.setTextColor(255, 255, 255);
    doc.text(`${formatElectrNumber(d.dropPercent, 2)}%`, cursorX, meterY - 2, { align: 'center' });

    // Legend
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.5);
    doc.setTextColor(71, 85, 105);
    doc.text(
      'Grön zon: ≤ 3.0% (Optimal)  •  Gul zon: 3.0–4.0% (Standardgodkänd)  •  Röd zon: > 4.0% (Överskrider standard)',
      marginX + contentWidth / 2,
      meterY + 10.5,
      { align: 'center' }
    );

    currentY += diagramH + 5;
  } else if (data.diagram.type === 'power_triangle') {
    checkPageBreak(44);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text('EFFEKTTRIANGEL & FASVEKTORER (P, Q, S)', marginX, currentY);
    currentY += 3.5;

    const d = data.diagram.data;
    const diagramH = 34;

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.roundedRect(marginX, currentY, contentWidth, diagramH, 1.5, 1.5, 'FD');

    // Draw Triangle on the left side
    const triOriginX = marginX + 14;
    const triOriginY = currentY + 27;
    const triBaseW = 55;
    const triHeightH = 18;

    const triCornerX = triOriginX + triBaseW;
    const triCornerY = triOriginY;
    const triTopX = triCornerX;
    const triTopY = triOriginY - triHeightH;

    // Right angle symbol
    doc.setDrawColor(148, 163, 184);
    doc.setLineWidth(0.2);
    doc.line(triCornerX - 3, triCornerY, triCornerX - 3, triCornerY - 3);
    doc.line(triCornerX - 3, triCornerY - 3, triCornerX, triCornerY - 3);

    // Base P (Rose)
    doc.setDrawColor(244, 63, 94);
    doc.setLineWidth(0.6);
    doc.line(triOriginX, triOriginY, triCornerX, triCornerY);

    // Height Q (Amber)
    doc.setDrawColor(245, 158, 11);
    doc.setLineWidth(0.6);
    doc.line(triCornerX, triCornerY, triTopX, triTopY);

    // Hypotenuse S (Sky)
    doc.setDrawColor(14, 165, 233);
    doc.setLineWidth(0.6);
    doc.line(triOriginX, triOriginY, triTopX, triTopY);

    // Vector labels
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(244, 63, 94);
    doc.text(`P = ${formatElectrNumber(d.activePowerKw, 2)} kW (Aktiv)`, triOriginX + triBaseW / 2, triOriginY + 4, { align: 'center' });

    doc.setTextColor(217, 119, 6);
    doc.text(`Q = ${formatElectrNumber(d.reactivePowerKvar, 2)} kVAr`, triCornerX + 2, triOriginY - triHeightH / 2);

    doc.setTextColor(2, 132, 199);
    doc.text(`S = ${formatElectrNumber(d.apparentPowerKva, 2)} kVA`, triOriginX + triBaseW / 2 - 8, triOriginY - triHeightH / 2 - 2);

    // Right side Summary Grid
    const gridX = marginX + 105;
    const gridY = currentY + 3;

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(gridX, gridY, 72, 26, 1, 1, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(15, 23, 42);
    doc.text('FASEGENSKAPER & MOTORDATA', gridX + 4, gridY + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`• Effektfaktor (cos φ): ${formatElectrNumber(d.cosPhi, 2)}`, gridX + 4, gridY + 10);
    doc.text(`• Verkningsgrad (η): ${formatElectrNumber(d.efficiency * 100, 1)} %`, gridX + 4, gridY + 14.5);
    doc.text(`• Linjeström vid ${d.voltage}V: ${formatElectrNumber(d.current, 2)} A`, gridX + 4, gridY + 19);
    doc.text(`• Vektorrelation: S = √(P² + Q²) = √3 · U · I`, gridX + 4, gridY + 23.5);

    currentY += diagramH + 5;
  } else if (data.diagram.type === 'star_delta') {
    checkPageBreak(38);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text('KOPPLINGSSCHEMA & JÄMFÖRELSE: Y- VS Δ-KOPPLING', marginX, currentY);
    currentY += 3.5;

    const d = data.diagram.data;
    const diagramH = 28;

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.roundedRect(marginX, currentY, contentWidth, diagramH, 1.5, 1.5, 'FD');

    const halfW = (contentWidth - 6) / 2;

    // Left box: Star (Y)
    doc.setFillColor(240, 249, 255);
    doc.setDrawColor(186, 230, 253);
    doc.roundedRect(marginX + 2, currentY + 2, halfW, 23, 1, 1, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(2, 132, 199);
    doc.text('STJÄRNKOPPLING (Y)', marginX + 4, currentY + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(51, 65, 85);
    doc.text(`• Elementspänning: ${formatElectrNumber(d.uStarElem, 1)} V (U_L / √3)`, marginX + 4, currentY + 10.5);
    doc.text(`• Linjeström: ${formatElectrNumber(d.iStarLine, 2)} A`, marginX + 4, currentY + 15);
    doc.text(`• Total Effekt (P_Y): ${formatElectrNumber(d.pStarTotal / 1000, 2)} kW (1/3 av delta)`, marginX + 4, currentY + 19.5);

    // Right box: Delta (Δ)
    doc.setFillColor(254, 243, 199);
    doc.setDrawColor(253, 230, 138);
    doc.roundedRect(marginX + 4 + halfW, currentY + 2, halfW, 23, 1, 1, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(180, 83, 9);
    doc.text('DELTAKOPPLING (Δ)', marginX + 6 + halfW, currentY + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(51, 65, 85);
    doc.text(`• Elementspänning: ${d.voltage} V (Full huvudspänning)`, marginX + 6 + halfW, currentY + 10.5);
    doc.text(`• Linjeström: ${formatElectrNumber(d.iDeltaLine, 2)} A (3× strömmen i Y)`, marginX + 6 + halfW, currentY + 15);
    doc.text(`• Total Effekt (P_Δ): ${formatElectrNumber(d.pDeltaTotal / 1000, 2)} kW (3× effekten i Y)`, marginX + 6 + halfW, currentY + 19.5);

    currentY += diagramH + 5;
  } else if (data.diagram.type === 'neutral_phasor') {
    checkPageBreak(38);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text('VISARDIAGRAM: FASSTRÖMMAR & NOLLSTRÖM (I_N)', marginX, currentY);
    currentY += 3.5;

    const d = data.diagram.data;
    const diagramH = 30;

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.roundedRect(marginX, currentY, contentWidth, diagramH, 1.5, 1.5, 'FD');

    // Phasor Center
    const pcX = marginX + 30;
    const pcY = currentY + 15;

    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.2);
    doc.circle(pcX, pcY, 11, 'D');

    // Axes
    doc.setDrawColor(180, 83, 9);
    doc.line(pcX, pcY, pcX + 11, pcY); // L1
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.5);
    doc.setTextColor(180, 83, 9);
    doc.text(`L1 (${d.iL1}A)`, pcX + 12, pcY + 1);

    doc.setDrawColor(100, 116, 139);
    doc.line(pcX, pcY, pcX - 5.5, pcY + 9.5); // L2
    doc.setTextColor(100, 116, 139);
    doc.text(`L2 (${d.iL2}A)`, pcX - 16, pcY + 12);

    doc.setDrawColor(71, 85, 105);
    doc.line(pcX, pcY, pcX - 5.5, pcY - 9.5); // L3
    doc.setTextColor(71, 85, 105);
    doc.text(`L3 (${d.iL3}A)`, pcX - 16, pcY - 9);

    // Info card on right
    const nGridX = marginX + 75;
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(nGridX, currentY + 2.5, contentWidth - 78, 24, 1, 1, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`RETURSTRÖM I NOLLAN: ${formatElectrNumber(d.iNeutral, 2)} A`, nGridX + 4, currentY + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`• Fasfördelning: L1=${d.iL1}A, L2=${d.iL2}A, L3=${d.iL3}A`, nGridX + 4, currentY + 12);
    doc.text(`• Analytisk formel: I_N = √(I₁² + I₂² + I₃² - I₁I₂ - I₂I₃ - I₃I₁)`, nGridX + 4, currentY + 16.5);
    doc.text(
      d.iNeutral < 0.05
        ? '• Status: Perfekt balanserad symmetrisk belastning (I_N = 0 A)'
        : `• Status: Obalanserad last. Returström genom nollan kräver full ledararea.`,
      nGridX + 4,
      currentY + 21
    );

    currentY += diagramH + 5;
  }

  return currentY;
}

