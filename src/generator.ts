import PDFDocument from 'pdfkit';
import { writeFile } from 'fs/promises';
import { Invoice, InvoiceOptions } from './types';
import { renderDefaultTemplate } from './templates/default';

const defaultOptions: InvoiceOptions = {
  template: 'default',
  fontSize: 10,
  accentColor: '#2563EB',
};

export async function generateInvoice(
  invoice: Invoice,
  options?: InvoiceOptions
): Promise<Buffer> {
  const opts: InvoiceOptions = { ...defaultOptions, ...options };

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'letter', margin: 50 });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    renderDefaultTemplate(doc, invoice, opts);

    doc.end();
  });
}

export async function generateInvoiceToFile(
  invoice: Invoice,
  outputPath: string,
  options?: InvoiceOptions
): Promise<void> {
  const buffer = await generateInvoice(invoice, options);
  await writeFile(outputPath, buffer);
}
