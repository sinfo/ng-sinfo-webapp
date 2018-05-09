import { Component, OnInit, Input } from '@angular/core'
import { environment } from '../../../environments/environment'
import { Router, RouterStateSnapshot } from '@angular/router'
import { AuthService } from '../../auth/auth.service'
import { UserService } from '../../user/user.service'
import { User } from '../../user/user.model'

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  @Input() user: User
  eventOcurring: boolean
  @Input() showSidebar = true
  url: String
  private snapshot: RouterStateSnapshot

  constructor (
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {
    this.snapshot = router.routerState.snapshot
  }

  ngOnInit () {
    let eventOcurring: boolean = environment.begin !== null && environment.end !== null ?
      new Date() >= environment.begin && new Date() <= environment.end
      : false
    this.url = this.snapshot.url.toString()

    if (this.authService.isLoggedIn()) {
      this.userService.getMe().subscribe(user => {
        this.user = user
      })
    }
  }

  detectLocation (location: string): boolean {
    return this.url.indexOf(location) !== -1
  }

  onLogout (): void {
    this.authService.logout()
    this.router.navigate(['/'])
  }
}
