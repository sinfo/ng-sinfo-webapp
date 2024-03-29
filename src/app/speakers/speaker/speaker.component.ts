import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Params, Router } from '@angular/router'
import { Title } from '@angular/platform-browser'
import { Location } from '@angular/common';

import { SpeakerService } from '../speaker.service'
import { Speaker } from '../speaker.model'
import { SessionService } from '../../session/session.service'
import { Session } from '../../session/session.model'
import { EventService } from '../../events/event.service'

@Component({
  selector: 'app-speaker',
  templateUrl: './speaker.component.html',
  styleUrls: ['./speaker.component.css']
})
export class SpeakerComponent implements OnInit {
  speaker: Speaker
  session: Session

  constructor(
    private speakerService: SpeakerService,
    private sessionService: SessionService,
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private _location: Location
  ) { }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      const id = params['id']
      this.getSpeaker(id)
      this.eventService.getCurrent().subscribe(event => {
        this.titleService.setTitle(event.name + ' - ' + this.speaker.name)
      })
    })
  }

  backClicked() {
    this._location.back();
  }

  getSpeaker(id: string): void {
    this.speakerService.getSpeaker(id)
      .subscribe(speaker => {
        this.speaker = speaker
        this.getSession(this.speaker.id)
      })
  }

  getSession(id: string): void {
    this.eventService.getCurrent().subscribe(event => {
      this.sessionService.getSessions(event.id)
        .subscribe(sessions => {
          this.session = sessions.find(session => {
            return session.speakers.length > 0 ? session.speakers[0]['id'] === id : null
          })
        })
    })
  }

  onSelect(session: Session): void {
    this.router.navigate(['/sessions', session.id])
  }
}
