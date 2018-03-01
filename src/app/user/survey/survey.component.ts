import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Params } from '@angular/router'
import { RedeemCode } from './redeem-code.model'
import { Session } from '../../session/session.model'
import { SurveyService } from './survey.service'
import { SessionService } from '../../session/session.service'
import { Achievement } from '../../achievements/achievement.model'
import { UserService } from '../user.service'
import { User } from '../user.model'
import { SurveyResponse } from './response.model'

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css']
})
export class SurveyComponent implements OnInit {
  me: User
  redeemCode: string
  session: Session
  achievement: Achievement
  submitting = false
  submitted = false
  ages = [
    '< 18',
    '18-22',
    '23-25',
    '26-28',
    '> 28'
  ]
  genders = [
    'Male',
    'Female'
  ]
  areas = [
    'Computer Engineering',
    'Electrotechnical Engineering',
    'Management',
    'Economy',
    'Design',
    'Other'
  ]
  satisfactionList = [
    'Very Satisfied',
    'Satisfied',
    'Unsatisfied',
    'Very Unsatisfied'
  ]

  constructor (
    private route: ActivatedRoute,
    private surveyService: SurveyService,
    private sessionService: SessionService,
    private userService: UserService
  ) { }

  ngOnInit () {
    this.userService.getMe()
      .subscribe(me => {
        this.me = me
        this.route.params.forEach((params: Params) => {
          this.redeemCode = params['redeemCode']
        })
      })
  }

  onSubmit (form: any) {
    this.submitting = true
    const surveyResponse = {
      age: form.age,
      area: form.area,
      gender: form.gender,
      isIST: (form.isIST === 'true'),
      satisfaction: form.satisfaction,
      suggestions: form.suggestions,
      logistics: {
        location: Number(form.logisticsLocation),
        installations: Number(form.logisticsInstallations),
        organization: Number(form.logisticsOrganization),
        communication: Number(form.logisticsCommunication)
      },
      session: {
        organization: Number(form.sessionOrganization),
        content: Number(form.sessionContent),
        speaker: Number(form.sessionSpeaker),
        duration: Number(form.sessionDuration),
        recommend: Number(form.sessionRecommend)
      }
    }
    this.surveyService.submitSurvey(surveyResponse as SurveyResponse, this.redeemCode)
      .subscribe(achievement => {
        this.submitting = false
        this.achievement = achievement
        this.submitted = true
      })
  }

}
