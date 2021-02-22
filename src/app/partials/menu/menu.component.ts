import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { AuthService } from '../../auth/auth.service'
import { MessageService } from '../../message.service'
import { EventService } from '../../events/event.service'
import { Event } from '../../events/event.model'
import { environment } from '../../../environments/environment.prod'
import { HostListener } from "@angular/core";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  isLoggedIn = false
  shortEventList: Event[]
  id_to_url = environment.id_to_url
  showDropDown: Boolean = false
  showEditionsDropDown: Boolean = false
  screenWidth: number;

  constructor(
    private router: Router,
    public messageService: MessageService,
    public eventService: EventService,
    private authService: AuthService
  ) {
    this.getScreenSize();
  }

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn()
    this.getShortEventList()
  }


  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.screenWidth = window.innerWidth;
    console.log(this.screenWidth);
  }
  onLogout(): void {
    this.authService.logout()

    this.router.url === '/'
      ? window.location.reload()
      : this.router.navigate(['/'])
  }

  getShortEventList(): void {
    this.eventService.getCurrent().subscribe(event => {
      this.eventService.getEvents().subscribe(events => {
        this.shortEventList = events.filter(function (a) {
          return a.id !== event.id
        })
      })
    })
  }

  toggleDropdown() {
    this.showDropDown = !this.showDropDown
  }

  showEditionsDropdown() {
    this.showEditionsDropDown = !this.showEditionsDropDown
  }

  closeDropdown() {
    this.showDropDown = false
  }
}
