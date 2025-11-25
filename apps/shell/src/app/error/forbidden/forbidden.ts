import { Component } from '@angular/core';
import { MatAnchor, MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-forbidden',
  imports: [
    MatAnchor,
    RouterLink,
    MatButton,
    MatIcon
  ],
  templateUrl: './forbidden.html',
  styleUrl: './forbidden.scss'
})
export class Forbidden {
  goBack() {
    window.history.back();
  }
}
