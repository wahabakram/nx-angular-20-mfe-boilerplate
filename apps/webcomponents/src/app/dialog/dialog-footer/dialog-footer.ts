import { NgClass } from '@angular/common';
import { Component, input, model, output } from '@angular/core';
import { DialogOptions } from '../types';
import { Icon } from '../../icon/icon';

@Component({
  selector: 'mfc-dialog-footer',
  imports: [NgClass, Icon],
  templateUrl: './dialog-footer.html',
  styleUrl: './dialog-footer.scss',
})
export class DialogFooter {
  config = input<DialogOptions<unknown>['footer']>();
  data = model();
  buttonClick = output<string>();
}
