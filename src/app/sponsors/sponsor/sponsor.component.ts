import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Params, Router } from '@angular/router'
import { Title } from '@angular/platform-browser'

import { SponsorService } from '../sponsor.service'
import { Sponsor } from '../sponsor.model'
import { EventService } from '../../events/event.service'

@Component({
  selector: 'app-sponsor',
  templateUrl: './sponsor.component.html',
  styleUrls: ['./sponsor.component.css']
})
export class SponsorComponent implements OnInit {
  sponsor: Sponsor

  constructor(
    private sponsorService: SponsorService,
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title
  ) { }

  async ngOnInit() {
    await this.route.params.forEach((params: Params) => {
      const id = params['id']
      this.getSponsor(id)
    })
  }

  getSponsor(id: string): void {
    this.sponsorService.getSponsor(id)
      .subscribe(sponsor => {
        this.sponsor = sponsor
      })
  }
}
