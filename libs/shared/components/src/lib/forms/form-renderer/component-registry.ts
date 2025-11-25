import { inject, Injectable, Type } from '@angular/core';
import { FORM_RENDERER_FIELD_REGISTRY } from './form-config.model';

export type ComponentImporter = () => Promise<Type<any>>;

@Injectable({
  providedIn: 'root',
})
export class ComponentRegistryService {
  private globalRegistry = inject(FORM_RENDERER_FIELD_REGISTRY, { optional: true });
  private componentMap = new Map<string, ComponentImporter>();

  constructor() {
    this.registerDefaultComponents();
  }

  private registerDefaultComponents(): void {
    this.componentMap.set('input', () =>
      import('./input-field/input-field').then(c => c.InputField)
    );
    this.componentMap.set('textarea', () =>
      import('./textarea-field/textarea-field')
        .then(c => c.TextareaField)
    );
    this.componentMap.set('select', () =>
      import('./select-field/select-field')
        .then(c => c.SelectField)
    );
    this.componentMap.set('checkbox', () =>
      import('./checkbox-field/checkbox-field')
        .then(c => c.CheckboxField)
    );
    this.componentMap.set('datepicker', () =>
      import('./datepicker-field/datepicker-field')
        .then(c => c.DatepickerField)
    );
    this.componentMap.set('toggle', () =>
      import('./toggle-field/toggle-field')
        .then(c => c.ToggleField)
    );
    this.componentMap.set('radioGroup', () =>
      import('./radio-group-field/radio-group-field')
        .then(c => c.RadioGroupField)
    );
    this.componentMap.set('timezone', () =>
      import('./timezone-field/timezone-field')
        .then(c => c.TimezoneField)
    );
    this.componentMap.set('image', () =>
      import('./image-content/image-content')
        .then(c => c.ImageContent));
    this.componentMap.set('text', () =>
      import('./text-content/text-content')
        .then(c => c.TextContent));
    this.componentMap.set('divider', () =>
      import('./divider-content/divider-content')
        .then(c => c.DividerContent));
    this.componentMap.set('autocompleteMany', () =>
      import('./autocomplete-many-field/autocomplete-many-field')
        .then(c => c.AutocompleteManyField)
    );

    if (this.globalRegistry) {
      const globalRegistry = this.globalRegistry as any;
      Object.keys(globalRegistry).forEach(typeName => {
        this.componentMap.set(typeName, globalRegistry[typeName]);
      });
    }
  }

  getImporter(typeName: string): ComponentImporter | undefined {
    return this.componentMap.get(typeName);
  }
}
