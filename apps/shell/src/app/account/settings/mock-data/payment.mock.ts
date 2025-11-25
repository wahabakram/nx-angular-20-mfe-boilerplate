export interface SavedCard {
  last4: string;
  expiry: string;
  brand: 'visa' | 'mastercard';
}

export const SAVED_CARDS: SavedCard[] = [
  { last4: '2212', expiry: '08/2028', brand: 'visa' },
  { last4: '2212', expiry: '08/2028', brand: 'mastercard' },
  { last4: '2212', expiry: '08/2028', brand: 'visa' },
];
