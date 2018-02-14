import { Component, OnInit } from '@angular/core'
import * as Instascan from 'instascan'

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.css']
})
export class QrcodeComponent implements OnInit {

  private id: string

  constructor () { }

  ngOnInit () {
    this.id = 'exemploDeID'
    this.runScanner()
  }

  runScanner (): void {
    let scanner = new Instascan.Scanner({ video: document.getElementById('preview') })
    scanner.addListener('scan', this.processScannedContent)

    Instascan.Camera.getCameras().then(function (cameras) {
      if (cameras.length > 0) {
        scanner.start(cameras[0])
      } else {
        console.error('No cameras found.')
      }
    }).catch(function (e) {
      console.error(e)
    })
  }

  processScannedContent (content): void {
    console.log(content)
  }

}
