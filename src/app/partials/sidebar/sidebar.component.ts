import { Component, OnInit, Input } from '@angular/core'
import { Router, RouterStateSnapshot } from '@angular/router'
import { AuthService } from '../../auth/auth.service'
import { UserService } from '../../user/user.service'
import { User } from '../../user/user.model'
import { EventService } from '../../events/event.service'

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  @Input() user: User
  eventOccurring: Boolean
  url: String
  private snapshot: RouterStateSnapshot
  isCvUpdated: Boolean = true

  constructor (
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private eventService: EventService
  ) {
    this.snapshot = router.routerState.snapshot
  }

  ngOnInit () {
    this.eventService.getCurrent().subscribe(event => this.eventOccurring = event.isOccurring)
    this.url = this.snapshot.url.toString()

    if (this.authService.isLoggedIn()) {
      this.userService.getMe().subscribe(user => {
        this.user = user
      })
      this.userService.isCvUpdated().subscribe(isCvUpdated => this.isCvUpdated = isCvUpdated, () => {
        this.isCvUpdated = false
      })
    }
  }

  detectLocation (location: string): boolean {
    return this.url.indexOf(location) !== -1
  }

  // TODO why is it unused
  onLogout (): void {
    this.authService.logout()
    this.router.navigate(['/'])
  }
}
