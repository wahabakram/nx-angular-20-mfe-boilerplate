import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { HorizontalDivider } from '@ng-mf/components';
import { Logo } from '@ng-mf/components';
import { NgOptimizedImage } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-signin',
  imports: [
    RouterLink,
    MatButton,
    MatFormField,
    MatLabel,
    MatInput,
    MatSuffix,
    HorizontalDivider,
    Logo,
    NgOptimizedImage,
    ReactiveFormsModule
  ],
  templateUrl: './signin.html',
  styleUrl: './signin.scss'
})
export class Signin {

}
