import { Component, OnInit, OnChanges } from '@angular/core';
import { Sponsor } from '../sponsors/sponsor.model';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { SponsorService } from '../sponsors/sponsor.service';
import { EventService } from '../events/event.service';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-partners',
  templateUrl: './partners.component.html',
  styleUrls: ['./partners.component.css']
})
export class PartnersComponent implements OnInit {
  partners: Sponsor[]
  flipped: boolean[]

  constructor(
    private router: Router,
    private sponsorService: SponsorService,
    private eventService: EventService
  ) { }

  ngOnInit() {
    this.getPartners()
  }

  getPartners(): void {
    this.eventService.getCurrent().subscribe(event => {
      this.sponsorService.getSponsors(event.id)
        .subscribe(sponsors => this.partners = this.filterSponsors(sponsors))
    })
  }

  filterSponsors(sponsors: Sponsor[]): Sponsor[] {

    let partners = []
    this.flipped = []

    console.log(sponsors)

    sponsors.forEach(sponsor => {
      if (sponsor.advertisementLvl === 'other'
        || sponsor.advertisementLvl === 'media') {
        partners.push(sponsor)
        this.flipped.push(false)
      }
    })
    return partners
  }

  flip(i: number) {
    this.flipped[i] = !this.flipped[i]
  }

}
