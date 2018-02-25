import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { Achievement } from './achievement.model'
import { AchievementService } from './achievement.service'
import { AuthService } from '../auth/auth.service'
import { UserService } from '../user/user.service'
import { User } from '../user/user.model'

@Component({
  selector: 'app-achievements',
  templateUrl: './achievements.component.html',
  styleUrls: ['./achievements.component.css']
})
export class AchievementsComponent implements OnInit {
  achievements: Achievement[]
  private user: User

  constructor (
    private achievementService: AchievementService,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit () {
    this.achievementService.getAchievements().subscribe(achievements => {
      this.achievements = achievements
    })

    if (this.authService.isLoggedIn()) {
      this.userService.getMe().subscribe(user => {
        this.user = user
      })
    }
  }

  isUnlocked (achievement: Achievement): boolean {
    return this.user ? achievement.users.indexOf(this.user.id) !== -1 : false
  }

  numUserAchievements (): number {
    return this.user.achievements.length
  }
}
