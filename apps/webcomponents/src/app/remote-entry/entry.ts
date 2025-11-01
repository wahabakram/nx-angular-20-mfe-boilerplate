import { Component } from '@angular/core';
import { NxWelcome } from './nx-welcome';

@Component({
  imports: [NxWelcome],
  selector: 'mfc-webcomponents-entry',
  template: `<mfc-nx-welcome></mfc-nx-welcome>`,
})
export class RemoteEntry {}
