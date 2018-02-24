import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core'
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
  isError: boolean
  hasTicket
  loading = false
  position: number

  constructor (
    private ticketService: TicketService,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private cd: ChangeDetectorRef
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

      if (this.authService.isLoggedIn() && this.ticket) {
        this.updateState(this.ticket)
        this.userService.getUserSessions(this.user.id)
      }
    })
  }

  updateState (ticket) {
    this.isRegistered = ticket.users && ticket.users.indexOf(this.user.id) !== -1
    this.isWaiting = ticket.waiting && ticket.waiting.indexOf(this.user.id) !== -1
    this.hasTicket = (this.isRegistered || this.isWaiting)
    this.position = ticket.waiting.indexOf(this.user.id) + 1
  }

  handleClick () {
    if (!this.authService.isLoggedIn()) {
      this.authService.redirectUrl = this.snapshot.url
      this.router.navigate(['/login'])
      return
    }

    this.loading = true
    this.isError = false
    if (!this.hasTicket) {
      return this.ticketService.registerTicket(this.workshop.id).subscribe(ticket => {
        console.log(ticket)
        this.ticket = ticket
        this.updateState(ticket)
        this.loading = false
        this.cd.detectChanges()
      }, (error) => {
        console.log(error)
        this.isError = true
        this.loading = false
      })
    }
    this.ticketService.voidTicket(this.workshop.id).subscribe(ticket => {
      this.ticket = ticket
      this.updateState(ticket)
      this.loading = false
      this.cd.detectChanges()
    }, (error) => {
      console.log(error)
      this.isError = true
      this.loading = false
    })
  }
}
