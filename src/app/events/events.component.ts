import { Component, OnInit, AfterViewInit } from '@angular/core'
import { MessageService, Type } from '../message.service'
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router'
import { environment } from '../../environments/environment'

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  selectedAboutText: string
  displayAboutDropdown: boolean
  begin: Date
  end: Date

  constructor (
    private router: Router
  ) {
    this.begin = environment.begin
    this.end = environment.end
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
