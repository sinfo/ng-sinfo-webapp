import { Component, OnInit } from '@angular/core'
import { User } from '../user.model'
import { MessageService, Type } from '../../message.service'
import { UserService } from '../user.service'
import { Company } from '../../company/company.model'
import { environment } from '../../../environments/environment'
import { CompanyCannonService } from '../../company/company-cannon.service'
import { CompanyService } from '../../company/company.service'
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
    private companyCannonService: CompanyCannonService,
    private companyService: CompanyService,
    private userService: UserService,
    private signatureService: SignatureService,
    private messageService: MessageService
  ) { }

  ngOnInit () {
    this.scannerActive = false
    this.userService.getMe()
      .subscribe(user => {
        this.me = user
        let company = user.company.find(c => {
          return c.edition === environment.currentEvent
        })

        this.companyService.getCompany(company.company)
          .subscribe(_company => {
            this.myCompany = _company
            this.scannerActive = true
          })
      })
  }

  receiveUser (user: User) {
    this.userRead = user
    this.signatureService.checkSignature(this.userRead, this.myCompany)
  }
}
