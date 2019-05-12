import { Component, OnInit } from '@angular/core'
import { Title } from '@angular/platform-browser'

import { User } from '../user.model'
import { UserService } from '../user.service'
import { Company } from '../../company/company.model'
import { CompanyService } from '../../company/company.service'
import { environment } from '../../../environments/environment'
import { AuthService } from '../../auth/auth.service'
import { EventService } from '../../events/event.service'

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
    private authService: AuthService,
    private eventService: EventService,
    private titleService: Title
  ) { }

  ngOnInit () {
    this.userService.getMe()
    .subscribe(me => {
      this.me = me
      this.eventService.getCurrent().subscribe(event => {
        this.titleService.setTitle(event.name + ' - Downloads')

        if (me.role === 'team') {
          this.cvsDownloadUrl = `${environment.cannonUrl}` +
          `/files/download?editionId=${event.id}` +
          `&access_token=${this.authService.getToken().token}`
        }
        if (me.role === 'company') {
          const company = me.company.find(c => {
            return c.edition === event.id
          })

          this.companyService.getCompany(company.company)
          .subscribe(_company => {
            this.company = _company
          })

          this.linksCVsDownloadUrl = `${environment.cannonUrl}/company/${company.company}` +
          `/files/download?editionId=${event.id}&links=true` +
          `&access_token=${this.authService.getToken().token}` // too big of a string

          this.cvsDownloadUrl = `${environment.cannonUrl}/company/${company.company}` +
          `/files/download?editionId=${event.id}` +
          `&access_token=${this.authService.getToken().token}`
        }
      })
    })
  }
}
