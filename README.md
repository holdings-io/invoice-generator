# Invoice Generator

[![npm version](https://img.shields.io/npm/v/@holdings-io/invoice-generator.svg)](https://www.npmjs.com/package/@holdings-io/invoice-generator)
[![license](https://img.shields.io/npm/l/@holdings-io/invoice-generator.svg)](https://github.com/holdings-io/invoice-generator/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

Generate professional PDF invoices from the command line or programmatically.

> Try the free hosted version at [getholdings.com/tools/invoice-generator](https://getholdings.com/tools/invoice-generator)

## Installation

```bash
npm install @holdings-io/invoice-generator
```

Or use directly with npx:

```bash
npx @holdings-io/invoice-generator --from "My Company" --to "Client" --item "Service,1,500" -o invoice.pdf
```

## Quick Start

### Programmatic Usage

```typescript
import { generateInvoiceToFile } from '@holdings-io/invoice-generator';

await generateInvoiceToFile(
  {
    invoiceNumber: 'INV-2024-001',
    date: '2024-01-15',
    dueDate: '2024-02-14',
    from: {
      name: 'Acme Corp',
      address: '123 Business St\nSan Francisco, CA 94105',
      email: 'billing@acme.com',
    },
    to: {
      name: 'Client Industries',
      address: '456 Commerce Ave\nNew York, NY 10001',
      email: 'accounts@client.com',
    },
    items: [
      { description: 'Web Design', quantity: 40, unitPrice: 150 },
      { description: 'Logo Design', quantity: 1, unitPrice: 500 },
      { description: 'Hosting (Annual)', quantity: 1, unitPrice: 240 },
    ],
    notes: 'Payment due within 30 days.',
    taxRate: 8.5,
  },
  'invoice.pdf'
);
```

### CLI Usage

```bash
invoice-generator \
  --from "Acme Corp" \
  --from-email "billing@acme.com" \
  --to "Client Industries" \
  --to-email "accounts@client.com" \
  --item "Web Design,40,150" \
  --item "Logo Design,1,500" \
  --tax-rate 8.5 \
  --notes "Payment due within 30 days." \
  -o invoice.pdf
```

## API Reference

### `generateInvoice(invoice, options?): Promise<Buffer>`

Generates a PDF invoice and returns it as a Buffer.

```typescript
import { generateInvoice } from '@holdings-io/invoice-generator';

const pdfBuffer = await generateInvoice(invoice);
// Use the buffer: send as email attachment, upload to S3, etc.
```

### `generateInvoiceToFile(invoice, outputPath, options?): Promise<void>`

Generates a PDF invoice and writes it to a file.

```typescript
import { generateInvoiceToFile } from '@holdings-io/invoice-generator';

await generateInvoiceToFile(invoice, './invoices/INV-001.pdf');
```

### Types

```typescript
interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount?: number; // Override auto-calculated amount
}

interface BusinessInfo {
  name: string;
  address?: string;
  email?: string;
  phone?: string;
}

interface Invoice {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  from: BusinessInfo;
  to: BusinessInfo;
  items: LineItem[];
  notes?: string;
  taxRate?: number;    // Percentage, e.g. 8.5 for 8.5%
  currency?: string;   // ISO 4217 code, default: "USD"
}

interface InvoiceOptions {
  template?: 'default';
  fontSize?: number;       // Default: 10
  accentColor?: string;    // Hex color, default: "#2563EB"
}
```

## CLI Reference

```
Usage: invoice-generator [options]

Options:
  --from <name>              Sender / your company name (required)
  --from-address <address>   Sender address
  --from-email <email>       Sender email
  --from-phone <phone>       Sender phone
  --to <name>                Recipient / client name (required)
  --to-address <address>     Recipient address
  --to-email <email>         Recipient email
  --to-phone <phone>         Recipient phone
  --item <items...>          Line item: "description,qty,price" (repeatable, required)
  --number <invoiceNumber>   Invoice number (auto-generated if omitted)
  --date <date>              Invoice date (default: today)
  --due-date <dueDate>       Due date (default: 30 days from today)
  --notes <notes>            Notes to include on invoice
  --tax-rate <rate>          Tax rate percentage
  --currency <code>          Currency code (default: USD)
  --accent-color <hex>       Accent color (default: #2563EB)
  -o, --output <path>        Output file path (default: invoice.pdf)
  -V, --version              Output version number
  -h, --help                 Display help
```

### Examples

**Simple invoice:**
```bash
invoice-generator --from "My Co" --to "Client" --item "Consulting,10,200" -o invoice.pdf
```

**Multiple items with tax:**
```bash
invoice-generator \
  --from "Agency LLC" \
  --from-address "100 Main St, Portland, OR" \
  --to "Startup Inc" \
  --item "Design Sprint,1,5000" \
  --item "Development,80,175" \
  --item "QA Testing,20,125" \
  --tax-rate 9.0 \
  --notes "Net 30" \
  -o project-invoice.pdf
```

**Custom styling:**
```bash
invoice-generator \
  --from "Studio" --to "Client" \
  --item "Photography,1,2500" \
  --accent-color "#059669" \
  -o styled-invoice.pdf
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

[MIT](LICENSE)

---

Built by [Holdings](https://getholdings.com) — Banking with built-in accounting for nonprofits and small businesses.
