import { Component, OnInit, NgZone } from '@angular/core'
import { UserService } from '../user.service'
import { User } from '../user.model'
import { environment } from './../../../environments/environment'
import { CompanyService } from '../../company/company.service'
import { Company } from '../../company/company.model'
import { AuthService } from '../../auth/auth.service'
import { Achievement } from '../../achievements/achievement.model'
import { RedeemCode } from '../survey/redeem-code.model'
import { SurveyService } from '../survey/survey.service'
import { AchievementService } from '../../achievements/achievement.service'

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})

export class MyProfileComponent implements OnInit {
  user: User
  company: Company
  submitedCV: boolean
  eventOcurring: boolean
  cvDownloadUrl: string
  achievements: Achievement[]
  redeemCodes: Array<{
    achievement: Achievement
    id: string
  }> = new Array()

  constructor(
    private userService: UserService,
    private companyService: CompanyService,
    private authService: AuthService,
    private surveyService: SurveyService,
    private zone: NgZone,
    private achievementService: AchievementService
  ) {
    this.cvDownloadUrl = `${environment.cannonUrl}/files/me/download?access_token=${this.authService.getToken().token}`
    /**
     *  TODO: To fix the unknown error with Google login
     * (https://github.com/sinfo/ng-sinfo-webapp/issues/62) we need to call getMe()
     * in the constructor this isn't a best practise, change this in the future.
     * Similar problem:
     * https://stackoverflow.com/questions/48876926/ngoninit-function-not-called-after-google-login-in-angular4
     */
    this.zone.run(() => {
      this.userService.getMe()
        .subscribe(user => {
          this.user = user

          this.userService.isCVSubmited().subscribe(response => {
            // TODO CANNON MUST RETURN 404 on no file
            this.submitedCV = response && response.id
          }, (error) => {
            this.submitedCV = false
          })

          this.userService.getUserAchievements(user.id).subscribe(achievements => {
            this.achievements = achievements

            this.surveyService.getMyRedeemCodes()
              .subscribe(myRedeemCodes => {
                if (!myRedeemCodes || myRedeemCodes.length === 0) { return }
                this.achievementService.getAchievements()
                  .subscribe(allAchievements => {
                    let redeemCodes = []
                    myRedeemCodes.forEach(redeemCode => {

                      // in the case of multiple check-ins of the same person in a session,
                      // we only show redeem codes for different achievements

                      if (redeemCodes.find(rc => {
                        return rc.achievement.id === redeemCode.achievement
                      })) { return }

                      let wantedAchievement = allAchievements.find(a => {
                        return a.id === redeemCode.achievement
                      })

                      if (!wantedAchievement) { return }

                      let newRedeemCode = {
                        achievement: wantedAchievement,
                        id: redeemCode.id
                      }

                      if (wantedAchievement) {
                        redeemCodes.push(newRedeemCode)
                        this.redeemCodes.push(newRedeemCode)
                      }
                    })
                  })
              })

            // if this user had company role in the previous edition,
            // it will have a user role in the current edition

          })

          if (this.user.role === 'company') {
            let company = this.user.company
            let companyFound = company.find(c => {
              return c.edition === environment.currentEvent
            })

            if (!companyFound) {
              this.userService.demoteSelf()
                .subscribe(newUser => this.user = newUser)
            } else {
              this.companyService.getCompany(companyFound.company)
                .subscribe(c => this.company = c)
            }
          }
        })
    })
  }

  ngOnInit() { }

  uploadCV(event) {
    let fileList: FileList = event.target.files
    if (fileList.length > 0) {
      let file: File = fileList[0]
      let formData: FormData = new FormData()
      console.log('uploadCV', file.name)
      formData.append('file', file, file.name)
      this.userService.uploadCV(formData).subscribe(res => {
        this.submitedCV = true
      }, (error) => {
        this.submitedCV = false
      })
    }
  }
}
