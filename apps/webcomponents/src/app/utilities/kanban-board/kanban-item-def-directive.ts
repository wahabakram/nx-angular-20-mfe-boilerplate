import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[mfcKanbanItemDef]'
})
export class KanbanItemDefDirective {
  readonly templateRef = inject(TemplateRef);
}
