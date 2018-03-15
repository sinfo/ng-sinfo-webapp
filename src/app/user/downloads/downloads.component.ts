import { Component, OnInit } from '@angular/core'
import { User } from '../user.model'
import { UserService } from '../user.service'
import { Company } from '../../company/company.model'
import { CompanyService } from '../../company/company.service'
import { environment } from '../../../environments/environment'

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
    private companyService: CompanyService
  ) { }

  ngOnInit () {
    this.userService.getMe()
      .subscribe(me => {
        this.me = me
        const company = me.company.find(c => {
          return c.edition === environment.currentEvent
        })
        this.cvsDownloadUrl = `${environment.cannonUrl}/company/${company.company}/files/download?editionId=${environment.currentEvent}`
        this.linksCVsDownloadUrl = `${environment.cannonUrl}/company/${company.company}` + `
        /files/download?editionId=${environment.currentEvent}&links=true` // too big of a string
        this.companyService.getCompany(company.company)
        .subscribe(_company => {
          this.company = _company
        })
      })
  }
}
