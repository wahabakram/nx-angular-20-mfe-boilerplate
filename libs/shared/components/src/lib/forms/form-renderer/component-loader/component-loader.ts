import { Component, ViewContainerRef, input, effect, computed, viewChild, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ComponentConfig } from '../form-config.model';
import { ComponentRegistryService } from '../component-registry';

@Component({
  selector: 'mf-component-loader',
  exportAs: 'mfComponentLoader',
  templateUrl: './component-loader.html',
  host: {
    '[style.grid-column]': 'gridColumnStyle()',
  }
})
export class ComponentLoader {
  private _registry = inject(ComponentRegistryService);
  componentConfig = input.required<ComponentConfig>();
  control = input<FormControl | null>(null);
  colspan = input<number | undefined>();
  protected gridColumnStyle = computed(() => {
    const span = this.colspan();
    return span ? `span ${span}` : null;
  });

  anchor = viewChild.required('anchor', { read: ViewContainerRef });

  constructor() {
    effect(async () => {
      const config = this.componentConfig();
      const control = this.control();
      const vcr = this.anchor();
      vcr.clear();
      const importer = this._registry.getImporter(config.type);

      if (importer) {
        try {
          const componentType = await importer();
          const componentRef = vcr.createComponent(componentType);

          componentRef.setInput('config', config);

          if (control) {
            componentRef.setInput('control', control);
          }
        } catch (error) {
          console.error(`Error loading component for type "${config.type}":`, error);
        }
      }
    });
  }
}
