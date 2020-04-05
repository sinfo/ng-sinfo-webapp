import { Component, OnInit, ViewChild } from '@angular/core'
import { Title } from '@angular/platform-browser'

import { EventService } from '../../../events/event.service'
import { UserService } from '../../user.service'
import { User } from '../../user.model'
import { Company } from '../../../company/company.model'
import { CompanyService } from '../../../company/company.service'
import { EndpointService } from '../../../endpoints/endpoint.service'
import { Router } from '@angular/router'
import { NgbTypeahead, NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap'
import { Observable, Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged, merge, filter, map } from 'rxjs/operators'

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
  selectedCompanies: Company[] = []
  selectAllCompanies = false
  me: User
  hoveredDate: NgbDateStruct
  fromDate: NgbDateStruct
  toDate: NgbDateStruct
  loading = false

  constructor(
    private eventService: EventService,
    private userService: UserService,
    private companyService: CompanyService,
    private calendar: NgbCalendar,
    private enpointService: EndpointService,
    private router: Router,
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

  onDateChange(date: NgbDateStruct) {
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

  ngOnInit() {
    this.eventService.getCurrent().subscribe(event => {
      this.titleService.setTitle(event.name + ' - Manage Downloads')
    })

    this.userService.getMe()
      .subscribe(me => {
        this.me = me
        this.getCompanies()
      })
  }

  getCompanies(): void {
    this.companyService.getCompanies()
      .subscribe(companies => {
        this.companies = companies
      })
  }

  selectedItem($event) {
    $event.preventDefault()
    if (!~this.selectedCompanies.indexOf($event.item)) {
      this.selectedCompanies.push($event.item)
    }
  }

  removeSelected(c: Company) {
    this.selectedCompanies = this.selectedCompanies.filter(company => { return company.id !== c.id })
  }

  createEndpoints(): void {
    if (!this.fromDate || !this.toDate) {
      return
    }

    this.loading = true

    let _companies = []
    _companies = this.selectAllCompanies ? this.companies : this.selectedCompanies
    _companies = _companies.map(c => { return c.id })

    this.enpointService.createEndpoints(
      _companies,
      new Date(this.fromDate.year, this.fromDate.month - 1, this.fromDate.day),
      new Date(this.toDate.year, this.toDate.month - 1, this.toDate.day, 23, 59, 59)
    ).subscribe(endpoints => {
      this.loading = false
      this.router.navigate(['/user/downloads/status'])
    }, () => {
      this.loading = false
    })
  }
}
