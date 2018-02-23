import { Component, OnInit } from '@angular/core'
import { Link } from '../link.model'
import { User } from '../../user.model'
import { UserService } from '../../user.service'
import { Company } from '../../../company/company.model'
import { CompanyService } from '../../../company/company.service'
import { environment } from '../../../../environments/environment'
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap'
import { CompanyCannonService } from '../../../company/company-cannon.service'

@Component({
  selector: 'app-my-links',
  templateUrl: './my-links.component.html',
  styleUrls: ['./my-links.component.css']
})
export class MyLinksComponent implements OnInit {

  me: User
  links: Link[]
  company: Company
  processedLinks: Array<{
    attendee: User
    user: User
    note: string
  }>

  constructor (
    private userService: UserService,
    private companyService: CompanyService,
    private companyCannonService: CompanyCannonService
  ) { }

  ngOnInit () {
    this.processedLinks = []
    this.userService.getMe()
      .subscribe(me => {
        this.me = me
        const company = me.company.find(c => {
          return c.edition === environment.currentEvent
        })

        this.companyService.getCompany(company.company)
          .subscribe(_company => this.company = _company)

        this.companyCannonService.getLinks(company.company)
          .subscribe(links => {
            this.links = links
            links.forEach(link => this.processLink(link))
          })
      })
  }

  processLink (link: Link) {
    this.userService.getUser(link.attendee)
      .subscribe(attendee => {
        this.userService.getUser(link.user)
          .subscribe(user => {
            this.processedLinks.push({
              attendee: attendee,
              user: user,
              note: link.note
            })
            console.log(attendee)
          })
      })
  }

}
