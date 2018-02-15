import { Component, OnInit } from '@angular/core'
import { environment } from '../../../environments/environment'
import { MessageService, Type } from '../../partials/messages/message.service'
import { AuthService } from '../auth.service'
import { Router } from '@angular/router'

declare let FB: any

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isFacebookActive: boolean
  isLoggedIn = false

  constructor (
    private messageService: MessageService,
    private authService: AuthService,
    public router: Router
  ) {
    this.isFacebookActive = (typeof(FB) !== 'undefined' && FB !== null)

    if (!this.isFacebookActive) {
      this.messageService.add({
        origin: 'LoginComponent: FB.init',
        text: 'You need to disable any ad blocker or tracking feature to be allowed to login with Facebook',
        type: Type.warning
      })
      return
    }

    FB.init({
      appId: environment.facebook.cannonAppId,
      cookie: false,
      xfbml: true,
      version: 'v2.12'
    })
  }

  ngOnInit () {
    this.isLoggedIn = this.authService.isLoggedIn()

    if (this.isLoggedIn) {
      this.router.navigate(['/me'])
      return
    }

    if (this.isFacebookActive) {
      FB.getLoginStatus(response => {
        this.facebookStatusChange(response)
      })
    }
  }

  onFacebookLogin () {
    FB.login()
  }

  facebookStatusChange (resp) {
    if (resp.status === 'connected') {
      // connect here with your server for facebook login by passing access token given by facebook
      this.authService.facebook(resp.authResponse.userID, resp.authResponse.accessToken)
        .subscribe(cannonToken => {
          if (cannonToken) {
            this.authService.setToken(cannonToken)
            this.router.navigate(['/me'])
          }
          return
        })
    } else if (resp.status === 'not_authorized') {
      this.messageService.add({
        origin: 'LoginComponent: facebookStatusChange',
        text: 'You were not allowed to login',
        type: Type.warning
      })
    } else {
      // TODO: Improve this
      console.log(resp)
    }
  }
}
