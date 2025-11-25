export interface Plan {
  id: string;
  name: string;
  price: number;
  description: string;
  isPopular?: boolean;
}

export interface BillingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface BillingHistoryItem {
  transactionId: string;
  planName: string;
  amount: number;
  date: Date | string;
  status: BillingHistoryStatus;
  cardLast4: string;
}

export interface BillingHistoryStatus {
  type: 'paid' | 'failed' | 'pending';
  name: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}
