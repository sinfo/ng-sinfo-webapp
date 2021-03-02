import { Component, OnInit } from '@angular/core'
import { Title } from '@angular/platform-browser'

import { Session } from '../../session/session.model'
import { SessionService } from '../../session/session.service'
import { SessionCannonService } from '../../session/session-cannon.service'
import { User } from '../user.model'
import { UserService } from '../user.service'
import { MessageService, Type } from '../../message.service'
import { EventService } from '../../events/event.service'
import { Achievement } from '../achievements/achievement.model'

@Component({
  selector: 'app-selfcheckin',
  templateUrl: './selfcheckin.component.html',
  styleUrls: ['./selfcheckin.component.css']
})
export class SelfcheckinComponent implements OnInit {
  sessions = []

  selectedSession: Session
  sessionsSignedin: string[]
  me: User
  title: string
  warning = false

  constructor(
    private sessionService: SessionService,
    private sessionCannonService: SessionCannonService,
    private userService: UserService,
    private messageService: MessageService,
    private eventService: EventService,
    private titleService: Title
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
            this.sessionsSignedin = achievements.reduce((acc, cur) => {
              acc.push(cur.session)
              return acc
            }, [])
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

  submit(code) {
    this.sessionCannonService.checkin(this.selectedSession.id, [this.me.id], code)
      .subscribe(msg => {
        if (msg) {
          this.getSessions()

          this.messageService.add({
            origin: `Self check in component`,
            showAlert: true,
            text: `Done!`,
            type: Type.success,
            timeout: 1000
          })
        }

      }, err => {
        console.error('erro no check in', err)
      })
  }

}
