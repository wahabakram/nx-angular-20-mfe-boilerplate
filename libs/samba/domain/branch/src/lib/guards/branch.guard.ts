import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { BranchStore } from '../store/branch.store';

export const branchGuard: CanActivateFn = (route, state) => {
  const branchStore = inject(BranchStore);
  const router = inject(Router);

  if (branchStore.selectedBranchId()) {
    return true;
  }

  return router.createUrlTree(['/select-branch'], {
    queryParams: { returnUrl: state.url }
  });
};
