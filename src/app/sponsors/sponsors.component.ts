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
  sponsors: Sponsor[]
  diamond: Sponsor
  platinums: Sponsor[] = []
  golds: Sponsor[] = []
  silvers: Sponsor[] = []
  others: Sponsor[] = []

  showAll = false

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

    this.getSponsors()
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
