import { Injectable } from '@angular/core'
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router'
import { Observable } from 'rxjs'
import { AuthService } from './auth.service'
import { UserService } from '../user/user.service'

@Injectable()
export class IsTeamGuard implements CanActivate {

  constructor (
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) { }

  canActivate (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'])
      return false
    }

    if (!this.userService.me || this.userService.me.role !== 'team') {
      this.router.navigate(['/login'])
      return false
    }

    return true
  }
}
