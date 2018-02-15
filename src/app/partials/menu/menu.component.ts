import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { MessageService } from '../messages/message.service'
import { AuthService } from '../../auth/auth.service'

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  private isLoggedIn = false

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
