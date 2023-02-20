import { Component, OnInit } from '@angular/core'
import { Title } from '@angular/platform-browser'

import { User } from '../user.model'
import { UserService } from '../user.service'
import { Company } from '../../company/company.model'
import { CompanyService } from '../../company/company.service'
import { EventService } from '../../events/event.service'
import { SignatureService } from './signature.service'

@Component({
  selector: 'app-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.css']
})
export class SignatureComponent implements OnInit {

  scannerActive: boolean
  title = 'Signature'
  info: string

  userRead: User
  me: User
  myCompany: Company

  constructor (
    private titleService: Title,
    private companyService: CompanyService,
    private userService: UserService,
    private signatureService: SignatureService,
    private eventService: EventService
  ) { }

  ngOnInit () {
    this.scannerActive = false
    this.eventService.getCurrent().subscribe(event => {
      this.titleService.setTitle(event.name + ' - Signature')
      this.userService.getMe()
        .subscribe(user => {
          this.me = user
          let company = user.company.find(c => {
            return c.edition === event.id
          })
          this.companyService.getCompany(company.company)
            .subscribe(_company => {
              this.myCompany = _company
              this.scannerActive = true
            })
        })
    })
  }

  receiveUser (data:{user:User, company:Company}) {
    this.userRead = data.user
    this.signatureService.checkSignature(this.userRead, this.myCompany)
  }
}
