import { Component, OnInit } from '@angular/core'
import { MessageService } from './message.service'

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  // The messageService must be public because its binded in the template
  constructor (public messageService: MessageService) { }

  ngOnInit () {
  }

}
