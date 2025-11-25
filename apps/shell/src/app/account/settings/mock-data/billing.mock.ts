export interface BillingTableItem {
  invoiceId: string;
  date: Date;
  amount: string;
  status: {
    id: 'paid' | 'unpaid' | 'pending';
    name: string;
  };
}

export interface BillingInfo {
  firstName: string;
  lastName: string;
  address: string;
  country: string;
  city: string;
}

export const BILLING_TABLE_DATA: BillingTableItem[] = [
  {
    invoiceId: '#INV11 - Mar 2024',
    date: new Date(),
    amount: '40.53',
    status: { id: 'paid', name: 'Paid' }
  },
  {
    invoiceId: '#INV12 - Mar 2024',
    date: new Date(),
    amount: '10.00',
    status: { id: 'paid', name: 'Paid' }
  },
  {
    invoiceId: '#INV13 - Mar 2024',
    date: new Date(),
    amount: '4.99',
    status: { id: 'unpaid', name: 'Unpaid' }
  },
  {
    invoiceId: '#INV14 - Mar 2024',
    date: new Date(),
    amount: '180.00',
    status: { id: 'pending', name: 'Pending' }
  },
  {
    invoiceId: '#INV15 - Mar 2024',
    date: new Date(),
    amount: '499.99',
    status: { id: 'paid', name: 'Paid' }
  },
  {
    invoiceId: '#INV16 - Mar 2024',
    date: new Date(),
    amount: '20.28',
    status: { id: 'paid', name: 'Paid' }
  },
  {
    invoiceId: '#INV17 - Mar 2024',
    date: new Date(),
    amount: '40.53',
    status: { id: 'paid', name: 'Paid' }
  },
];

export const BILLING_INFO: BillingInfo = {
  firstName: 'Pavel',
  lastName: 'Salauyou',
  address: 'Abbey Street 87',
  country: 'United Kingdom',
  city: 'London'
};
