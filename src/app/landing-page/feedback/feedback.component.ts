import { Component, OnInit } from '@angular/core'

import { EventService } from '../../events/event.service'

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {

  show: boolean

  constructor (private eventService: EventService) { }

  ngOnInit () {
    this.eventService.getCurrent().subscribe(event => {
      this.show = !event.isOcurring
    })
  }

}
