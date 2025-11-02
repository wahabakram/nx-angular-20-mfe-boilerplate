import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[mfcBreadcrumbItemIconDef]',
})
export class BreadcrumbItemIconDefDirective {
  readonly templateRef = inject(TemplateRef);
}
