import { Component, OnInit } from '@angular/core'
import { UserService } from '../user.service'
import { User } from '../user.model'
import { Company } from '../../company/company.model'
import { CompanyService } from '../../company/company.service'
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.css']
})
export class LinkComponent implements OnInit {

  scannerActive: boolean
  userRead: User
  company: Company
  me: User

  notes: string

  constructor (
    private userService: UserService,
    private companyService: CompanyService
  ) { }

  ngOnInit () {
    this.scannerActive = true
    this.userService.getMe()
      .subscribe(user => {
        this.me = user
        if (user.role !== 'company') return

        let company = user.company.find(c => {
          return c.edition === environment.currentEvent
        })

        if (!company) return

        this.companyService.getCompany(company.company)
          .subscribe(_company => this.company = _company)
      })
  }

  reScan () {
    this.userRead = null
    this.scannerActive = true
  }

  processData (id: string) {
    this.scannerActive = false
    this.userService.getUser(id)
      .subscribe(user => this.userRead = user)
  }

}
