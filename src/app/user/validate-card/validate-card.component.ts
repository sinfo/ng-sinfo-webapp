import { Component, OnInit } from '@angular/core'
import { Title } from '@angular/platform-browser'

import { UserService } from '../user.service'
import { User } from '../user.model'
import { MessageService, Type } from '../../message.service'
import { EventService } from '../../events/event.service'
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

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

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private eventService: EventService,
    private titleService: Title,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit() {
    this.eventService.getCurrent().subscribe(event => {
      this.titleService.setTitle(event.name + ' - Validate Card')
    })

    this.scannerActive = true
    this.userService.getMe()
      .subscribe(user => {
        this.user = user
      })
  }

  receiveUser(data: {user:User, company}) {
    this.userRead = data.user
    this.userService.validateCard(data.user.id).subscribe((_user) => {
      if (!_user) return
      this.snackbar.open(`Validated ${data.user.name}'s card`, "Nice!", {
        panelClass: ['mat-toolbar', 'mat-primary'],
        duration: 2000
      })
      this.messageService.add({
        origin: 'Validate card',
        showAlert: true,
        text: `Validated ${data.user.name}'s card`,
        type: Type.success,
        timeout: 7000
      }) 
    }, error => {

      if (error.error.statusCode === 409) {
        this.snackbar.open(`${data.user.name}'s card is already validated`, "Oops", {
          panelClass: ['mat-toolbar', 'mat-warn'],
          duration: 2000
        })
        this.messageService.add({
          origin: 'Validate card',
          showAlert: true,
          text: `${data.user.name}'s card is already validated`,
          type: Type.warning,
          timeout: 7000
        })
      } else if (error.error.statusCode === 404 || error.error.statusCode === 422) {
        this.snackbar.open(`Not enough signatures on ${data.user.name}'s card`, "Yikes", {
          panelClass: ['mat-toolbar', 'mat-warn'],
          duration: 2000
        }
        )
        this.messageService.add({
          origin: 'Validate card',
          showAlert: true,
          text: `Not enough signatures on ${data.user.name}'s card`,
          type: Type.warning,
          timeout: 7000
        })
      }

    })
  }
}
