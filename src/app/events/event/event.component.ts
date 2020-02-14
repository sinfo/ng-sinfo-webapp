import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Params, Router } from '@angular/router'
import { Title } from '@angular/platform-browser'
import { EventService } from '../event.service'
import { environment } from '../../../environments/environment'
import { Event } from '../event.model'
import { SponsorService } from '../../landing-page/sponsors/sponsor.service'
import { Sponsor } from '../../landing-page/sponsors/sponsor.model'

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {
  eventId: string
  eventName: string

  sponsors: Sponsor[]

  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
    private titleService: Title,
    private sponsorService: SponsorService
  ) { }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      this.eventId = environment.url_to_id[params['id']]
      this.eventService.getEvent(this.eventId).subscribe((event: Event) => {
        this.eventName = event.name
        this.titleService.setTitle(this.eventName)

        this.getSponsors(event);
      })
    })
  }

  getSponsors(event: Event): void {
    this.sponsorService.getSponsors(event.id)
      .subscribe(sponsors => this.sponsors = sponsors)
  }
}
