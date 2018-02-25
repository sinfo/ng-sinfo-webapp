import { Component, OnInit, Input } from '@angular/core'
import { environment } from '../../../environments/environment'
import { Router } from '@angular/router'
import { AuthService } from '../../auth/auth.service'

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  @Input() user: any
  eventOcurring: boolean
  @Input() showSidebar = true

  constructor (
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit () {
    this.eventOcurring = environment.eventOcurring
  }

  onLogout (): void {
    this.authService.logout()
    this.router.navigate(['/'])
  }
}
