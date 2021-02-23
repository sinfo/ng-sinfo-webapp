import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'

import { Observable, of } from 'rxjs'
import { catchError } from 'rxjs/operators'

import { Session } from './session.model'
import { User } from '../user/user.model'

import { environment } from '../../environments/environment'
import { MessageService, Type } from '../message.service'
import { AuthService } from '../auth/auth.service'

@Injectable()
export class SessionCannonService {

  private sessionsUrl = environment.cannonUrl + '/sessions'

  constructor (
    private http: HttpClient,
    private messageService: MessageService,
    private authService: AuthService
  ) { }

  checkin (sessionId: string, usersId: string[], code?: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authService.getToken().token}`
      })
    }

    return this.http.post<User>(`${this.sessionsUrl}/${sessionId}/check-in`, {
      users: usersId, code: code
    }, httpOptions)
      .pipe(
        catchError(this.handleError<any>('check-in'))
      )
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
        origin: `SessionService: ${operation}`,
        text: 'When fetching session from server',
        type: Type.error,
        showAlert: true,
        errorObject: error,
        timeout: 4000
      })

      // Let the app keep running by returning an empty result.
      return of(result)
    }
  }

}
