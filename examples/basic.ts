import { generateInvoiceToFile, Invoice } from '../src';

const invoice: Invoice = {
  invoiceNumber: 'INV-2024-001',
  date: '2024-01-15',
  dueDate: '2024-02-14',
  from: {
    name: 'Acme Corp',
    address: '123 Business St, Suite 100\nSan Francisco, CA 94105',
    email: 'billing@acme.com',
    phone: '(555) 123-4567',
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
  notes: 'Payment due within 30 days. Thank you for your business!',
  taxRate: 8.5,
};

generateInvoiceToFile(invoice, 'example-invoice.pdf').then(() => {
  console.log('Invoice generated: example-invoice.pdf');
});
