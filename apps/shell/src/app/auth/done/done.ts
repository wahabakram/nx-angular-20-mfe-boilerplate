import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatAnchor, MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Logo } from '@ng-mf/components';

@Component({
  selector: 'app-done',
  imports: [
    FormsModule,
    MatButton,
    MatIcon,
    RouterLink,
    MatAnchor,
    Logo
  ],
  templateUrl: './done.html',
  styleUrl: './done.scss'
})
export class Done {

}
