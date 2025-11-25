import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { ErrorHelp } from '../_common/error-help/error-help';

@Component({
  selector: 'app-internal-server-error-2',
  imports: [
    MatButton,
    MatIcon,
    RouterLink,
    ErrorHelp
  ],
  templateUrl: './internal-server-error-2.html',
  styleUrl: './internal-server-error-2.scss'
})
export class InternalServerError2 {
  goBack() {
    window.history.back();
  }
}
