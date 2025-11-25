import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ErrorHelp } from '../_common/error-help/error-help';

@Component({
  imports: [
    RouterLink,
    MatButton,
    MatIcon,
    ErrorHelp
  ],
  templateUrl: './not-found-2.html',
  styleUrl: './not-found-2.scss'
})
export class NotFound2 {
  goBack() {
    window.history.back();
  }
}
