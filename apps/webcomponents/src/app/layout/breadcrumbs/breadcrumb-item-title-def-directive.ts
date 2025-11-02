import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[mfcBreadcrumbItemTitleDef]',
})
export class BreadcrumbItemTitleDefDirective {
  readonly templateRef = inject(TemplateRef);
}
