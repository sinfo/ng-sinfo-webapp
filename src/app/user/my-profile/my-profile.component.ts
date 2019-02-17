import { Component, NgZone } from '@angular/core'
import { UserService } from '../user.service'
import { User } from '../user.model'
import { environment } from './../../../environments/environment'
import { CompanyService } from '../../company/company.service'
import { Company } from '../../company/company.model'
import { AuthService } from '../../auth/auth.service'
import { Achievement } from '../../achievements/achievement.model'
import { SurveyService } from '../survey/survey.service'
import { AchievementService } from '../../achievements/achievement.service'
import { EventService } from '../../events/event.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})

export class MyProfileComponent {
  user: User
  presentationRole: string
  company: Company
  submitedCV: boolean
  cvDownloadUrl: string
  achievements: Achievement[]
  redeemCodes: Array<{
    achievement: Achievement
    id: string
  }> = new Array()

  constructor (
    private userService: UserService,
    private companyService: CompanyService,
    private authService: AuthService,
    private surveyService: SurveyService,
    private zone: NgZone,
    private achievementService: AchievementService,
    private eventService: EventService,
    private router: Router
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
          this.presentationRole = this.getPresentationRole(this.user)

          this.userService.getCv().subscribe(cv => {
            // TODO CANNON MUST RETURN 404 on no file
            this.submitedCV = cv !== null && cv.id !== null
          }, () => {
            this.submitedCV = false
          })

          this.userService.getUserAchievements(user.id).subscribe(achievements => {
            this.achievements = achievements

            // if this user had company role in the previous edition,
            // it will have a user role in the current edition

          })
          this.eventService.getCurrent().subscribe(event => {
            if (this.user.role === 'company') {
              let company = this.user.company
              let companyFound = company.find(c => {
                return c.edition === event.id
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
    })
  }

  getPresentationRole (user: User) {
    if (user === undefined) {
      this.router.navigate(['/'])
    }
    if (user.role === 'user') return 'Atendee'
    if (user.role === 'company') return 'Company'
    if (user.role === 'team') return 'Member'
    if (user.role === 'admin') return 'Admin'
  }

  uploadCV (event) {
    let fileList: FileList = event.target.files
    if (fileList.length > 0) {
      let file: File = fileList[0]
      let formData: FormData = new FormData()
      formData.append('file', file, file.name)
      this.userService.uploadCV(formData).subscribe(res => {
        this.submitedCV = true
      }, () => {
        this.submitedCV = false
      })
    }
  }

  deleteCV () {
    this.userService.deleteCV().subscribe(res => {
      this.submitedCV = false
    })
  }
}
