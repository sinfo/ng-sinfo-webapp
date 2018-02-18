import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core'
import { MessageService, Type } from '../partials/messages/message.service'

@Component({
  selector: 'app-qrcode-scanner',
  templateUrl: './qr-code-scanner.component.html',
  styleUrls: ['./qr-code-scanner.component.css']
})
export class QrcodeScannerComponent implements OnInit {

  @Output() data: EventEmitter<string> = new EventEmitter()
  @Input('singleton') singleton: boolean

  camStarted = false
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
      this.selectedDevice = cams[0]
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
        origin: 'qrcode',
        text: content,
        type: Type.warning
      })
    } else {
      this.messageService.add({
        origin: 'qrcode',
        text: 'Erro na leitura. Tente novamente.',
        type: Type.error
      })
    }

    if (this.singleton) {
      this.camStarted = false
    }
  }
}
