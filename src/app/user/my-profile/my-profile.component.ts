import { Component, OnInit, NgZone } from '@angular/core'
import { UserService } from '../user.service'
import { User } from '../user.model'
import { environment } from './../../../environments/environment'
import { CompanyService } from '../../company/company.service'
import { Company } from '../../company/company.model'
import { AuthService } from '../../auth/auth.service'
import { Achievement } from '../../achievements/achievement.model';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: [ './my-profile.component.css' ]
})

export class MyProfileComponent implements OnInit {
  user: User
  company: Company
  submitedCV: boolean
  eventOcurring: boolean
  cvDownloadUrl: string
  achievements: Achievement[]

  constructor (
    private userService: UserService,
    private companyService: CompanyService,
    private authService: AuthService,
    private zone: NgZone
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
        })

        // if this user had company role in the previous edition,
        // it will have a user role in the current edition

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

  ngOnInit () { }

  uploadCV (event) {
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
