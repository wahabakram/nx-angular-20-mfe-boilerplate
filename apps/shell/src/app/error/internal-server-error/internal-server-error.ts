import { Component } from '@angular/core';
import { MatAnchor, MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

@Component({
  imports: [
    MatAnchor,
    RouterLink,
    MatButton,
    MatIcon
  ],
  templateUrl: './internal-server-error.html',
  styleUrl: './internal-server-error.scss'
})
export class InternalServerError {
  goBack() {
    window.history.back();
  }
}
