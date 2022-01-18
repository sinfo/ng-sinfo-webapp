import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

import { UserService } from './user.service'
import { User } from './user.model'
import { Achievement } from './achievements/achievement.model'
import { MatIconRegistry } from '@angular/material/icon'
import { DomSanitizer, Title } from '@angular/platform-browser'
import { AuthService } from '../auth/auth.service'

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  user: User
  achievements: Achievement[]
  opened: boolean
  isLoggedIn = false


  constructor(
    private authService: AuthService,
    private userService: UserService,
    private route: ActivatedRoute,
    private titleService: Title,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {

  }

  ngOnInit() {
    this.userService.getMe().subscribe(me => {
      this.user = me
    })
    this.isLoggedIn = this.authService.isLoggedIn()

  }

  getUserAchievements(id: string): void {
    this.userService.getUserAchievements(id)
      .subscribe(achievements => this.achievements = achievements)
  }
}
