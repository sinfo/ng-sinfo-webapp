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

  constructor(
    private scoreboardService: ScoreboardService,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getTop20Users()
  }

  getTop20Users(): void {
    this.scoreboardService.getTop20Users()
      .subscribe(users => { 
        this.scoreboard = users
        this.getUser()
      })
  }

  getUser(): void {    
    if (this.authService.isLoggedIn()) {
      this.userService.getMe()
      .subscribe(user => this.currentUser = user)
    }
  }

  isCurrentUser(id: string): boolean {
    return this.currentUser && this.currentUser.id === id
  }

  isUserInTop20(): boolean {
    return this.scoreboard.indexOf(this.currentUser) !== -1
  }

  redirectToUser(id: string): void {
    this.router.navigate(['/user', id])
  }

  redirectToAchievements(): void {
    this.router.navigate(['/achievements'])
  }
}
