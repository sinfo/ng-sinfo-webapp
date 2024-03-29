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
  usersDone = false
  winner: User

  achievement: Achievement

  achievementKinds: Array<{
    kind: string,
    achievements: Array<{
      name: string,
      start: string,
      img: string,
      achievement: Achievement
    }>
  }> = []

  achievements: Array<{
    name: string,
    start: string,
    img: string,
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
    this.achievementKinds = []
    this.achievementService.getActiveAchievements().subscribe(achievements => {
      achievements.filter(achievement => {
        return achievement.users && achievement.users.length > 0 && achievement.session
      }).forEach(achievement => {
        this.sessionService.getSession(achievement.session).subscribe(session => {
          if (session) {
            if (this.achievementKinds.filter(e => e.kind === achievement.kind).length === 0) {
              this.achievementKinds.push({ kind: achievement.kind, achievements: [] })
            }

            this.achievementKinds.find(e => e.kind === achievement.kind).achievements.push({
              'name': session.companies.length ? session.companies[0] + ' - ' + session.kind : session.name,
              'start': session.date,
              'img': session.img,
              'achievement': achievement
            })

            this.achievementKinds.find(e => e.kind === achievement.kind).achievements.sort((a, b): number => {
              if (a.start === b.start) {
                return 0
              }
              let date1 = new Date(a.start)
              let date2 = new Date(b.start)
              return date1 > date2 ? 1 : -1
            })

            this.achievements.push({
              'name': session.companies.length ? session.companies[0] + ' - ' + session.kind : session.name,
              'start': session.date,
              'img': session.img,
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
        this.router.navigate(['/user/qrcode'])
      }

      this.eventService.getCurrent().subscribe(event => {
        this.titleService.setTitle(event.name + ' - Pick Winner')
      })
    })
  }

  showUsers(achievement: Achievement) {
    this.achievement = achievement
    this.users = []
    const n = achievement.users.length
    achievement.users.forEach(userId => {
      this.userService.getUser(userId).subscribe(user => {
        if (user.role !== 'team') {
          this.users.push(user)
          if (this.users.length === n) {
            this.users.sort((a, b) => {
              return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1
            })
            this.usersDone = true
          }
        }
      })
    })
  }


  chooseWinner() {
    this.winner = this.users[this.randomIntFromInterval(0, this.users.length - 1)]
  }

  randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  changeSession() {
    this.winner = null
    this.users = []
    this.usersDone = false
    this.achievement = null
  }

}
