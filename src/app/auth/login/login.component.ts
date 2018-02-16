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

    this.initSocialSDKs()
  }

  initSocialSDKs () {
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

    if (this.isGoogleActive) {
      this.initGoogle()
    }
    if (this.isFacebookActive) {
      this.initFacebook()
    }
  }

  initFacebook () {
    FB.init({
      appId: environment.facebook.appId,
      cookie: false,
      xfbml: true,
      version: 'v2.12'
    })
  }

  initGoogle () {
    gapi.load('auth2', () => {
      gapi.auth2.init({
        client_id: environment.google.clientId,
        cookiepolicy: 'single_host_origin',
        scope: 'profile email openid'
      })
    })
  }

  ngAfterViewInit () {
    gapi.signin2.render('google-signin', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'light',
      'onsuccess': param => this.onGoogleLogin(param),
      'onfailure': err => this.messageService.add({
        origin: 'LoginComponent: Google Sign in',
        text: err.message,
        type: Type.error
      })
    })
  }

  onGoogleLogin (googleUser) {
    const profile = googleUser.getBasicProfile()
    console.log('ID: ' + profile.getId()) // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName())
    console.log('Image URL: ' + profile.getImageUrl())
    console.log('Email: ' + profile.getEmail()) // This is null if the 'email' scope is not present.
    console.log('Token: ', googleUser.getAuthResponse().id_token)

    const userId = profile.getId()
    const token = googleUser.getAuthResponse().id_token

    this.authService.google(userId, token)
      .subscribe(cannonToken => {
        if (cannonToken) {
          console.log(cannonToken)
          this.authService.setToken(cannonToken)
          this.router.navigate(['/me'])
        }
        return
      })
  }

  onFacebookLogin () {
    FB.login(response => {
      this.facebookStatusChange(response)
    })
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
