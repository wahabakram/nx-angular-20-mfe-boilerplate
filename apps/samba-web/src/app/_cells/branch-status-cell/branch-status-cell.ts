import { Component, input } from '@angular/core';

@Component({
  selector: 'app-branch-status-cell',
  imports: [],
  template: `
    <span
      class="status"
      [class.active]="isActive()"
      [class.inactive]="!isActive()">
      {{ isActive() ? 'Active' : 'Inactive' }}
    </span>
  `,
  styles: `
    :host {
      font-size: 0.75rem;
    }

    .status {
      font-weight: 600;
      text-align: center;
      line-height: 1.2;
      display: inline-flex;
      align-items: center;
      padding: 0.375rem 0.75rem;
      border-radius: 1.75rem;
      border: 1px solid transparent;
      width: fit-content;
      height: 1.75rem;
    }

    .status.active {
      background-color: #2ecc71;
      color: white;
    }

    .status.inactive {
      background-color: rgb(156 163 175);
      color: white;
    }

    @media (prefers-color-scheme: dark) {
      .status.active {
        background-color: #27ae60;
      }

      .status.inactive {
        background-color: rgb(107 114 128);
      }
    }
  `,
})
export class BranchStatusCell {
  isActive = input.required<boolean>();
}
