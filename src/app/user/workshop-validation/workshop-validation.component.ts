import { Component, OnInit } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { Router } from '@angular/router'


import { Session } from '../../session/session.model'
import { SessionService } from '../../session/session.service'
import { User } from '../user.model'
import { UserService } from '../user.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { EventService } from '../../events/event.service'
import { TicketService } from '../workshops/ticket.service'
import { Ticket } from '../workshops/ticket.model'


@Component({
  selector: 'app-workshop-validation',
  templateUrl: './workshop-validation.component.html',
  styleUrls: ['./workshop-validation.component.css']
})
export class WorkshopValidationComponent implements OnInit {

  scannerActive: boolean
  eventId: string
  workshops: any
  ticket: Ticket


  constructor(
    private router: Router,
    private sessionService: SessionService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private eventService: EventService,
    private titleService: Title,
    private ticketService: TicketService
  ) { }

  ngOnInit(): void {
    this.eventService.getCurrent().subscribe(event => {
      this.titleService.setTitle(event.name + ' - Workshop Validation')
      this.eventId = event.id

      this.userService.getMe()
        .subscribe(me => {
          if (me.role !== 'team') {
            this.router.navigate(['/user/qrcode'])
          }
          if (this.checkLocalStorage()) return
          this.scannerActive = false
          this.getWorkshops()
        })
    })
  }

  getEndDate(s: Session) {
    let sessionDate = new Date(s.date)
    sessionDate = new Date(Date.UTC(sessionDate.getUTCFullYear(), sessionDate.getUTCMonth(), sessionDate.getUTCDate(),
      sessionDate.getUTCHours(), sessionDate.getUTCMinutes(), sessionDate.getUTCSeconds()))
    let sessionDuration = new Date(s.duration)
    sessionDuration = new Date(Date.UTC(sessionDuration.getUTCFullYear(),
      sessionDuration.getUTCMonth(), sessionDuration.getUTCDate(),
      sessionDuration.getUTCHours(), sessionDuration.getUTCMinutes(), sessionDuration.getUTCSeconds()))
    let durationInSeconds =
      (sessionDuration.getUTCHours() * 3600) +
      (sessionDuration.getUTCMinutes() * 60) +
      sessionDuration.getUTCSeconds()

    return new Date(sessionDate.getTime() + durationInSeconds * 1000)
  }

  toUTCDate(date) {
    let sessionDate = new Date(date)
    return new Date(Date.UTC(sessionDate.getUTCFullYear(), sessionDate.getUTCMonth(), sessionDate.getUTCDate(),
      sessionDate.getUTCHours(), sessionDate.getUTCMinutes(), sessionDate.getUTCSeconds()))
  }

  getUTCDate() {
    let sessionDate = new Date()
    return new Date(Date.UTC(sessionDate.getUTCFullYear(), sessionDate.getUTCMonth(), sessionDate.getUTCDate(),
      sessionDate.getUTCHours(), sessionDate.getUTCMinutes(), sessionDate.getUTCSeconds()))
  }

  getWorkshops() {
    this.sessionService.getSessions(this.eventId).subscribe((sessions) => {
      sessions = sessions.filter((s) => (s.kind === "Workshop" || s.kind === 'workshop')
        && this.getEndDate(s).toISOString() > this.getUTCDate().toISOString())
      sessions.sort((a, b) => {
        return new Date(a.date).toISOString() <= new Date(b.date).toISOString() ? -1 : 1
      })
      console.log(sessions)
      this.workshops = sessions
    })
  }

  beginCheck(workshop: Session) {
    this.ticketService.getTicket(workshop.id).subscribe((ticket) => {
      if (ticket) {
        localStorage.setItem('ticket', JSON.stringify(ticket))
        this.ticket = ticket
        this.scannerActive = true
      }
    })
  }

  receiveUser(user: User) {
    if (this.ticket.users.includes(user.id)) {
      this.snackBar.open(`User is registered!`, "Ok", {
        panelClass: ['mat-toolbar', 'mat-primary'],
        duration: 3000
      })
    } else {
      this.snackBar.open(`User is not registered!`, "Ok", {
        panelClass: ['mat-toolbar', 'mat-warn'],
        duration: 3000
      })
    }
  }

  cancel() {
    localStorage.removeItem('ticket')
    this.ticket = null
    this.scannerActive = false
  }

  checkLocalStorage(): boolean {
    let ticketS = localStorage.getItem('ticket')
    console.log(!ticketS || ticketS === undefined)
    if (!ticketS || ticketS === undefined) {
      return false
    }
    let ticket = JSON.parse(ticketS)

    if (!ticket) return false
    this.scannerActive = true

    return true
  }
}
