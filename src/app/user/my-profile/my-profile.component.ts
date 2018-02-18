import { Component, OnInit } from '@angular/core'
import { UserService } from '../user.service'
import { User } from '../user.model'

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: [
    './my-profile.component.css',
    './sidebar.component.css'
  ]
})

export class MyProfileComponent implements OnInit {
  user: User
  showSidebar = true

  constructor (
    private userService: UserService
  ) { }

  ngOnInit () {
    this.userService.getMe()
      .subscribe(user => {
        this.user = user
        console.log(this.user)
      })
  }
}
