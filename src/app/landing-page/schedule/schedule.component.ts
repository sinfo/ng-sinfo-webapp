import { Component, OnInit, OnChanges, Input } from '@angular/core'
import { Router } from '@angular/router'

import { Session } from '../../session/session.model'
import { SessionService } from '../../session/session.service'

import { environment } from '../../../environments/environment'

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit, OnChanges {
  @Input() eventId: string

  selectedTheme: string
  selectedTime: string
  selectedSession: [string, string, string, string, string]
  displayDayDropdown: boolean
  displaySessionDropdown: [boolean, boolean, boolean, boolean, boolean]

  sessions: Session[]
  private schedule

  constructor (
    private sessionService: SessionService,
    private router: Router
  ) { }

  ngOnInit () {
    this.getSessions()

    this.showOrHideDropdown()
  }

  ngOnChanges () {
    this.getSessions()
  }

  getSessions (): void {
    this.sessionService.getSessions(this.eventId)
      .subscribe(sessions => {
        this.sessions = sessions
        this.createSchedule(sessions)
      })
  }

  createSchedule (sessions: Session[]): void {
    let tempSchedule = []
    let registeredDays = -1

    sessions.forEach((val, index) => {
      let date = new Date(Date.parse(val.date))
      let day = date.getDate()

      // check if day was already registered
      if (!(registeredDays + 1) || tempSchedule[registeredDays].date.getDate() !== day) {
        tempSchedule.push({
          sessions: {
            Presentation: {
              sala1: [],
              sala2: []
            },
            Keynote: [],
            Workshop: {
              sala1: [],
              sala2: []
            }
          },
          theme: environment.themes[this.eventId][registeredDays + 1],
          date: date
        })
        registeredDays += 1
      }

      if (val.kind === 'Keynote') {
        tempSchedule[registeredDays].sessions[val.kind].push(val)
      } else {
        let place = (val.place === 'Room 2') ? 'sala2' : 'sala1'
        tempSchedule[registeredDays].sessions[val.kind][place].push(val)
      }
    })

    this.schedule = tempSchedule

    if (this.schedule.length > 0) {
      this.selectedTheme = this.schedule[0].theme
      this.selectedTime = this.schedule[0].date
      this.selectedSession = ['Keynotes', 'Keynotes', 'Keynotes', 'Keynotes', 'Keynotes']
    }

  }

  onSelect (session: Session): void {
    this.router.navigate(['/sessions', session.id])
  }

  /* Beggining of Dropdown tabs actions */
  showOrHideDropdown (): void {
    this.displayDayDropdown = window.innerWidth > 768 ? true : false
    this.displaySessionDropdown = window.innerWidth > 768 ? [true, true, true, true, true] : [false, false, false, false, false]
  }

  toggleDayDropdown (): void {
    this.displayDayDropdown = !this.displayDayDropdown
  }

  toggleSessionDropdown (day: number): void {
    this.displaySessionDropdown[day] = !this.displaySessionDropdown[day]
  }

  updateSelectedDayText (theme: string, day: string): void {
    this.selectedTheme = theme
    this.selectedTime = day
  }

  updateSelectedSessionText (day: number, session: string) {
    this.selectedSession[day] = session
  }
  /* End of Dropdown tabs actions */
}
