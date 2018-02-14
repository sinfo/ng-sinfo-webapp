import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { MessageService, Type } from '../partials/messages/message.service'
import { environment } from '../../environments/environment'
import { Observable } from 'rxjs/Observable'
import { of } from 'rxjs/observable/of'
import { CannonToken } from './cannon-token.model'
import { tap, catchError } from 'rxjs/operators'
import { StorageService } from '../storage.service'

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable()
export class AuthService {
  private authUrl = environment.cannonUrl + '/auth'

  constructor (
    private http: HttpClient,
    private messageService: MessageService,
    private storageService: StorageService
  ) { }

  facebook (id, token): Observable<CannonToken> {
    return this.http.post<CannonToken>(`${this.authUrl}/facebook`, { id, token }, httpOptions)
    .pipe(
      tap((cannonToken: CannonToken) => console.log(cannonToken)),
      catchError(this.handleError<CannonToken>('Facebook Login'))
    )
  }

  getToken (): CannonToken {
    return this.storageService.getItem('cannon-auth') as CannonToken
  }

  setToken (token: CannonToken): void {
    this.storageService.setItem('cannon-auth', token)
  }

  isAuthenticated (): boolean {
    if (this.getToken().date > Date.now().valueOf()) {
      return true
    }
    return false
  }

  logout (): void {
    localStorage.removeItem('cannon-auth')
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error) // log to console instead

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
