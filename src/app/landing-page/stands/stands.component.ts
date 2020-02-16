import { Component, OnInit, Input } from '@angular/core'
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-stands',
  templateUrl: './stands.component.html',
  styleUrls: ['./stands.component.css'],
  providers: [NgbCarouselConfig]
})
export class StandsComponent implements OnInit {

  @Input() eventId: string

  constructor (config: NgbCarouselConfig) {
    config.wrap = false
    config.keyboard = false
    config.pauseOnHover = false
  }

  ngOnInit () {
  }

}
