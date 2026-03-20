export interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount?: number;
}

export interface BusinessInfo {
  name: string;
  address?: string;
  email?: string;
  phone?: string;
}

export interface Invoice {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  from: BusinessInfo;
  to: BusinessInfo;
  items: LineItem[];
  notes?: string;
  taxRate?: number;
  currency?: string;
}

export interface InvoiceOptions {
  template?: 'default';
  fontSize?: number;
  accentColor?: string;
}
