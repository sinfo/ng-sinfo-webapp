import { Component, OnInit } from '@angular/core'
import { Title } from '@angular/platform-browser'

import { Session } from '../../session/session.model'
import { SessionService } from '../../session/session.service'
import { SessionCannonService } from '../../session/session-cannon.service'
import { User } from '../user.model'
import { UserService } from '../user.service'
import { MessageService, Type } from '../../message.service'
import { EventService } from '../../events/event.service'
import { AchievementService } from '../achievements/achievement.service'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'

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
  unregistered: number
  all: boolean

  scannerActive: boolean
  submitLabel: string
  insideScannerMsg: [{ title: string, msg: string }, { title: string, msg: string }]

  constructor(
    private achievementService: AchievementService,
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

    this.scannerActive = false
    this.unregistered = 0
    this.all = false

    this.userService.getMe()
      .subscribe(me => {
        this.me = me
        if (this.checkLocalStorage()) return
        this.getSessions()
      })
  }

  toggleAll() {
    this.emptyLocalStorage()
    this.unregistered = 0
    this.getSessions()
  }

  getSessions() {
    this.eventService.getCurrent().subscribe(event => {
      this.sessionService.getSessions(event.id)
        .subscribe(sessions => {
          let _sessions = []
          sessions.forEach(s => {
            this.achievementService.getAchievementSession(s.id).subscribe(ach => {
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

              // today and before it ends OR all sessions
              if (sessionDate.getDate() === new Date().getDate() || this.all) {
                _sessions.push({
                  begin: sessionDate,
                  end: sessionEnd,
                  countdown: countdown,
                  session: s,
                  total: (ach.unregisteredUsers !== undefined ? ach.unregisteredUsers : 0) + (ach.users !== undefined ? ach.users.length : 0),
                  canCheckIn: sessionDate.getDate() === new Date().getDate()
                })
              }

            })
          })
          this.sessions = _sessions
          this.users = []
        })
    })
  }

  beginCheckIn(session: Session) {
    this.selectedSession = session
    this.scannerActive = true
    localStorage.setItem('selectedSession', JSON.stringify(this.selectedSession))
  }

  receiveUser(user: User) {
    this.users.push(user)
    localStorage.setItem('users', JSON.stringify(this.users))
    this.submitLabel = `Submit ${this.users.length + this.unregistered} users`
    this.updateInsideScannerMsg()
  }

  updateUnregistered(amount) {
    if (this.unregistered !== 0 || amount > 0) {
      this.unregistered += amount
      this.submitLabel = `Submit ${this.users.length + this.unregistered} users`
      this.updateInsideScannerMsg()
    }
  }

  submit() {
    let ids = this.users.reduce((acc, cur) => {
      acc.push(cur.id)
      return acc
    }, [])

    this.sessionCannonService.checkin(this.selectedSession.id, ids, this.unregistered)
      .subscribe(msg => {
        if (msg) {
          this.emptyLocalStorage()
          this.getSessions()

          this.messageService.add({
            origin: `Check in component`,
            showAlert: true,
            text: `Done!`,
            type: Type.success
          })
        }

      }, err => {
        console.error('erro no check in', err)
      })
  }

  checkLocalStorage(): boolean {
    let selectedSession = JSON.parse(localStorage.getItem('selectedSession'))
    this.scannerActive = true

    if (!selectedSession) return false

    let users = JSON.parse(localStorage.getItem('users'))

    if (!users) {
      this.users = []
      return false
    }

    this.users = users
    this.selectedSession = selectedSession
    this.submitLabel = `Submit ${this.users.length} users`
    this.updateInsideScannerMsg()

    return true
  }

  emptyLocalStorage() {
    localStorage.removeItem('users')
    localStorage.removeItem('selectedSession')
    this.scannerActive = false
    this.selectedSession = undefined
    this.users = []
    this.insideScannerMsg = undefined
    this.submitLabel = undefined
  }

  updateInsideScannerMsg() {
    this.insideScannerMsg = [
      {
        title: 'Last user:',
        msg: `${this.users[this.users.length - 1].name}`
      },
      {
        title: 'Total:',
        msg: `${this.users.length}`
      }
    ]
  }

  delete() {
    let result = window.confirm('This will delete all the saved check-ins, are you sure?')
    if (!result) return

    this.emptyLocalStorage()
    this.unregistered = 0
    this.getSessions()
  }

}
