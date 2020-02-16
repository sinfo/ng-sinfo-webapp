import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Title } from '@angular/platform-browser'

import { EventService } from '../../../events/event.service'
import { Endpoint } from '../../../endpoints/endpoint.model'
import { EndpointService } from '../../../endpoints/endpoint.service'
import { UserService } from '../../user.service'
import { User } from '../../user.model'
import { CompanyService } from '../../../company/company.service'
import { Company } from '../../../company/company.model'

@Component({
  selector: 'app-downloads-status',
  templateUrl: './downloads-status.component.html',
  styleUrls: ['./downloads-status.component.css']
})
export class DownloadsStatusComponent implements OnInit {

  endpoints: Endpoint[]
  companies: { [key: string]: Company } = {}
  hasCompanies: boolean
  me: User

  constructor (
    private eventService: EventService,
    private endpointService: EndpointService,
    private router: Router,
    private companyService: CompanyService,
    private userService: UserService,
    private titleService: Title
  ) { }

  ngOnInit () {
    this.eventService.getCurrent().subscribe(event => {
      this.titleService.setTitle(event.name + ' - Download Status')
    })

    this.userService.getMe().subscribe(user => {
      this.me = user

      if (user.role !== 'team') {
        this.router.navigate(['/user/qrcode'])
      }

      this.endpointService.getEndpoints().subscribe(endpoints => {
        this.endpoints = endpoints.sort((a, b) => {
          return a.company.localeCompare(b.company)
        })
      })

      this.companyService.getCompanies().subscribe(companies => {
        companies.forEach((c) => {
          this.companies[c.id] = c
        })
        this.hasCompanies = true
      })
    })
  }

  removeEndpoint = (id: string) => {
    this.endpointService.deleteEndpoint(id).subscribe(e => {
      this.endpoints = this.endpoints.filter(endpoint => { return endpoint.company !== id })
    })
  }

  removeAllEndpoints = () => {
    this.endpoints.forEach(c => {
      this.endpoints = []
      this.endpointService.deleteEndpoint(c.company).subscribe(e => {
        // tslint:disable-next-line:handle-callback-err
      }, (err) => {
        this.endpoints.push(c)
      })
    })
  }
}
