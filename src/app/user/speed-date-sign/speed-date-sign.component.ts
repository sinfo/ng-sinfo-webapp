import { Component, OnInit } from '@angular/core'
import { Title } from '@angular/platform-browser'

import { User } from '../user.model'
import { UserService } from '../user.service'
import { Company } from '../../company/company.model'
import { CompanyService } from '../../company/company.service'
import { EventService } from '../../events/event.service'
import { SignatureService } from '../signature/signature.service'
import { MessageService, Type } from '../../message.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Link, Note } from '../link/link.model'
import { CompanyCannonService } from '../../company/company-cannon.service'




@Component({
  selector: 'app-speed-date-sign',
  templateUrl: './speed-date-sign.component.html',
  styleUrls: ['./speed-date-sign.component.css']
})
export class SpeedDateSignComponent implements OnInit {

  scannerActive: boolean
  title = 'Signature'
  info: string
  cam = false
  userId = ''
  descriptions: string[]
  description: string

  userRead: User
  me: User
  myCompany: Company

  currentLink: Link
  notes: Note
  yesToLink: Boolean
  yesToSign: Boolean

  constructor(
    private titleService: Title,
    private companyService: CompanyService,
    private userService: UserService,
    private signatureService: SignatureService,
    private eventService: EventService,
    private snackBar: MatSnackBar,
    private messageService: MessageService,
    private companyCannonService: CompanyCannonService,


  ) { }

  ngOnInit() {
    this.scannerActive = false
    this.yesToLink = false
    this.yesToSign = false
    this.cam = false
    this.notes = {
      contacts: {
        email: null,
        phone: null
      },
      interestedIn: null,
      otherObservations: null,
      availability: null,
      degree: null,
      //fixme: not used in speed date links (?)
      internships: null
    }

    this.descriptions = [
      'Insert the ID of the attendee in the text box below or scan the QR code by switching input.',
      'Sign a user\'s card after you have interacted with them.'
    ]
    this.description = this.descriptions[0]

    this.eventService.getCurrent().subscribe(event => {
      this.titleService.setTitle(event.name + ' - Speed Date Signature')
      this.userService.getMe()
        .subscribe(user => {
          this.me = user
          let company = user.company.find(c => {
            return c.edition === event.id
          })
          this.companyService.getCompany(company.company)
            .subscribe(_company => {
              this.myCompany = _company
              this.scannerActive = true
            })
        })
    })
  }

  toggleCam() {
    this.cam = !this.cam
  }

  submit() {
    this.userService.getUser(this.userId)
      .subscribe(user => {
        let message = ''
        if (!user) {
          message = 'User ID not found.'
        } else if (user && user.id === this.me.id) {
          message = 'You cannot perform this action on yourself!'
        }

        if (message.length > 0) {
          this.snackBar.open(message, "Ok", {
            panelClass: ['mat-toolbar', 'mat-primary'],
            duration: 2000
          })
          this.messageService.add({
            origin: 'Sign Speed Date',
            showAlert: true,
            text: message,
            type: Type.warning,
            timeout: 2000
          })
          return
        }

        this.userRead = user
        this.description = this.descriptions[1]
        this.receiveUser({user:user, company:null})

      })
  }



  toLink() {
    this.yesToLink = true
    this.info = `Linking ${this.userRead.name} with ${this.myCompany.name}`
  }

  reScan() {
    this.userRead = null
    this.scannerActive = true
    this.userId = ''
    this.yesToLink = false
    this.description = this.descriptions[0]
    this.info = ''
    this.yesToSign = false
  }

  updateInfo() {
    this.info = `Signed speed date ${this.userRead.name}`
    this.signatureService.signSpeed(this.userRead, this.myCompany)
    this.snackBar.open('User was successfully signed!', "Ok", {
      panelClass: ['mat-toolbar', 'mat-primary'],
      duration: 2000
    })
    this.messageService.add({
      origin: 'Sign and Link',
      showAlert: true,
      text: 'User was successfully signed!',
      type: Type.success,
      timeout: 2000
    })
  }

  receiveUser(data:{user:User, company:Company}) {
    this.userRead = data.user
    this.scannerActive = false
    this.companyCannonService.getLink(this.myCompany.id, this.userRead.id)
      .subscribe(_link => {
        this.currentLink = _link
        this.buildNotes(_link)
      })
  }

  signUser() {
    this.yesToSign = true
    this.info = `Signing ${this.userRead.name}'s card.`
    this.updateInfo()
  }

  buildNotes(_link) {
    if (_link) {
      this.notes.contacts.email = _link.notes.contacts.email
      this.notes.contacts.phone = _link.notes.contacts.phone
      this.notes.availability = _link.notes.availability
      this.notes.degree = _link.notes.degree
      this.notes.interestedIn = _link.notes.interestedIn
      this.notes.otherObservations = _link.notes.otherObservations
      return
    }
    this.notes.contacts.email = null
    this.notes.contacts.phone = null
    this.notes.interestedIn = null
    this.notes.degree = null
    this.notes.availability = null
    this.notes.otherObservations = null
  }

  link() {
    if (this.currentLink) {
      this.updateLink()
    } else {
      this.createLink()
      this.snackBar.open('Link created', "Ok", {
        panelClass: ['mat-toolbar', 'mat-primary'],
        duration: 2000
      })
      this.messageService.add({
        origin: 'Link created',
        showAlert: true,
        text: 'Link created',
        type: Type.success,
        timeout: 6000
      })
    }
  }

  createLink() {
    this.companyCannonService.createLink(this.myCompany.id, this.me.id, this.userRead.id, this.notes)
      .subscribe(_link => {
        this.currentLink = _link
      })
  }

  updateLink() {
    this.companyCannonService.updateLink(this.myCompany.id, this.me.id, this.userRead.id, this.notes)
      .subscribe(_link => {
        this.currentLink = _link
        this.snackBar.open('Link updated', "Ok", {
          panelClass: ['mat-toolbar', 'mat-primary'],
          duration: 2000
        })
        this.messageService.add({
          origin: 'Link component',
          showAlert: true,
          text: 'Link updated',
          timeout: 4000,
          type: Type.success
        })
      })
  }

}
