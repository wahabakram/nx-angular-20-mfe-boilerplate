import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function usernameValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const valid = /^[a-zA-Z0-9_.-]+$/.test(control.value);

    return valid ? null : { invalidUsername: true };
  };
}
