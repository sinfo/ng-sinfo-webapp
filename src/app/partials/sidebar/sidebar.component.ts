import { Component, OnInit, Input } from '@angular/core'
import { environment } from '../../../environments/environment'

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  @Input() user: any
  eventOcurring: boolean

  showSidebar = true

  constructor () { }

  ngOnInit () {
    this.eventOcurring = environment.eventOcurring
  }

}
