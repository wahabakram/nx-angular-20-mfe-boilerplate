import { InvoiceDetailsMock } from './invoice.model';

export const invoiceDetailsMock: InvoiceDetailsMock = {
  headerTitle: 'Invoice - INV-2025-0817-042',
  subtitle: 'View the details and activity of this invoice',
  badges: ['Overdue'],
  reminders: [
    { label: '7 days before due date', checked: true },
    { label: '3 days before due date', checked: true },
    { label: 'On due date' },
  ],
  sender: {
    name: 'Nimbus Creative Studio GmbH',
    address: 'Potsdamer Platz 1, 10785 Berlin, Germany',
    email: 'billing@nimbus.studio',
    logo: ''
  },
  customer: {
    name: 'Acme Robotics Inc.',
    email: 'ap@acmerobotics.com'
  },
  invoice: {
    number: 'INV-2025-0817-042',
    issueDate: 'August 12th, 2025',
    dueDate: 'August 26th, 2025',
    currency: 'EUR (€)'
  },
  items: [
    {
      name: 'UX Design Sprint (Week 1)',
      description: 'Discovery workshops, user flows, and wireframes for the mobile app.',
      qty: 1,
      unitPrice: '€3,200.00',
      amount: '€3,200.00'
    },
    {
      name: 'Mobile App Development',
      description: 'Implementation of core features and state management.',
      qty: 80,
      unitPrice: '€75.00',
      amount: '€6,000.00'
    },
    {
      name: 'Cloud Hosting (Aug 2025)',
      description: 'Managed Kubernetes cluster and CDN bandwidth.',
      qty: 1,
      unitPrice: '€420.00',
      amount: '€420.00'
    },
    {
      name: 'QA & Testing',
      description: 'Manual and automated regression testing.',
      qty: 24,
      unitPrice: '€55.00',
      amount: '€1,320.00'
    }
  ],
  totals: {
    subtotal: '€10,940.00',
    discountLabel: 'DISCOUNT (5%)',
    discountAmount: '€547.00',
    total: '€10,393.00'
  },
  paymentInfo: [
    { label: 'ACCOUNT NAME', value: 'Nimbus Creative Studio GmbH' },
    { label: 'IBAN', value: 'DE89 3704 0044 0532 0130 00' },
    { label: 'SWIFT/BIC', value: 'COBADEFFXXX' },
    { label: 'BANK NAME', value: 'Commerzbank AG' },
    { label: 'BANK ADDRESS', value: 'Kaiserplatz, 60261 Frankfurt am Main, Germany' },
    { label: 'REFERENCE', value: 'INV-2025-0817-042' }
  ],
  note: 'Thank you for your business. Please include the invoice number as the payment reference.',
  activity: [
    {
      who: 'You',
      when: 'Today, 10:02 AM',
      what: 'Created invoice INV-2025-0817-042/Acme Robotics Inc.',
      type: 'created'
    },
    {
      who: 'You',
      when: 'Today, 10:15 AM',
      what: 'Sent invoice INV-2025-0817-042 to ap@acmerobotics.com',
      type: 'sent'
    },
    {
      who: 'Payment Confirmed',
      when: 'Today, 11:40 AM',
      what: 'You manually confirmed a partial payment of €5,000.00',
      type: 'payment',
      links: [
        { label: 'EDIT PAYMENT', type: 'edit_payment' },
        { label: 'REMOVE PAYMENT', type: 'remove_payment' }
      ]
    },
    {
      who: 'You',
      when: 'Today, 12:05 PM',
      what: 'Resent invoice INV-2025-0817-042 to ap@acmerobotics.com',
      type: 'resent'
    }
  ]
};
