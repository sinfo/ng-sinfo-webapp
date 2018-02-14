import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { MessageService } from '../messages/message.service'

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  private isLoggedIn = false

  constructor (
    private router: Router,
    public messageService: MessageService
  ) { }

  ngOnInit () {
  }

}
