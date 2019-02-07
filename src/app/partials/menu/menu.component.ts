import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { AuthService } from '../../auth/auth.service'
import { MessageService } from '../../message.service'
import { EventService } from '../../events/event.service'
import { Event } from '../../events/event.model'
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  isLoggedIn = false
  private shortEventList: Event[]
  private id_to_url: string = environment.id_to_url

  constructor (
    private router: Router,
    public messageService: MessageService,
    public eventService: EventService,
    private authService: AuthService
  ) { }

  ngOnInit () {
    this.isLoggedIn = this.authService.isLoggedIn()
    this.getShortEventList()
  }

  onLogout (): void {
    this.authService.logout()
    this.router.navigate(['/'])
  }

  getShortEventList (): void {
    this.eventService.getEvents().subscribe(events => {
      //Sort array
      this.shortEventList = events.sort(function(a,b){
        return Date.parse(b.date) - Date.parse(a.date);
      //Remove current event
      }).filter(function(a){
        return a.id != environment.currentEvent
      })
    })
  }
}
