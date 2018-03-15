import { Component, OnInit, ViewChild } from '@angular/core'
import { UserService } from '../../user.service'
import { User } from '../../user.model'
import { Company } from '../../../company/company.model'
import { CompanyService } from '../../../company/company.service'
import { environment } from '../../../../environments/environment'

import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap'
import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject'

import 'rxjs/add/operator/map'
import 'rxjs/add/operator/merge'
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/debounceTime'
import 'rxjs/add/operator/distinctUntilChanged'
import 'rxjs/add/operator/do'

@Component({
  selector: 'app-manage-downloads',
  templateUrl: './manage-downloads.component.html',
  styleUrls: ['./manage-downloads.component.css']
})
export class ManageDownloadsComponent implements OnInit {

  companies: Company[]
  searchedCompany: Company
  me: User

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

  validCompany (): boolean {
    if (!this.companies || !this.searchedCompany) return false
    return this.companies.find(c => {
      return c.id === this.searchedCompany.id
    }) !== undefined
  }

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
}
