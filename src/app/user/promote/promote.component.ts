import { Component, OnInit } from '@angular/core'
import { UserService } from '../user.service'
import { User } from '../user.model'

@Component({
  selector: 'app-promote',
  templateUrl: './promote.component.html',
  styleUrls: ['./promote.component.css']
})
export class PromoteComponent implements OnInit {

  id: string
  active: boolean
  userRead: User

  constructor (
    private userService: UserService
  ) { }

  ngOnInit () {
    this.active = true
  }

  processData (data: string) {
    if (!this.id) {
      this.id = data
      this.active = false
    }

    this.userService.getUser(this.id)
      .subscribe(user => this.userRead = user)
  }

  promoteToTeam () {
    if (!this.userRead) {
      return
    }

    this.userService.changeRole(this.userRead.id, 'team')
      .subscribe(user => this.userRead = user)
  }

  demoteUser () {
    if (!this.userRead) {
      return
    }

    this.userService.changeRole(this.userRead.id, 'user')
      .subscribe(user => this.userRead = user)
  }

}
