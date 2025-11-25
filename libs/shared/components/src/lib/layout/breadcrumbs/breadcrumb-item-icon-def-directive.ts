import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[mfBreadcrumbItemIconDef]',
})
export class BreadcrumbItemIconDefDirective {
  readonly templateRef = inject(TemplateRef);
}
