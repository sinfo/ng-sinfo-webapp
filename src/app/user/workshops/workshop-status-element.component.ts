import { Component, OnInit, OnChanges, Input } from '@angular/core'
import { Session } from '../../session/session.model'
import { Ticket } from './ticket.model'
import { User } from '../user.model'
import { TicketService } from './ticket.service'
import { AuthService } from '../../auth/auth.service'
import { UserService } from '../user.service'

@Component({
  selector: 'app-workshop-status-element',
  templateUrl: './workshop-status-element.component.html',
  styleUrls: ['./workshop-status-element.component.css']
})
export class WorkshopStatusElementComponent implements OnInit {

  @Input() workshop: Session
  @Input() user: User

  showMore = false
  ticket: Ticket
  isRegistrationClosed: boolean
  count: number
  private userMails = []

  constructor(
    private ticketService: TicketService,
    private userService: UserService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.ticketService.getTicket(this.workshop.id).subscribe(ticket => {
        if (ticket === undefined) return

        this.ticket = ticket
        this.count = ticket && ticket.users ? (ticket.users.length / this.workshop.tickets.max) * 100 : 0

        this.userService.getUsers(ticket.users).subscribe(users => {
          this.userMails = users && users.map(user => { return user.mail })
        })
      })
    }
  }

  onRegistrationClosed(isRegistrationClosed: boolean) {
    this.isRegistrationClosed = isRegistrationClosed
  }
}
