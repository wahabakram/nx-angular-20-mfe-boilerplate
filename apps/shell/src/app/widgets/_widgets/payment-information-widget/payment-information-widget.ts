import { Component, inject, input, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { DASHBOARD } from '@ng-mf/components';

@Component({
  selector: 'app-payment-information-widget',
  imports: [MatButton, RouterLink],
  templateUrl: './payment-information-widget.html',
  styleUrl: './payment-information-widget.scss',
})
export class PaymentInformationWidget implements OnInit {
  private _dashboard = inject<any>(DASHBOARD, { optional: true });

  widget = input();

  ngOnInit() {}
}
