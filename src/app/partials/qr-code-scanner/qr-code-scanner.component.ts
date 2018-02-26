import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core'
import { MessageService, Type } from '../../message.service'
import { User } from '../../user/user.model'
import { UserService } from '../../user/user.service'

@Component({
  selector: 'app-qrcode-scanner',
  templateUrl: './qr-code-scanner.component.html',
  styleUrls: ['./qr-code-scanner.component.css']
})
export class QrcodeScannerComponent implements OnInit {

  @Output() userReadOutput: EventEmitter<User> = new EventEmitter()
  @Input() title: string
  @Input() info: string
  @Input() camStarted: boolean

  selectedDevice
  private availableDevices: {
    cams: any[]
    selected: number
  }
  userRead: User

  constructor (
    private messageService: MessageService,
    private userService: UserService
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
    if (!content) {
      this.messageService.add({
        origin: 'QrcodeScannerComponent processContent()',
        showAlert: true,
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
            showAlert: true,
            text: 'User not found.',
            type: Type.error,
            timeout: 6000
          })
          return
        }

        this.userReadOutput.emit(user)
        this.userRead = user
        this.messageService.add({
          origin: 'QrcodeScannerComponent processContent()',
          showAlert: false,
          text: content,
          type: Type.success
        })
      })
  }
}
