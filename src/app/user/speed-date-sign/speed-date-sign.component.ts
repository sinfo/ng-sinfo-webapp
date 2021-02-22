import { Component, OnInit } from '@angular/core'
import { Title } from '@angular/platform-browser'

import { User } from '../user.model'
import { UserService } from '../user.service'
import { Company } from '../../company/company.model'
import { CompanyService } from '../../company/company.service'
import { EventService } from '../../events/event.service'
import { SignatureService } from '../signature/signature.service'
import { MessageService, Type } from '../../message.service'



@Component({
  selector: 'app-speed-date-sign',
  templateUrl: './speed-date-sign.component.html',
  styleUrls: ['./speed-date-sign.component.css']
})
export class SpeedDateSignComponent implements OnInit {

  scannerActive: boolean
  title = 'Signature'
  info: string
  cam = false
  userId = ''

  userRead: User
  me: User
  myCompany: Company

  constructor(
    private titleService: Title,
    private companyService: CompanyService,
    private userService: UserService,
    private signatureService: SignatureService,
    private eventService: EventService,
    private messageService: MessageService

  ) { }

  ngOnInit() {
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

  toggleCam() {
    this.cam = !this.cam
  }

  submit() {
    this.userService.getUser(this.userId)
      .subscribe(user => {
        if (!user) {

          this.messageService.add({
            origin: 'Sign Speed Date',
            showAlert: false,
            text: 'User not found.',
            type: Type.error,
            timeout: 6000
          })
          return
        }

        this.userRead = user
        this.signatureService.signSpeed(this.userRead, this.myCompany)

      })
  }

  receiveUser(user: User) {
    this.userRead = user
    this.signatureService.signSpeed(this.userRead, this.myCompany)
  }

}
