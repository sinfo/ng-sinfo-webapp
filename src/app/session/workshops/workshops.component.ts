import { Component, OnInit } from '@angular/core'
import { Router, Params } from '@angular/router'

import { SessionService } from '../session.service'
import { Session } from '../session.model'
import { UserService } from '../../user/user.service'
import { User } from '../../user/user.model'
import { AuthService } from '../../auth/auth.service'
import { EventService } from '../../events/event.service'
import { Event } from '../../events/event.model'

@Component({
  selector: 'app-workshops',
  templateUrl: './workshops.component.html',
  styleUrls: ['./workshops.component.css']
})
export class WorkshopsComponent implements OnInit {

  myWorkshopsFrontend: Array<{
    date: string,
    workshops: Session[]
  }>
  allWorkshopsFrontend: Array<{
    date: string,
    workshops: Session[]
  }>

  myWorkshops: Session[]
  allWorkshops: Session[]

  user: User
  event: Event

  constructor (
    private sessionService: SessionService,
    private userService: UserService,
    private authService: AuthService,
    private eventService: EventService,
    private router: Router
  ) { }

  ngOnInit () {

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'])
      return
    }

    this.userService.getMe().subscribe(user => {
      this.user = user
      this.userService.getUserSessions(user.id).subscribe(mySessions => {
        this.eventService.getCurrent().subscribe(event => {
          this.event = event
          this.sessionService.getSessions(event.id).subscribe(sessions => {

            this.myWorkshops = sessions.filter((session) => {
              return (mySessions.indexOf(session.id) >= 0 && session.kind === 'Workshop')
            })

            this.allWorkshops = sessions
              .filter((session) => {
                return session.kind === 'Workshop' && mySessions.indexOf(session.id) < 0
              })
              .sort((wsA, wsB) => {
                return Date.parse(wsA.date) - Date.parse(wsB.date)
              })

            this.allWorkshops = sessions
              .filter((session) => {
                return session.kind === 'Workshop'
              })
              .sort((wsA, wsB) => {
                return Date.parse(wsA.date) - Date.parse(wsB.date)
              })

            this.updateWorkhopsFrontend()

          })
        })
      })
    })
  }

  updateWorkhopsFrontend () {
    this.myWorkshopsFrontend = this.myWorkshops
      .reduce((accumulator, session, index, array) => {
        let lastIndex = accumulator.length - 1

        if (index > 0) {
          const sessionDate = new Date(session.date)
          const prevSessionDate = new Date(array[--index].date)
          const sameDay =
            sessionDate.getDate() === prevSessionDate.getDate()
            && sessionDate.getMonth() === prevSessionDate.getMonth()
            && sessionDate.getFullYear() === prevSessionDate.getFullYear()

          if (sameDay) {
            accumulator[lastIndex].workshops.push(session)
            return accumulator
          }
        }

        const date = new Date(session.date)

        date.setHours(0)
        date.setMinutes(0)
        date.setSeconds(0)
        date.setMilliseconds(0)

        accumulator.push({ date: date, workshops: [session] })
        return accumulator
      }, [])

    this.allWorkshopsFrontend = this.allWorkshops
      .reduce((accumulator, session, index, array) => {
        let lastIndex = accumulator.length - 1

        if (index > 0) {
          const sessionDate = new Date(session.date)
          const prevSessionDate = new Date(array[--index].date)
          const sameDay =
            sessionDate.getDate() === prevSessionDate.getDate()
            && sessionDate.getMonth() === prevSessionDate.getMonth()
            && sessionDate.getFullYear() === prevSessionDate.getFullYear()

          if (sameDay) {
            accumulator[lastIndex].workshops.push(session)
            return accumulator
          }
        }

        const date = new Date(session.date)

        date.setHours(0)
        date.setMinutes(0)
        date.setSeconds(0)
        date.setMilliseconds(0)

        accumulator.push({ date: date, workshops: [session] })
        return accumulator
      }, [])

  }

  // TODO refactor me
  isReserved (isReserved: boolean, workshop: Session) {

    // se foi adicionado o ticket
    if (isReserved) {

      // tira da lista de todos
      this.allWorkshops = this.allWorkshops.filter(session => {
        return (session.id !== workshop.id)
      })

      // pões na minha lista
      this.myWorkshops.push(workshop)

      this.myWorkshops.sort((wsA, wsB) => {
        return Date.parse(wsA.date) - Date.parse(wsB.date)
      })

    // se foi removido o ticket
    } else {

      // tira na minha lista
      this.myWorkshops = this.myWorkshops.filter(session => {
        return (session.id !== workshop.id)
      })

      // pões na lista de todos
      this.allWorkshops.push(workshop)

      this.allWorkshops.sort((wsA, wsB) => {
        return Date.parse(wsA.date) - Date.parse(wsB.date)
      })

    }

    this.updateWorkhopsFrontend()
  }
}
