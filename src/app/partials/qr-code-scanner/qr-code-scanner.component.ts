import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core'
import { MessageService, Type } from '../../message.service'
import { User } from '../../user/user.model'
import { UserService } from '../../user/user.service'
import { CompanyService } from '../../company/company.service'
import { environment } from '../../../environments/environment'
import { Company } from '../../company/company.model'

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

  selectedDevice
  private availableDevices: {
    cams: any[]
    selected: number
  }

  constructor (
    private messageService: MessageService,
    private userService: UserService,
    private companyService: CompanyService
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
          this.messageService.add({
            origin: 'QrcodeScannerComponent processContent()',
            showAlert: false,
            text: 'User not found.',
            type: Type.error,
            timeout: 6000
          })
          return
        }

        this.userReadOutput.emit(user)
        this.userRead = user

        if (user.role === 'company') {
          let company = user.company.find(c => {
            return c.edition === environment.currentEvent
          })

          if (!company) return

          this.companyService.getCompany(company.company)
            .subscribe(_company => this.company = _company)
        }

        let showAlert = content ? true : false

        this.messageService.add({
          origin: 'QrcodeScannerComponent processContent()',
          showAlert: true,
          text: content,
          type: Type.success
        })
      })
  }
}
