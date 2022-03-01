import { Component, OnInit } from '@angular/core'
import { Sponsor } from '../../landing-page/sponsors/sponsor.model'
import { SponsorService } from '../../landing-page/sponsors/sponsor.service'
import { Promocode } from './promocode.model'
import { PromocodesService } from './promocodes.service'

@Component({
  selector: 'app-promocodes',
  templateUrl: './promocodes.component.html',
  styleUrls: ['./promocodes.component.css']
})
export class PromocodesComponent implements OnInit {
  partners: Promocode[]
  isPartnersEmpty: boolean

  constructor(
    private partnerService: PromocodesService,
    private sponsorService: SponsorService
  ) { }

  ngOnInit() {
    this.getPartners()
  }

  getPartners(): void {
    this.partnerService.getPartners()
      .subscribe(partners => {
        this.getImages(partners)
        partners.forEach(p => {
          if (this.isValidHttpUrl(p.code)) {
            p.link = true
          }
        })
      })
  }

  isValidHttpUrl(string) {
    let url;

    try {
      url = new URL(string);
    } catch (_) {
      return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
  }

  getImages(partners: Promocode[]) {

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
    ttp.innerHTML = 'Copied!'

    setTimeout((_str) => {
      const _ttp = document.getElementById('tooltip-' + _str)
      _ttp.innerHTML = 'Copy'
    }, 1500, str)
  }

}
