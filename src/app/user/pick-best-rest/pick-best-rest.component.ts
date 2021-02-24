import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { UserService } from '../user.service'
import { User } from '../user.model'
import { EventService } from '../../events/event.service'

@Component({
  selector: 'app-pick-best.rest',
  templateUrl: './pick-best-rest.component.html',
  styleUrls: ['./pick-best-rest.component.css']
})

export class PickBestRestComponent implements OnInit {
  me: User
  users: User[] = []
  winner: User
  totalEntries: number = 0

  constructor (
    private router: Router,
    private userService: UserService,
    private eventService: EventService,
  ) { }

  ngOnInit () {
    this.userService.getMe().subscribe(user => {
      this.me = user

      if (user.role !== 'team') {
        console.log("get out thot")
        this.router.navigate(['/user/qrcode'])
      }

      this.eventService.getCurrent().subscribe(event => {
        this.userService.getActiveUsers().subscribe(users => {
          this.users = users.filter((user) => {
            return (user.role !== 'team')
          })
          this.users.forEach((user) =>{
            this.totalEntries += user.points
          })
        })
      })
    })
  }

  chooseWinner () {
    this.winner = null
    let ticketChosen = Math.floor(Math.random() * this.totalEntries)
    this.users.every((user) => {
      ticketChosen -= user.points
      if (ticketChosen <= 0) {
        this.winner = user
        return false
      } 
      return true
    })
    this.winner = this.users[Math.floor(Math.random() * this.users.length)]
  }

}
