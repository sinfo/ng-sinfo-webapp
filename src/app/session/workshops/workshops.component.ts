import { Component, OnInit } from '@angular/core'
import { Router, Params } from '@angular/router'

import { SessionService } from '../session.service'
import { Session } from '../session.model'
import { UserService } from '../../user/user.service'
import { User } from '../../user/user.model'
import { AuthService } from '../../auth/auth.service'

@Component({
  selector: 'app-workshops',
  templateUrl: './workshops.component.html',
  styleUrls: ['./workshops.component.css']
})
export class WorkshopsComponent implements OnInit {

  workshops: Session[]
  _workshops: Array<{
    date: string,
    workshops: Session[]
  }>
  user: User

  constructor (
    private sessionService: SessionService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit () {
    this.sessionService.getSessions()
    .subscribe(sessions => {

      this.workshops = sessions.filter((session) => {
        return session.kind === 'Workshop'
      })

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

    if (this.authService.isLoggedIn()) {
      this.userService.getMe().subscribe(user => {
        this.user = user
        this.userService.getUserSessions(user.id).subscribe(sessions => {
          console.log(sessions)
        })
      })
    }
  }
}
