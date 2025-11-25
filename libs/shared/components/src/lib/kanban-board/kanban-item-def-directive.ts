import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[mfKanbanItemDef]'
})
export class KanbanItemDefDirective {
  readonly templateRef = inject(TemplateRef);
}
