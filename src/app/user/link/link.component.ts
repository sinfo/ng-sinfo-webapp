import { Component, OnInit } from '@angular/core'
import { Title } from '@angular/platform-browser'

import { UserService } from '../user.service'
import { User } from '../user.model'
import { Company } from '../../company/company.model'
import { CompanyService } from '../../company/company.service'
import { Link, Note } from './link.model'
import { MessageService, Type } from '../../message.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { CompanyCannonService } from '../../company/company-cannon.service'
import { SignatureService } from '../signature/signature.service'
import { EventService } from '../../events/event.service'

@Component({
  selector: 'MessageServiceapp-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.css']
})
export class LinkComponent implements OnInit {

  author: string
  linkReady: boolean
  eventId: string

  scannerActive: boolean
  title = 'Sign and Link'
  description: string
  info: string
  descriptions: string[]

  userRead: User
  company: Company
  me: User
  currentLink: Link
  notes: Note
  yesToLink: Boolean
  yesToSign: Boolean
  cam: Boolean
  userId: string = ''

  constructor(
    private userService: UserService,
    private companyService: CompanyService,
    private companyCannonService: CompanyCannonService,
    private signatureService: SignatureService,
    private messageService: MessageService,
    private snackBar: MatSnackBar,
    private eventService: EventService,
    private titleService: Title
  ) { }

  ngOnInit() {
    this.scannerActive = false
    this.yesToLink = false
    this.cam = false
    this.notes = {
      contacts: {
        email: null,
        phone: null
      },
      interestedIn: null,
      otherObservations: null,
      availability: null,
      degree: null
    }
    this.descriptions = [
      'Insert the ID of the attendee in the text box below or scan the QR code by switching input.',
      'Sign a user\'s card after you have interacted with them.'
    ]
    this.description = this.descriptions[0]

    this.eventService.getCurrent().subscribe(event => {
      this.eventId = event.id
      this.titleService.setTitle(event.name + ' - Links')
      this.userService.getMe()
        .subscribe(user => {
          this.me = user
          if (user.role === 'company'){
            this.author = 'company'

            let company = user.company.find(c => {
              return c.edition === event.id
            })
  
            if (!company) return
  
            this.companyService.getCompany(company.company)
              .subscribe(_company => {
                this.company = _company
                this.scannerActive = true
                this.linkReady = true
              })
          }

          else {
            this.author = 'attendee'
            this.scannerActive = true
            this.linkReady = true
          }
        })
    })
  }

  toggleCam() {
    this.cam = !this.cam
  }

  signUser() {
    this.yesToSign = true
    this.info = `Signing ${this.userRead.name}'s card.`
    this.updateInfo()
  }

  toLink() {
    this.yesToLink = true
    this.info = `Linking ${this.userRead.name} with ${this.company.name}`
    this.description = this.info
  }

  reScan() {
    this.userRead = null
    this.userId = ''
    this.yesToLink = false
    this.description = this.descriptions[0]
    this.info = ''
    this.yesToSign = false
    this.scannerActive = true
  }

  updateInfo() {
    this.info = `Signed ${this.userRead.name}`
    this.signatureService.checkSignature(this.userRead, this.company)
    this.snackBar.open('User was successfully signed!', "Ok", {
      panelClass: ['mat-toolbar', 'mat-primary'],
      duration: 2000
    })
    // this.messageService.add({
    //   origin: 'Sign and Link',
    //   showAlert: true,
    //   text: 'User was successfully signed!',
    //   type: Type.success,
    //   timeout: 2000
    // })
  }

  receiveUser(user: User) {
    this.userRead = user
    this.scannerActive = false
    if (this.me.role === 'company') {
      this.companyCannonService.getLink(this.company.id, this.userRead.id)
      .subscribe(_link => {
        if (_link) {
          this.currentLink = _link
        }
        this.buildNotes(_link)
      })
    }
    else {
      //FIXME use output of qrcode reader to get company
      let company = this.userRead.company.find(c => c.edition === this.eventId)

      if (!company) return

      this.companyService.getCompany(company.company)
        .subscribe(_company => {
          this.company = _company
          console.log(_company)
        })
      
      this.userService.getLink(this.me.id, company.company)
        .subscribe(_link => {
          if (_link) {
            this.currentLink = _link
          }
          this.buildNotes(_link)
        })
    }
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
    if (this.me.role === 'company') {
      this.companyCannonService.createLink(this.company.id, this.me.id, this.userRead.id, this.notes)
      .subscribe(_link => {
        if (_link) {
          this.currentLink = _link
          this.snackBar.open('Link created', "Ok", {
            panelClass: ['mat-toolbar', 'mat-primary'],
            duration: 2000
          })
        } else {
          this.snackBar.open('Error creating link', "Ok", {
            panelClass: ['mat-toolbar', 'mat-primary'],
            duration: 2000
          })
        }
      })
    }
    else{
      this.userService.createLink(this.me.id, this.company.id, this.userRead.id, this.notes)
      .subscribe(_link => {
        if (_link) {
          this.currentLink = _link
          this.snackBar.open('Link created', "Ok", {
            panelClass: ['mat-toolbar', 'mat-primary'],
            duration: 2000
          })
        } else {
          this.snackBar.open('Error creating link', "Ok", {
            panelClass: ['mat-toolbar', 'mat-primary'],
            duration: 2000
          })
        }
      })
    }
    
  }

  updateLink() {
    if (this.me.role === 'company') {
      this.companyCannonService.updateLink(this.company.id, this.me.id, this.userRead.id, this.notes)
      .subscribe(_link => {
        if (_link) {
          this.currentLink = _link
          this.snackBar.open('Link updated', "Ok", {
            panelClass: ['mat-toolbar', 'mat-primary'],
            duration: 2000
          })
        } else {
          this.snackBar.open('Error updating link', "Ok", {
            panelClass: ['mat-toolbar', 'mat-primary'],
            duration: 2000
          })
        }
        // this.messageService.add({
        //   origin: 'Link component',
        //   showAlert: true,
        //   text: 'Link updated',
        //   timeout: 4000,
        //   type: Type.success
        // })
      })
    }
    else {
      this.userService.updateLink(this.me.id, this.company.id, this.userRead.id, this.notes)
      .subscribe(_link => {
        if (_link) {
          this.currentLink = _link
          this.snackBar.open('Link updated', "Ok", {
            panelClass: ['mat-toolbar', 'mat-primary'],
            duration: 2000
          })
        } else {
          this.snackBar.open('Error updating link', "Ok", {
            panelClass: ['mat-toolbar', 'mat-primary'],
            duration: 2000
          })
        }
      })
    }
    
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
          // this.messageService.add({
          //   origin: 'Sign and Link',
          //   showAlert: true,
          //   text: message,
          //   type: Type.warning,
          //   timeout: 2000
          // })
          return
        }

        this.userRead = user
        this.description = this.descriptions[1]
        this.receiveUser(user)
      })
  }

}
