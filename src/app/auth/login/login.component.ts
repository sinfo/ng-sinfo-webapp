import { Component, OnInit, AfterViewInit } from '@angular/core'
import { environment } from '../../../environments/environment'
import { MessageService, Type } from '../../partials/messages/message.service'
import { AuthService } from '../auth.service'
import { Router } from '@angular/router'

declare let FB: any
declare let gapi: any

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {
  private isFacebookActive: boolean
  private isGoogleActive: boolean
  private isLoggedIn = false
  private auth2: any

  constructor (
    private messageService: MessageService,
    private authService: AuthService,
    public router: Router
  ) { }

  ngOnInit () {
    this.isLoggedIn = this.authService.isLoggedIn()

    if (this.isLoggedIn) {
      this.router.navigate(['/me'])
      return
    }

    this.isFacebookActive = (typeof (FB) !== 'undefined' && FB !== null)
    this.isGoogleActive = (typeof (gapi) !== 'undefined' && gapi !== null)

    if (!this.isFacebookActive) {
      this.messageService.add({
        origin: 'LoginComponent: constructor',
        text: `You need to disable any ad blocker or tracking protection to be
                allowed to login with Facebook.`,
        type: Type.warning
      })
    }
    if (!this.isGoogleActive) {
      this.messageService.add({
        origin: 'LoginComponent: constructor',
        text: `You need to disable any ad blocker or tracking protection to be
                allowed to login with Google.`,
        type: Type.warning
      })
    }
  }

  ngAfterViewInit () {
    this.initSocialSDKs()
  }

  initSocialSDKs () {
    if (this.isGoogleActive) {
      gapi.load('auth2', () => {
        this.auth2 = gapi.auth2.init({
          client_id: environment.google.clientId,
          cookiepolicy: 'single_host_origin',
          scope: 'profile email openid'
        })
        this.attachSignin(document.getElementById('google-signin'))
      })
    }
    if (this.isFacebookActive) {
      FB.init({
        appId: environment.facebook.appId,
        cookie: false,
        xfbml: true,
        version: 'v2.12'
      })
    }
  }

  attachSignin (element) {
    this.auth2.attachClickHandler(element, {}, (googleUser) => {
      this.onGoogleLogin(googleUser)
    }, (error) => {
      this.messageService.add({
        origin: 'LoginComponent: Google attachSignin',
        text: error.error,
        type: Type.log
      })
    })
  }

  onGoogleLogin (googleUser) {
    const profile = googleUser.getBasicProfile()
    const userId = profile.getId()
    const token = googleUser.getAuthResponse().id_token

    this.authService.google(userId, token)
      .subscribe(cannonToken => {
        this.authService.setToken(cannonToken)
        this.router.navigate(['/me'])
      })
  }

  onFacebookLogin () {
    FB.login(response => {
      this.facebookStatusChange(response)
    }, { scope: 'public_profile,email' })
  }

  facebookStatusChange (resp) {
    if (resp.status === 'connected') {
      // connect here with your server for facebook login by passing access token given by facebook
      this.authService.facebook(resp.authResponse.userID, resp.authResponse.accessToken)
        .subscribe(cannonToken => {
          this.authService.setToken(cannonToken)
          this.router.navigate(['/me'])
        })
    } else if (resp.status === 'not_authorized') {
      this.messageService.add({
        origin: `LoginComponent: facebookStatusChange: ${resp.status}`,
        text: 'You were not allowed to login with Facebook',
        type: Type.warning
      })
    } else {
      this.messageService.add({
        origin: `LoginComponent: facebookStatusChange: ${resp.status}`,
        text: 'An error occurred by logging with Facebook',
        type: Type.error
      })
    }
  }
}
