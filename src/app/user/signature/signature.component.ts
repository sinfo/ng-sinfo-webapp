import { Component, OnInit } from '@angular/core'
import { User } from '../user.model'
import { MessageService } from '../../message.service'
import { UserService } from '../user.service'
import { Company } from '../../company/company.model'
import { environment } from '../../../environments/environment'
import { CompanyCannonService } from '../../company/company-cannon.service'
import { CompanyService } from '../../company/company.service'

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
  alreadySigned

  constructor(
    private companyCannonService: CompanyCannonService,
    private companyService: CompanyService,
    private userService: UserService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.scannerActive = true
    this.updateInfo()
    this.userService.getMe()
      .subscribe(user => {
        this.me = user
        if (user.role !== 'company') return

        let company = user.company.find(c => {
          return c.edition === environment.currentEvent
        })

        if (!company) return

        this.companyService.getCompany(company.company)
          .subscribe(_company => {
            this.myCompany = _company
            if (this.alreadySigned === undefined) {
              this.checkSignature()
            }
          })
      })
  }

  reScan(): void {
    this.userRead = null
    this.scannerActive = true
  }

  updateInfo (): void {
    let d = new Date().getDay()
    let weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    this.info = `${weekday[d]}'s card`
  }

  receiveUser (user: User) {
    this.userRead = user
    this.scannerActive = false
    if (this.alreadySigned === undefined) {
      this.checkSignature()
    }
  }

  sign (): void {
    this.companyCannonService.sign(this.myCompany.id, this.userRead.id)
      .subscribe(user => {
        if (!user) return
        this.userRead = user
        this.alreadySigned = true
      })
  }

  checkSignature (): void {
    let signatures = this.userRead.signatures.find(s => {
      return s.day === new Date().getDate().toString() && s.edition === environment.currentEvent
    })

    let wantedSignature = signatures.signatures.indexOf(this.myCompany.id)

    if (wantedSignature === -1) {
      this.alreadySigned = false
      return
    }

    this.alreadySigned = true
  }

}
