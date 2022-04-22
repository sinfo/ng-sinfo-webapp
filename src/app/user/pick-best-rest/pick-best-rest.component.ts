import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { UserService } from '../user.service'
import { User } from '../user.model'
import { EventService } from '../../events/event.service'
import { AchievementService } from '../achievements/achievement.service'

@Component({
  selector: 'app-pick-best.rest',
  templateUrl: './pick-best-rest.component.html',
  styleUrls: ['./pick-best-rest.component.css']
})

export class PickBestRestComponent implements OnInit {
  me: User
  eligibleUsers: User[] = []
  cvUsers: string[] = []
  winner: User
  cvWinner: User
  totalEntries: number = 0

  constructor(
    private router: Router,
    private userService: UserService,
    private eventService: EventService,
    private achievementService: AchievementService,
  ) { }

  ngOnInit() {

    this.userService.getMe().subscribe(user => {
      this.me = user

      if (user.role !== 'team') {
        this.router.navigate(['/user/qrcode'])
      }

      this.eventService.getCurrent().subscribe(event => {
        this.totalEntries = 0
        this.userService.getActiveUsers().subscribe(users => {
          this.eligibleUsers = users.filter((user) => {
            return (user.role !== 'team' && user.points > 0)
          })
          this.eligibleUsers.forEach((user) => {
            this.totalEntries += user.points
          })
        })

        this.achievementService.getActiveAchievements().subscribe(achievements => {
          this.cvUsers = achievements.find((ach) => ach.kind === 'cv').users
        })
      })
    })
  }

  chooseWinner() {
    this.winner = null

    let ticketChosen = Math.floor(Math.random() * this.totalEntries)
    this.eligibleUsers.every((user) => {
      ticketChosen -= user.points
      if (ticketChosen <= 0) {
        this.winner = user
        return false
      }
      return true
    })
  }

  chooseCVWinner() {
    this.cvWinner = null

    let user = this.cvUsers[Math.floor(Math.random() * this.cvUsers.length)]
    this.userService.getUser(user).subscribe(u => {
      this.cvWinner = u
    })
  }

}
