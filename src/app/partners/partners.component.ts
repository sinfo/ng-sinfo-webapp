import { Component, OnInit, OnChanges } from '@angular/core';
import { Sponsor } from '../sponsors/sponsor.model';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { SponsorService } from '../sponsors/sponsor.service';
import { EventService } from '../events/event.service';
import { filter, map } from 'rxjs/operators';
import { stringify } from 'querystring';
import { Partner } from './partner.model';
import { PartnersService } from './partners.service';

@Component({
  selector: 'app-partners',
  templateUrl: './partners.component.html',
  styleUrls: ['./partners.component.css']
})
export class PartnersComponent implements OnInit {
  partners: Partner[]

  constructor(
    private partnerService: PartnersService,
    private sponsorService: SponsorService
  ) { }

  ngOnInit() {
    this.getPartners()
  }

  getPartners(): void {
    this.partnerService.getPartners()
      .subscribe(partners => this.getImages(partners))
  }

  getImages(partners: Partner[]) {

    partners.forEach(p => {
      this.sponsorService.getSponsor(p.company).subscribe((sponsor: Sponsor) => {
        p.img = sponsor.img
        p.name = sponsor.name
        p.flipped = false
      })
    })

    this.partners = partners
  }

  flip(i: number) {
    this.partners[i].flipped = !this.partners[i].flipped
    if (this.partners[i].flipped) {
      document.getElementById(i.toString()).style.transform = "rotateY(180deg)"
    } else {
      document.getElementById(i.toString()).style.transform = "rotateY(0deg)"
    }
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
