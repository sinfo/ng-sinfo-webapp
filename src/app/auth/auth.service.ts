import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { Observable, of } from 'rxjs'
import { tap, catchError } from 'rxjs/operators'
import { StorageService } from '../storage.service'
import { MessageService, Type } from '../message.service'
import { CannonToken } from './cannon-token.model'
import { JwtService } from './jwt.service'

declare let gapi: any
declare let FB: any
let GOOGLE_SCOPE = 'profile email openid'


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

enum LoginType {
  GOOGLE,
  FACEBOOK,
  LINKEDIN,
  FENIX
}

@Injectable()
export class AuthService {
  private authUrl = environment.cannonUrl + '/auth'
  redirectUrl: string
  linkedinState: string
  loginType: LoginType

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private storageService: StorageService,
    private jwtService: JwtService,
  ) { }

  facebook(id, token): Observable<CannonToken> {
    this.loginType = LoginType.FACEBOOK
    return this.http.post<CannonToken>(`${this.authUrl}/facebook`, { id, token }, httpOptions)
      .pipe(
        tap(cannonToken => cannonToken.loginWith = 'facebook'),
        catchError(this.handleError<CannonToken>('Facebook Login'))
      )
  }

  google(id, token): Observable<CannonToken> {
    this.loginType = LoginType.GOOGLE
    return this.http.post<CannonToken>(`${this.authUrl}/google`, { id, token }, httpOptions)
      .pipe(
        tap(cannonToken => cannonToken.loginWith = 'google'),
        catchError(this.handleError<CannonToken>('Google Login'))
      )
  }

  fenix(code): Observable<CannonToken> {
    this.loginType = LoginType.FENIX
    return this.http.post<CannonToken>(`${this.authUrl}/fenix`, { code }, httpOptions)
      .pipe(
        tap(cannonToken => cannonToken.loginWith = 'fenix'),
        catchError(this.handleError<CannonToken>('Fenix Login'))
      )
  }

  linkedin(code): Observable<CannonToken> {
    this.loginType = LoginType.LINKEDIN
    return this.http.post<CannonToken>(`${this.authUrl}/linkedin`, { code }, httpOptions)
      .pipe(
        tap(cannonToken => cannonToken.loginWith = 'linkedin'),
        catchError(this.handleError<CannonToken>('Linkedin Login'))
      )
  }

  getToken(): CannonToken | null | undefined {
    return this.storageService.getItem('cannon_token') as CannonToken
  }

  setToken(token: CannonToken): void {
    this.storageService.setItem('cannon_token', token)
  }

  isLoggedIn(): boolean {
    const cannonToken = this.getToken()
    if (!cannonToken) {
      return false
    }
    const isTokenExpired = this.jwtService.isTokenExpired(cannonToken.token)

    if (isTokenExpired) {
      this.logout()
    }
    return !isTokenExpired
  }

  logout(): void {
    // const isGoogleActive = (typeof (gapi) !== 'undefined' && gapi !== null)


    // const cannonToken = this.getToken()
    this.storageService.removeItem('cannon_token')

    // switch (cannonToken.loginWith) {
    //   case 'facebook':
    //     FB.logout();
    //     break;
    //   case 'google':
    //     if (isGoogleActive && !gapi.auth2) {
    //       await new Promise((resolve, reject) => {
    //         gapi.load('auth2', resolve)
    //       })
    //       gapi.auth2.init({
    //         client_id: environment.google.clientId,
    //         cookiepolicy: 'single_host_origin',
    //         scope: GOOGLE_SCOPE
    //       })
    //       gapi.auth2.getAuthInstance().disconnect()
    //     } else if (isGoogleActive && gapi.auth2) {
    //       gapi.auth2.getAuthInstance().disconnect()
    //     }
    //     break;
    //   case 'linkedin':
    //     break;
    //   case 'fenix':
    //     break;
    //   default:
    //     break;
    // }
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.messageService.add({
        origin: `AuthService: ${operation}`,
        text: 'When signing in',
        type: Type.error,
        showAlert: false,
        errorObject: error,
        timeout: 8000
      })

      // Let the app keep running by returning an empty result.
      return of(result)
    }
  }
}
