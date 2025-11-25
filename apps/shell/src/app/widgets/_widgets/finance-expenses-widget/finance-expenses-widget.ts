import { Component, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { CurrencyPipe } from '@angular/common';

export type ExpenseCategoryType = 'travel' | 'shopping' | 'food';

export interface Expense {
  category: string;
  icon: string;
  amount: number;
  percentage: number;
  categoryType: ExpenseCategoryType;
}

@Component({
  selector: 'app-finance-expenses-widget',
  imports: [
    MatIcon,
    CurrencyPipe,
  ],
  templateUrl: './finance-expenses-widget.html',
  styleUrl: './finance-expenses-widget.scss',
  host: {
    class: 'widget-container'
  }
})
export class FinanceExpensesWidget {
  expenses = signal<Expense[]>([
    {
      category: 'Travels',
      icon: 'airplanemode_active',
      amount: 1134.00,
      percentage: 50,
      categoryType: 'travel', // Используем семантический тип
    },
    {
      category: 'Shopping',
      icon: 'shopping_cart',
      amount: 612.95,
      percentage: 24,
      categoryType: 'shopping', // Используем семантический тип
    },
    {
      category: 'Food',
      icon: 'fastfood',
      amount: 610.35,
      percentage: 24,
      categoryType: 'food', // Используем семантический тип
    },
  ]);
}
