import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { EventService } from '../events/event.service'

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  selectedAboutText: string
  displayAboutDropdown: boolean
  eventId: string
  begin: Date
  end: Date
  fragment: string

  constructor (
    private router: Router,
    private eventService: EventService
  ) {

  }

  ngOnInit () {
    this.selectedAboutText = 'About Us'
    this.eventService.getCurrent().subscribe(event => {
      this.eventId = event.id
      this.begin = event.begin
      this.end = event.end
      const curr = new Date().getTime()
    })
    this.showOrHideDropdown()
  }

  /* Beggining of Dropdown tabs actions */
  showOrHideDropdown (): void {
    this.displayAboutDropdown = window.innerWidth > 768 ? true : false
  }

  updatedSelectedText (text: string): void {
    this.selectedAboutText = text
  }
  /* End of Dropdown tabs actions */
}
