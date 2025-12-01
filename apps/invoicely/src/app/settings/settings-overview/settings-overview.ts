import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-settings-overview',
  imports: [MatCardModule, MatIconModule],
  template: `
    <div class="page-container">
      <h1>Settings</h1>

      <mat-card>
        <mat-card-content class="placeholder-content">
          <mat-icon>settings</mat-icon>
          <h2>Settings</h2>
          <p>App settings and preferences will appear here</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-container {
      h1 {
        margin: 0 0 2rem 0;
        font-size: 2rem;
        font-weight: 700;
      }

      .placeholder-content {
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
export class SettingsOverview {}
