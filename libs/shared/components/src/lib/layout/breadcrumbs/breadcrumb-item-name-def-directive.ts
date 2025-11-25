import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[mfBreadcrumbItemNameDef]',
})
export class BreadcrumbItemNameDefDirective {
  readonly templateRef = inject(TemplateRef);
}
