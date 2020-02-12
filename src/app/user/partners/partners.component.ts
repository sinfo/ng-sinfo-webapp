import { Component, OnInit, OnChanges } from '@angular/core';
import { Sponsor } from '../../sponsors/sponsor.model';
import { SponsorService } from '../../sponsors/sponsor.service';
import { Partner } from './partner.model';
import { PartnersService } from './partners.service';

@Component({
  selector: 'app-partners',
  templateUrl: './partners.component.html',
  styleUrls: ['./partners.component.css']
})
export class PartnersComponent implements OnInit {
  partners: Partner[]
  isPartnersEmpty: boolean

  constructor(
    private partnerService: PartnersService,
    private sponsorService: SponsorService
  ) { }

  ngOnInit() {
    this.getPartners()
  }

  getPartners(): void {
    this.partnerService.getPartners()
      .subscribe(partners => {
        this.getImages(partners)
      })
  }

  getImages(partners: Partner[]) {

    partners.forEach(p => {
      this.sponsorService.getSponsor(p.company).subscribe((sponsor: Sponsor) => {
        p.img = sponsor.img
        p.name = sponsor.name
      })
    })

    this.partners = partners
    this.isPartnersEmpty = this.partners.length === 0
  }

  copy(event, str: string) {
    const el = document.createElement('textarea')
    el.value = str
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
    event.stopPropagation()

    const ttp = document.getElementById('tooltip-' + str)
    ttp.style.opacity === '0' ? ttp.style.opacity = '0.8' : ttp.style.opacity = '0'

    setTimeout((str) => {
      const ttp = document.getElementById('tooltip-' + str)
      ttp.style.opacity === '0' ? ttp.style.opacity = '0.8' : ttp.style.opacity = '0'
    }, 1500, str)
  }

}
