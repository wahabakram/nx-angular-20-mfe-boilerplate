import {
  Component,
  computed,
  input,
  output,
  ChangeDetectionStrategy,
  Signal,
  effect,
  OnDestroy,
  OnInit, inject, DestroyRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, ValidatorFn } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { ComponentConfig, FormConfig, LayoutNode, GridNode, ValidatorConfig } from '../form-config.model';
import { FormGeneratorService } from '../form-generator';
import { ValidatorRegistryService } from '../validator-registry';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ComponentLoader } from '../component-loader/component-loader';

@Component({
  selector: 'mfc-form-renderer',
  exportAs: 'mfcFormRenderer',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatNativeDateModule,
    ComponentLoader,
  ],
  templateUrl: './form-renderer.html',
  styleUrl: './form-renderer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'mfc-form-renderer',
  }
})
export class FormRenderer implements OnInit, OnDestroy {
  private destroyRef = inject(DestroyRef);
  private _formGenerator = inject(FormGeneratorService);
  private _validatorRegistry = inject(ValidatorRegistryService);

  readonly config = input.required<FormConfig>();
  readonly initialValue = input<Record<string, any> | undefined>();
  readonly formSubmit = output<any>();
  readonly valueChanges = output<any>();

  private elementsMap: Signal<Map<string, ComponentConfig>> = computed(() => {
    const map = new Map<string, ComponentConfig>();
    for (const element of this.config().elements) {
      map.set(element.name, element);
    }
    return map;
  });

  protected formGroup: Signal<FormGroup> = computed(() =>
    this._formGenerator.createFormGroup(this.config(), this.initialValue())
  );

  private initialized = false;
  private valueChangesSub?: Subscription;

  constructor(
  ) {
    effect(() => {
      this.valueChangesSub?.unsubscribe();
      const form = this.formGroup();
      this.valueChangesSub = form.valueChanges
        .pipe(
          startWith(form.value),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe(() => {
          for (const elementConfig of this.config().elements) {
            if (elementConfig.kind === 'field') {
              const control = form.get(elementConfig.name);

              if (!control) {
                continue;
              }

              const isVisible = elementConfig.visibleWhen ? elementConfig.visibleWhen(form) : true;
              const shouldBeEnabled = !(elementConfig.disabled ?? false) && isVisible;

              if (shouldBeEnabled && control.disabled) {
                control.enable({ emitEvent: false });
                const validators = this.mapValidators(elementConfig.validators);
                control.setValidators(validators);
              } else if (!shouldBeEnabled && control.enabled) {
                control.disable({ emitEvent: false });
                control.clearValidators();
              }

              control.updateValueAndValidity({ emitEvent: false });
            }
          }

          this.initialized = true;
        });
    });
  }

  ngOnInit() {
    const form = this.formGroup();
    form
      .valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (!this.initialized) {
          return;
        }

        this.valueChanges.emit(form.value);
      });
  }

  ngOnDestroy(): void {
    this.valueChangesSub?.unsubscribe();
  }

  submit() {
    const form = this.formGroup();
    if (form.valid) {
      this.formSubmit.emit(form.getRawValue());
    } else {
      form.markAllAsTouched();
    }
  }

  get form() {
    return this.formGroup();
  }

  get value() {
    return this.formGroup().value;
  }

  get isValid() {
    return this.form.valid;
  }

  get isInvalid() {
    return this.form.invalid;
  }

  protected isFieldVisible(name: string): boolean {
    const componentConfig = this.elementsMap().get(name);
    if (!componentConfig) {
      return true;
    }

    if (componentConfig.kind === 'field' && componentConfig.visibleWhen) {
      return componentConfig.visibleWhen(this.formGroup());
    }

    return true;
  }

  protected getComponentConfig(name: string): ComponentConfig | undefined {
    return this.elementsMap().get(name);
  }

  protected getControl(name: string): FormControl | null {
    return this.formGroup().get(name) as FormControl | null;
  }

  protected isGridNode(node: LayoutNode): node is GridNode {
    return 'children' in node;
  }

  protected onSubmit(): void {
    this.submit();
  }

  private mapValidators(validators: ValidatorConfig[] | undefined): ValidatorFn[] {
    if (!validators) {
      return [];
    }

    return validators.map(config => this._validatorRegistry.getValidator(config));
  }
}
