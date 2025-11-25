import { Injectable, signal } from '@angular/core';
import { BillingAddress, BillingHistoryItem, FaqItem, Plan } from '../_models/billing-model';

@Injectable({
  providedIn: 'root',
})
export class BillingService {
  readonly plans = signal<Plan[]>([
    {
      id: 'plan-basic',
      name: 'Basic',
      price: 10,
      description: 'Basic features for up to 10 users with unlimited projects and reporting.'
    },
    {
      id: 'plan-growth',
      name: 'Growth',
      price: 20,
      description: 'Advance features and reportings, better workflows and automation.',
      isPopular: true
    },
    {
      id: 'plan-scale',
      name: 'Scale',
      price: 30,
      description: 'Personalized planning, advanced features and reporting + API Access.'
    },
    {
      id: 'plan-enterprise',
      name: 'Enterprise',
      price: 40,
      description: 'Personalized service and enterprise security for large temas + API Access.'
    },
  ]);

  readonly billingAddress = signal<BillingAddress>({
    firstName: 'Olivia',
    lastName: 'Martinez',
    address: '123 Main Street',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94103',
    country: 'United States',
  });

  readonly billingHistory = signal<BillingHistoryItem[]>([
      {
        "transactionId": "txn_8a2bde4f",
        "planName": "Premium Plan",
        "amount": 49.99,
        "date": "2025-05-15T08:30:00Z",
        "status": {
          "type": "paid",
          "name": "Paid"
        },
        "cardLast4": "5678"
      },
      {
        "transactionId": "txn_c1f9a03e",
        "planName": "Basic Plan",
        "amount": 10.00,
        "date": "2025-05-14T12:00:00Z",
        "status": {
          "type": "failed",
          "name": "Failed"
        },
        "cardLast4": "1122"
      },
      {
        "transactionId": "txn_3e4d5c6b",
        "planName": "Standard Plan",
        "amount": 25.50,
        "date": "2025-04-20T18:45:00Z",
        "status": {
          "type": "paid",
          "name": "Paid"
        },
        "cardLast4": "9876"
      },
      {
        "transactionId": "txn_f2a1b9c8",
        "planName": "Basic Plan",
        "amount": 10.00,
        "date": "2025-03-10T09:00:00Z",
        "status": {
          "type": "paid",
          "name": "Paid"
        },
        "cardLast4": "4321"
      },
      {
        "transactionId": "txn_d7e6f5a4",
        "planName": "Premium Plan",
        "amount": 49.99,
        "date": "2025-02-28T23:59:59Z",
        "status": {
          "type": "failed",
          "name": "Failed"
        },
        "cardLast4": "5555"
      },
      {
        "transactionId": "txn_9c8b7a6d",
        "planName": "Standard Plan",
        "amount": 25.50,
        "date": "2025-01-05T14:20:00Z",
        "status": {
          "type": "paid",
          "name": "Paid"
        },
        "cardLast4": "6789"
      },
      {
        "transactionId": "txn_5e4f3d2c",
        "planName": "Basic Plan",
        "amount": 10.00,
        "date": "2024-12-25T06:10:00Z",
        "status": {
          "type": "pending",
          "name": "Pending"
        },
        "cardLast4": "3344"
      },
      {
        "transactionId": "txn_b1a9c8d7",
        "planName": "Premium Plan",
        "amount": 49.99,
        "date": "2024-11-30T11:11:11Z",
        "status": {
          "type": "paid",
          "name": "Paid"
        },
        "cardLast4": "7788"
      },
      {
        "transactionId": "txn_6f5e4d3c",
        "planName": "Standard Plan",
        "amount": 25.50,
        "date": "2024-10-18T19:05:00Z",
        "status": {
          "type": "failed",
          "name": "Failed"
        },
        "cardLast4": "2121"
      },
      {
        "transactionId": "txn_a9b8c7d6",
        "planName": "Basic Plan",
        "amount": 10.00,
        "date": "2024-09-01T00:00:00Z",
        "status": {
          "type": "paid",
          "name": "Paid"
        },
        "cardLast4": "4567"
      }
  ]);

  readonly faqItems = signal<FaqItem[]>([
    {
      question: 'How do I change my plan?',
      answer: 'You can change your plan at any time in the "Plans & Billing" section.'
    },
    {
      question: 'Can I cancel my subscription?',
      answer: 'To cancel your subscription, please contact our support team.'
    },
    {
      question: 'How do I update my payment method?',
      answer: 'You can update your payment method in your account settings.'
    },
    {
      question: 'Where can I find my invoices?',
      answer: 'All your invoices are available for download in the "Billing history" section.'
    }
  ]);

  updateBillingAddress(newAddress: BillingAddress): void {
    this.billingAddress.set(newAddress);
    console.log('Billing address updated:', newAddress);
  }
}
