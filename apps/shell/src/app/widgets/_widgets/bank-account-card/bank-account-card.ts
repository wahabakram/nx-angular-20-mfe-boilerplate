import { Component, inject, input, OnInit } from '@angular/core';
import { DASHBOARD } from '@ng-mf/components';

@Component({
  selector: 'app-bank-account-card',
  imports: [],
  templateUrl: './bank-account-card.html',
  styleUrl: './bank-account-card.scss',
  host: {
    class: 'widget-container'
  }
})
export class BankAccountCard implements OnInit {
  private _dashboard = inject<any>(DASHBOARD, { optional: true });

  widget = input();

  ngOnInit() {
  }
}
