import { Component, OnInit, ViewChild } from '@angular/core'
import { Title } from '@angular/platform-browser'

import { UserService } from '../user.service'
import { User } from '../user.model'
import { Company } from '../../company/company.model'
import { CompanyService } from '../../company/company.service'
import { EventService } from '../../events/event.service'

import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap'
import { Observable, Subject } from 'rxjs'
import { debounceTime, merge, filter, map, distinctUntilChanged } from 'rxjs/operators'

@Component({
  selector: 'app-promote',
  templateUrl: './promote.component.html',
  styleUrls: ['./promote.component.css']
})
export class PromoteComponent implements OnInit {

  scannerActive: boolean
  title = 'Promote'
  info: string

  userRead: User
  userReadCompany: Company

  companies: Company[]
  searchedCompany: Company

  me: User

  constructor (
    private userService: UserService,
    private companyService: CompanyService,
    private eventService: EventService,
    private titleService: Title
  ) { }

  @ViewChild('instance', { static: false }) instance: NgbTypeahead
  focus$ = new Subject<string>()
  click$ = new Subject<string>()

  formatter = (company: Company) => company.name

  search = (text$: Observable<string>) =>
    text$
      .pipe(debounceTime(200)).pipe(distinctUntilChanged())
      .pipe(merge(this.focus$))
      .pipe(merge(this.click$.pipe(filter(() => !this.instance.isPopupOpen()))))
      .pipe(map(term => (term === '' ? this.companies : this.companies
        .filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1))))

  validCompany (): boolean {
    if (!this.companies || !this.searchedCompany) return false
    return this.companies.find(c => {
      return c.id === this.searchedCompany.id
    }) !== undefined
  }

  ngOnInit () {
    this.eventService.getCurrent().subscribe(event => {
      this.titleService.setTitle(event.name + ' - Promote')
    })

    this.scannerActive = true
    this.userService.getMe()
      .subscribe(me => {
        this.me = me
        this.getCompanies()
      })
  }

  reScan () {
    this.userRead = null
    this.scannerActive = true
  }

  updateInfo (user: User, userCompany?: Company) {
    let info = ''

    if (userCompany) {
      info = userCompany.name
    } else if (user.role === 'team') {
      info = user.role
    }

    this.info = info
  }

  receiveUser (user: User) {
    this.userRead = user
    this.scannerActive = false
    this.updateInfo(user)

    if (!this.companies || user.role !== 'company') {
      this.updateInfo(user)
      return
    }
    this.eventService.getCurrent().subscribe(event => {
      let userCompany = user.company.find(c => {
        return c.edition === event.id
      })

      if (!userCompany) {
        this.updateInfo(user)
        return
      }

      this.userReadCompany = this.companies.find(c => {
        return c.id === userCompany.company
      })

      this.updateInfo(user, this.userReadCompany)
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
      .subscribe(user => {
        this.userRead = user
        this.userReadCompany = undefined
        this.updateInfo(user)
      })
  }

  promoteToCompany () {
    if (!this.userRead || !this.searchedCompany) return

    this.userService.updateUser(this.userRead.id, 'company', this.searchedCompany.id)
      .subscribe(user => {
        this.userRead = user
        this.userReadCompany = this.searchedCompany
        this.updateInfo(user, this.userReadCompany)
      })
  }

  demoteUser () {
    if (!this.userRead) return

    this.userService.updateUser(this.userRead.id, 'user')
      .subscribe(user => {
        this.userRead = user
        this.userReadCompany = undefined
        this.updateInfo(user)
      })
  }

}
