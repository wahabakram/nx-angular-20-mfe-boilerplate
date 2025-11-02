import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[mfcDataViewActionBar]',
})
export class DataViewActionBarDirective {
  readonly templateRef = inject(TemplateRef);
}
