import { Component, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { PinInput } from '@ng-mf/components';
import { Logo } from '@ng-mf/components';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-password-reset',
  imports: [
    FormsModule,
    MatButton,
    RouterLink,
    ReactiveFormsModule,
    MatIcon,
    PinInput,
    Logo,
    NgOptimizedImage
  ],
  templateUrl: './password-reset.html',
  styleUrl: './password-reset.scss'
})
export class PasswordReset {
  private _router = inject(Router);
  pin = new FormControl('', [Validators.required]);

  resendCode(): void {
  }

  continue() {
    this._router.navigateByUrl('/auth/set-new-password');
  }
}
