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
  eventOcurring: Boolean

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
    this.eventService.getCurrent().subscribe(event => this.eventOcurring = event.isOcurring)
    this.url = this.snapshot.url.toString()

    if (this.user) {
      this.userService.isCvUpdated().subscribe(isCvUpdated => this.isCvUpdated = isCvUpdated, () => {
        this.isCvUpdated = false
      })
    }
  }

  detectLocation (location: string): boolean {

    this.url = this.router.url.toString()

    if (location === '/user/achievements'){
      console.log("testing" + location)
      console.log(this.url.toString())
      console.log(this.url.indexOf(location))
    }
    return this.url.indexOf(location) !== -1
  }

  onLogout (): void {
    this.authService.logout()
    this.router.navigate(['/'])
  }
}
