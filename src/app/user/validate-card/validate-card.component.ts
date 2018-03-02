import { Component, OnInit } from '@angular/core'
import { UserService } from '../user.service'
import { User } from '../user.model'
import { Company } from '../../company/company.model'
import { CompanyService } from '../../company/company.service'
import { environment } from '../../../environments/environment'
import { MessageService, Type } from '../../message.service'
import { CompanyCannonService } from '../../company/company-cannon.service'
import { SignatureService } from '../signature/signature.service'

@Component({
  selector: 'app-validate-card',
  templateUrl: './validate-card.component.html',
  styleUrls: ['./validate-card.component.css']
})
export class ValidateCardComponent implements OnInit {
  scannerActive: boolean
  title = 'Validate Card'
  info: string
  userRead: User
  user: User

  constructor (
    private userService: UserService,
    private messageService: MessageService
  ) { }

  ngOnInit () {
    this.scannerActive = true
    this.userService.getMe()
    .subscribe(user => {
      this.user = user
    })
  }

  receiveUser (user: User) {
    this.userRead = user
    this.userService.validateCard(user.id).subscribe((_user) => {
      if (!_user) return
      this.messageService.add({
        origin: 'Validate card',
        showAlert: true,
        text: `Validated ${user.name}'s card`,
        type: Type.success,
        timeout: 7000
      })
    })
  }
}
