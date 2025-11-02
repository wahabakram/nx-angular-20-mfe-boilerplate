import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[mfcBreadcrumbItemNameDef]',
})
export class BreadcrumbItemNameDefDirective {
  readonly templateRef = inject(TemplateRef);
}
