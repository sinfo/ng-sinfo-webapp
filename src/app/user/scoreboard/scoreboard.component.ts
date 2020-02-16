import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Title } from '@angular/platform-browser'

import { ScoreboardService } from './scoreboard.service'
import { User } from '../user.model'
import { AuthService } from '../../auth/auth.service'
import { UserService } from '../user.service'
import { EventService } from '../../events/event.service'

@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.css']
})
export class ScoreboardComponent implements OnInit {
  scoreboard: User[]
  private currentUser: User
  begin: Date
  current: Date = new Date()
  days: Date[] = []
  isScoreboardEmpty: boolean

  constructor (
    private scoreboardService: ScoreboardService,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private titleService: Title,
    private eventService: EventService
  ) { }

  ngOnInit () {
    this.eventService.getCurrent().subscribe(event => {
      this.titleService.setTitle(event.name + ' - Scoreboard')
      let dayLength = 1000 * 60 * 60 * 24 // A day worth of miliseconds
      this.begin = event.begin
      this.begin.setHours(23)
      this.begin.setMinutes(59)
      this.begin.setSeconds(59)
      this.begin.setMilliseconds(999)
      for (let day = this.begin.getTime(); day < this.current.getTime(); day += dayLength) {
        let temp = new Date(day)
        this.days.push(temp)
      }
    })
    if (this.authService.isLoggedIn()) {
      this.userService.getMe().subscribe(user => {
        this.currentUser = user
      })
    }
    this.scoreboardService.getUsersPoints(this.current.toISOString()).subscribe(users => {
      // Find current user with user.points format
      let user = users.find((a) => {
        return a.id === this.currentUser.id
      })
      if (user !== undefined) {
        this.currentUser = user
      }
      // Filter admin bot and get top 20
      this.scoreboard = users.filter(user => {
        return user.id
      }).splice(0, 20)

      this.isScoreboardEmpty = !this.scoreboard || this.scoreboard.length <= 0 || !this.scoreboard[0].points
    })

  }

  isCurrentUser (id: string): boolean {
    return this.currentUser && this.currentUser.id === id
  }

  isUserInTop20 (): boolean {
    return this.scoreboard.filter(user => user.id === this.currentUser.id).length === 1
  }

  redirectToUser (id: string): void {
    this.router.navigate(['/user', id])
  }

  setScoreboard (date: string) {
    this.scoreboardService.getUsersPoints(date).subscribe(users => {
      // Find current user with user.points format
      let user = users.find((a) => {
        return a.id === this.currentUser.id
      })
      user === undefined ? this.currentUser.points = 0 : this.currentUser = user
      // Filter admin bot and get top 20
      this.scoreboard = users.filter(user => {
        return user.id
      }).splice(0, 20)

      this.isScoreboardEmpty = this.scoreboard && this.scoreboard.length > 0 && !this.scoreboard[0].points
    })
  }

  getDay (day: Date): number {
    let diff = day.getTime() - this.begin.getTime()
    return diff / (1000 * 60 * 60 * 24) + 1
  }
}
