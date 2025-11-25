import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-billing-actions-cell',
  imports: [
    MatButton,
    MatIcon
  ],
  templateUrl: './billing-actions-cell.html',
  styleUrl: './billing-actions-cell.scss'
})
export class BillingActionsCell {

}
