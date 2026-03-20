import { Command } from 'commander';
import { generateInvoiceToFile } from './generator';
import { Invoice, LineItem, BusinessInfo } from './types';

interface CliOptions {
  from: string;
  fromAddress?: string;
  fromEmail?: string;
  fromPhone?: string;
  to: string;
  toAddress?: string;
  toEmail?: string;
  toPhone?: string;
  item: string[];
  number?: string;
  date?: string;
  dueDate?: string;
  notes?: string;
  taxRate?: string;
  currency?: string;
  accentColor?: string;
  output: string;
}

function parseItem(raw: string): LineItem {
  const parts = raw.split(',').map((s) => s.trim());
  if (parts.length < 3) {
    throw new Error(
      `Invalid item format: "${raw}". Expected "description,quantity,unitPrice"`
    );
  }
  const description = parts[0];
  const quantity = Number(parts[1]);
  const unitPrice = Number(parts[2]);
  if (isNaN(quantity) || isNaN(unitPrice)) {
    throw new Error(
      `Invalid numbers in item: "${raw}". quantity and unitPrice must be numbers.`
    );
  }
  return { description, quantity, unitPrice };
}

function today(): string {
  return new Date().toISOString().split('T')[0];
}

function thirtyDaysFromNow(): string {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().split('T')[0];
}

function generateInvoiceNumber(): string {
  const now = new Date();
  return `INV-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
}

const program = new Command();

program
  .name('invoice-generator')
  .description('Generate professional PDF invoices')
  .version('1.0.0')
  .requiredOption('--from <name>', 'Sender / your company name')
  .option('--from-address <address>', 'Sender address')
  .option('--from-email <email>', 'Sender email')
  .option('--from-phone <phone>', 'Sender phone')
  .requiredOption('--to <name>', 'Recipient / client name')
  .option('--to-address <address>', 'Recipient address')
  .option('--to-email <email>', 'Recipient email')
  .option('--to-phone <phone>', 'Recipient phone')
  .requiredOption('--item <items...>', 'Line item: "description,quantity,unitPrice" (repeatable)')
  .option('--number <invoiceNumber>', 'Invoice number (auto-generated if omitted)')
  .option('--date <date>', 'Invoice date (default: today)')
  .option('--due-date <dueDate>', 'Due date (default: 30 days from today)')
  .option('--notes <notes>', 'Notes to include on invoice')
  .option('--tax-rate <rate>', 'Tax rate percentage (e.g. 8.5)')
  .option('--currency <code>', 'Currency code (default: USD)')
  .option('--accent-color <hex>', 'Accent color hex (default: #2563EB)')
  .option('-o, --output <path>', 'Output PDF file path', 'invoice.pdf')
  .action(async (opts: CliOptions) => {
    try {
      const from: BusinessInfo = {
        name: opts.from,
        address: opts.fromAddress,
        email: opts.fromEmail,
        phone: opts.fromPhone,
      };

      const to: BusinessInfo = {
        name: opts.to,
        address: opts.toAddress,
        email: opts.toEmail,
        phone: opts.toPhone,
      };

      const items = opts.item.map(parseItem);

      const invoice: Invoice = {
        invoiceNumber: opts.number || generateInvoiceNumber(),
        date: opts.date || today(),
        dueDate: opts.dueDate || thirtyDaysFromNow(),
        from,
        to,
        items,
        notes: opts.notes,
        taxRate: opts.taxRate ? Number(opts.taxRate) : undefined,
        currency: opts.currency,
      };

      await generateInvoiceToFile(invoice, opts.output, {
        accentColor: opts.accentColor,
      });

      console.log(`✅ Invoice generated: ${opts.output}`);
    } catch (err) {
      console.error(`❌ Error: ${(err as Error).message}`);
      process.exit(1);
    }
  });

program.parse();
