import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { EventService } from '../events/event.service'
import { Title } from '@angular/platform-browser'

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
    private titleService: Title,
    private eventService: EventService
  ) {

  }

  ngOnInit () {
    this.selectedAboutText = 'About Us'
    this.eventService.getCurrent().subscribe(event => {
      this.titleService.setTitle(event.name)
      this.eventId = event.id
      this.begin = event.beginDate
      this.end = event.endDate
    })
    this.showOrHideDropdown()
  }

  /* Beggining of Dropdown tabs actions */
  showOrHideDropdown (): void {
    this.displayAboutDropdown = window.innerWidth > 768
  }

  updatedSelectedText (text: string): void {
    this.selectedAboutText = text
  }
  /* End of Dropdown tabs actions */
}
