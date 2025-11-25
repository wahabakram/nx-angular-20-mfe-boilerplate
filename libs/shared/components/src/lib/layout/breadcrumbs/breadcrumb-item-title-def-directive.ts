import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[mfBreadcrumbItemTitleDef]',
})
export class BreadcrumbItemTitleDefDirective {
  readonly templateRef = inject(TemplateRef);
}
