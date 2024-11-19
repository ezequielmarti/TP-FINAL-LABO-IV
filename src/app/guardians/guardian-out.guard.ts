import { CanDeactivateFn } from '@angular/router';

export const guardianOutGuard: CanDeactivateFn<unknown> = (component, currentRoute, currentState, nextState) => {
  return true;
};
