import { Component, OnInit, Input } from '@angular/core'
import { Sponsor } from './sponsor.model'
import {
  trigger,
  state,
  style,
  animate,
  transition,
  AUTO_STYLE
} from '@angular/animations';

@Component({
  selector: 'app-sponsors',
  templateUrl: './sponsors.component.html',
  styleUrls: ['./sponsors.component.css'],
  animations: [
    trigger('myInsertRemoveTrigger', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms', style({ opacity: 0 }))
      ])
    ]),
  ]
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
