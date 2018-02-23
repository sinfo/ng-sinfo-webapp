import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core'
import { MessageService, Type } from '../../message.service'

@Component({
  selector: 'app-qrcode-scanner',
  templateUrl: './qr-code-scanner.component.html',
  styleUrls: ['./qr-code-scanner.component.css']
})
export class QrcodeScannerComponent implements OnInit {

  @Output() data: EventEmitter<string> = new EventEmitter()
  @Input('singleton') singleton: boolean
  @Input() camStarted: boolean

  // camStarted = false
  selectedDevice
  private qrResult: string
  private availableDevices: any[]

  constructor (
    private messageService: MessageService
  ) { }

  ngOnInit () { }

  displayCameras (cams: any[]) {
    this.availableDevices = cams
    if (cams && cams.length > 0) {
      this.selectedDevice = cams[cams.length - 1]
      this.camStarted = true
    }
  }

  handleQrCodeResult (result: string) {
    this.qrResult = result
    this.processContent(result)
  }

  onChange (selectedValue: string) {
    this.camStarted = false
    this.selectedDevice = selectedValue
    this.camStarted = true
  }

  processContent (content): void {
    if (content) {
      this.data.emit(content)
      this.messageService.add({
        origin: 'QrcodeScannerComponent processContent()',
        showAlert: true,
        text: content,
        type: Type.success,
        timeout: 1000
      })
    } else {
      this.messageService.add({
        origin: 'QrcodeScannerComponent processContent()',
        showAlert: true,
        text: 'Reading the QRCode, try again.',
        type: Type.error,
        timeout: 6000
      })
    }
  }
}
