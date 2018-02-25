import { Injectable } from '@angular/core'
import { CompanyCannonService } from '../../company/company-cannon.service'
import { User } from '../user.model'
import { Company } from '../../company/company.model'
import { environment } from '../../../environments/environment'
import { MessageService, Type } from '../../message.service'

@Injectable()
export class SignatureService {

  constructor (
    private companyCannonService: CompanyCannonService,
    private messageService: MessageService
  ) { }

  sign (user: User, company: Company): void {
    this.companyCannonService.sign(company.id, user.id)
      .subscribe(_user => {
        if (!_user) return
        this.messageService.add({
          origin: 'Signatures',
          showAlert: true,
          text: `Signed ${user.name}'s card`,
          type: Type.success,
          timeout: 7000
        })
      })
  }

  checkSignature (user: User, company: Company): void {
    let wantedSignature = -1
    let signatures

    if (user.signatures) {
      signatures = user.signatures.find(s => {
        return s.day === new Date().getDate().toString() && s.edition === environment.currentEvent
      })

      wantedSignature = (signatures && signatures.signatures)
        ? signatures.signatures.indexOf(company.id) : -1
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
          text: `${user.name} has already filled his/her card for today`,
          type: Type.warning,
          timeout: 7000
        })
        return
      }

      this.sign(user, company)
      return
    }

    // signature found
    this.messageService.add({
      origin: 'Signatures',
      showAlert: true,
      text: `Already signed ${user.name}'s card for today`,
      type: Type.warning,
      timeout: 7000
    })
  }

}
