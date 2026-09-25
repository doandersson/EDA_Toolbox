import { jsPDF } from 'jspdf';
import { PdfReportData } from '../types/report';

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
