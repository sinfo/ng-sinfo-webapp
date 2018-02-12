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
  private diamond: Sponsor
  private platinums: Sponsor[] = []
  private golds: Sponsor[] = []
  private silvers: Sponsor[] = []
  private others: Sponsor[] = []

  private showAll = false

  constructor (
    private router: Router,
    private sponsorService: SponsorService
  ) { }

  ngOnInit () {
    /**
     * Check if this component is being initited from main page (/)
     * or sponsors page (/sponsors)
     * If in Sponsors page show ALL sponsors (this.showAll = true)
     */
    this.router.url === '/' ? this.showAll = false : this.showAll = true

    const sponsors = this.sponsorService.getLocalSponsors()
    if (sponsors) {
      this.sponsors = this.displaySponsors(sponsors)
    } else {
      // If sponsors does not exist in SponsorService memory we need to get it from the API
      this.getSponsors()
    }
  }

  getSponsors (): void {
    this.sponsorService.getSponsors()
      .subscribe(sponsors => this.sponsors = this.displaySponsors(sponsors))
  }

  displaySponsors (sponsors: Sponsor[]): Sponsor[] {
    sponsors.forEach(sponsor => {
      if (sponsor.advertisementLvl === 'exclusive') this.diamond = sponsor
      if (sponsor.advertisementLvl === 'max') this.platinums.push(sponsor)
      if (sponsor.advertisementLvl === 'med') this.golds.push(sponsor)
      if (sponsor.advertisementLvl === 'min') this.silvers.push(sponsor)
      if (sponsor.advertisementLvl === 'other'
        || sponsor.advertisementLvl === 'media') this.others.push(sponsor)
    })
    return sponsors
  }

}
