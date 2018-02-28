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
  myAchievements: Achievement[]
  user: User

  constructor (
    private achievementService: AchievementService,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit () {
    this.achievementService.getAchievements().subscribe(achievements => {
      this.achievements = achievements
      .filter((a) => { return a.id }) // Filter any empty achievements
      .sort((a, b) => { return a.id.localeCompare(b.id) }) // sort by id
    })

    if (this.authService.isLoggedIn()) {
      this.userService.getMe().subscribe(user => {
        this.user = user
        this.userService.getUserAchievements(user.id).subscribe(achievements => {
          this.myAchievements = achievements
          this.achievements = this.myAchievements.concat(this.achievements.filter((achievement) => {
            return !~this.myAchievements.map(a => { return a.id }).indexOf(achievement.id)
          }))
        })
      })
    }
  }

  isUnlocked (achievement: Achievement): boolean {
    return this.user && achievement.users ? achievement.users.indexOf(this.user.id) !== -1 : false
  }

  numUserAchievements () {
    return this.myAchievements && this.myAchievements.length ? this.myAchievements.length : 0
  }
}
