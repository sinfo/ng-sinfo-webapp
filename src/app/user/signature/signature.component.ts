import { Component, OnInit } from '@angular/core'
import { User } from '../user.model'
import { MessageService, Type } from '../../message.service'
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
  signatureChecked = false

  constructor (
    private companyCannonService: CompanyCannonService,
    private companyService: CompanyService,
    private userService: UserService,
    private messageService: MessageService
  ) { }

  ngOnInit () {
    this.scannerActive = true
    this.userService.getMe()
      .subscribe(user => {
        this.me = user
        let company = user.company.find(c => {
          return c.edition === environment.currentEvent
        })

        this.companyService.getCompany(company.company)
          .subscribe(_company => {
            this.myCompany = _company
            if (!this.signatureChecked && this.userRead) {
              this.checkSignature()
            }
          })
      })
  }

  receiveUser (user: User) {
    this.userRead = user
    if (!this.signatureChecked && this.myCompany) {
      this.checkSignature()
    }
  }

  flushInfo (): void {
    this.signatureChecked = false
    this.userRead = undefined
  }

  sign (): void {
    this.companyCannonService.sign(this.myCompany.id, this.userRead.id)
      .subscribe(user => {
        if (!user) return
        this.messageService.add({
          origin: 'Signatures',
          showAlert: true,
          text: `Signed ${this.userRead.name}'s card`,
          type: Type.success,
          timeout: 7000
        })
        this.flushInfo()
      })
  }

  checkSignature (): void {
    let wantedSignature = -1
    this.signatureChecked = true
    let signatures

    if (this.userRead.signatures) {
      signatures = this.userRead.signatures.find(s => {
        return s.day === new Date().getDate().toString() && s.edition === environment.currentEvent
      })

      wantedSignature = (signatures && signatures.signatures)
        ? signatures.signatures.indexOf(this.myCompany.id) : -1
    }

    // signature not found
    if (wantedSignature === -1) {

      // check card's capacity
      let signaturesCount = (signatures && signatures.signatures) ? signatures.signatures.length : 0

      // full card. don't sign
      if (signaturesCount >= environment.signaturesCardCapacity) {
        this.messageService.add({
          origin: 'Signatures',
          showAlert: true,
          text: `${this.userRead.name} has already filled his/her card for today`,
          type: Type.warning,
          timeout: 7000
        })
        this.flushInfo()
        return
      }

      this.sign()
      return
    }

    // signature found
    this.messageService.add({
      origin: 'Signatures',
      showAlert: true,
      text: `Already signed ${this.userRead.name}'s card for today`,
      type: Type.warning,
      timeout: 7000
    })

    this.flushInfo()
  }

}
