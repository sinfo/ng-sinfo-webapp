import { Component, OnInit } from '@angular/core'
import { UserService } from '../user.service'

@Component({
  selector: 'app-promote',
  templateUrl: './promote.component.html',
  styleUrls: ['./promote.component.css']
})
export class PromoteComponent implements OnInit {

  id: string
  active: boolean

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


    console.log(`
      Data: ${data}
      id:   ${this.id}`
    )

    this.userService.getUser(this.id)
      .subscribe(user => {
        console.log(user)
      })
  }

}
