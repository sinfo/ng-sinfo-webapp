import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Params, Router } from '@angular/router'
import { EventService } from '../event.service'
import { Event } from '../event.model'

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {
  event: Event
  id: string

  constructor (
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit () {
    this.route.params.forEach((params: Params) => {
      this.id = params['id']
      this.getEvent(this.id)
    })
  }

  getEvent (id: string): void {
    this.eventService.getEvent(id)
      .subscribe(event => {
        this.event = event
      })
  }
}
