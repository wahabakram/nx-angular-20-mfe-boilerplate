import { Component, computed, signal, WritableSignal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatRipple } from '@angular/material/core';
import { RouterLink } from '@angular/router';
import { NgTemplateOutlet } from '@angular/common';
import { MatButton } from '@angular/material/button';

export type FaqItem = {
  readonly question: string;
  readonly answer: string;
  isOpen: WritableSignal<boolean>;
};

@Component({
  selector: 'app-faq',
  imports: [
    MatIcon,
    MatRipple,
    RouterLink,
    NgTemplateOutlet,
    MatButton,
  ],
  templateUrl: './faq.html',
  styleUrl: './faq.scss'
})
export class Faq {
  private readonly mostAskedSource: Omit<FaqItem, 'isOpen'>[] = [
    {
      question: 'Is there a 14-days trial?',
      answer: 'Yes, we offer a 14-day free trial. You can explore all the features of the Premium Membership during this period without any commitment.',
    },
    {
      question: "What's the benefits of the Premium Membership?",
      answer: 'Premium Membership gives you access to exclusive features, unlimited downloads, priority support, and much more.',
    },
  ];

  private readonly generalInquiriesSource: Omit<FaqItem, 'isOpen'>[] = [
    {
      question: 'How to download your items',
      answer: 'To download your items, go to your account dashboard, navigate to the "My Items" section, and click the download button.',
    },
    {
      question: 'View and download invoices',
      answer: 'You can view and download all your invoices from the "Billing" section in your account settings. They are available in PDF format.',
    },
  ];

  private readonly licensesSource: Omit<FaqItem, 'isOpen'>[] = [
    {
      question: 'How do licenses work for items I bought?',
      answer: 'Each license is a legal agreement that grants you specific rights to use the item. Details are provided with each purchase.',
    },
    {
      question: 'Do licenses have an expiry date?',
      answer: 'Most of our licenses are perpetual, meaning they do not expire. However, some special licenses might have a time limit, which will be clearly stated.',
    },
    {
      question: 'I want to make multiple end products with the same item',
      answer: 'For multiple end products, you typically need to purchase a separate license for each one or acquire an Extended License that allows for multiple uses.',
    },
    {
      question: 'How easy is it to change the license type?',
      answer: 'Upgrading your license (e.g., from Regular to Extended) is straightforward and can be done from your account\'s download page.',
    },
    {
      question: 'Do I need a Regular License or an Extended License?',
      answer: 'A Regular License is suitable for a single commercial project. If the end product is sold to multiple clients, an Extended License is required.',
    },
  ];

  private readonly paymentsSource: Omit<FaqItem, 'isOpen'>[] = [
    {
      question: 'Common PayPal, Skrill, and credit card issues',
      answer: 'If you encounter issues, first ensure your details are correct and your account has sufficient funds. For persistent issues, contact our support team.',
    },
    {
      question: 'How do I find my transaction ID?',
      answer: 'Your transaction ID can be found in the payment confirmation email you received and in the "Billing" section of your account.',
    },
    {
      question: 'PayPal disputes And chargebacks',
      answer: 'We encourage you to contact our support first to resolve any issues. Filing a dispute may temporarily lock your account.',
    },
    {
      question: 'Saving your credit card details',
      answer: 'For your security, we do not store full credit card details on our servers. We use a secure, PCI-compliant payment processor.',
    },
    {
      question: 'Why do prepaid credits expire?',
      answer: 'Prepaid credits may have an expiry date to comply with financial regulations and to encourage active use of our services.',
    },
  ];

  readonly licensesFaqs = signal<FaqItem[]>(
    this.licensesSource.map((item) => ({ ...item, isOpen: signal(false) }))
  );

  readonly paymentsFaqs = signal<FaqItem[]>(
    this.paymentsSource.map((item) => ({ ...item, isOpen: signal(false) }))
  );

  readonly mostAskedFaqs = signal<FaqItem[]>(
    this.mostAskedSource.map((item) => ({ ...item, isOpen: signal(false) }))
  );

  readonly generalInquiriesFaqs = signal<FaqItem[]>(
    this.generalInquiriesSource.map((item) => ({ ...item, isOpen: signal(false) }))
  );

  toggleFaq(faq: FaqItem): void {
    faq.isOpen.update((currentValue: any) => !currentValue);
  }
}
