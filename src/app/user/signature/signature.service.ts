import { Injectable } from '@angular/core'
import { CompanyCannonService } from '../../company/company-cannon.service'
import { User } from '../user.model'
import { Company } from '../../company/company.model'
import { environment } from '../../../environments/environment'
import { MessageService, Type } from '../../message.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { EventService } from '../../events/event.service'

@Injectable()
export class SignatureService {

  constructor(
    private companyCannonService: CompanyCannonService,
    private messageService: MessageService,
    private snackBar: MatSnackBar,
    private eventService: EventService
  ) { }

  sign(user: User, company: Company): void {
    this.companyCannonService.sign(company.id, user.id)
      .subscribe(_user => {
        if (!_user) return
        this.snackBar.open(`Signed ${user.name}'s card`, "Ok", {
          panelClass: ['mat-toolbar', 'mat-primary'],
          duration: 2000
        })
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
        if (!_user) return
        this.snackBar.open(`Signed ${user.name} a speed date`, "Ok", {
          panelClass: ['mat-toolbar', 'mat-primary'],
          duration: 2000
        })
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
          ? signatures.signatures.filter(s => s.companyId === company.id).length - 1 : -1
      }

      // signature not found
      if (wantedSignature === -1) {
        this.sign(user, company)
        return
      }

      // signature found
      this.snackBar.open(`Already signed ${user.name}'s card for today`, "Ok", {
        panelClass: ['mat-toolbar', 'mat-warn'],
        duration: 2000
      })
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
