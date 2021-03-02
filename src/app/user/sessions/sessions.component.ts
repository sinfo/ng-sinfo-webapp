import { Component, OnInit } from '@angular/core'
import { SessionsService } from './sessions.service'
import { SessionService } from '../../session/session.service'
import { Session } from '../../session/session.model'
import { UserService } from '../user.service'
import { EventService } from '../../events/event.service'
import { User } from '../user.model'
import { Router } from '@angular/router'
import { Title } from '@angular/platform-browser'
import { Event } from '../../events/event.model'
import { AchievementService } from '../achievements/achievement.service'
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap'
import { ClipboardService } from "ngx-clipboard";

interface Code {
  created: Date,
  expiration: Date,
  code: String
}

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.css']
})
export class SessionsComponent implements OnInit {

  sessions: Session[]
  codes: Map<String, Code>
  me: User
  currentEvent: Event
  time: NgbTimeStruct = { hour: 13, minute: 30, second: 30 }

  constructor(
    private sessionsService: SessionsService,
    private eventSessionService: SessionService,
    private userService: UserService,
    private eventService: EventService,
    private achievementsService: AchievementService,
    private clipboardService: ClipboardService,
    private router: Router,
    private titleService: Title
  ) {
  }

  ngOnInit(): void {
    this.eventService.getCurrent().subscribe(event => {
      this.currentEvent = event
      this.titleService.setTitle(event.name + ' - Session Codes')
      this.codes = new Map<String, Code>()
      this.getSessions()
    })
  }

  generateSessionCode(session: Session): void {
    if (!session || !session.date) return

    const expirationDate = new Date(session.date)
    expirationDate.setFullYear(2021)
    expirationDate.setHours(this.time.hour, this.time.minute, this.time.second)
    this.sessionsService.generateCode(session.id, expirationDate)
      .subscribe(achievement => {
        if (!achievement) return
        this.codes.set(achievement.session, achievement.code)
      })
  }

  getSessions(): void {
    this.eventSessionService.getSessions(this.currentEvent.id).subscribe(sessions => {
      this.sessions = sessions
      this.getAchievements()
    })
  }

  getAchievements(): void {
    this.achievementsService.getAchievementsCode(
      new Date(this.currentEvent.begin),
      new Date(new Date(this.currentEvent.begin).getTime() + new Date(this.currentEvent.duration).getTime())
    ).subscribe(achievements => {
      achievements.map(achievement => {
        if (achievement.session && achievement.code && achievement.code.code) {
          this.codes.set(achievement.session, achievement.code)
        }
      })

      this.sessions = this.sessions.filter(s => {
        const code = this.getSessionCode(s.id)
        return code !== undefined && code.expiration <= new Date() || code === undefined
      })
    })
  }

  formatDate(date: string | Date): string {
    const newDate = typeof date === 'string' ? new Date(date) : date
    return newDate.toUTCString()
  }

  getSessionCode(sessionId: string): Code {
    return this.codes !== undefined ? this.codes.get(sessionId) : undefined
  }

  getCodeTitle(session: Session): string {
    return 'Code: ' + this.getSessionCode(session.id).code
  }

  copyCode(code: string): void {
    this.clipboardService.copyFromContent(code)
  }
}
