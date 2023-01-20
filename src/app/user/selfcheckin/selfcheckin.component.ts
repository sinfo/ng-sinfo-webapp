import { Component, OnInit } from '@angular/core'
import { Title } from '@angular/platform-browser'

import { Session } from '../../session/session.model'
import { SessionService } from '../../session/session.service'
import { SessionCannonService } from '../../session/session-cannon.service'
import { User } from '../user.model'
import { UserService } from '../user.service'
import { MessageService, Type } from '../../message.service'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { EventService } from '../../events/event.service'
import { Achievement } from '../achievements/achievement.model'
import { Router } from '@angular/router'

@Component({
  selector: 'app-selfcheckin',
  templateUrl: './selfcheckin.component.html',
  styleUrls: ['./selfcheckin.component.css']
})
export class SelfcheckinComponent implements OnInit {
  sessions = []

  selectedSession: Session
  sessionsSignedin = new Set<string>()
  me: User
  title: string
  warning = false
  code = ''

  constructor(
    private sessionService: SessionService,
    private sessionCannonService: SessionCannonService,
    private userService: UserService,
    private messageService: MessageService,
    private snackBar: MatSnackBar,
    private eventService: EventService,
    private titleService: Title,
    private router: Router

  ) { }

  ngOnInit() {
    this.eventService.getCurrent().subscribe(event => {
      this.titleService.setTitle(event.name + ' - Check In')
    })

    this.userService.getMe()
      .subscribe(me => {
        this.me = me
        this.userService.getUserAchievements(this.me.id)
          .subscribe(achievements => {
            achievements.forEach(a => {
              this.sessionsSignedin.add(a.session)
            })
            this.getSessions()
          })
      })
  }

  getSessions() {
    this.eventService.getCurrent().subscribe(event => {
      this.sessionService.getSessions(event.id)
        .subscribe(sessions => {
          let _sessions = []
          sessions.forEach(s => {
            let sessionDate = new Date(s.date)
            // Fix for 1970 +1 hour on toDate conversion bug (javascript being dumb)
            let duration = s.duration.slice(4)
            duration = '2010' + duration
            // End of fix
            let sessionDuration = new Date(duration)
            let durationInSeconds =
              (sessionDuration.getHours() * 3600) +
              (sessionDuration.getMinutes() * 60) +
              sessionDuration.getSeconds()

            let sessionEnd = new Date(sessionDate.getTime() + durationInSeconds * 1000)
            let countdown = new Date(sessionEnd.getTime() - new Date().getTime())

            // today and before it ends
            if (sessionDate.getDate() === new Date().getDate()) {
              _sessions.push({
                begin: sessionDate,
                end: sessionEnd,
                countdown: countdown,
                session: s
              })
            }

          })
          this.sessions = _sessions
        })
    })
  }

  beginCheckIn(session: Session) {
    this.warning = session.kind === 'Workshop'
    this.selectedSession = session
  }

  submit() {
    this.sessionCannonService.checkin(this.selectedSession.id, [this.me.id], 0, this.code)
      .subscribe((ach: Achievement) => {
        this.code = ''
        this.selectedSession = null
        if (ach) {
          this.sessionsSignedin.add(ach.session)
          this.snackBar.open(`Checked in to session`, "Ok", {
            panelClass: ['mat-toolbar', 'mat-primary'],
            duration: 2000
          })
          this.messageService.add({
            origin: `Self check in component`,
            showAlert: true,
            text: `Checked in to session`,
            type: Type.success,
            timeout: 7000
          })
          this.router.navigate([`/user/achievement/${ach.id}`])

        }

      }, err => {
        console.error('erro no check in')
      })
  }

}
