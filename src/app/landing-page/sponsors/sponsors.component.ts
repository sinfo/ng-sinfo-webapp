import { Component, OnInit, Input } from '@angular/core'
import { Sponsor } from './sponsor.model'

@Component({
  selector: 'app-sponsors',
  templateUrl: './sponsors.component.html',
  styleUrls: ['./sponsors.component.css']
})
export class SponsorsComponent implements OnInit {

  @Input() sponsors: Sponsor[]
  diamond: Sponsor
  platinums: Sponsor[] = []
  golds: Sponsor[] = []
  silvers: Sponsor[] = []
  others: Sponsor[] = []

  showAll = false
  isAllSponsors = false

  constructor() { }

  ngOnInit() {
    console.log("here")
    console.log("sponsors", this.sponsors)
    this.displaySponsors(this.sponsors)
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

  show() {
    this.showAll = !this.showAll
  }

}
