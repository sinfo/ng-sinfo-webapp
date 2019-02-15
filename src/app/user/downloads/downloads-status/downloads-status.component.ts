import { Component, OnInit } from '@angular/core'
import { Router, Params, RouterStateSnapshot } from '@angular/router'
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
    private endpointService: EndpointService,
    private router: Router,
    private companyService: CompanyService,
    private userService: UserService
  ) { }

  ngOnInit () {
    this.userService.getMe().subscribe(user => {
      this.me = user

      console.log('status', user.role)

      if (user.role !== 'team') {
        this.router.navigate(['/qrcode'])
      }

      console.log('status')

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
