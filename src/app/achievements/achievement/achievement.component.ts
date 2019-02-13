import { Component, OnInit, Input } from '@angular/core'
import { ActivatedRoute, Params, Router } from '@angular/router'

import { Achievement } from '../achievement.model'
import { AchievementService } from '../achievement.service'
import { AuthService } from '../../auth/auth.service'
import { UserService } from '../../user/user.service'
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
    private route: ActivatedRoute
  ) { }

  ngOnInit () {
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
