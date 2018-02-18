import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { Session } from './session.model'
import { SessionService } from './session.service'

import { environment } from '../../environments/environment'

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {

  sessions: Session[]
  private schedule

  constructor (
    private sessionService: SessionService,
    private router: Router
  ) { }

  ngOnInit () {
    this.getSessions()
  }

  getSessions (): void {
    this.sessionService.getSessions()
      .subscribe(sessions => {
        this.sessions = sessions
        this.createSchedule(sessions)
      })
  }

  createSchedule (sessions: Session[]): void {
    let tempSchedule = {}

    sessions.forEach((val, index) => {
      let date = new Date(Date.parse(val.date))
      let day = date.getDate()

      // check if day was already registered
      if (!tempSchedule[day]) {
        tempSchedule[day] = {
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
          theme: '',
          date: val.date
        }
      }

      if (val.kind === 'Keynote') {
        tempSchedule[day].sessions[val.kind].push(val)
      } else {
        let place = 'sala' + (val.place.split(' ')[1] ? val.place.split(' ')[1] : '1')
        tempSchedule[day].sessions[val.kind][place].push(val)
      }
    })

    let i = 0
    this.schedule = []
    for (let day in tempSchedule) {
      tempSchedule[day].theme = environment.themes[i]
      this.schedule.push(tempSchedule[day])
      i += 1
    }

  }

  onSelect (session: Session): void {
    this.router.navigate(['/sessions', session.id])
  }
}
