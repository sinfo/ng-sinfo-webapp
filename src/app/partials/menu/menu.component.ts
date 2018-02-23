import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { AuthService } from '../../auth/auth.service'
import { MessageService } from '../../message.service'

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  isLoggedIn = false

  constructor (
    private router: Router,
    public messageService: MessageService,
    private authService: AuthService
  ) { }

  ngOnInit () {
    this.isLoggedIn = this.authService.isLoggedIn()
  }

  onLogout (): void {
    this.authService.logout()
    this.router.navigate(['/'])
  }
}
