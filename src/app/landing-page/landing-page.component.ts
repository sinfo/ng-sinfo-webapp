import { Component, OnInit } from '@angular/core'
import { EventService } from '../events/event.service'
import { Title } from '@angular/platform-browser'
import { LivestreamService } from './livestream/livestream.service'
import { SponsorService } from './sponsors/sponsor.service'
import { Sponsor } from './sponsors/sponsor.model'
import { PromocodeService } from './promocodes/promocode.service'
import { Promocode } from './promocodes/promocode.model'
import { Event } from '../events/event.model'
import {
  trigger,
  state,
  style,
  animate,
  transition,
  AUTO_STYLE
} from '@angular/animations';


@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
  animations: [
    trigger('myInsertRemoveTrigger', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('0ms', style({ opacity: 0 }))
      ])
    ]),
  ]

})
export class LandingPageComponent implements OnInit {
  selectedAboutText: string
  displayAboutDropdown: boolean
  menuClick: boolean
  eventId: string
  begin: Date
  end: Date
  fragment: string
  isLive: boolean
  dropdownNav: boolean = false
  sponsors: Sponsor[]
  promocodes: Promocode[]

  constructor(
    private titleService: Title,
    private eventService: EventService,
    private liveStreamService: LivestreamService,
    private sponsorService: SponsorService,
    private promocodeService: PromocodeService
  ) { }

  ngOnInit() {
    this.selectedAboutText = 'About Us'
    this.eventService.getCurrent().subscribe((event: Event) => {
      event = new Event(event)
      this.titleService.setTitle(event.name)
      this.eventId = event.id
      this.begin = event.begin
      this.end = event.end

      this.getSponsors(event)
      this.getPromocodes()
    })

    this.showOrHideDropdown()
    //this.checkLiveStream()
  }

  toggleDropdown() {
    this.dropdownNav = !this.dropdownNav
  }

  getSponsors(event: Event): void {
    this.sponsorService.getSponsors(event.id)
      .subscribe(sponsors => {
        this.sponsors = sponsors
      }
      )
  }

  getPromocodes(): void {
    this.promocodeService.getPromocodes(this.eventId)
      .subscribe(promocodes => {
        this.promocodes = promocodes
      })
  }

  /* Beggining of Dropdown tabs actions */
  showOrHideDropdown(): void {
    this.displayAboutDropdown = window.innerWidth > 768 ? true : false
    this.menuClick = false
  }

  dropdown(): boolean {
    return !this.displayAboutDropdown && this.menuClick
  }

  updateMenuClick(): void {
    this.menuClick = !this.menuClick
  }

  updatedSelectedText(text: string): void {
    this.selectedAboutText = text
  }
  /* End of Dropdown tabs actions */

  checkLiveStream() {
    this.liveStreamService.getLivestreamInformation().subscribe(
      data => {
        this.isLive = data['up']
      }
    )
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}
