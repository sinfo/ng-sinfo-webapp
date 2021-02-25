import { Injectable } from '@angular/core'
import { CompanyCannonService } from '../../company/company-cannon.service'
import { User } from '../user.model'
import { Company } from '../../company/company.model'
import { environment } from '../../../environments/environment'
import { MessageService, Type } from '../../message.service'
import { EventService } from '../../events/event.service'

@Injectable()
export class SignatureService {

  constructor(
    private companyCannonService: CompanyCannonService,
    private messageService: MessageService,
    private eventService: EventService
  ) { }

  sign(user: User, company: Company): void {
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

  signSpeed(user: User, company: Company): void {
    this.companyCannonService.signSpeedDate(company.id, user.id)
      .subscribe(_user => {
        console.log(company)
        if (!_user) return
        this.messageService.add({
          origin: 'Speed Date Signature',
          showAlert: true,
          text: `Signed ${user.name} a speed date`,
          type: Type.success,
          timeout: 7000
        })
      })
  }

  checkSignature(user: User, company: Company): void {
    let wantedSignature = -1
    let signatures
    this.eventService.getCurrent().subscribe(event => {
      if (user.signatures) {
        signatures = user.signatures.find(s => {
          return s.day === new Date().getDate().toString() && s.edition === event.id
        })

        wantedSignature = (signatures && signatures.signatures)
          ? signatures.signatures.indexOf(company.id) : -1
      }

      // signature not found
      if (wantedSignature === -1) {
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
    })
  }
}
