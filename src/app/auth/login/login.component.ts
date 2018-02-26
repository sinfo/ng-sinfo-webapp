import { Component, OnInit, AfterViewInit } from '@angular/core'
import { environment } from '../../../environments/environment'
import { AuthService } from '../auth.service'
import { Router, ActivatedRoute } from '@angular/router'
import { MessageService, Type } from '../../message.service'

declare let FB: any
declare let gapi: any

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {
  isFacebookActive: boolean
  isGoogleActive: boolean
  fenixUrlAuth =
  `https://fenix.tecnico.ulisboa.pt/oauth/userdialog?client_id=${environment.fenix.clientId}&redirect_uri=${environment.fenix.redirectUrl}`
  private isLoggedIn = false
  private auth2: any

  constructor (
    private messageService: MessageService,
    private authService: AuthService,
    public router: Router,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(params => {
      const fenixCode = params['code']
      if (fenixCode) {
        this.onFenixLogin(fenixCode)
      }
    })
  }

  ngOnInit () {
    this.isLoggedIn = this.authService.isLoggedIn()

    if (this.isLoggedIn) {
      this.router.navigate([`${this.authService.redirectUrl || '/me'}`])
      return
    }

    this.isFacebookActive = (typeof (FB) !== 'undefined' && FB !== null)
    this.isGoogleActive = (typeof (gapi) !== 'undefined' && gapi !== null)

    if (!this.isFacebookActive) {
      this.messageService.add({
        origin: `LoginComponent: ngOnInit isFacebookActive=${this.isFacebookActive}`,
        text: `You need to disable any ad blocker or tracking protection mechanism to be
                allowed to login with Facebook.`,
        showAlert: false,
        type: Type.log
      })
    }
    if (!this.isGoogleActive) {
      this.messageService.add({
        origin: `LoginComponent: ngOnInit isGoogleActive=${this.isGoogleActive}`,
        text: `You need to disable any ad blocker or tracking protection mechanism to be
                allowed to login with Google.`,
        type: Type.log,
        showAlert: false
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
    this.auth2.attachClickHandler(element, { }, (googleUser) => {
    }, (error) => {
      this.messageService.add({
        origin: 'LoginComponent: Google attachSignin',
        text: error.error,
        errorObject: error,
        type: Type.log,
        showAlert: false
      })
    })
  }

  onFenixLogin (fenixCode) {
    console.log('onFenixLogin', fenixCode)
    this.authService.fenix(fenixCode)
      .subscribe(cannonToken => {
        console.log('cannon ok ', cannonToken)
        this.authService.setToken(cannonToken)
        this.router.navigate([ `${this.authService.redirectUrl || '/me'}` ])
      })
  }

  onGoogleLogin () {
    this.auth2.currentUser.listen(googleUser => {
      const profile = googleUser.getBasicProfile()
      const userId = profile.getId()
      const token = googleUser.getAuthResponse().id_token

      this.authService.google(userId, token)
      .subscribe(cannonToken => {
        this.authService.setToken(cannonToken)
        this.router.navigate([`${this.authService.redirectUrl || '/me'}`])
      })
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
          this.router.navigate([`${this.authService.redirectUrl || '/me'}`])
        })
    } else if (resp.status === 'not_authorized') {
      this.messageService.add({
        origin: `LoginComponent: facebookStatusChange: ${resp.status}`,
        text: 'You were not allowed to login with Facebook',
        type: Type.error,
        showAlert: false,
        errorObject: resp
      })
    } else {
      this.messageService.add({
        origin: `LoginComponent: facebookStatusChange: ${resp.status}`,
        text: 'An error occurred by logging with Facebook',
        type: Type.error,
        showAlert: false,
        errorObject: resp
      })
    }
  }
}
