import { Component, OnInit } from '@angular/core'
import { Title } from '@angular/platform-browser'

import { RedeemService } from './redeem.service'
import { AchievementService } from '../achievements/achievement.service'
import { EventService } from '../../events/event.service'
import { Achievement } from '../achievements/achievement.model'
import { UserService } from '../user.service'
import { User } from '../user.model'

@Component({
  selector: 'app-redeem',
  templateUrl: './redeem.component.html',
  styleUrls: ['./redeem.component.css']
})
export class RedeemComponent implements OnInit {

  me: User
  redeemCode: string
  info: string
  scannerActive = false
  title = 'Secret Achievements'
  processUser = false
  isCamOn: Boolean = false

  myAchievements: Achievement[]

  constructor(
    private redeemService: RedeemService,
    private achievementService: AchievementService,
    private userService: UserService,
    private eventService: EventService,
    private titleService: Title
  ) { }

  ngOnInit() {
    this.eventService.getCurrent().subscribe(event => {
      this.titleService.setTitle(event.name + ' - Redeem')
    })

    this.userService.getMe().subscribe(user => {
      this.me = user
    })

    this.updateMyAchievements()
  }

  updateMyAchievements() {
    this.achievementService.getMyAchievements().subscribe(achievements => {
      this.myAchievements = achievements
      this.scannerActive = true
    })
  }

  receiveRedeemCode(code?: string) {
    if (code)
      this.redeemCode = code;
    this.redeemService.redeem(this.redeemCode, this.myAchievements)
    this.updateMyAchievements()
  }

  toggleInputMethod() {
    this.isCamOn = !this.isCamOn
  }

}
