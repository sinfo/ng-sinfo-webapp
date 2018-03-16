import { Component, OnInit, ViewChild } from '@angular/core'
import { UserService } from '../../user.service'
import { User } from '../../user.model'
import { Company } from '../../../company/company.model'
import { CompanyService } from '../../../company/company.service'
import { environment } from '../../../../environments/environment'
import { EndpointService } from '../../../endpoints/endpoint.service'
import { Router } from '@angular/router'
import { NgbTypeahead, NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap'
import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject'

import 'rxjs/add/operator/map'
import 'rxjs/add/operator/merge'
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/debounceTime'
import 'rxjs/add/operator/distinctUntilChanged'
import 'rxjs/add/operator/do'

const equals = (one: NgbDateStruct, two: NgbDateStruct) =>
  one && two && two.year === one.year && two.month === one.month && two.day === one.day

const before = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
    ? false : one.day < two.day : one.month < two.month : one.year < two.year

const after = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
    ? false : one.day > two.day : one.month > two.month : one.year > two.year

@Component({
  selector: 'app-manage-downloads',
  templateUrl: './manage-downloads.component.html',
  styleUrls: ['./manage-downloads.component.css']
})

export class ManageDownloadsComponent implements OnInit {

  companies: Company[]
  searchedCompany: Company
  allCompanies = true
  me: User
  hoveredDate: NgbDateStruct
  fromDate: NgbDateStruct
  toDate: NgbDateStruct
  loading = false

  constructor (
    private userService: UserService,
    private companyService: CompanyService,
    private calendar: NgbCalendar,
    private enpointService: EndpointService,
    private router: Router
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

  validCompany (): boolean {
    if (!this.companies || !this.searchedCompany) return false
    return this.companies.find(c => {
      return c.id === this.searchedCompany.id
    }) !== undefined
  }

  onDateChange (date: NgbDateStruct) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date
    } else if (this.fromDate && !this.toDate && after(date, this.fromDate)) {
      this.toDate = date
    } else {
      this.toDate = null
      this.fromDate = date
    }
  }

  isHovered = date => this.fromDate && !this.toDate && this.hoveredDate && after(date, this.fromDate) && before(date, this.hoveredDate)
  isInside = date => after(date, this.fromDate) && before(date, this.toDate)
  isFrom = date => equals(date, this.fromDate)
  isTo = date => equals(date, this.toDate)

  ngOnInit () {
    this.userService.getMe()
      .subscribe(me => {
        this.me = me
        this.getCompanies()
      })
  }

  getCompanies (): void {
    this.companyService.getCompanies()
      .subscribe(companies => {
        this.companies = companies
      })
  }

  createEndpoints (): void {
    this.loading = true
    let companies = []
    if (this.allCompanies) {
      companies = this.companies && this.companies.map(c => { return c.id })
    }
    console.log(companies, new Date(this.fromDate.year, this.fromDate.month - 1, this.fromDate.day), this.toDate)
    this.enpointService.createEndpoints(
      companies,
      new Date(this.fromDate.year, this.fromDate.month - 1, this.fromDate.day),
      new Date(this.toDate.year, this.toDate.month - 1, this.toDate.day, 23, 59, 59)
     ).subscribe(endpoints => {
       console.log(endpoints)
       this.loading = false
       this.router.navigate(['/downloads/status'])
     // tslint:disable-next-line:handle-callback-err
     }, err => {
       this.loading = false
     })
  }
}
