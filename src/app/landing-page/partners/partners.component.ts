import { Component, Input, OnInit, OnChanges } from '@angular/core'
import { Sponsor } from '../sponsors/sponsor.model'
import {
  trigger,
  state,
  style,
  animate,
  transition,
  AUTO_STYLE
} from '@angular/animations';

@Component({
  selector: 'app-partners',
  templateUrl: './partners.component.html',
  styleUrls: ['./partners.component.css'],
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
export class PartnersComponent implements OnInit, OnChanges {

  @Input() sponsors: Sponsor[]

  partners: Sponsor[] = []
  showAll = true

  constructor(
  ) { }

  ngOnInit() {
    this.fillPartners()
  }

  ngOnChanges() {
    this.fillPartners()
  }

  fillPartners() {
    if (!this.sponsors || this.sponsors.length === 0) return

    this.partners = this.sponsors.filter((sponsor: Sponsor) => {
      return sponsor
    })
  }
}
