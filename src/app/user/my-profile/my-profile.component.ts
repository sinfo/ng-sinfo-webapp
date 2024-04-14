import { Component, NgZone, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Title } from '@angular/platform-browser'

import { UserService } from '../user.service'
import { User } from '../user.model'
import { environment } from '../../../environments/environment'
import { CompanyService } from '../../company/company.service'
import { Company } from '../../company/company.model'
import { AuthService } from '../../auth/auth.service'
import { Achievement } from '../achievements/achievement.model'
import { SurveyService } from '../survey/survey.service'
import { AchievementService } from '../achievements/achievement.service'
import { EventService } from '../../events/event.service'
import { ClipboardService } from 'ngx-clipboard'
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap'
import { MessageService, Type } from '../../message.service'

const PROMOCODES_INFO_KEY = "promocodes-info"

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})

export class MyProfileComponent implements OnInit {
  user: User
  presentationRole: string
  company: Company
  submitedCV: boolean
  cvDownloadUrl: string
  promocodesInfo: boolean
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
    private achievementService: AchievementService,
    private eventService: EventService,
    private router: Router,
    private titleService: Title,
    private clipboardService: ClipboardService,
    private messageService: MessageService


  ) {
  }

  ngOnInit() {
    this.eventService.getCurrent().subscribe(event => {
      this.titleService.setTitle(event.name + ' - QR Code')
    })

    let promocodesInfoLocalStorage = localStorage.getItem(PROMOCODES_INFO_KEY)
    if(promocodesInfoLocalStorage == undefined){
      localStorage.setItem(PROMOCODES_INFO_KEY, "true")
      this.promocodesInfo = true
    } else {
       this.promocodesInfo = promocodesInfoLocalStorage == "true" 
    }

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

  getPresentationRole(user: User) {
    if (user === undefined) {
      this.router.navigate(['/'])
    }
    if (user.role === 'user') return 'Attendee'
    if (user.role === 'company') return 'Company'
    if (user.role === 'team') return 'Member'
    if (user.role === 'admin') return 'Admin'
  }

  uploadCV(event) {
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

  deleteCV() {
    this.userService.deleteCV().subscribe(res => {
      this.submitedCV = false
    })
  }

  copyToClipboard(tooltip: NgbTooltip) {
    // this.messageService.add({
    //   origin: `My Profile`,
    //   text: `Copied!`,
    //   type: Type.success,
    //   showAlert: true,
    //   timeout: 2000
    // })

    const ttp = document.getElementById('tooltip')
    ttp.style.opacity === '0' ? ttp.style.opacity = '0.8' : ttp.style.opacity = '0'

    setTimeout(() => {
      const _ttp = document.getElementById('tooltip')
      _ttp.style.opacity === '0' ? _ttp.style.opacity = '0.8' : _ttp.style.opacity = '0'
    }, 1500)

    this.clipboardService.copyFromContent(this.user.id)
  }

  closePromocodesInfo() {
    localStorage.setItem(PROMOCODES_INFO_KEY,"false")
    this.promocodesInfo = false
  }
}
