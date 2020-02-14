import { Component, OnInit, OnChanges, Input } from '@angular/core'
import { Router } from '@angular/router'
import { Title } from '@angular/platform-browser'

import { SponsorService } from './sponsor.service'
import { EventService } from '../../events/event.service'
import { Sponsor } from './sponsor.model'

@Component({
  selector: 'app-sponsors',
  templateUrl: './sponsors.component.html',
  styleUrls: ['./sponsors.component.css']
})
export class SponsorsComponent implements OnInit, OnChanges {

  @Input() sponsors: Sponsor[]
  diamond: Sponsor
  platinums: Sponsor[] = []
  golds: Sponsor[] = []
  silvers: Sponsor[] = []
  others: Sponsor[] = []

  showAll = false
  isAllSponsors = false

  constructor(
    private router: Router,
    private titleService: Title,
    private sponsorService: SponsorService,
  ) { }

  ngOnInit() {
    /**
     * Check if this component is being initited from main page (/)
     * or sponsors page (/sponsors)
     * If in Sponsors page show ALL sponsors (this.showAll = true)
     */
    this.showAll = this.router.url !== '/'
    this.isAllSponsors = this.router.url === '/sponsors'

    this.displaySponsors(this.sponsors)
  }

  ngOnChanges() {
    this.showAll = this.router.url !== '/'
    this.isAllSponsors = this.router.url === '/sponsors'
  }

  displaySponsors(sponsors: Sponsor[]): Sponsor[] {
    this.diamond = null
    this.platinums = []
    this.golds = []
    this.silvers = []
    this.others = []

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
