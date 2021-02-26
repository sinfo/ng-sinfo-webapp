import { Component, OnInit } from '@angular/core'
import { Title } from '@angular/platform-browser'

import { UserService } from '../user.service'
import { User } from '../user.model'
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
  capacity = environment.signaturesCardCapacity
  day= new Date()
  companies = []
  userSignatures = []

  constructor (
    private userService: UserService,
    private companyService: CompanyService,
    private eventService: EventService,
    private titleService: Title
  ) { }

  ngOnInit () {
    this.eventService.getCurrent().subscribe(event => {
      this.titleService.setTitle(event.name + ' - Card')

      this.userService.getMe().subscribe(user => {
        this.user = user

        if (!this.user.signatures) {
          return
        }

        let day = this.day.getDate().toString()
        let tempSignatures = this.user.signatures.find(s => {
          return s.day === day && s.edition === event.id
        }) || {signatures: [] }

        this.userSignatures=tempSignatures.signatures
        
        this.userSignatures = [
          { companyId:"optimus", date: new Date(new Date().setHours(2))}, 
          { companyId:"epimetheus", date: new Date(new Date().setHours(8))}, 
          { companyId:"altice", date: new Date(new Date().setHours(9))}, 
          { companyId:"talkdesk", date: new Date(new Date().setHours(1))}, 
          { companyId:"miniclip", date: new Date(new Date().setHours(11))}
        ]
        this.userSignatures.sort((a,b) => {return b.date.valueOf() - a.date.valueOf()})
        this.userSignatures = this.userSignatures.slice(0, this.capacity)

        this.userSignatures.forEach((signature) => {
          this.companies.push({
            name: signature.companyId,
            img: "",
            howLongAgo: this.formatDuration((new Date().valueOf() - signature.date.valueOf())/1000) + " ago"
          })
        })

        this.userSignatures.forEach(signature => {
          this.companyService.getCompany(signature.companyId)
            .subscribe(c => {
              this.companies[this.companies.findIndex((company)=>{ return company.name === c.id})].img = c.img
          })
        })
        console.log(this.companies)
        console.log(this.userSignatures)
      })
    })

  }
  formatDuration(seconds) {
    if (seconds === 0) {
        return 'now';
    }
    var numYears = Math.floor(seconds / (86400 * 365));
    var numDays = Math.floor(seconds % (86400 * 365) / 86400);
    var numHours = Math.floor(((seconds % (86400 * 365)) % 86400) / 3600);
    var numMinutes = Math.floor((((seconds % (86400 * 365)) % 86400) % 3600) / 60);
    var numSeconds = (((seconds % (86400 * 365)) % 86400) % 3600) % 60;

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
