import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[mfDataViewActionBar]',
})
export class DataViewActionBarDirective {
  readonly templateRef = inject(TemplateRef);
}
