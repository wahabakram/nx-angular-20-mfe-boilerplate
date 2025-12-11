import { Component, inject, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Icon } from '@ng-mf/components';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Dashboard, DASHBOARD } from '@ng-mf/components';
import { MockDataService } from '../../../_mock-data/mock-data.service';

export interface IDataManagementWidget {
  title?: string;
}

@Component({
  selector: 'app-data-management-widget',
  imports: [MatButton, Icon, MatProgressSpinner],
  templateUrl: './data-management-widget.html',
  styleUrl: './data-management-widget.scss',
  host: {
    class: 'widget-container',
  },
})
export class DataManagementWidget {
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });
  private mockDataService = inject(MockDataService);

  isSeeding = signal(false);
  isDataSeeded = signal(this.mockDataService.isDataSeeded());
  message = signal<string | null>(null);

  seedData(force: boolean = false): void {
    this.isSeeding.set(true);
    this.message.set(null);

    this.mockDataService.seedAllData(force).subscribe({
      next: () => {
        this.isSeeding.set(false);
        this.isDataSeeded.set(true);
        this.message.set('✅ Mock data seeded successfully! Refresh the page to see the data.');
      },
      error: (err) => {
        this.isSeeding.set(false);
        this.message.set('❌ Failed to seed data. Check console for details.');
        console.error(err);
      },
    });
  }

  clearData(): void {
    if (confirm('Are you sure you want to clear the seeded data flag? This will allow re-seeding on next app start.')) {
      this.mockDataService.clearSeededFlag();
      this.isDataSeeded.set(false);
      this.message.set('✅ Data flag cleared. Refresh the page to seed data again.');
    }
  }

  refreshPage(): void {
    window.location.reload();
  }
}
