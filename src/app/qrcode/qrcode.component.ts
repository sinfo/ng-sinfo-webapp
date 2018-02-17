import { Component, OnInit, AfterViewInit } from '@angular/core'
import * as Instascan from 'instascan'
import { MessageService, Type } from '../partials/messages/message.service'

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.css']
})
export class QrcodeComponent implements OnInit, AfterViewInit {

  private data: Array<string>
  private read: string
  private base64: string
  // private scanner: Instascan.Scanner

  private camStarted = false
  private selectedDevice = undefined
  private qrResult = ""
  private availableDevices = []

  constructor (
    private messageService: MessageService
  ) { }

  ngOnInit () {
    this.data = []
  }

  ngAfterViewInit () {
    // this.runScanner()
  }

  displayCameras (cams: any[]) {
    this.availableDevices = cams
    console.log("Devices", cams)
    if (cams && cams.length > 0) {
      this.selectedDevice = cams[0]
      this.camStarted = true
    }
  }

  handleQrCodeResult (result: string) {
    console.log("Result", result)
    this.qrResult = result
  }

  onChange (selectedValue: string) {
    console.log("Selection changed", selectedValue)
    this.camStarted = false
    this.selectedDevice = selectedValue
    this.camStarted = true
  }

  /*
  runScanner (): void {
    this.scanner = new Instascan.Scanner({
      continuous: false,
      video: document.getElementById('preview')
    })

    this.scanner.addListener('scan', content => {
      this.processContent(content)
    })

    Instascan.Camera.getCameras().then(cameras => {
      if (cameras.length > 0) {
        this.scanner.start(cameras[0])
      } else {
        console.error('No cameras found.')
      }
    }).catch(function (e) {
      console.error(e)
    })
  }

  scan (content): void {
    this.scanner.scan()
  }

  processContent (content): void {
    console.log(content)
    if (content) {
      this.data.push(content)
      this.read = content
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
  }
  */

}
