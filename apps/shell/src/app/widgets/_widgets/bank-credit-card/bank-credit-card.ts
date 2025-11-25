import { Component, inject, input, OnInit } from '@angular/core';
import { DASHBOARD } from '@ng-mf/components';

@Component({
  selector: 'app-bank-credit-card',
  imports: [],
  templateUrl: './bank-credit-card.html',
  styleUrl: './bank-credit-card.scss',
  host: {
    class: 'widget-container'
  }
})
export class BankCreditCard implements OnInit {
  private _dashboard = inject<any>(DASHBOARD, { optional: true });

  widget = input();

  ngOnInit() {
  }
}
