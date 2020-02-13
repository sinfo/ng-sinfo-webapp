import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core'
import { Session } from '../../../session/session.model'
import { Ticket } from '../ticket.model'
import { User } from '../../user.model'
import { TicketService } from '../ticket.service'
import { AuthService } from '../../../auth/auth.service'

@Component({
  selector: 'app-workshop',
  templateUrl: './workshop.component.html',
  styleUrls: ['./workshop.component.css']
})
export class WorkshopComponent implements OnInit {

  @Input() workshop: Session
  @Input() user: User
  @Output() isReserved = new EventEmitter<boolean>()

  showMore = false
  ticket: Ticket
  isRegistrationClosed: boolean

  constructor(
    private ticketService: TicketService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.ticketService.getTicket(this.workshop.id).subscribe(ticket => {
        this.ticket = ticket
      })
    }
  }

  onRegistrationClosed(isRegistrationClosed: boolean) {
    this.isRegistrationClosed = isRegistrationClosed
  }

  hasTicket(isReserved: boolean) {
    this.isReserved.emit(isReserved)
  }
}
