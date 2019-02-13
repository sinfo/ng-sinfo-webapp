import { Component, OnInit } from '@angular/core'
import { Router, Params } from '@angular/router'

import { SessionService } from '../session.service'
import { Session } from '../session.model'
import { UserService } from '../../user/user.service'
import { User } from '../../user/user.model'
import { AuthService } from '../../auth/auth.service'
import { EventService } from '../../events/event.service'

@Component({
  selector: 'app-workshops',
  templateUrl: './workshops.component.html',
  styleUrls: ['./workshops.component.css']
})
export class WorkshopsComponent implements OnInit {

  myPresentationWorkshops: Array<{
    date: string,
    workshops: Session[]
  }>
  allPresentationWorkshops: Array<{
    date: string,
    workshops: Session[]
  }>
  user: User

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
          this.sessionService.getSessions(event.id).subscribe(sessions => {

            let workshops = sessions
              .filter((session) => {
                return session.kind === 'Workshop'
              })
              .sort((wsA, wsB) => {
                return Date.parse(wsA.date) - Date.parse(wsB.date)
              })

            this.myPresentationWorkshops = workshops.filter((session) => {
              return (mySessions.indexOf(session.id) >= 0)
            })
            .reduce((accumulator, session, index, array) => {
              let lastIndex = accumulator.length - 1
              if (index > 0 && array[--index].date === session.date) {
                accumulator[lastIndex].workshops.push(session)
                return accumulator
              }
              accumulator.push({ date: session.date, workshops: [session] })
              return accumulator
            }, [])

            this.allPresentationWorkshops = workshops.filter((session) => {
              return (mySessions.indexOf(session.id) < 0)
            })
            .reduce((accumulator, session, index, array) => {
              let lastIndex = accumulator.length - 1
              if (index > 0 && array[--index].date === session.date) {
                accumulator[lastIndex].workshops.push(session)
                return accumulator
              }
              accumulator.push({ date: session.date, workshops: [session] })
              return accumulator
            }, [])
          })
        })
      })
    })
  }

  // TODO refactor me
  isReserved (isReserved: boolean, workshop: Session) {

    // se foi adicionado o ticket
    if (isReserved) {

      // tira da lista de todos
      this.allPresentationWorkshops.forEach(element => {
        element.workshops = element.workshops.filter(session => {
          return (session.id !== workshop.id)
        })
      })

      // pões na minha lista
      let pushed = false
      this.myPresentationWorkshops.forEach(element => {
        if (element.date === workshop.date) {
          element.workshops.push(workshop)
          pushed = true
        }
      })
      if (!pushed) {
        this.myPresentationWorkshops.push({ date: workshop.date, workshops: [workshop] })
      }

      this.myPresentationWorkshops.sort((wsA, wsB) => {
        return Date.parse(wsA.date) - Date.parse(wsB.date)
      })

    // se foi removido o ticket
    } else {

      // tira na minha lista
      this.myPresentationWorkshops.forEach(element => {
        element.workshops = element.workshops.filter(session => {
          return (session.id !== workshop.id)
        })
      })

      // pões na lista de todos
      let pushed = false
      this.allPresentationWorkshops.forEach(element => {
        if (element.date === workshop.date) {
          element.workshops.push(workshop)
          pushed = true
        }
      })
      if (!pushed) {
        this.allPresentationWorkshops.push({ date: workshop.date, workshops: [workshop] })
      }

      this.allPresentationWorkshops.sort((wsA, wsB) => {
        return Date.parse(wsA.date) - Date.parse(wsB.date)
      })
    }
  }
}
