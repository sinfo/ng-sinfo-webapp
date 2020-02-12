import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Title } from '@angular/platform-browser'

import { UserService } from '../user.service'
import { User } from '../user.model'
import { SessionService } from '../../session/session.service'
import { AchievementService } from '../achievements/achievement.service'
import { Achievement } from '../achievements/achievement.model'
import { EventService } from '../../events/event.service'

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
    name: string,
    start: string;
    achievement: Achievement
  }> = []

  constructor(
    private router: Router,
    private userService: UserService,
    private sessionService: SessionService,
    private achievementService: AchievementService,
    private eventService: EventService,
    private titleService: Title
  ) {
    this.achievements = []
    this.achievementService.getActiveAchievements().subscribe(achievements => {
      achievements.filter(achievement => {
        return achievement.users && achievement.users.length > 0 && achievement.session
      }).forEach(achievement => {
        this.sessionService.getSession(achievement.session).subscribe(session => {
          if (session) {
            this.achievements.push({
              'name': session.companies.length ? session.companies[0] + ' - ' + session.kind : session.name,
              'start': session.date,
              'achievement': achievement
            })
            this.achievements.sort((a, b): number => {
              if (a.start === b.start) {
                return 0
              }
              let date1 = new Date(a.start)
              let date2 = new Date(b.start)
              return date1 > date2 ? 1 : -1
            })
          }
        })
      })
    })
  }

  ngOnInit() {
    this.userService.getMe().subscribe(user => {
      this.me = user

      if (user.role !== 'team') {
        this.router.navigate(['/qrcode'])
      }

      this.eventService.getCurrent().subscribe(event => {
        this.titleService.setTitle(event.name + ' - Pick Winner')
      })
    })
  }

  showUsers(achievement: Achievement) {
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

  chooseWinner() {
    this.winner = this.users[Math.floor(Math.random() * this.users.length)]
  }

  changeSession() {
    this.winner = null
    this.users = []
    this.achievement = null
  }

}
