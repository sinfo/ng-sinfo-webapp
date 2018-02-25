import { Component, OnInit } from '@angular/core'
import { UserService } from '../user.service'
import { User } from '../user.model'
import { environment } from '../../../environments/environment'
import { CompanyService } from '../../company/company.service'

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  user: User
  signatures = {
    day: new Date(),
    capacity: environment.signaturesCardCapacity,
    companies: []
  }

  constructor (
    private userService: UserService,
    private companyService: CompanyService
  ) { }

  ngOnInit () {
    this.userService.getMe()
      .subscribe(user => {
        this.user = user
        if (!this.user.signatures) {
          return
        }

        let day = this.signatures.day.getDate().toString()
        let userSignatures = this.user.signatures.find(s => {
          return s.day === day
        })

        console.log('PASSED', userSignatures, day)
        if (!userSignatures) return

        userSignatures.signatures.forEach(company => {
          this.companyService.getCompany(company)
            .subscribe(c => {
              this.signatures.companies.push({
                name: c.name,
                img: c.img
              })
              console.log(this.signatures.companies)
            })
        })
      })
  }

  getArray (n: number): any[] {
    return Array(n)
  }

}
