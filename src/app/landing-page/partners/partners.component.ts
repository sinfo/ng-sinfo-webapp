import { Component, Input, OnInit, OnChanges } from '@angular/core'
import { Sponsor } from '../sponsors/sponsor.model'

@Component({
  selector: 'app-partners',
  templateUrl: './partners.component.html',
  styleUrls: ['./partners.component.css']
})
export class PartnersComponent implements OnInit, OnChanges {

  @Input() sponsors: Sponsor[]

  partners: Sponsor[] = []

  constructor (
  ) { }

  ngOnInit () {
    this.fillPartners()
  }

  ngOnChanges () {
    this.fillPartners()
  }

  fillPartners () {
    if (!this.sponsors || this.sponsors.length === 0) return

    this.partners = this.sponsors.filter((sponsor: Sponsor) => {
      return sponsor.advertisementLvl === 'other'
    })
  }
}
