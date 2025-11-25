import { Component } from '@angular/core';
import { NxWelcome } from './nx-welcome';

@Component({
  imports: [NxWelcome],
  selector: 'mf-webcomponents-entry',
  template: `<mf-nx-welcome></mf-nx-welcome>`,
})
export class RemoteEntry {}
