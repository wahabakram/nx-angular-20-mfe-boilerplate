import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-payment-list',
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Payments</h1>
        <button mat-raised-button color="primary">
          <mat-icon>add</mat-icon>
          Record Payment
        </button>
      </div>

      <mat-card>
        <mat-card-content class="empty-state">
          <mat-icon>payment</mat-icon>
          <h2>No payments yet</h2>
          <p>Record your first payment to track revenue</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-container {
      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;

        h1 {
          margin: 0;
          font-size: 2rem;
          font-weight: 700;
        }
      }

      .empty-state {
        text-align: center;
        padding: 4rem 2rem;

        mat-icon {
          font-size: 64px;
          width: 64px;
          height: 64px;
          color: #d1d5db;
          margin-bottom: 1rem;
        }

        h2 {
          margin: 0 0 0.5rem 0;
        }

        p {
          margin: 0;
          color: #6b7280;
        }
      }
    }
  `],
})
export class PaymentList {}
