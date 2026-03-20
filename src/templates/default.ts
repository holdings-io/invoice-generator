import PDFDocument from 'pdfkit';
import { Invoice, LineItem, InvoiceOptions } from '../types';

function formatCurrency(amount: number, currency: string): string {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    CAD: 'CA$',
    AUD: 'A$',
  };
  const symbol = symbols[currency] || currency + ' ';
  return `${symbol}${amount.toFixed(2)}`;
}

export function renderDefaultTemplate(
  doc: PDFKit.PDFDocument,
  invoice: Invoice,
  options: InvoiceOptions
): void {
  const currency = invoice.currency || 'USD';
  const accentColor = options.accentColor || '#2563EB';
  const fontSize = options.fontSize || 10;

  // Header bar
  doc
    .rect(0, 0, doc.page.width, 80)
    .fill(accentColor);

  doc
    .font('Helvetica-Bold')
    .fontSize(28)
    .fillColor('#FFFFFF')
    .text('INVOICE', 50, 28);

  // Invoice details (right side)
  doc
    .font('Helvetica')
    .fontSize(fontSize)
    .fillColor('#374151');

  const detailsX = 380;
  doc
    .font('Helvetica-Bold')
    .text('Invoice #:', detailsX, 100)
    .font('Helvetica')
    .text(invoice.invoiceNumber, detailsX + 80, 100);

  doc
    .font('Helvetica-Bold')
    .text('Date:', detailsX, 118)
    .font('Helvetica')
    .text(invoice.date, detailsX + 80, 118);

  doc
    .font('Helvetica-Bold')
    .text('Due Date:', detailsX, 136)
    .font('Helvetica')
    .text(invoice.dueDate, detailsX + 80, 136);

  // From
  let y = 100;
  doc
    .font('Helvetica-Bold')
    .fontSize(11)
    .fillColor(accentColor)
    .text('From', 50, y);
  y += 18;
  doc
    .font('Helvetica-Bold')
    .fontSize(fontSize)
    .fillColor('#111827')
    .text(invoice.from.name, 50, y);
  y += 15;
  doc.font('Helvetica').fillColor('#374151');
  if (invoice.from.address) {
    doc.text(invoice.from.address, 50, y);
    y += 15;
  }
  if (invoice.from.email) {
    doc.text(invoice.from.email, 50, y);
    y += 15;
  }
  if (invoice.from.phone) {
    doc.text(invoice.from.phone, 50, y);
    y += 15;
  }

  // To
  y = 180;
  doc
    .font('Helvetica-Bold')
    .fontSize(11)
    .fillColor(accentColor)
    .text('Bill To', 50, y);
  y += 18;
  doc
    .font('Helvetica-Bold')
    .fontSize(fontSize)
    .fillColor('#111827')
    .text(invoice.to.name, 50, y);
  y += 15;
  doc.font('Helvetica').fillColor('#374151');
  if (invoice.to.address) {
    doc.text(invoice.to.address, 50, y);
    y += 15;
  }
  if (invoice.to.email) {
    doc.text(invoice.to.email, 50, y);
    y += 15;
  }
  if (invoice.to.phone) {
    doc.text(invoice.to.phone, 50, y);
    y += 15;
  }

  // Table header
  const tableTop = 280;
  const col = { desc: 50, qty: 310, price: 390, amount: 470 };

  doc
    .rect(50, tableTop, doc.page.width - 100, 24)
    .fill(accentColor);

  doc
    .font('Helvetica-Bold')
    .fontSize(fontSize)
    .fillColor('#FFFFFF')
    .text('Description', col.desc + 8, tableTop + 7)
    .text('Qty', col.qty, tableTop + 7, { width: 60, align: 'right' })
    .text('Unit Price', col.price, tableTop + 7, { width: 70, align: 'right' })
    .text('Amount', col.amount, tableTop + 7, { width: 75, align: 'right' });

  // Table rows
  let rowY = tableTop + 32;
  doc.font('Helvetica').fillColor('#374151');

  const computedItems: (LineItem & { computed: number })[] = invoice.items.map((item) => ({
    ...item,
    computed: item.amount ?? item.quantity * item.unitPrice,
  }));

  computedItems.forEach((item, i) => {
    if (i % 2 === 0) {
      doc.rect(50, rowY - 4, doc.page.width - 100, 22).fill('#F9FAFB');
      doc.fillColor('#374151');
    }
    doc
      .text(item.description, col.desc + 8, rowY, { width: 250 })
      .text(String(item.quantity), col.qty, rowY, { width: 60, align: 'right' })
      .text(formatCurrency(item.unitPrice, currency), col.price, rowY, { width: 70, align: 'right' })
      .text(formatCurrency(item.computed, currency), col.amount, rowY, { width: 75, align: 'right' });
    rowY += 24;
  });

  // Divider
  rowY += 8;
  doc
    .moveTo(350, rowY)
    .lineTo(doc.page.width - 50, rowY)
    .strokeColor('#D1D5DB')
    .stroke();
  rowY += 12;

  // Totals
  const subtotal = computedItems.reduce((sum, item) => sum + item.computed, 0);
  const taxRate = invoice.taxRate ?? 0;
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;

  const totalsX = 400;
  const valuesX = 470;

  doc
    .font('Helvetica')
    .fontSize(fontSize)
    .fillColor('#374151')
    .text('Subtotal:', totalsX, rowY, { width: 60, align: 'right' })
    .text(formatCurrency(subtotal, currency), valuesX, rowY, { width: 75, align: 'right' });
  rowY += 18;

  if (taxRate > 0) {
    doc
      .text(`Tax (${taxRate}%):`, totalsX, rowY, { width: 60, align: 'right' })
      .text(formatCurrency(taxAmount, currency), valuesX, rowY, { width: 75, align: 'right' });
    rowY += 18;
  }

  doc
    .rect(390, rowY - 4, doc.page.width - 440, 24)
    .fill(accentColor);
  doc
    .font('Helvetica-Bold')
    .fontSize(12)
    .fillColor('#FFFFFF')
    .text('Total:', totalsX, rowY, { width: 60, align: 'right' })
    .text(formatCurrency(total, currency), valuesX, rowY, { width: 75, align: 'right' });

  // Notes
  if (invoice.notes) {
    rowY += 50;
    doc
      .font('Helvetica-Bold')
      .fontSize(11)
      .fillColor(accentColor)
      .text('Notes', 50, rowY);
    rowY += 18;
    doc
      .font('Helvetica')
      .fontSize(fontSize)
      .fillColor('#374151')
      .text(invoice.notes, 50, rowY, { width: 400 });
  }

  // Footer
  doc
    .font('Helvetica')
    .fontSize(8)
    .fillColor('#9CA3AF')
    .text(
      'Generated with Invoice Generator by Holdings — getholdings.com',
      50,
      doc.page.height - 40,
      { width: doc.page.width - 100, align: 'center' }
    );
}
