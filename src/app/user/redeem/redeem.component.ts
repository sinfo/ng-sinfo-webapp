import { Component, OnInit } from '@angular/core'
import { RedeemService } from './redeem.service'
import { AchievementService } from '../../achievements/achievement.service'
import { Achievement } from '../../achievements/achievement.model'
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
  title = 'Find achievements'
  processUser = false

  myAchievements: Achievement[]

  constructor (
    private redeemService: RedeemService,
    private achievementService: AchievementService,
    private userService: UserService
  ) { }

  ngOnInit () {
    this.userService.getMe().subscribe(user => {
      this.me = user
    })

    this.updateMyAchievements()
  }

  updateMyAchievements () {
    this.achievementService.getMyAchievements().subscribe(achievements => {
      this.myAchievements = achievements
      this.scannerActive = true
    })
  }

  receiveRedeemCode (code: string) {
    this.redeemCode = code
    this.redeemService.redeem(code, this.myAchievements)
    this.updateMyAchievements()
  }

}
