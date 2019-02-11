import { Component, OnInit } from '@angular/core'
import { Router, Params } from '@angular/router'

import { SessionService } from '../session.service'
import { Session } from '../session.model'
import { UserService } from '../../user/user.service'
import { User } from '../../user/user.model'
import { AuthService } from '../../auth/auth.service'
import { EventService } from '../../events/event.service'

@Component({
  selector: 'app-my-workshops',
  templateUrl: './workshops.component.html',
  styleUrls: ['./workshops.component.css']
})
export class MyWorkshopsComponent implements OnInit {

  workshops: Session[]
  _workshops: Array<{
    date: string,
    workshops: Session[]
  }>
  user: User
  title = 'My Workshops'

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
            this.workshops = sessions.filter((session) => {
              return (session.kind === 'Workshop' && ~mySessions.indexOf(session.id))
            })

            // Array used to easily show workshops by day date
            this._workshops = this.workshops
            .sort((wsA, wsB) => {
              return Date.parse(wsA.date) - Date.parse(wsB.date)
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
}
