import { Component, OnInit } from '@angular/core'
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap'

import { EventService } from '../../events/event.service'

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css'],
  providers: [NgbCarouselConfig]
})


export class FeedbackComponent implements OnInit {

  show: boolean
  images = [700, 533, 807, 124].map((n) => `https://picsum.photos/id/${n}/900/500`);
  constructor(private eventService: EventService, config: NgbCarouselConfig) {
    config.interval = 10000;
    config.wrap = false;
    config.keyboard = false;
    config.pauseOnHover = false;
  }

  ngOnInit() {
    this.eventService.getCurrent().subscribe(event => {
      this.show = !event.isOcurring
    })
  }

}
