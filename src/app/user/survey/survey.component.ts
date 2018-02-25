import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Params } from '@angular/router'
import { RedeemCode } from './redeem-code.model'
import { Session } from '../../session/session.model'
import { SurveyService } from './survey.service'
import { SessionService } from '../../session/session.service'
import { Achievement } from '../../achievements/achievement.model'
import { AchievementService } from '../../achievements/achievement.service'

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css']
})
export class SurveyComponent implements OnInit {
  redeemCode: RedeemCode
  session: Session
  achievement: Achievement

  constructor (
    private route: ActivatedRoute,
    private surveyService: SurveyService,
    private sessionService: SessionService,
    private achievementService: AchievementService
  ) { }

  ngOnInit () {
    this.route.params.forEach((params: Params) => {
      const redeemCode = params['redeemCode']
      this.getRedeemCode(redeemCode)
    })
    /**
     * 1. Get RedeemCode from url params
     * 2. Get Info from cannon about redeem code
     * 3. Get achievement
     * 3. Get session from Deck
     * 4. Check the type of session
     */
  }

  getRedeemCode (id: string): void {
    this.surveyService.getRedeemCode(id).subscribe(redeemCode => {
      this.redeemCode = redeemCode
      this.getAchievement(this.redeemCode.achievement)
    })
  }

  getAchievement (id: string): void {
    this.achievementService.getAchievement(id).subscribe(achievement => {
      this.achievement = achievement
      this.getSession(this.achievement.session)
    })
  }

  getSession (id: string): void {
    this.sessionService.getSession(id).subscribe(session => this.session = session)
  }

}
