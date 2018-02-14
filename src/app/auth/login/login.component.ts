import { Component, OnInit } from '@angular/core'
import { environment } from '../../../environments/environment'
import { MessageService, Type } from '../../partials/messages/message.service'
import { AuthService } from '../auth.service'

declare let FB: any

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isFacebookActive: boolean

  constructor (
    private messageService: MessageService,
    private authService: AuthService
  ) {
    if (typeof(FB) !== 'undefined' && FB !== null) {
      this.isFacebookActive = true
    } else {
      this.isFacebookActive = false
      this.messageService.add({
        origin: 'LoginComponent: FB.init',
        text: 'You need to disable any ad blocker or tracking feature to be allowed to login with Facebook',
        type: Type.warning
      })
    }

    if (this.isFacebookActive) {
      FB.init({
        appId: environment.facebook.cannonAppId,
        cookie: true,  // enable cookies to allow the server to access
        // the session
        xfbml: true,  // parse social plugins on this page
        version: 'v2.12' // use graph api version 2.5
      })
    }
  }

  ngOnInit () {
    if (this.isFacebookActive) {
      FB.getLoginStatus(response => {
        this.statusChangeCallback(response)
      })
    }
  }

  onFacebookLogin () {
    FB.login()
  }

  statusChangeCallback (resp) {
    console.log(resp.authResponse)
    if (resp.status === 'connected') {
      // connect here with your server for facebook login by passing access token given by facebook
      /* this.authService.facebook(resp.authResponse.userID, resp.authResponse.accessToken)
        .subscribe(cannonToken => console.log(cannonToken)) */
    } else if (resp.status === 'not_authorized') {
      console.log('not auth', resp.status)
    } else {
    }
  }
}
