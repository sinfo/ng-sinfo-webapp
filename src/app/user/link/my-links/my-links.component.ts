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
      this.titleService.setTitle(event.name + ' - My Links')
      this.userService.getMe()
        .subscribe(me => {
          this.me = me
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
              links.forEach(link => this.processLink(link))
            })
        })
    })
  }

  deleteLink(id: string) {
    this.companyCannonService.deleteLink(this.company.id, id).subscribe(() => {
      this.companyCannonService.getLinks(this.company.id)
        .subscribe(links => {
          this.processedLinks = []
          this.links = links
          links.forEach(link => this.processLink(link))
        })
    })
  }

  processLink(link: Link) {
    const filtered = this.fetchedUsers.filter(u => u.id === link.user)
    const savedUser = filtered.length > 0 ? filtered[0] : null

    let processed = new ProcessedLink()

    processed.cv = link.cv
    processed.note = link.notes
    processed.noteEmpty = (!link.notes.contacts.email &&
      !link.notes.contacts.phone &&
      !link.notes.degree &&
      !link.notes.availability &&
      !link.notes.interestedIn &&
      !link.notes.otherObservations)

    if (savedUser) {
      processed.user = savedUser
      this.fillAttendee(link, processed)
    } else {
      this.userService.getUser(link.user).subscribe(
        user => {
          if (user) {
            processed.user = user
            this.fetchedUsers.push(user)
            this.fillAttendee(link, processed)
          }
        })
    }
  }

  fillAttendee(link: Link, processed: ProcessedLink) {
    this.userService.getUser(link.attendee).subscribe(
      attendee => {
        if (attendee) {
          processed.attendee = attendee
          this.processedLinks.push(processed)
        }
      })
  }
}
