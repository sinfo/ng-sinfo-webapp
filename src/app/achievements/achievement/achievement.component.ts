import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Params } from '@angular/router'
import { Title } from '@angular/platform-browser'

import { Achievement } from '../achievement.model'
import { AchievementService } from '../achievement.service'
import { AuthService } from '../../auth/auth.service'
import { UserService } from '../../user/user.service'
import { EventService } from '../../events/event.service'
import { User } from '../../user/user.model'

@Component({
  selector: 'app-achievement',
  templateUrl: './achievement.component.html',
  styleUrls: ['./achievement.component.css']
})
export class AchievementComponent implements OnInit {
  achievement: Achievement
  user: User
  winner: User
  users: User[]

  constructor (
    private achievementService: AchievementService,
    private authService: AuthService,
    private userService: UserService,
    private route: ActivatedRoute,
    private eventService: EventService,
    private titleService: Title
  ) { }

  ngOnInit () {
    this.eventService.getCurrent().subscribe(event => {
      this.titleService.setTitle(event.name + ' - Achievement')
    })

    this.route.params.forEach((params: Params) => {
      const id = params['id']

      this.achievementService.getAchievement(id).subscribe(achievement => {

        this.achievement = achievement

        this.userService.getUsers(this.achievement.users).subscribe(users => {
          this.users = users
        })
      })
    })

    if (this.authService.isLoggedIn()) {
      this.userService.getMe().subscribe(user => {
        this.user = user
      })
    }
  }

  pickWinner () {
    const winnerId = this.achievement.users[Math.floor(Math.random() * this.achievement.users.length)]
    this.userService.getUser(winnerId).subscribe(user => {
      this.winner = user
    })
  }
}
