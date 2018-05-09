import { Component, OnInit } from '@angular/core'
import { environment } from '../../../environments/environment'

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {

  show: boolean

  constructor () { }

  ngOnInit () {
    let eventOcurring: boolean = environment.begin !== null && environment.end !== null ?
      new Date() >= environment.begin && new Date() <= environment.end
      : false
    this.show = !eventOcurring
  }

}
