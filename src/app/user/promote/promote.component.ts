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

  private id: string
  private scannerActive: boolean
  private userRead: User

  private companies: string[]
  private company: string
  private searchedCompany: string

  constructor (
    private userService: UserService,
    private companyService: CompanyService
  ) { }

  @ViewChild('instance') instance: NgbTypeahead
  focus$ = new Subject<string>()
  click$ = new Subject<string>()

  search = (text$: Observable<string>) =>
    text$
      .debounceTime(200).distinctUntilChanged()
      .merge(this.focus$)
      .merge(this.click$.filter(() => !this.instance.isPopupOpen()))
      .map(term => (term === '' ? this.companies : this.companies
        .filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)))

  ngOnInit () {
    this.scannerActive = true
    this.getCompanies()
  }

  reScan () {
    this.userRead = null
    this.id = null
    this.scannerActive = true
  }

  processData (data: string) {
    if (!this.id) {
      this.id = data
      this.scannerActive = false
    }

    this.userService.getUser(this.id)
      .subscribe(user => {
        this.userRead = user
        if (user.role !== 'company') {
          return
        }

        for (let i = 0; i < user.company.length; i++) {
          if (user.company[i].edition === environment.currentEvent) {
            this.company = user.company[i].edition
            break
          }
        }
      })
  }

  getCompanies (): void {
    this.companyService.getCompanies()
      .subscribe(companies => {
        this.companies = companies.map(e => e.name)
      })
  }

  promoteToTeam () {
    if (!this.userRead) {
      return
    }

    this.userService.updateUser(this.userRead.id, 'team')
      .subscribe(user => this.userRead = user)
  }

  promoteToCompany () {
    if (!this.userRead || !this.searchedCompany) {
      return
    }

    this.userService.updateUser(this.userRead.id, 'company', this.searchedCompany)
      .subscribe(user => {
        this.userRead = user
        this.company = this.searchedCompany
      })
  }

  demoteUser () {
    if (!this.userRead) {
      return
    }

    this.userService.updateUser(this.userRead.id, 'user')
      .subscribe(user => this.userRead = user)
  }

}
