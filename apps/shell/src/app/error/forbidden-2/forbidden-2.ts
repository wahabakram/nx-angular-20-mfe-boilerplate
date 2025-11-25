import { Component } from '@angular/core';
import { ErrorHelp } from '../_common/error-help/error-help';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

@Component({
  imports: [
    ErrorHelp,
    MatButton,
    MatIcon,
    RouterLink,
  ],
  templateUrl: './forbidden-2.html',
  styleUrl: './forbidden-2.scss'
})
export class Forbidden2 {
  goBack() {
    window.history.back();
  }
}
