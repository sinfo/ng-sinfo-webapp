import { Component, OnInit } from '@angular/core'
import { Title } from '@angular/platform-browser'

import { EventService } from './../events/event.service'

@Component({
  selector: 'app-code-of-conduct',
  templateUrl: './code-of-conduct.html',
  styles: []
})
export class CodeOfConductComponent implements OnInit {

  constructor (
    private eventService: EventService,
    private titleService: Title
  ) { }

  ngOnInit () {
    this.eventService.getCurrent().subscribe(event => {
      this.titleService.setTitle(event.name + ' - Code Of Conduct')
    })
  }
}

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.html',
  styles: []
})
export class PrivacyPolicyComponent implements OnInit {

  constructor (
    private eventService: EventService,
    private titleService: Title
  ) { }

  ngOnInit () {
    this.eventService.getCurrent().subscribe(event => {
      this.titleService.setTitle(event.name + ' - Privacy Policy')
    })
  }
}

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.html',
  styles: []
})
export class PageNotFoundComponent implements OnInit {

  constructor (
    private eventService: EventService,
    private titleService: Title
  ) { }

  ngOnInit () {
    this.eventService.getCurrent().subscribe(event => {
      this.titleService.setTitle(event.name + ' - Page Not Found')
    })
  }
}

@Component({
  selector: 'app-live',
  templateUrl: './live.html',
  styles: []
})
export class LiveComponent implements OnInit {

  constructor (
    private eventService: EventService,
    private titleService: Title
  ) { }

  ngOnInit () {
    this.eventService.getCurrent().subscribe(event => {
      this.titleService.setTitle(event.name + ' - Live')
    })
  }
}
