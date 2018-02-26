import { Component, OnInit, Input } from '@angular/core'
import { environment } from '../../../environments/environment'
import { Router, RouterStateSnapshot } from '@angular/router'
import { AuthService } from '../../auth/auth.service'

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  @Input() user: any
  eventOcurring: boolean
  showSidebar = true
  url: String
  private snapshot: RouterStateSnapshot

  constructor (
    private router: Router,
    private authService: AuthService
  ) {
    this.snapshot = router.routerState.snapshot
  }

  ngOnInit () {
    this.eventOcurring = environment.eventOcurring
    this.url = this.snapshot.url.toString()
  }

  detectLocation (location: string): boolean {
    return this.url.indexOf(location) !== -1
  }

  onLogout (): void {
    this.authService.logout()
    this.router.navigate(['/'])
  }
}
