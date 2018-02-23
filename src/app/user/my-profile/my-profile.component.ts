import { Component, OnInit } from '@angular/core'
import { UserService } from '../user.service'
import { User } from '../user.model'
import { environment } from './../../../environments/environment'

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: [ './my-profile.component.css' ]
})

export class MyProfileComponent implements OnInit {
  user: User
  company: string

  constructor (
    private userService: UserService
  ) { }

  ngOnInit () {
    this.userService.getMe()
      .subscribe(user => {
        this.user = user

        // if this user had company role in the previous edition,
        // it will have a user role in the current edition

        if (this.user.role === 'company') {
          let company = this.user.company
          let found = false
          for (let i = 0; i < company.length; i++) {
            if (company[i].edition === environment.currentEvent) {
              found = true
            }
          }

          if (!found) {
            this.userService.demoteSelf()
              .subscribe(newUser => this.user = newUser)
          } else {
            this.user.company.forEach(el => {
              if (el.edition === environment.currentEvent) {
                this.company = el.company
              }
            })
          }
        }
      })
  }
}
