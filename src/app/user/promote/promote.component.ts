import { Component, OnInit } from '@angular/core'
import { UserService } from '../user.service'
import { User } from '../user.model'
import { Company } from '../../company/company.model'
import { CompanyService } from '../../company/company.service'

@Component({
  selector: 'app-promote',
  templateUrl: './promote.component.html',
  styleUrls: ['./promote.component.css']
})
export class PromoteComponent implements OnInit {

  id: string
  active: boolean
  userRead: User
  companies: Company[]
  company: string

  constructor (
    private userService: UserService,
    private companyService: CompanyService
  ) { }

  ngOnInit () {
    this.active = true
    this.getCompanies()
    this.company = 'OLHA PARA MIM'
  }

  processData (data: string) {
    if (!this.id) {
      this.id = data
      this.active = false
    }

    this.userService.getUser(this.id)
      .subscribe(user => this.userRead = user)
  }

  getCompanies (): void {
    this.companyService.getCompanies()
      .subscribe(companies => this.companies = companies)
  }

  promoteToTeam () {
    if (!this.userRead) {
      return
    }

    this.userService.updateUser(this.userRead.id, 'team')
      .subscribe(user => this.userRead = user)
  }

  promoteToCompany (company: string) {
    if (!this.userRead) {
      return
    }

    this.userService.updateUser(this.userRead.id, 'company', company)
      .subscribe(user => this.userRead = user)
  }

  demoteUser () {
    if (!this.userRead) {
      return
    }

    this.userService.updateUser(this.userRead.id, 'user')
      .subscribe(user => this.userRead = user)
  }

}
