import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core'
import { MessageService, Type } from '../../message.service'
import { User } from '../../user/user.model'
import { UserService } from '../../user/user.service'
import { CompanyService } from '../../company/company.service'
import { Company } from '../../company/company.model'

import { EventService } from '../../events/event.service'

@Component({
  selector: 'app-qrcode-scanner',
  templateUrl: './qr-code-scanner.component.html',
  styleUrls: ['./qr-code-scanner.component.css']
})
export class QrcodeScannerComponent implements OnInit {

  @Output() userReadOutput: EventEmitter<User> = new EventEmitter()
  @Input() title: string
  @Input() info: string
  @Input() company: Company
  @Input() camStarted: boolean
  @Input() userRead: User

  @Input() insideScannerMsg: [{ title: string, msg: string }]
  @Output() buttonAction = new EventEmitter()
  @Input() buttonLabel: string

  animation: boolean // true -> success, false -> error, undefined -> neither

  selectedDevice
  private availableDevices: {
    cams: any[]
    selected: number
  }

  constructor (
    private messageService: MessageService,
    private userService: UserService,
    private companyService: CompanyService,
    private eventService: EventService
  ) { }

  ngOnInit () { }

  displayCameras (cams: any[]) {
    this.availableDevices = {
      cams: cams,
      selected: -1
    }

    if (cams && cams.length > 0) {
      this.selectedDevice = cams[cams.length - 1]
      this.camStarted = true
      this.availableDevices.selected = cams.length - 1
    }
  }

  changeCamera () {
    let selected = (this.availableDevices.selected + 1) % this.availableDevices.cams.length
    this.availableDevices.selected = selected
    this.onChange(this.availableDevices.cams[selected])
  }

  onChange (selectedValue: string) {
    this.camStarted = false
    this.selectedDevice = selectedValue
    this.camStarted = true
  }

  handleQrCodeResult (content): void {
    this.company = undefined // flush previous info

    if (!content) {
      this.messageService.add({
        origin: 'QrcodeScannerComponent processContent()',
        showAlert: false,
        text: 'Reading the QRCode, try again.',
        type: Type.error,
        timeout: 6000
      })
      return
    }

    this.userService.getUser(content)
      .subscribe(user => {
        if (!user) {

          this.animation = false
          setTimeout(() => {
            this.animation = undefined
          }, 500)

          this.messageService.add({
            origin: 'QrcodeScannerComponent processContent()',
            showAlert: false,
            text: 'User not found.',
            type: Type.error,
            timeout: 6000
          })
          return
        }

        this.animation = true
        setTimeout(() => {
          this.animation = undefined
        }, 500)

        this.userReadOutput.emit(user)
        this.userRead = user

        if (user.role === 'company') {
          this.eventService.getCurrent().subscribe(event => {
            let company = user.company.find(c => c.edition === event.id)
            if (!company) return

            this.companyService.getCompany(company.company)
              .subscribe(_company => this.company = _company)
          })
        }
      })
  }

  buttonClick () {
    this.buttonAction.emit()
  }
}
