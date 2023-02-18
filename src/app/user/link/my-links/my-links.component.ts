import { Component, OnInit } from '@angular/core'
import { Title } from '@angular/platform-browser'

import { Link, Note, ProcessedLink } from '../link.model'
import { User } from '../../user.model'
import { UserService } from '../../user.service'
import { Company } from '../../../company/company.model'
import { CompanyService } from '../../../company/company.service'
import { CompanyCannonService } from '../../../company/company-cannon.service'
import { EventService } from '../../../events/event.service'

@Component({
  selector: 'app-my-links',
  templateUrl: './my-links.component.html',
  styleUrls: ['./my-links.component.css']
})
export class MyLinksComponent implements OnInit {

  private fetchedUsers: User[]

  me: User
  links: Link[]
  company: Company
  processedLinks: Array<ProcessedLink>
  gotLinks: boolean
  selectedLink: ProcessedLink

  constructor(
    private userService: UserService,
    private companyService: CompanyService,
    private companyCannonService: CompanyCannonService,
    private eventService: EventService,
    private titleService: Title
  ) { }

  ngOnInit() {
    this.processedLinks = []
    this.fetchedUsers = []

    this.eventService.getCurrent().subscribe(event => {
      //this.titleService.setTitle(event.name + ' - My Links')
      this.userService.getMe()
        .subscribe(me => {
          this.me = me
          if(this.me.role === "company"){
            const company = me.company.find(c => {
              return c.edition === event.id
            })

            this.companyService.getCompany(company.company)
            .subscribe(_company => {
              this.company = _company
            })

            this.companyCannonService.getLinks(company.company)
              .subscribe(links => {
                this.links = links
                links.forEach(link => this.processLink(link, "company"))
              })
          }
          else {
            this.userService.getLinks(this.me.id)
              .subscribe(links => {
                this.links = links
                links.forEach(link => this.processLink(link, "attendee"))
              })
          }
        })
    })
  }

  deleteLink(link: ProcessedLink) {
    if (link.author === "company") {
      this.companyCannonService.deleteLink(this.company.id, link.attendee.id).subscribe(() => {
        this.companyCannonService.getLinks(this.company.id)
          .subscribe(links => {
            this.processedLinks = []
            this.links = links
            links.forEach(link => this.processLink(link, "company"))
          })
      })
    }
    else {
      this.userService.deleteLink(this.me.id, link.company.id).subscribe(() => {
        this.userService.getLinks(this.me.id)
          .subscribe(links => {
            this.processedLinks = []
            this.links = links
            links.forEach(link => this.processLink(link, "attendee"))
          })
      })
    }
  }

  editLink(link: ProcessedLink) {
    this.selectedLink = link
  }

  receiveEditedLink(editedLink: ProcessedLink) {
    if(editedLink) {
      this.processedLinks.forEach(link => {
        if(this.selectedLink === link) {
          link = editedLink
        } 
      })
    } 
    
    this.selectedLink = null
  }

  processLink(link: Link, author: string) {
    const filtered = this.fetchedUsers.filter(u => u.id === link.user)
    const savedUser = filtered.length > 0 ? filtered[0] : null

    let processed = new ProcessedLink()

    processed.cv = link.cv
    processed.note = link.notes
    processed.author = link.author
    processed.noteEmpty = (!link.notes.contacts.email &&
      !link.notes.contacts.phone &&
      !link.notes.degree &&
      !link.notes.availability &&
      !link.notes.interestedIn &&
      !link.notes.otherObservations &&
      !link.notes.internships)

    if (savedUser) {
      processed.user = savedUser
      this.fillAttendee(link, processed, author)
    } else {
      this.userService.getUser(link.user).subscribe(
        user => {
          if (user) {
            processed.user = user
            this.fetchedUsers.push(user)
            this.fillAttendee(link, processed, author)
          }
        })
    }
  }

  fillAttendee(link: Link, processed: ProcessedLink, author: string) {
    if (author === "company") {
      this.userService.getUser(link.attendee).subscribe(
        attendee => {
          if (attendee) {
            processed.attendee = attendee
            this.processedLinks.push(processed)
          }
        })
    }
    else {
      this.companyService.getCompany(link.company).subscribe(
        company => {
          if (company) {
            processed.company = company
            this.processedLinks.push(processed)
          }
        })
    }
    
  }
}
