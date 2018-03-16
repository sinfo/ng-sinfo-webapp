import { Component, OnInit } from '@angular/core'
import { User } from '../user.model'
import { UserService } from '../user.service'
import { Company } from '../../company/company.model'
import { CompanyService } from '../../company/company.service'
import { environment } from '../../../environments/environment'
import { AuthService } from '../../auth/auth.service'

@Component({
  selector: 'app-downloads',
  templateUrl: './downloads.component.html',
  styleUrls: ['./downloads.component.css']
})
export class DownloadsComponent implements OnInit {

  me: User
  company: Company
  cvsDownloadUrl: string
  linksCVsDownloadUrl: string

  constructor (
    private userService: UserService,
    private companyService: CompanyService,
    private authService: AuthService
  ) { }

  ngOnInit () {
    this.userService.getMe()
    .subscribe(me => {
      this.me = me

      if (me.role === 'team') {
        this.cvsDownloadUrl = `${environment.cannonUrl}` +
        `/files/download?editionId=${environment.currentEvent}` +
        `&access_token=${this.authService.getToken().token}`
      }
      if (me.role === 'company') {
        const company = me.company.find(c => {
          return c.edition === environment.currentEvent
        })

        this.companyService.getCompany(company.company)
        .subscribe(_company => {
          this.company = _company
        })

        this.linksCVsDownloadUrl = `${environment.cannonUrl}/company/${company.company}` +
        `/files/download?editionId=${environment.currentEvent}&links=true` +
        `&access_token=${this.authService.getToken().token}` // too big of a string

        this.cvsDownloadUrl = `${environment.cannonUrl}/company/${company.company}` +
        `/files/download?editionId=${environment.currentEvent}` +
        `&access_token=${this.authService.getToken().token}`
      }
    })
  }
}
