import { Component, OnInit } from '@angular/core'
import { UserService } from './user.service'
import { ActivatedRoute, Params } from '@angular/router'
import { User } from './user.model'

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  private user: User

  constructor (
    private userService: UserService,
    private route: ActivatedRoute
  ) { }

  ngOnInit () {
    this.route.params.forEach((params: Params) => this.getUser(params['id']))
  }

  getUser (id: string): void {
    this.userService.getUser(id)
      .subscribe(user => this.user = user)
  }

}
