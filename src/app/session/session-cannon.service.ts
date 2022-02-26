import { Injectable } from '@angular/core'
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http'

import { Observable, of } from 'rxjs'
import { catchError } from 'rxjs/operators'

import { environment } from '../../environments/environment'
import { MessageService, Type } from '../message.service'
import { AuthService } from '../auth/auth.service'
import { Achievement } from '../user/achievements/achievement.model'
import { Router } from '@angular/router'

@Injectable()
export class SessionCannonService {

  private sessionsUrl = environment.cannonUrl + '/sessions'

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private authService: AuthService,
    private router: Router
  ) { }

  checkin(sessionId: string, usersId: string[], unregisteredUsers?: Number, code?: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authService.getToken().token}`
      })
    }

    return this.http.post<Achievement>(`${this.sessionsUrl}/${sessionId}/check-in`, {
      users: usersId, code: code, unregisteredUsers: unregisteredUsers ? unregisteredUsers : 0
    }, httpOptions)
      .pipe(
        catchError(this.handleErrorCheckIn<any>('check-in'))
      )
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

  private handleErrorCheckIn<T>(operation = 'operation', result?: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      this.messageService.add({
        origin: `SessionService: ${operation}`,
        text: error.status === 403 ?
          `Overlapping workshops detected. You cannot attend multiple workshops at the same time. 
        Your entries for both workshops will be deducted.` : 'Wrong code or code is already invalid.',
        type: Type.error,
        showAlert: true,
        errorObject: error,
        timeout: error.status === 403 ? null : 4000
      })

      if (error.status === 403) {
        this.router.navigate([`/`])
      }


      // Let the app keep running by returning an empty result.
      return of(result)
    }
  }

}
