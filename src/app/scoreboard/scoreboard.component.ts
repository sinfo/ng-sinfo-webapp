import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { ScoreboardService } from './scoreboard.service'
import { User } from '../user/user.model'
import { AuthService } from '../auth/auth.service'
import { UserService } from '../user/user.service'

@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.css']
})
export class ScoreboardComponent implements OnInit {
  scoreboard: User[]
  private currentUser: User
  isScoreboardEmpty: boolean

  constructor (
    private scoreboardService: ScoreboardService,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit () {
    if (this.authService.isLoggedIn()) {
      this.userService.getMe().subscribe(user => {
        this.currentUser = user
      })
    }
    this.scoreboardService.getUsersPoints().subscribe(users => {
      // Filter admin bot and get top 20
      this.scoreboard = users.filter(user => {
        return user.id
      }).splice(0, 20)

      this.isScoreboardEmpty = this.scoreboard && this.scoreboard.length > 0 && !this.scoreboard[0].points
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
}
