import { Component, OnInit } from '@angular/core';


import { ActivatedRoute, Router, Params } from '@angular/router'
import { DomSanitizer, SafeHtml, Title } from '@angular/platform-browser'
import { Location } from '@angular/common';


import { SessionService } from '../session/session.service';
import { Session } from '../session/session.model'
import { Company } from '../company/company.model';
import { CompanyService } from '../company/company.service';
import { EventService } from '../events/event.service'
import { Event } from '../events/event.model';
import { Sponsor } from '../landing-page/sponsors/sponsor.model';

@Component({
  selector: 'app-sponsor',
  templateUrl: './sponsor.component.html',
  styleUrls: ['./sponsor.component.css']
})
export class SponsorComponent implements OnInit {


  sessions: Session[]
  sponsor: Company
  description: SafeHtml
  event: Event

  constructor(
    private sessionService: SessionService,
    private sponsorService: CompanyService,
    private activatedRoute: ActivatedRoute,
    private eventService: EventService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private titleService: Title,
    private _location: Location,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.forEach((params: Params) => {
      const id = params['id']
      this.sponsorService.getCompany(id)
        .subscribe(sponsor => {
          this.sponsor = sponsor


          this.eventService.getCurrent().subscribe(event => {
            this.event = event
            this.titleService.setTitle(event.name + ' - ' + this.sponsor.name)
            this.getSessions(this.sponsor.id)

          })
        })
    })
  }


  backClicked() {
    this._location.back();
  }

  getSessions(id: string): void {
    this.sessionService.getSessions(this.event.id)
      .subscribe(sessions => {
        this.sessions = sessions.filter(session => session.companies && session.companies.length > 0 && session.companies[0].id === id)
      })
  }

  getSponsor(id: string): void {

  }

  onSelect(id: string): void {
    this.router.navigate(['/sessions', id])
  }

  visitSite(sponsor: Sponsor) {
    if (sponsor.site) window.open(sponsor.site, '_blank')
  }

}

