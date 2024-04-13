import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core'
import { MessageService, Type } from '../../message.service'
import { User } from '../../user/user.model'
import { UserService } from '../../user/user.service'
import { CompanyService } from '../../company/company.service'
import { Company } from '../../company/company.model'
import { MatSnackBar } from '@angular/material/snack-bar'

import { EventService } from '../../events/event.service'
import { last } from 'rxjs/operators'

@Component({
  selector: 'app-qrcode-scanner',
  templateUrl: './qr-code-scanner.component.html',
  styleUrls: ['./qr-code-scanner.component.css']
})
export class QrcodeScannerComponent implements OnInit {

  @Output() readData: EventEmitter<{user: User, company: Company}> = new EventEmitter()
  @Output() rawOutput: EventEmitter<string> = new EventEmitter()
  @Input() title: string
  @Input() info: string
  @Input() company: Company
  @Input() camStarted: boolean
  @Input() userRead: User

  @Input() processUser: boolean

  @Input() insideScannerMsg: [{ title: string, msg: string }]
  @Output() buttonAction = new EventEmitter()
  @Input() buttonLabel: string

  animation: boolean // true -> success, false -> error, undefined -> neither
  lastUser: User = undefined
  lastRaw: string
  desiredDevice: MediaDeviceInfo = null

  private availableDevices: {
    cams: MediaDeviceInfo[]
    selected: number
  }

  constructor(
    private messageService: MessageService,
    private snackBar: MatSnackBar,
    private userService: UserService,
    private companyService: CompanyService,
    private eventService: EventService
  ) { }

  ngOnInit() {
    if (this.processUser === undefined) {
      this.processUser = true
    }
  }

  camerasFoundHandler(cams: any[]) {
    this.availableDevices = {
      cams: cams,
      selected: -1
    }

    if (cams && cams.length > 0) {
      this.desiredDevice = cams[cams.length - 1]
      this.camStarted = true
      this.availableDevices.selected = cams.length - 1
    }
  }

  changeCamera() {
    let selected = (this.availableDevices.selected + 1) % this.availableDevices.cams.length
    this.availableDevices.selected = selected
    this.onChange(this.availableDevices.cams[selected])
  }

  onChange(selectedValue: MediaDeviceInfo) {
    this.camStarted = false
    this.desiredDevice = selectedValue
    this.camStarted = true
  }

  handleQrCodeResult(content): void {
    this.company = undefined // flush previous info
    this.lastUser = undefined
    this.userRead = undefined

    if (!content) {
      this.snackBar.open('Reading the QRCode, try again.', "Ok", {
        panelClass: ['mat-toolbar', 'mat-warn'],
        duration: 2000
      })
      /* this.messageService.add({
        origin: 'QrcodeScannerComponent processContent()',
        showAlert: false,
        text: 'Reading the QRCode, try again.',
        type: Type.error,
        timeout: 6000
      }) */
      return
    }

    if (this.lastRaw === content) {
      return
    }

    this.rawOutput.emit(content)
    this.lastRaw = content

    if (!this.processUser) return

    this.userService.getUser(content)
      .subscribe(user => {
        if (!user) {

          this.animation = false
          setTimeout(() => {
            this.animation = undefined
          }, 500)

          this.snackBar.open('User not found', "Ok", {
            panelClass: ['mat-toolbar', 'mat-warn'],
            duration: 2000
          })
          /* this.messageService.add({
            origin: 'QrcodeScannerComponent processContent()',
            showAlert: false,
            text: 'User not found.',
            type: Type.error,
            timeout: 6000
          }) */
          return
        }
        if (this.lastUser === undefined || this.lastUser.id !== user.id) {
          this.animation = true
          setInterval(() => {
            this.animation = undefined
          }, 500)

          if (user.role === 'company') {
            this.eventService.getCurrent().subscribe(event => {
              let company = user.company.find(c => c.edition === event.id)
              if (!company) return

              this.companyService.getCompany(company.company)
                .subscribe(_company => {
                  this.company = _company
                  this.readData.emit({user:user, company:_company})
                })
            })
          }
          else{
            this.readData.emit({user:user, company:null})
          }
          this.userRead = user
          this.lastUser = user
          //this.lastRaw = undefined // Removed to prevent infinite reading of the same qrcode. Revisit if problem in reverse links appear
        }
      })
  }

  buttonClick() {
    this.buttonAction.emit()
  }
}
