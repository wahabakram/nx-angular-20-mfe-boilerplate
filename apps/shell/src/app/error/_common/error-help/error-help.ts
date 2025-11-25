import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-error-help',
  imports: [
    MatIcon,
    RouterLink
  ],
  templateUrl: './error-help.html',
  styleUrl: './error-help.scss'
})
export class ErrorHelp {
  readonly supportEmail = signal('support@example.com');
  readonly blogLink = signal('www.example.com/blog');
}
