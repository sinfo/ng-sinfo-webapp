import { Component, OnInit } from '@angular/core'
import { Title } from '@angular/platform-browser'

import { UserService } from '../user.service'
import { User } from '../user.model'
import { Company } from '../../company/company.model'
import { CompanyService } from '../../company/company.service'
import { Link, Note } from './link.model'
import { MessageService, Type } from '../../message.service'
import { CompanyCannonService } from '../../company/company-cannon.service'
import { SignatureService } from '../signature/signature.service'
import { EventService } from '../../events/event.service'

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
  notes: Note


  constructor(
    private userService: UserService,
    private companyService: CompanyService,
    private companyCannonService: CompanyCannonService,
    private signatureService: SignatureService,
    private messageService: MessageService,
    private eventService: EventService,
    private titleService: Title
  ) { }

  ngOnInit() {
    this.scannerActive = false
    this.notes = {
      contacts: {
        email: null,
        phone: null
      },
      interestedIn: null,
      otherObservations: null,
      avaliability: null,
      degree: null
    }
    this.eventService.getCurrent().subscribe(event => {
      this.titleService.setTitle(event.name + ' - Links')
      this.userService.getMe()
        .subscribe(user => {
          this.me = user
          if (user.role !== 'company') return

          let company = user.company.find(c => {
            return c.edition === event.id
          })

          if (!company) return

          this.companyService.getCompany(company.company)
            .subscribe(_company => {
              this.company = _company
              this.scannerActive = true
            })
        })
    })
  }

  reScan() {
    this.userRead = null
    this.scannerActive = true
  }

  updateInfo() {
    this.info = `Linked with ${this.company.name}`
    this.signatureService.checkSignature(this.userRead, this.company)
  }

  receiveUser(user: User) {
    this.userRead = user
    this.scannerActive = false
    this.companyCannonService.getLink(this.company.id, this.userRead.id)
      .subscribe(_link => {
        this.currentLink = _link
        this.buildNotes(_link)
        if (_link) this.updateInfo()
      })
  }

  buildNotes(_link) {
    if (_link) {
      console.log(_link)
      this.notes.contacts = _link.contacts
      this.notes.avaliability = _link.avaliability
      this.notes.degree = _link.degree
      this.notes.interestedIn = _link.interestedIn
      this.notes.otherObservations = _link.otherObservations
    }
    this.notes.contacts.email = null
    this.notes.contacts.phone = null
    this.notes.interestedIn = null
    this.notes.degree = null
    this.notes.avaliability = null
    this.notes.otherObservations = null
  }

  link() {
    this.currentLink ? this.updateLink() : this.createLink()
  }

  createLink() {
    this.companyCannonService.createLink(this.company.id, this.me.id, this.userRead.id, this.notes)
      .subscribe(_link => {
        this.currentLink = _link
        this.updateInfo()
      })
  }

  updateLink() {
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

  deleteLink() {
    this.companyCannonService.deleteLink(this.company.id, this.userRead.id)
      .subscribe(_link => {
        this.currentLink = null
        this.info = ''
        this.notes = null
      })
  }

}
