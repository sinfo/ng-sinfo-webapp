import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Params } from '@angular/router'

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
  private user: User
  winner: User

  constructor (
    private achievementService: AchievementService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private userService: UserService
  ) { }

  ngOnInit () {
    if (this.authService.isLoggedIn()) {
      this.userService.getMe().subscribe(user => {
        this.user = user
        this.winner = user
      })
    }

    this.activatedRoute.params.forEach((params: Params) => {
      const id = params['id']
      this.getAchievement(id)
    })
  }

  pickWinner () {
    const winnerId = this.achievement.users[Math.floor(Math.random() * this.achievement.users.length)]
    this.userService.getUser(winnerId).subscribe(user => {
      console.log(user)
      this.winner = user
    })
  }

  getAchievement (id: string): void {
    this.achievementService.getAchievement(id)
      .subscribe(achievement => this.achievement = achievement)
  }
}
