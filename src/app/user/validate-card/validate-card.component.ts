import { Component, OnInit } from '@angular/core'
import { UserService } from '../user.service'
import { User } from '../user.model'
import { MessageService, Type } from '../../message.service'

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
    }, error => {

      if (error.error.statusCode === 409) {
        this.messageService.add({
          origin: 'Validate card',
          showAlert: true,
          text: `${user.name}'s card is already validated`,
          type: Type.warning,
          timeout: 7000
        })
      } else if (error.error.statusCode === 404 || error.error.statusCode === 422) {
        this.messageService.add({
          origin: 'Validate card',
          showAlert: true,
          text: `Not enough signatures on ${user.name}'s card`,
          type: Type.warning,
          timeout: 7000
        })
      }

    })
  }
}
