import { Component, OnInit } from '@angular/core'
import { Router, NavigationEnd } from '@angular/router'
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

  constructor (
    private router: Router,
    private eventService: EventService
  ) {
    this.eventService.getCurrent().subscribe(event => { this.begin = event.begin; this.end = event.end })
    /**
     * At time of writing this, there is no way to scroll to fragments, natively.
     * Issue: https://github.com/angular/angular/issues/6595
     */
    router.events.subscribe(s => {
      if (s instanceof NavigationEnd) {
        const tree = router.parseUrl(router.url)
        if (tree.fragment) {
          const element = document.querySelector('#' + tree.fragment)
          if (element) { element.scrollIntoView(true) }
        }
      }
    })
  }

  ngOnInit () {
    this.selectedAboutText = 'About Us'
    this.eventService.getCurrent().subscribe(event => { this.eventId = event.id })
    this.showOrHideDropdown()
  }

  /* Beggining of Dropdown tabs actions */
  showOrHideDropdown (): void {
    this.displayAboutDropdown = window.innerWidth > 768 ? true : false
  }

  toggleDropdown (): void {
    this.displayAboutDropdown = !this.displayAboutDropdown
  }

  updatedSelectedText (text: string): void {
    this.selectedAboutText = text
  }
  /* End of Dropdown tabs actions */
}
