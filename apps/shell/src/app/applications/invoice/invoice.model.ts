// Shared invoice models for the Invoice feature

export interface Party {
  name: string;
  email: string;
  address?: string;
  logo?: string;
}

export interface Reminder {
  label: string;
  checked?: boolean;
}

export interface InvoiceItem {
  name: string;
  description?: string;
  qty: number;
  /** already formatted for display */
  unitPrice: string;
  /** already formatted for display */
  amount: string;
}

export interface PaymentField {
  label: string;
  value: string;
}

export interface ActivityLink { label: string; href?: string; type: string }

export interface Activity {
  who: string;
  when: string;
  what: string;
  type: string;
  links?: ActivityLink[];
}

export interface InvoiceDetailsMock {
  headerTitle: string;
  subtitle: string;
  badges: string[];
  reminders: Reminder[];
  sender: Party;
  customer: Party;
  invoice: {
    number: string;
    issueDate: string;
    dueDate: string;
    currency: string;
  };
  items: InvoiceItem[];
  totals: {
    subtotal: string;
    discountLabel: string;
    discountAmount: string;
    total: string;
  };
  paymentInfo: PaymentField[];
  note: string;
  activity: Activity[];
}
