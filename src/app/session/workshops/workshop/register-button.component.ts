import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core'
import { Router, RouterStateSnapshot } from '@angular/router'

import { Session } from '../../session.model'
import { Ticket } from '../ticket.model'
import { User } from '../../../user/user.model'
import { TicketService } from '../ticket.service'
import { AuthService } from '../../../auth/auth.service'
import { UserService } from '../../../user/user.service'

@Component({
  selector: 'app-workshop-register-button',
  templateUrl: './register-button.component.html',
  styleUrls: ['./register-button.component.css']
})
export class WorkshopRegisterButtonComponent implements OnInit {

  @Input() workshop: Session
  @Input() user: User
  @Output() onRegistrationClosed = new EventEmitter<boolean>()

  ticket: Ticket
  snapshot: RouterStateSnapshot
  showMore = false
  isRegistered: boolean
  isWaiting: boolean
  isRegistrationClosed: boolean
  hasTicket
  loading = false
  position: number

  constructor (
    private ticketService: TicketService,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {
    this.snapshot = router.routerState.snapshot
  }

  ngOnInit () {
    this.ticketService.getTicket(this.workshop.id).subscribe(ticket => {
      this.ticket = ticket

      const now = Date.now()
      this.isRegistrationClosed = (now < Date.parse(this.workshop.tickets.start) ||
      now > Date.parse(this.workshop.tickets.end) ||
      now > Date.parse(this.workshop.date))

      if (this.isRegistrationClosed) {
        this.onRegistrationClosed.emit(true)
      }

      if (this.authService.isLoggedIn()) {
        this.updateState()
        this.userService.getUserSessions(this.user.id)
      }
    })
  }

  updateState () {
    this.isRegistered = this.ticket.users && this.ticket.users.indexOf(this.user.id) !== -1
    this.isWaiting = this.ticket.waiting && this.ticket.waiting.indexOf(this.user.id) !== -1
    this.hasTicket = (this.isRegistered || this.isWaiting)
    this.position = this.ticket.waiting.indexOf(this.user.id) + 1
  }

  handleClick () {
    if (!this.authService.isLoggedIn()) {
      this.authService.redirectUrl = this.snapshot.url
      this.router.navigate(['/login'])
      return
    }

    this.loading = true
    if (!this.hasTicket) {
      return this.ticketService.registerTicket(this.workshop.id).subscribe(ticket => {
        this.loading = false
        this.ticket = ticket
        this.updateState()
      })
    }
    this.ticketService.voidTicket(this.workshop.id).subscribe(ticket => {
      this.loading = false
      this.ticket = ticket
      this.updateState()
    })
  }
}
