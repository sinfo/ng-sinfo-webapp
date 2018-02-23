import { Component, OnInit } from '@angular/core'
import { UserService } from '../user.service'
import { User } from '../user.model'
import { Company } from '../../company/company.model'
import { CompanyService } from '../../company/company.service'
import { environment } from '../../../environments/environment.prod'
import { Link } from './link.model'
import { MessageService, Type } from '../../message.service'
import { CompanyCannonService } from '../../company/company-cannon.service'

@Component({
  selector: 'app-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.css']
})
export class LinkComponent implements OnInit {

  scannerActive: boolean
  title = 'Link'
  info: string

  userRead: User
  company: Company
  me: User
  currentLink: Link
  notes: string

  constructor (
    private userService: UserService,
    private companyService: CompanyService,
    private companyCannonService: CompanyCannonService,
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

  updateInfo () {
    this.info = `Linked with ${this.company.name}`
  }

  receiveUser (user: User) {
    this.userRead = user
    this.scannerActive = false
    this.companyCannonService.getLink(this.company.id, this.userRead.id)
      .subscribe(_link => {
        this.currentLink = _link
        this.notes = _link ? _link.note : null
        if (_link) this.updateInfo()
      })
  }

  link () {
    this.currentLink ? this.updateLink() : this.createLink()
  }

  createLink () {
    this.companyCannonService.createLink(this.company.id, this.me.id, this.userRead.id, this.notes)
      .subscribe(_link => {
        this.currentLink = _link
        this.updateInfo()
      })
  }

  updateLink () {
    this.companyCannonService.updateLink(this.company.id, this.me.id, this.userRead.id, this.notes)
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
    this.companyCannonService.deleteLink(this.company.id, this.userRead.id)
      .subscribe(_link => {
        this.currentLink = null
        this.info = ''
        this.notes = null
      })
  }

}
