import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router, Params } from '@angular/router'
import { DomSanitizer, SafeHtml, Title } from '@angular/platform-browser'
import { Location } from '@angular/common';
import { SessionService } from './session.service'
import { Session } from './session.model'
import { SpeakerService } from '../speakers/speaker.service'
import { Speaker } from '../speakers/speaker.model'
import { EventService } from '../events/event.service'
import {
  trigger,
  style,
  animate,
  transition
} from '@angular/animations';
import { UserService } from '../user/user.service';
import { User } from '../user/user.model';

@Component({
  selector: 'app-sessions',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.css'],
  animations: [
    trigger('myInsertRemoveTrigger', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
      // transition(':leave', [
      //   animate('300ms', style({ opacity: 0 }))
      // ])
    ]),
  ]
})

export class SessionComponent implements OnInit {
  session: Session
  speakers: Speaker[] = []
  description: SafeHtml
  user: User
  showMore = false

  constructor(
    private sessionService: SessionService,
    private speakerService: SpeakerService,
    private activatedRoute: ActivatedRoute,
    private eventService: EventService,
    private userService: UserService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private titleService: Title,
    private _location: Location
  ) { }

  ngOnInit() {
    this.activatedRoute.params.forEach((params: Params) => {
      const id = params['id']
      this.getSession(id)

      this.eventService.getCurrent().subscribe(event => {
        this.titleService.setTitle(event.name + ' - ' + this.session.name)
      })

      this.userService.getMe().subscribe((me) => this.user = me)
    })
  }
  backClicked() {
    this._location.back();
  }

  getSession(id: string): void {
    this.sessionService.getSession(id)
      .subscribe(session => {
        this.description = this.sanitizer.bypassSecurityTrustHtml(session.description)
        this.session = session
        if (session.kind === 'Keynote') {
          this.getSpeaker(this.session)
        }
      })
  }

  getSpeaker(session: Session): void {
    for(let sessionSpeaker of session.speakers){
      this.speakerService.getSpeaker(sessionSpeaker['id'])
      .subscribe(speaker => {
        this.speakers.push(speaker);
      })
    }
  }

  onSelect(id: string): void {
    this.router.navigate(['/speakers', id])
  }

}
