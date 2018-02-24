import { Component, OnInit, OnChanges, Input } from '@angular/core'
import { Session } from '../session.model'
import { Ticket } from './ticket.model'
import { User } from '../../user/user.model'
import { TicketService } from './ticket.service'
import { AuthService } from '../../auth/auth.service'

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

  constructor (
    private ticketService: TicketService,
    private authService: AuthService
  ) { }

  ngOnInit () {
    if (this.authService.isLoggedIn()) {
      this.ticketService.getTicket(this.workshop.id).subscribe(ticket => {
        this.ticket = ticket
      })
    }
  }

  onRegistrationClosed (isRegistrationClosed: boolean) {
    this.isRegistrationClosed = isRegistrationClosed
  }
}
