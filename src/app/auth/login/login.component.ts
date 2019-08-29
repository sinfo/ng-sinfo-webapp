import { Component, OnInit, AfterViewInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { Title } from '@angular/platform-browser'

import { environment } from '../../../environments/environment'
import { AuthService } from '../auth.service'
import { MessageService, Type } from '../../message.service'
import { EventService } from '../../events/event.service'

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

  submitting = false

  fenixUrlAuth =
  `https://fenix.tecnico.ulisboa.pt/oauth/userdialog?client_id=${environment.fenix.clientId}&redirect_uri=${environment.fenix.redirectUrl}`

  // tslint:disable-next-line:max-line-length
  linkedInUrlAuth = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${environment.linkedIn.clientId}&redirect_uri=${environment.linkedIn.redirectUrl}&state=SINFO&scope=r_basicprofile%20r_emailaddress`

  private isLoggedIn = false
  private auth2: any

  constructor (
    private messageService: MessageService,
    private authService: AuthService,
    private eventService: EventService,
    public router: Router,
    private route: ActivatedRoute,
    private titleService: Title
  ) { }

  ngOnInit () {
    this.eventService.getCurrent().subscribe(event => {
      this.titleService.setTitle(event.name + ' - Login')
    })

    this.isLoggedIn = this.authService.isLoggedIn()

    if (this.isLoggedIn) {
      this.router.navigate([`${this.authService.redirectUrl || '/qrcode'}`])
      return
    }

    this.route.queryParams.subscribe(params => {
      const fenixCode = params['code']
      if (fenixCode) {
        this.onFenixLogin(fenixCode)
      }
    })

    this.isFacebookActive = (typeof (FB) !== 'undefined' && FB !== null)
    this.isGoogleActive = (typeof (gapi) !== 'undefined' && gapi !== null)

    if (!this.isFacebookActive) {
      this.messageService.add({
        origin: `LoginComponent: ngOnInit isFacebookActive=${this.isFacebookActive}`,
        text: `You need to disable any ad blocker or tracking protection mechanism to be
                allowed to login with Facebook.`,
        showAlert: true,
        type: Type.log,
        timeout: 4000
      })
    }
    if (!this.isGoogleActive) {
      this.messageService.add({
        origin: `LoginComponent: ngOnInit isGoogleActive=${this.isGoogleActive}`,
        text: `You need to disable any ad blocker or tracking protection mechanism to be
                allowed to login with Google.`,
        type: Type.log,
        showAlert: true,
        timeout: 4000
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
    this.auth2.attachClickHandler(element, { }, () => {
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
    this.submitting = true
    this.authService.fenix(fenixCode).subscribe(cannonToken => {
      this.authService.setToken(cannonToken)
      this.router.navigate([ `${this.authService.redirectUrl || '/qrcode'}` ])
    })
  }

  onGoogleLogin () {
    this.submitting = true
    this.auth2.currentUser.listen(googleUser => {
      const profile = googleUser.getBasicProfile()
      const userId = profile.getId()
      const token = googleUser.getAuthResponse().id_token

      this.authService.google(userId, token)
      .subscribe(cannonToken => {
        this.authService.setToken(cannonToken)
        this.router.navigate([`${this.authService.redirectUrl || '/qrcode'}`])
      })
    })
  }

  onFacebookLogin () {
    this.submitting = true
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
          this.router.navigate([`${this.authService.redirectUrl || '/qrcode'}`])
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
