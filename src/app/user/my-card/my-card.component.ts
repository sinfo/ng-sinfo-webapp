import { Component, OnInit } from '@angular/core'
import { Title } from '@angular/platform-browser'

import { UserService } from '../user.service'
import { User } from '../user.model'
import { environment } from '../../../environments/environment'
import { CompanyService } from '../../company/company.service'
import { EventService } from '../../events/event.service'

@Component({
  selector: 'app-card',
  templateUrl: './my-card.component.html',
  styleUrls: ['./my-card.component.css']
})
export class MyCardComponent implements OnInit {

  user: User
  signatures = {
    day: new Date(),
    capacity: environment.signaturesCardCapacity,
    companies: []
  }
  //TODO: Put here the correct type (Signature[] does not work)
  userSignatures: any
  numSignatures: Number

  constructor(
    private userService: UserService,
    private companyService: CompanyService,
    private eventService: EventService,
    private titleService: Title
  ) { }

  ngOnInit() {
    this.eventService.getCurrent().subscribe(event => {
      this.titleService.setTitle(event.name + ' - Card')

      this.userService.getMe(true).subscribe(user => {
        this.user = user

        if (!this.user.signatures) {
          return
        }

        let day = this.signatures.day.getDate().toString()
        this.userSignatures = this.user.signatures.find(s => {
          return s.day === day && s.edition === event.id
        })

        if (this.userSignatures) {
          this.userSignatures.signatures.sort((a, b) => { return b.date.valueOf() - a.date.valueOf() })
          // userSignatures.signatures = userSignatures.signatures.slice(0, this.signatures.capacity)
          // userSignatures.signatures = [{ companyId:"optimus", date: new Date()}, { companyId:"optimus", date: new Date()}, { companyId:"optimus", date: new Date()}, { companyId:"optimus", date: new Date()}, { companyId:"optimus", date: new Date()}, { companyId:"optimus", date: new Date()}]
  
          this.numSignatures = this.userSignatures.signatures.length
  
          this.userSignatures.signatures.forEach(signature => {
            this.companyService.getCompany(signature.companyId)
              .subscribe(c => {
                if (c) {
                  this.signatures.companies.push({
                    name: c.name,
                    img: c.img
                  })
                }
              })
          })
        }

      })
    })

  }

  getArray(n: number): any[] {
    return Array(n)
  }

}
