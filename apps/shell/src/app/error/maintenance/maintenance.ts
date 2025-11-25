import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { HorizontalDivider } from '@ng-mf/components';

@Component({
  imports: [MatButton, MatIcon, RouterLink, HorizontalDivider],
  templateUrl: './maintenance.html',
  styleUrl: './maintenance.scss',
})
export class Maintenance {
  goBack() {
    window.history.back();
  }
}
