import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-promote',
  templateUrl: './promote.component.html',
  styleUrls: ['./promote.component.css']
})
export class PromoteComponent implements OnInit {

  id: string

  constructor () { }

  ngOnInit () {
  }

  processData (data: string) {
    if (!this.id) {
      this.id = data
    }
    console.log(`
      Data: ${data}
      id:   ${this.id}`)
  }

}
