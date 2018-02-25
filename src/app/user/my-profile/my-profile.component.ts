import { Component, OnInit, NgZone } from '@angular/core'
import { UserService } from '../user.service'
import { User } from '../user.model'
import { environment } from './../../../environments/environment'
import { CompanyService } from '../../company/company.service'

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: [ './my-profile.component.css' ]
})

export class MyProfileComponent implements OnInit {
  user: User
  company: string
  eventOcurring: boolean

  constructor (
    private userService: UserService,
    private companyService: CompanyService
    private zone: NgZone
  ) {
    /**
     *  TODO: To fix the unknown error with Google login
     * (https://github.com/sinfo/ng-sinfo-webapp/issues/62) we need to call getMe()
     * in the constructor this isn't a best practise, change this in the future.
     * Similar problem:
     * https://stackoverflow.com/questions/48876926/ngoninit-function-not-called-after-google-login-in-angular4
     */
    this.zone.run(() => {
      this.userService.getMe()
      .subscribe(user => {
        this.user = user

        // if this user had company role in the previous edition,
        // it will have a user role in the current edition

        if (this.user.role === 'company') {
          let company = this.user.company
          let companyFound = company.find(c => {
            return c.edition === environment.currentEvent
          })

          if (!companyFound) {
            this.userService.demoteSelf()
              .subscribe(newUser => this.user = newUser)
          } else {
            this.companyService.getCompany(companyFound.company)
              .subscribe(c => this.company = c.name)
          }
        }

      })
    })
  }

  ngOnInit () { }
}
