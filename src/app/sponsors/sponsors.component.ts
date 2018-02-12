import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { SponsorService } from './sponsor.service'
import { Sponsor } from './sponsor.model'

@Component({
  selector: 'app-sponsors',
  templateUrl: './sponsors.component.html',
  styleUrls: ['./sponsors.component.css']
})
export class SponsorsComponent implements OnInit {
  private sponsors: Sponsor[]

  constructor (
    private router: Router,
    private sponsorService: SponsorService
  ) { }

  ngOnInit () {
    const sponsors = this.sponsorService.getLocalSponsors()
    if (sponsors) {
      this.sponsors = sponsors
    } else {
      // If speakers does not exist in SpeakerService memory we need to get it from the API
      this.getSponsors()
    }
  }

  getSponsors (): void {
    this.sponsorService.getSponsors()
      .subscribe(sponsors => this.sponsors = sponsors)
  }

}
