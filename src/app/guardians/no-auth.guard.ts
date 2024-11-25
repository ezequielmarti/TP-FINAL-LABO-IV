import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { NotificationService } from '../services/notification.service';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  if(!userService.isLoggedIn()){
    return true;
    
  }else{
    router.navigate(['/']);
    notificationService.showMessage('Usted ya se encuentra registrado.');
    return false;
  }
};
