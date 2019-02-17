import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { UserService } from '../user/user.service'
import { User } from '../user/user.model'
import { SessionService } from '../session/session.service'
import { AchievementService } from '../achievements/achievement.service'
import { Achievement } from '../achievements/achievement.model'

import { map, tap, reduce, filter } from 'rxjs/operators'
import { element } from '@angular/core/src/render3'

@Component({
  selector: 'app-pick-winner',
  templateUrl: './pick-winner.component.html',
  styleUrls: ['./pick-winner.component.css']
})
export class PickWinnerComponent implements OnInit {
  me: User
  users: User[] = []
  winner: User

  achievement: Achievement

  achievements: Array<{
    session: string,
    achievement: Achievement
  }> = []

  constructor (
    private router: Router,
    private userService: UserService,
    private sessionService: SessionService,
    private achievementService: AchievementService
  ) {
    this.achievements = []
    this.achievementService.getActiveAchievements().subscribe(achievements => {
      achievements.filter(achievement => {
        return achievement.users && achievement.users.length > 0 && achievement.session
      }).forEach(achievement => {
        this.sessionService.getSession(achievement.session).subscribe(session => {
          if (session) {
            this.achievements.push({ 'session': session.name, 'achievement': achievement })
          }
        })
      })
    })
  }

  ngOnInit () {
    this.userService.getMe().subscribe(user => {
      this.me = user

      if (user.role !== 'team') {
        this.router.navigate(['/qrcode'])
      }
    })
  }

  showUsers (achievement: Achievement) {
    this.achievement = achievement
    this.users = []
    achievement.users.forEach(userId => {
      this.userService.getUser(userId).subscribe(user => {
        if (user.role !== 'team') {
          this.users.push(user)
        }
      })
    })
  }

  chooseWinner () {
    this.winner = this.users[Math.floor(Math.random() * this.users.length)]
  }

  changeSession () {
    this.winner = null
    this.users = []
    this.achievement = null
  }

}
