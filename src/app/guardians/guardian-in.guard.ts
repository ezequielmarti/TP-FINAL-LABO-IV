import { CanActivateFn } from '@angular/router';

export const guardianInGuard: CanActivateFn = (route, state) => {
  return true;
};
