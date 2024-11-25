import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { NotificationService } from '../services/notification.service';

export const isAuthGuard: CanActivateFn = (route, state) => {
  
  const userService = inject(UserService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  if(userService.isLoggedIn()){
    return true;
  }else{
    notificationService.showMessage('Inicia sesión para poder acceder.');
    return false;
  }
  
};
