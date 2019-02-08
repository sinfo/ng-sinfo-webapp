import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Params, Router } from '@angular/router'
import { EventService } from '../event.service'
import { environment } from '../../../environments/environment'

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {
  eventId: string
  eventName: string

  constructor (
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit () {
    this.route.params.forEach((params: Params) => {
      this.eventId = environment.url_to_id[params['id']]
      this.eventService.getEvent(this.eventId).subscribe(event => {
        this.eventName = event.name
      })
    })
  }
}