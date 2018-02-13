import { Component, OnInit } from '@angular/core'
import { SessionService } from '../session.service'
import { ActivatedRoute, Params } from '@angular/router'
import { Session } from '../session.model'

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.css']
})
export class SessionsComponent implements OnInit {
  private session: Session

  constructor(
    private sessionService: SessionService,
    private route: ActivatedRoute 
  ) { }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      const id = params['id']
      const session = this.sessionService.getLocalSession(id)

      if(session) {
        this.session = session
      } else {
        this.getSession(id)
      }
    })
  }

  getSession (id: string): void {
    this.sessionService.getSession(id)
      .subscribe(session => this.session = session)
  }

}
