import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { MessageService, Type } from '../partials/messages/message.service'
import { environment } from '../../environments/environment'
import { Observable } from 'rxjs/Observable'
import { of } from 'rxjs/observable/of'
import { CannonToken } from './cannon-token.model'
import { tap, catchError } from 'rxjs/operators'
import { StorageService } from '../storage.service'

declare let FB: any

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable()
export class AuthService {
  private authUrl = environment.cannonUrl + '/auth'
  redirectUrl: string

  constructor (
    private http: HttpClient,
    private messageService: MessageService,
    private storageService: StorageService
  ) { }

  facebook (id, token): Observable<CannonToken> {
    return this.http.post<CannonToken>(`${this.authUrl}/facebook`, { id, token }, httpOptions)
    .pipe(
      catchError(this.handleError<CannonToken>('Facebook Login'))
    )
  }

  google (id, token): Observable<CannonToken> {
    return this.http.post<CannonToken>(`${this.authUrl}/google`, { id, token }, httpOptions)
    .pipe(
      catchError(this.handleError<CannonToken>('Google Login'))
    )
  }

  getToken (): CannonToken | null | undefined {
    return this.storageService.getItem('cannon-auth') as CannonToken
  }

  setToken (token: CannonToken): void {
    this.storageService.setItem('cannon-auth', token)
  }

  isLoggedIn (): boolean {
    const token = this.getToken()
    if (!token) {
      return false
    }

    const now = new Date()
    const ttl = token.ttl * 60 // Convert ttl in minutes to UNIX timestamp
    const expires = token.date + ttl

    if (expires > Math.floor(now.getTime() / 1000)) {
      return true
    }
    this.logout()
    return false
  }

  logout (): void {
    this.storageService.removeItem('cannon-auth')
    FB.logout((response) => {
      console.log(response)
    })
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.messageService.add({
        origin: `AuthService: ${operation}`,
        text: error.message,
        type: Type.error
      })

      // Let the app keep running by returning an empty result.
      return of(result as T)
    }
  }
}
