import { Component, OnInit } from '@angular/core'
import { Session } from '../../session/session.model'
import { SessionService } from '../../session/session.service'
import { SessionCannonService } from '../../session/session-cannon.service'
import { User } from '../user.model'
import { UserService } from '../user.service'

@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.css']
})
export class CheckinComponent implements OnInit {

  sessions = []

  selectedSession: Session
  users: User[]
  me: User
  title: string

  scannerActive: boolean

  constructor (
    private sessionService: SessionService,
    private sessionCannonService: SessionCannonService,
    private userService: UserService
  ) { }

  ngOnInit () {
    this.scannerActive = false

    this.userService.getMe()
      .subscribe(me => {
        this.me = me

        if (this.checkLocalStorage()) return

        this.sessionService.getSessions()
          .subscribe(sessions => {
            let _sessions = []
            sessions.forEach(s => {
              let sessionDate = new Date(s.date)
              let sessionDuration = new Date(s.duration)
              let durationInSeconds =
                (sessionDuration.getHours() * 3600) +
                (sessionDuration.getMinutes() * 60) +
                sessionDuration.getSeconds()

              let sessionEnd = new Date(sessionDate.getTime() + durationInSeconds * 1000)
              let countdown = new Date(sessionEnd.getTime() - sessionDate.getTime())

              // today and before it ends
              if (new Date() < sessionEnd && sessionDate.getDate() === new Date().getDate()) {
                _sessions.push({
                  begin: sessionDate,
                  end: sessionEnd,
                  countdown: countdown,
                  session: s
                })
              }

            })
            this.sessions = _sessions
            this.users = []
          })
      })
  }

  beginCheckIn (session: Session) {
    this.selectedSession = session
    this.scannerActive = true
    localStorage.setItem('selectedSession', JSON.stringify(this.selectedSession))
  }

  receiveUser (user: User) {
    this.users.push(user)
    localStorage.setItem('users', JSON.stringify(this.users))
  }

  submit () {
    let ids = this.users.reduce((acc, cur) => {
      acc.push(cur.id)
      return acc
    }, [])

    this.sessionCannonService.checkin(this.selectedSession.id, ids)
      .subscribe(something => {
        console.log(something)
        localStorage.removeItem('users')
        localStorage.removeItem('selectedSession')
      })
  }

  checkLocalStorage (): boolean {
    let selectedSection = JSON.parse(localStorage.getItem('selectedSession'))
    this.scannerActive = true

    if (!this.selectedSession) return false

    this.users = JSON.parse(localStorage.getItem('users'))
    this.selectedSession = selectedSection

    console.log('retrieved:', this.selectedSession, this.users)
    return true
  }

}
