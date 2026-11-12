import { jsPDF } from 'jspdf';
import { GeneratedInvoice, LoadItem } from '../types';

export function buildInvoiceFromLoad(
  load: LoadItem,
  carrierEmail: string = 'dispatch@carrier.com',
  carrierAddress: string = 'United States'
): GeneratedInvoice {
  const feePercent = load.dispatchFeePercent || 7;
  const grossRate = load.rate || 0;
  const feeAmount = (grossRate * feePercent) / 100;
  const invoiceNum = load.invoiceNumber || `INV-${load.loadNumber.replace(/\D/g, '') || Date.now().toString().slice(-5)}`;

  const today = new Date().toISOString().split('T')[0];
  const dueDateObj = new Date();
  dueDateObj.setDate(dueDateObj.getDate() + 3);
  const dueDate = dueDateObj.toISOString().split('T')[0];

  return {
    id: `inv-${Date.now()}`,
    invoiceNumber: invoiceNum,
    invoiceDate: today,
    dueDate: dueDate,
    paymentTerms: 'Net 72 Hours upon freight delivery confirmation',
    poNumber: load.loadNumber,
    fromName: 'Infinity Dispatch LLC',
    fromEmail: 'Davidcross.vl1@gmail.com',
    fromPhone: '+1 (409) 509-6940',
    fromAddress: 'Headquarters: Houston, TX · Web: infinitydispatchllcusa.com',
    billToCompany: load.carrierName || 'Carrier Fleet Partner',
    billToContact: load.driverName || 'Dispatch Manager',
    billToEmail: carrierEmail,
    billToPhone: load.carrierPhone || load.driverPhone || '(409) 509-6940',
    billToAddress: carrierAddress,
    billToMc: load.mcNumber || 'MC-Pending',
    items: [
      {
        id: '1',
        description: `Commercial Freight Dispatch Services (${feePercent}%) - Load #${load.loadNumber} [${load.originCity}, ${load.originState} → ${load.destinationCity}, ${load.destinationState}]`,
        rate: grossRate,
        quantity: 1,
        amount: feeAmount,
      },
    ],
    subtotal: feeAmount,
    tax: 0,
    total: feeAmount,
    notes: `Broker: ${load.brokerName} (${load.brokerPhone || 'N/A'})\nLoaded Miles: ${load.loadedMiles} mi | Equipment: ${load.equipmentType}\nCommodity: ${load.commodity || 'General Freight'}`,
    terms: 'Payment is due within 72 hours of freight delivery confirmation. Remit via ACH, Wire, Zelle (Davidcross.vl1@gmail.com / (409) 509-6940), or direct deduction through your Factoring company.',
    status: 'Sent',
    loadReferenceId: load.id,
    createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
  };
}

export function generateInvoicePdf(invoice: GeneratedInvoice): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  // Header Background Banner
  doc.setFillColor(15, 23, 42); // slate-900 / dark navy
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Gold accent bar
  doc.setFillColor(245, 158, 11); // amber-500
  doc.rect(0, 42, pageWidth, 2.5, 'F');

  // Company Name
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('INFINITY DISPATCH LLC', margin, 18);

  // Subtitle / Nationwide tag
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225); // slate-300
  doc.text('NATIONWIDE COMMERCIAL FREIGHT LOGISTICS & DISPATCH', margin, 24);
  doc.text('Headquarters: Houston, TX  |  Phone: +1 (409) 509-6940', margin, 30);
  doc.text('Email: Davidcross.vl1@gmail.com  |  Web: infinitydispatchllcusa.com', margin, 36);

  // Top Right "INVOICE" watermark text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(245, 158, 11);
  doc.text('INVOICE', pageWidth - margin - 5, 24, { align: 'right' });

  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text(`#${invoice.invoiceNumber}`, pageWidth - margin - 5, 33, { align: 'right' });

  // Invoice Details & Bill To Section
  let currentY = 54;

  // Box 1: Billed To
  doc.setFillColor(248, 250, 252); // slate-50
  doc.roundedRect(margin, currentY, 95, 42, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.roundedRect(margin, currentY, 95, 42, 2, 2, 'D');

  doc.setTextColor(100, 116, 139); // slate-500
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('BILL TO CARRIER:', margin + 4, currentY + 7);

  doc.setTextColor(15, 23, 42); // slate-900
  doc.setFontSize(11);
  doc.text(invoice.billToCompany.slice(0, 32), margin + 4, currentY + 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text(`Authority: ${invoice.billToMc}`, margin + 4, currentY + 20);
  doc.text(`Contact: ${invoice.billToContact} | ${invoice.billToPhone}`, margin + 4, currentY + 26);
  doc.text(`Email: ${invoice.billToEmail}`, margin + 4, currentY + 32);
  doc.text(`Address: ${invoice.billToAddress || 'United States'}`, margin + 4, currentY + 38);

  // Box 2: Invoice Metadata
  const metaX = margin + 100;
  const metaWidth = contentWidth - 100;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(metaX, currentY, metaWidth, 42, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(metaX, currentY, metaWidth, 42, 2, 2, 'D');

  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('INVOICE SPECIFICATIONS:', metaX + 4, currentY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);

  doc.text('Invoice Date:', metaX + 4, currentY + 14);
  doc.setFont('helvetica', 'bold');
  doc.text(invoice.invoiceDate, metaX + 35, currentY + 14);

  doc.setFont('helvetica', 'normal');
  doc.text('Due Date:', metaX + 4, currentY + 20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(185, 28, 28); // red-700
  doc.text(invoice.dueDate, metaX + 35, currentY + 20);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text('Load / PO #:', metaX + 4, currentY + 26);
  doc.setFont('helvetica', 'bold');
  doc.text(invoice.poNumber || 'N/A', metaX + 35, currentY + 26);

  doc.setFont('helvetica', 'normal');
  doc.text('Terms:', metaX + 4, currentY + 32);
  doc.text('Net 72 Hours', metaX + 35, currentY + 32);

  doc.text('Status:', metaX + 4, currentY + 38);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 185, 129); // emerald-600
  doc.text(invoice.status.toUpperCase(), metaX + 35, currentY + 38);

  currentY += 49;

  // Items Table Header
  doc.setFillColor(30, 41, 59); // slate-800
  doc.rect(margin, currentY, contentWidth, 8, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('DESCRIPTION', margin + 4, currentY + 5.5);
  doc.text('GROSS RATE', margin + 115, currentY + 5.5, { align: 'right' });
  doc.text('FEE % / QTY', margin + 145, currentY + 5.5, { align: 'right' });
  doc.text('AMOUNT DUE', margin + contentWidth - 4, currentY + 5.5, { align: 'right' });

  currentY += 8;

  // Items Rows
  invoice.items.forEach((item, index) => {
    const isEven = index % 2 === 0;
    doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
    doc.rect(margin, currentY, contentWidth, 12, 'F');
    doc.setDrawColor(241, 245, 249);
    doc.line(margin, currentY + 12, margin + contentWidth, currentY + 12);

    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);

    // Multi-line description if long
    const descLines = doc.splitTextToSize(item.description, 100);
    doc.text(descLines, margin + 4, currentY + 5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    doc.text(`$${Number(item.rate).toFixed(2)}`, margin + 115, currentY + 7, { align: 'right' });
    doc.text(`${item.quantity} Load`, margin + 145, currentY + 7, { align: 'right' });

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(`$${Number(item.amount).toFixed(2)}`, margin + contentWidth - 4, currentY + 7, { align: 'right' });

    currentY += 12;
  });

  currentY += 4;

  // Totals Box
  const totalsX = margin + 105;
  const totalsWidth = contentWidth - 105;

  const discountVal = Number(invoice.discount) || 0;
  const taxVal = Number(invoice.tax) || 0;
  const paidVal = Number(invoice.amountPaid) || 0;
  const totalVal = Number(invoice.total);
  const balanceDueVal = invoice.balanceDue !== undefined ? Number(invoice.balanceDue) : Math.max(0, totalVal - paidVal);

  const hasExtraRows = discountVal > 0 || taxVal > 0 || paidVal > 0;
  const boxHeight = hasExtraRows ? 36 : 28;

  doc.setFillColor(248, 250, 252);
  doc.roundedRect(totalsX, currentY, totalsWidth, boxHeight, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(totalsX, currentY, totalsWidth, boxHeight, 2, 2, 'D');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text('Subtotal:', totalsX + 6, currentY + 6);
  doc.text(`$${Number(invoice.subtotal).toFixed(2)}`, totalsX + totalsWidth - 6, currentY + 6, { align: 'right' });

  let lineOffset = 6;
  if (discountVal > 0) {
    lineOffset += 5;
    doc.text(`Discount:`, totalsX + 6, currentY + lineOffset);
    doc.setTextColor(5, 150, 105);
    doc.text(`-$${discountVal.toFixed(2)}`, totalsX + totalsWidth - 6, currentY + lineOffset, { align: 'right' });
    doc.setTextColor(71, 85, 105);
  }

  if (taxVal > 0) {
    lineOffset += 5;
    doc.text(`Tax:`, totalsX + 6, currentY + lineOffset);
    doc.text(`+$${taxVal.toFixed(2)}`, totalsX + totalsWidth - 6, currentY + lineOffset, { align: 'right' });
  }

  if (paidVal > 0) {
    lineOffset += 5;
    doc.text(`Amount Paid:`, totalsX + 6, currentY + lineOffset);
    doc.text(`-$${paidVal.toFixed(2)}`, totalsX + totalsWidth - 6, currentY + lineOffset, { align: 'right' });
  }

  // Total / Balance Due Highlight
  const highlightY = currentY + boxHeight - 9;
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(totalsX + 2, highlightY, totalsWidth - 4, 8, 1, 1, 'F');
  doc.setTextColor(245, 158, 11);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('BALANCE DUE:', totalsX + 6, highlightY + 5.5);
  doc.text(`$${balanceDueVal.toFixed(2)} USD`, totalsX + totalsWidth - 6, highlightY + 5.5, { align: 'right' });


  // Load Notes / Route details box on the left
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, currentY, 100, 28, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, currentY, 100, 28, 2, 2, 'D');

  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('LOAD DISPATCH REFERENCE:', margin + 4, currentY + 6);

  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  const noteLines = doc.splitTextToSize(invoice.notes || 'Dispatched by Infinity Dispatch LLC.', 92);
  doc.text(noteLines, margin + 4, currentY + 12);

  currentY += 34;

  // Payment Instructions Banner
  doc.setFillColor(239, 246, 255); // blue-50
  doc.roundedRect(margin, currentY, contentWidth, 26, 2, 2, 'F');
  doc.setDrawColor(191, 219, 254); // blue-200
  doc.roundedRect(margin, currentY, contentWidth, 26, 2, 2, 'D');

  doc.setTextColor(30, 58, 138); // blue-900
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('REMITTANCE & PAYMENT METHODS (Direct Carrier Payout Verified)', margin + 4, currentY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  doc.text('1. QuickPay / Zelle / ACH: Send to Davidcross.vl1@gmail.com  (Mobile: +1 (409) 509-6940)', margin + 4, currentY + 12);
  doc.text('2. Factoring Deduction: Email this invoice and Notice of Assignment to your factoring partner.', margin + 4, currentY + 17);
  doc.text('3. Terms: 100% Direct broker funds belong to carrier. Remit dispatch commission within 72 hrs.', margin + 4, currentY + 22);

  currentY += 31;

  // Signature and Verification
  doc.setDrawColor(203, 213, 225);
  doc.line(margin, currentY + 12, margin + 70, currentY + 12);
  doc.line(margin + contentWidth - 70, currentY + 12, margin + contentWidth, currentY + 12);

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(8);
  doc.text('Authorized Signature: David Cross / Alvin', margin, currentY + 16);
  doc.text('Infinity Dispatch LLC - Operations', margin, currentY + 20);

  doc.text('Carrier Acceptance & Dispatch Verification', margin + contentWidth - 70, currentY + 16);
  doc.text(`Carrier: ${invoice.billToCompany.slice(0, 24)}`, margin + contentWidth - 70, currentY + 20);

  // Footer bar
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text(
    `Infinity Dispatch LLC · 24/7 Commercial Logistics · Houston, TX · Official System Generated Document · ${new Date().toISOString()}`,
    pageWidth / 2,
    285,
    { align: 'center' }
  );

  return doc;
}

export function invoicePdfToBase64(doc: jsPDF): string {
  // Extract pure base64 without the prefix data:application/pdf;filename=generated.pdf;base64,
  const dataUri = doc.output('datauristring');
  const base64Index = dataUri.indexOf(';base64,');
  if (base64Index >= 0) {
    return dataUri.substring(base64Index + ';base64,'.length);
  }
  return '';
}

export function downloadInvoicePdf(invoice: GeneratedInvoice): void {
  const doc = generateInvoicePdf(invoice);
  doc.save(`Invoice_${invoice.invoiceNumber}_InfinityDispatch.pdf`);
}

export interface FreightDocumentPdfOptions {
  title: string;
  docType: string;
  fileName?: string;
  carrierName?: string;
  mcNumber?: string;
  loadNumber?: string;
  date?: string;
  content?: string;
  extraDetails?: Record<string, string | number>;
  stampText?: string;
  signatureName?: string;
}

export function generateFreightDocumentPdf(options: FreightDocumentPdfOptions): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  // Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 38, 'F');

  // Accent divider line
  doc.setFillColor(59, 130, 246); // blue-500
  doc.rect(0, 38, pageWidth, 2, 'F');

  // Header text
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('INFINITY DISPATCH LLC', margin, 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225);
  doc.text('COMMERCIAL FREIGHT LOGISTICS & CARRIER PORTAL SYSTEM', margin, 22);
  doc.text('Headquarters: Houston, TX · Dispatch Desk: (409) 509-6940 · infinitydispatchllcusa.com', margin, 28);
  doc.text('David Cross (Business Development) · Alvin (Operations Director)', margin, 34);

  // Document Type Watermark top right
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(245, 158, 11); // amber-500
  doc.text((options.docType || 'DOCUMENT').toUpperCase(), pageWidth - margin, 20, { align: 'right' });

  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text(`Ref: ${options.loadNumber || options.mcNumber || 'INF-DOC'}`, pageWidth - margin, 28, { align: 'right' });

  let currentY = 48;

  // Title Box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, currentY, contentWidth, 22, 2, 2, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, currentY, contentWidth, 22, 2, 2, 'D');

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(options.title, margin + 4, currentY + 9);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(
    `Carrier: ${options.carrierName || 'Apex Interstate Express LLC'}  |  Authority: ${options.mcNumber || 'MC-1489201'}  |  Date: ${options.date || new Date().toISOString().split('T')[0]}`,
    margin + 4,
    currentY + 16
  );

  // Official Stamp Box
  const stamp = options.stampText || 'OFFICIALLY VERIFIED & LOCKED';
  doc.setDrawColor(16, 185, 129); // emerald-500
  doc.setFillColor(236, 253, 245);
  doc.roundedRect(pageWidth - margin - 52, currentY + 3, 48, 16, 1, 1, 'FD');
  doc.setTextColor(5, 150, 105);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('INFINITY DISPATCH', pageWidth - margin - 28, currentY + 9, { align: 'center' });
  doc.text(stamp, pageWidth - margin - 28, currentY + 14, { align: 'center' });

  currentY += 28;

  // Extra Details Grid if present
  if (options.extraDetails && Object.keys(options.extraDetails).length > 0) {
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(margin, currentY, contentWidth, 24, 2, 2, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, currentY, contentWidth, 24, 2, 2, 'D');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('DOCUMENT SPECIFICATIONS & ATTRIBUTES:', margin + 4, currentY + 6);

    const entries = Object.entries(options.extraDetails);
    const colWidth = contentWidth / Math.min(entries.length, 4);

    entries.slice(0, 4).forEach(([k, v], i) => {
      const colX = margin + 4 + i * colWidth;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text(k.toUpperCase(), colX, currentY + 13);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text(String(v).slice(0, 26), colX, currentY + 19);
    });

    currentY += 30;
  }

  // Document Content Section
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, currentY, contentWidth, 120, 2, 2, 'D');

  doc.setFillColor(30, 41, 59);
  doc.rect(margin, currentY, contentWidth, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('OFFICIAL RECORD & LEGAL DISPATCH CLAUSES', margin + 4, currentY + 5);

  const rawContent = options.content || `${options.title}\nCarrier: ${options.carrierName}\nMC: ${options.mcNumber}\nStatus: Verified on file at Infinity Dispatch LLC`;
  const splitLines = doc.splitTextToSize(rawContent, contentWidth - 8);

  doc.setFont('courier', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  doc.text(splitLines.slice(0, 32), margin + 4, currentY + 14);

  currentY += 128;

  // Signatures & Authorization
  doc.setDrawColor(203, 213, 225);
  doc.line(margin, currentY + 10, margin + 65, currentY + 10);
  doc.line(margin + contentWidth - 65, currentY + 10, margin + contentWidth, currentY + 10);

  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`Authorized Officer: ${options.signatureName || 'David Cross / Alvin'}`, margin, currentY + 15);
  doc.text('Infinity Dispatch LLC · Commercial Desk', margin, currentY + 19);

  doc.text('Carrier / Authorized Driver Verification', margin + contentWidth - 65, currentY + 15);
  doc.text(`Verified: ${options.carrierName ? options.carrierName.slice(0, 24) : 'Carrier On File'}`, margin + contentWidth - 65, currentY + 19);

  // Bottom footer
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    `Infinity Dispatch LLC · Permanent Cloud Vault · Digital Verification ID: INF-VER-${Math.floor(100000 + Math.random() * 900000)} · ${new Date().toISOString()}`,
    pageWidth / 2,
    285,
    { align: 'center' }
  );

  return doc;
}

export function downloadFreightDocumentPdf(options: FreightDocumentPdfOptions): void {
  const doc = generateFreightDocumentPdf(options);
  const cleanName = (options.fileName || options.title).replace(/\.txt$/, '').replace(/\.pdf$/, '');
  doc.save(`${cleanName}_InfinityDispatch.pdf`);
}

