import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router, Params } from '@angular/router'

import { SessionService } from '../session.service'
import { Session } from '../session.model'
import { SpeakerService } from '../../speakers/speaker.service'
import { Speaker } from '../../speakers/speaker.model'

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.css']
})

export class SessionsComponent implements OnInit {
  private session: Session
  private speaker: Speaker

  constructor (
    private sessionService: SessionService,
    private speakerService: SpeakerService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit () {
    this.activatedRoute.params.forEach((params: Params) => {
      const id = params['id']
      this.getSession(id)
    })
  }

  getSession (id: string): void {
    this.sessionService.getSession(id)
      .subscribe(session => {
        this.session = session
        if (session.kind === 'Keynote') {
          this.getSpeaker(this.session)
        }
      })
  }

  getSpeaker (session: Session): void {
    this.speakerService.getSpeaker(session.speakers[0]['id'])
      .subscribe(speaker => this.speaker = speaker)

  }

  onSelect (id: string): void {
    this.router.navigate(['/speakers', id])
  }

}
