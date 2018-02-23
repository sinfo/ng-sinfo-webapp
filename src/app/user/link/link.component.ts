import { Component, OnInit } from '@angular/core'
import { UserService } from '../user.service'
import { User } from '../user.model'
import { Company } from '../../company/company.model'
import { CompanyService } from '../../company/company.service'
import { environment } from '../../../environments/environment'
import { LinkService } from './link.service'
import { Link } from './link.model'
import { MessageService, Type } from '../../message.service'

@Component({
  selector: 'app-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.css']
})
export class LinkComponent implements OnInit {

  scannerActive: boolean
  userRead: User
  company: Company
  me: User
  currentLink: Link

  notes: string

  constructor (
    private userService: UserService,
    private companyService: CompanyService,
    private linkService: LinkService,
    private messageService: MessageService
  ) { }

  ngOnInit () {
    this.scannerActive = true
    this.notes = ''
    this.userService.getMe()
      .subscribe(user => {
        this.me = user
        if (user.role !== 'company') return

        let company = user.company.find(c => {
          return c.edition === environment.currentEvent
        })

        if (!company) return

        this.companyService.getCompany(company.company)
          .subscribe(_company => this.company = _company)
      })
  }

  reScan () {
    this.userRead = null
    this.scannerActive = true
  }

  processData (id: string) {
    this.scannerActive = false
    this.userService.getUser(id)
      .subscribe(user => {
        this.userRead = user
        this.linkService.getLink(this.company.id, this.userRead.id)
          .subscribe(_link => {
            this.currentLink = _link
            this.notes = _link ? _link.note : null
          })
      })
  }

  link () {
    this.currentLink ? this.updateLink() : this.createLink()
  }

  createLink () {
    this.linkService.createLink(this.company.id, this.me.id, this.userRead.id, this.notes)
      .subscribe(_link => {
        this.currentLink = _link
      })
  }

  updateLink () {
    this.linkService.updateLink(this.company.id, this.me.id, this.userRead.id, this.notes)
      .subscribe(_link => {
        this.currentLink = _link
        this.messageService.add({
          origin: 'Link component',
          showAlert: true,
          text: 'Link updated',
          timeout: 4000,
          type: Type.success
        })
      })
  }

  deleteLink () {
    this.linkService.deleteLink(this.company.id, this.userRead.id)
      .subscribe(_link => {
        this.currentLink = null
        this.notes = null
      })
  }

}
