import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Title } from '@angular/platform-browser'

import { UserService } from '../user.service'
import { User } from '../user.model'
import { Event } from '../../events/event.model'
import { environment } from '../../../environments/environment'
import { CompanyService } from '../../company/company.service'
import { EventService } from '../../events/event.service'

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  user: User
  event: Event
  capacity = environment.signaturesCardCapacity
  autoUpdatePeriod = environment.signaturesAutoUpdate
  day= new Date()
  companies = []
  companiesReady = false
  userSignatures: {
    companyId: string,
    date: Date
  }[]

  constructor (
    private router: Router,
    private userService: UserService,
    private companyService: CompanyService,
    private eventService: EventService,
    private titleService: Title
  ) { 
  }
  ngOnInit () {
    if (this.autoUpdatePeriod) {
      setInterval(()=>{
        if (this.router.routerState.snapshot.url === "/user/card"){
          this.refreshCompanies()
        }
      }, this.autoUpdatePeriod * 1000)
    }
    
    this.eventService.getCurrent().subscribe(event => {
      this.event = event
      this.titleService.setTitle(event.name + ' - Card')

      this.userService.getMe().subscribe(user => {
        this.user = user

        if (!this.user.signatures) {
          this.companiesReady = true
          return
        }

        let day = this.day.getDate().toString()
        this.userSignatures = (this.user.signatures.find(s => {
          return s.day === day && s.edition === this.event.id
        }) || {signatures: [] }).signatures

        if (this.userSignatures.length == 0) {
          this.companiesReady = true
          return
        }
        this.userSignatures.sort((a,b) => {return b.date.valueOf() - a.date.valueOf()})
        this.userSignatures = this.userSignatures.slice(0, this.capacity)

        this.userSignatures.forEach((signature) => {
          this.companyService.getCompany(signature.companyId)
          .subscribe(c => {
              this.companies.push({
                name: signature.companyId,
                img: c.img,
                signatureDate: signature.date,
                howLongAgo: this.formatDuration((new Date().valueOf() - new Date(signature.date).valueOf())/1000)
              })
              this.companiesReady = this.companies.every((c) => {return c.img})
              if (this.companiesReady) {
                this.companies.sort((a,b) => {return b.signatureDate.valueOf() - a.signatureDate.valueOf()})
              }
          })
        })

        
      })
    })

  }
  
  refreshCompanies () {
    console.log("Refreshed")
    this.userService.getMe().subscribe(user => {
      this.user = user

      if (!this.user.signatures) {
        return
      }

      let day = this.day.getDate().toString()
      this.userSignatures = (this.user.signatures.find(s => {
        return s.day === day && s.edition === this.event.id
      }) || {signatures: [] }).signatures

      
      this.userSignatures.sort((a,b) => {return b.date.valueOf() - a.date.valueOf()})
      this.userSignatures = this.userSignatures.slice(0, this.capacity)

      this.userSignatures.forEach((signature) => {
        if (this.companies.every((company) => {
          return company.name != signature.companyId
        })) {
          this.companyService.getCompany(signature.companyId)
            .subscribe(c => {
                this.companies.push({
                  name: signature.companyId,
                  img: c.img,
                  signatureDate: signature.date,
                  howLongAgo: this.formatDuration((new Date().valueOf() - new Date(signature.date).valueOf())/1000)
                })
                this.companies.sort((a,b) => {return b.signatureDate.valueOf() - a.signatureDate.valueOf()})

          })
        }
      })
    })
  }

  formatDuration (seconds) {
    var numYears = Math.floor(seconds / (86400 * 365));
    var numDays = Math.floor(seconds % (86400 * 365) / 86400);
    var numHours = Math.floor(((seconds % (86400 * 365)) % 86400) / 3600);
    var numMinutes = Math.floor((((seconds % (86400 * 365)) % 86400) % 3600) / 60);
    var numSeconds = Math.floor((((seconds % (86400 * 365)) % 86400) % 3600) % 60);

    var secondsFun = function () {
        return (numSeconds ? (((seconds > 60) ? ' and ' + numSeconds + " second" : +numSeconds + " second") + (numSeconds === 1 ? '' : 's')) : '');
    };

    var minutesFun = function () {
        if (numSeconds === 0 && numDays !== 0) {
            return 'and ' + (numMinutes ? numMinutes + " minute" + (numMinutes === 1 ? '' : 's') : '');
        }
        return (numMinutes ? numMinutes + " minute" + (numMinutes === 1 ? '' : 's') : '');
    };

    var hoursFun = function () {
        if (minutesFun().charAt(0) === 'a') {
            return (numHours ? numHours + " hour" + (numHours === 1 ? ' ' : 's ') : '');
        }
        if (numSeconds === 0 && numMinutes === 0) {
            return (numHours ? numHours + " hour" + (numHours === 1 ? '' : 's') : '');
        }

        return (numHours ? numHours + " hour" + (numHours === 1 ? ' ' : 's ') : '');
    };

    var daysFun = function () {
        return (numDays ? numDays + " day" + (numDays === 1 ? ' ' : 's ') : '');
    };

    var yearsFun = function () {
        return (numYears ? numYears + " year" + (numYears === 1 ? ' ' : 's ') : '');
    };

    return yearsFun() || daysFun() || hoursFun() || minutesFun() || secondsFun();
  }
}
