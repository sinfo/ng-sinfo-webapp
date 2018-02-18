import { Component, OnInit } from '@angular/core'
import { environment } from '../../environments/environment'

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {

  show: boolean

  constructor () { }

  ngOnInit () {
    this.show = !environment.eventOcurring
  }

}
