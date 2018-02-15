import { Injectable } from '@angular/core'
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router'
import { Observable } from 'rxjs/Observable'
import { AuthService } from './auth.service'

@Injectable()
export class AuthGuard implements CanActivate {

  constructor (
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate (
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    let url: string = state.url
    console.log(this.checkLogin(url))
    return this.checkLogin(url)
  }

  private checkLogin (url: string): boolean {
    if (this.authService.isLoggedIn()) return true

    // Store the attempted URL for redirecting
    this.authService.redirectUrl = url

    this.router.navigate(['/login'])
    return false
  }
}
