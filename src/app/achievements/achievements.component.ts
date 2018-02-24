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
    this.getAchievements()
  }

  getAchievements (): void {
    this.achievementService.getAchievements()
      .subscribe(achievements => {
        this.achievements = achievements
        this.getUser()
      })
  }

  onSelect (achievement: Achievement): void {
    this.router.navigate(['/achievements', achievement.id])
  }

  getUser (): void {
    let isLoggedIn = this.authService.isLoggedIn()

    if (isLoggedIn) {
      this.userService.getMe()
        .subscribe(user => this.user = user)
    }
  }

  isUnlocked (achievement: Achievement): boolean {
    return this.user ? achievement.users.indexOf(this.user.id) !== -1 : false
  }

  redirectToScoreboard (): void {
    this.router.navigate(['/scoreboard'])
  }

  numUserAchievements () : string | number {
    return this.user && this.user.achievements ? this.user.achievements.length : '?'
  }  
}
