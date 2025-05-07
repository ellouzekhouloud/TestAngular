import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { LoginService } from './services/login.service';
import { NavigationService } from './services/navigation.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: LoginService, private router: Router,private navigationService: NavigationService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    if (!this.authService.isLoggedIn()) {
      localStorage.clear();
      return this.router.createUrlTree(['/login']);
    }
  
    const userRole = this.authService.getRole();
    const allowedRole = route.data['role'];
    const allowedRoles = route.data['roles'];
  
    const isAllowed =
      (!allowedRole && !allowedRoles) ||
      (allowedRole && userRole === allowedRole) ||
      (allowedRoles && allowedRoles.includes(userRole!));
  
    if (isAllowed) {
      // On ne stocke que si l’accès est autorisé
      this.navigationService.setPreviousUrl(state.url);
      return true;
    }
  
    // Si non autorisé, on redirige
    return this.router.createUrlTree(['/unauthorized']);
  }
}
