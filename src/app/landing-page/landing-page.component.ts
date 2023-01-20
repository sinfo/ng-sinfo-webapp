import { Component, OnInit } from '@angular/core'
import { EventService } from '../events/event.service'
import { Title } from '@angular/platform-browser'
import { LivestreamService } from './livestream/livestream.service'
import { SponsorService } from './sponsors/sponsor.service'
import { Sponsor } from './sponsors/sponsor.model'
import { Event } from '../events/event.model'
import { environment } from '../../environments/environment'
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],

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

  constructor(
    private titleService: Title,
    private eventService: EventService,
    private liveStreamService: LivestreamService,
    private sponsorService: SponsorService
  ) { }

  ngOnInit() {
    this.selectedAboutText = 'About Us'
    console.log(environment.deckUrl)
    this.eventService.getCurrent().subscribe((event: Event) => {
      this.titleService.setTitle(event.name)
      this.eventId = event.id
      this.begin = event.begin
      this.end = event.end

      this.getSponsors(event)
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
        console.log("sponsors")

        console.log(sponsors)
      }
      )
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
}
