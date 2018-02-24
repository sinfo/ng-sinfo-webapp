import { Component, OnInit } from '@angular/core'
import { Router, Params, RouterStateSnapshot } from '@angular/router'

import { SessionService } from '../session.service'
import { Session } from '../session.model'
import { UserService } from '../../user/user.service'
import { User } from '../../user/user.model'
import { AuthService } from '../../auth/auth.service'

@Component({
  selector: 'app-workshops-status',
  templateUrl: './workshops-status.component.html',
  styleUrls: ['./workshops.component.css', './workshops-status.component.css']
})
export class WorkshopsStatusComponent implements OnInit {

  snapshot: RouterStateSnapshot
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
  ) {
    this.snapshot = router.routerState.snapshot
  }

  ngOnInit () {
    if (!this.authService.isLoggedIn()) {
      this.authService.redirectUrl = this.snapshot.url
      this.router.navigate(['/login'])
      return
    }
    this.userService.getMe().subscribe(user => {
      this.user = user

      if (user.role !== 'team') {
        this.router.navigate(['/me'])
      }

      this.sessionService.getSessions().subscribe(sessions => {

        this.workshops = sessions.filter((session) => {
          return session.kind === 'Workshop'
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
  }
}
