import { Component, OnInit } from '@angular/core'
import { MessageService, Type } from '../message.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  constructor (private messageService: MessageService) { }

  ngOnInit () {
    this.messageService.add({
      text: 'Hello World',
      showAlert: true,
      origin: 'LandingPageComponent',
      type: Type.success,
      timeout: 4000
    })
  }

}
