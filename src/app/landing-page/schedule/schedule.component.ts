import { Component, OnInit, OnChanges, Input } from '@angular/core'
import { Router } from '@angular/router'

import { Session } from '../../session/session.model'
import { SessionService } from '../../session/session.service'
import { EventService } from '../../events/event.service'

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
  selectedSession: string
  displayDayDropdown: Boolean
  displaySessionDropdown: Boolean

  sessions: Session[]
  private schedule
  calendarUrl: string

  constructor(
    private sessionService: SessionService,
    private eventService: EventService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.getSessions()
    this.getCalendarUrl()
    this.showOrHideDropdown()
  }

  ngOnChanges() {
    this.getSessions()
  }

  getSessions(): void {
    this.sessionService.getSessions(this.eventId)
      .subscribe(sessions => {
        this.sessions = sessions
        this.createSchedule(sessions)
      })
  }

  getCalendarUrl(): void {
    this.eventService.getCalendarUrl()
      .subscribe(url => this.calendarUrl = url)
  }

  createSchedule(sessions: Session[]): void {
    let tempSchedule = []
    let registeredDays = -1

    sessions.forEach((val, index) => {
      let date = new Date(Date.parse(val.date))
      let day = date.getUTCDay()

      // check if day was already registered
      if (!(registeredDays + 1) || tempSchedule[registeredDays].date.getUTCDay() !== day) {
        tempSchedule.push({
          sessions: {
            Presentation: {
              all: [],
              sala1: [],
              sala2: []
            },
            Keynote: [],
            Workshop: {
              all: [],
              sala1: [],
              sala2: []
            }
          },
          theme: environment.themes[this.eventId] ? environment.themes[this.eventId][registeredDays + 1] : "",
          date: date
        })
        registeredDays += 1
      }

      if (val.kind === 'Keynote') {
        // FIXME
        // Sets the session image to a static image in digital ocean for the panel (only case where seapers.len > 1 !!! FOR NOW !!!)
        // Change this link if panel image changes
        // If a normal talk has more than 1 speaker this need to be revisited
        if (val.speakers.length > 1){
          val.img = "https://static.sinfo.org/static/31-sinfo/websiteImages/panel-31.png"
        }
        tempSchedule[registeredDays].sessions[val.kind].push(val)
      } else {
        let place = (val.place === 'Room 2') ? 'sala2' : 'sala1'
        tempSchedule[registeredDays].sessions[val.kind][place].push(val)
        tempSchedule[registeredDays].sessions[val.kind].all.push(val)
      }
    })

    tempSchedule.forEach(day => {
      day.sessions.Keynote.sort(function(a, b) {
        if (a.date <= b.date) return -1;
        else return 1;
      })

      day.sessions.Workshop.all.sort(function(a, b) {
        if (a.date < b.date) return -1;
        if (a.date > b.date) return 1;
        // Dates are equal, sort by place
        return a.place.localeCompare(b.place);
      })

      day.sessions.Presentation.all.sort(function(a, b) {
        if (a.date < b.date) return -1;
        if (a.date > b.date) return 1;
        // Dates are equal, sort by place
        return a.place.localeCompare(b.place);
      })
    })

    this.schedule = tempSchedule

    if (this.schedule.length > 0) {
      this.selectedTheme = this.schedule[0].theme
      this.selectedTime = this.schedule[0].date
      this.selectedSession = 'Keynotes'
    }

  }

  showOrHideDropdown() {
    this.displayDayDropdown = window.innerWidth > 768
    this.displaySessionDropdown = window.innerWidth > 768
  }

  toggleDayDropdown() {
    this.displayDayDropdown = !this.displayDayDropdown || window.innerWidth > 768
  }

  toggleSessionDropdown() {
    this.displaySessionDropdown = !this.displaySessionDropdown || window.innerWidth > 768
  }

  onSelect(session: Session): void {
    this.router.navigate(['/sessions', session.id])
  }

  updateSelectedDayText(theme: string, day: string): void {
    this.selectedTheme = theme
    this.selectedTime = day
    this.toggleDayDropdown()
  }

  updateSelectedSessionText(session: string) {
    this.selectedSession = session
    this.toggleSessionDropdown()
  }
  /* End of Dropdown tabs actions */
}
