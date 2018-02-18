import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Params, Router } from '@angular/router'

import { SpeakerService } from '../speaker.service'
import { Speaker } from '../speaker.model'
import { SessionService } from '../../schedule/session.service'
import { Session } from '../../schedule/session.model'

@Component({
  selector: 'app-speaker',
  templateUrl: './speaker.component.html',
  styleUrls: ['./speaker.component.css']
})
export class SpeakerComponent implements OnInit {
  speaker: Speaker
  session: Session

  constructor (
    private speakerService: SpeakerService,
    private sessionService: SessionService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit () {
    this.route.params.forEach((params: Params) => {
      const id = params['id']
      this.getSpeaker(id)
    })
  }

  getSpeaker (id: string): void {
    this.speakerService.getSpeaker(id)
      .subscribe(speaker => {
        this.speaker = speaker
        this.getSession(this.speaker.id)
      })
  }

  getSession (id: string): void {
    this.sessionService.getSessions()
      .subscribe(sessions => {
        this.session = sessions.find(session => {
          return session.speakers.length > 0 ? session.speakers[0]['id'] === id : null
        })
      })
  }

  onSelect (session: Session): void {
    this.router.navigate(['/sessions', session.id])
  }
}
