import { Component, OnInit, ViewChild } from '@angular/core'
import { UserService } from '../user.service'
import { User } from '../user.model'
import { Company } from '../../company/company.model'
import { CompanyService } from '../../company/company.service'
import { environment } from '../../../environments/environment.prod'

import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap'
import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject'

import 'rxjs/add/operator/map'
import 'rxjs/add/operator/merge'
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/debounceTime'
import 'rxjs/add/operator/distinctUntilChanged'

@Component({
  selector: 'app-promote',
  templateUrl: './promote.component.html',
  styleUrls: ['./promote.component.css']
})
export class PromoteComponent implements OnInit {

  scannerActive: boolean
  userRead: User
  userReadCompany: Company

  companies: Company[]
  searchedCompany: Company

  constructor (
    private userService: UserService,
    private companyService: CompanyService
  ) { }

  @ViewChild('instance') instance: NgbTypeahead
  focus$ = new Subject<string>()
  click$ = new Subject<string>()

  formatter = (company: Company) => company.name

  search = (text$: Observable<string>) =>
    text$
      .debounceTime(200).distinctUntilChanged()
      .merge(this.focus$)
      .merge(this.click$.filter(() => !this.instance.isPopupOpen()))
      .map(term => (term === '' ? this.companies : this.companies
        .filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1)))

  ngOnInit () {
    this.scannerActive = true
    this.getCompanies()
  }

  reScan () {
    this.userRead = null
    this.scannerActive = true
  }

  processData (id: string) {
    if (!id) return

    this.scannerActive = false

    this.userService.getUser(id)
      .subscribe(user => {
        this.userRead = user
        if (this.companies && user.role === 'company') {
          let userCompany = user.company.find(c => {
            return c.edition === environment.currentEvent
          })

          this.userReadCompany = this.companies.find(c => {
            return c.id === userCompany.company
          })
        }
      })
  }

  getCompanies (): void {
    this.companyService.getCompanies()
      .subscribe(companies => {
        this.companies = companies
      })
  }

  promoteToTeam () {
    if (!this.userRead) return

    this.userService.updateUser(this.userRead.id, 'team')
      .subscribe(user => this.userRead = user)
  }

  promoteToCompany () {
    if (!this.userRead || !this.searchedCompany) return

    this.userService.updateUser(this.userRead.id, 'company', this.searchedCompany.id)
      .subscribe(user => {
        this.userRead = user
        this.userReadCompany = this.searchedCompany
      })
  }

  demoteUser () {
    if (!this.userRead) return

    this.userService.updateUser(this.userRead.id, 'user')
      .subscribe(user => this.userRead = user)
  }

}
