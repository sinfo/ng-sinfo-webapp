import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Params } from '@angular/router'
import { Title } from '@angular/platform-browser'

import { EventService } from '../events/event.service'
import { UserService } from './user.service'
import { User } from './user.model'
import { Achievement } from '../achievements/achievement.model'

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  user: User
  achievements: Achievement[]

  constructor (
    private eventService: EventService,
    private userService: UserService,
    private route: ActivatedRoute,
    private titleService: Title
  ) { }

  ngOnInit () {
    this.route.params.forEach((params: Params) => {
      this.getUser(params['id'])
      this.eventService.getCurrent().subscribe(event => {
        this.titleService.setTitle(event.name + ' - ' + this.user.name)
      })
      this.getUserAchievements(params['id'])
    })
  }

  getUser (id: string): void {
    this.userService.getUser(id)
      .subscribe(user => this.user = user)
  }

  getUserAchievements (id: string): void {
    this.userService.getUserAchievements(id)
      .subscribe(achievements => this.achievements = achievements)
  }
}
