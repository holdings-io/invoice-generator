import { generateInvoiceToFile, Invoice } from '../src';

const invoice: Invoice = {
  invoiceNumber: 'INV-2024-042',
  date: '2024-03-01',
  dueDate: '2024-03-31',
  from: {
    name: 'Creative Studio',
    address: '789 Design Blvd\nAustin, TX 78701',
    email: 'hello@creativestudio.com',
  },
  to: {
    name: 'Startup Inc',
    address: '321 Launch Pad Dr\nDenver, CO 80202',
    email: 'finance@startup.com',
  },
  items: [
    { description: 'Brand Strategy Workshop', quantity: 2, unitPrice: 2000 },
    { description: 'UI/UX Design Sprint', quantity: 1, unitPrice: 5000 },
    { description: 'Design System Documentation', quantity: 1, unitPrice: 1500 },
  ],
  currency: 'USD',
  taxRate: 0,
  notes: 'Net 30. We appreciate your partnership!',
};

// Custom accent color for a different look
generateInvoiceToFile(invoice, 'custom-invoice.pdf', {
  accentColor: '#059669',
  fontSize: 11,
}).then(() => {
  console.log('Custom invoice generated: custom-invoice.pdf');
});
