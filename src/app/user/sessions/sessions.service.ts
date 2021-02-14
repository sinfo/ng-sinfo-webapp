import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { AuthService } from '../../auth/auth.service'
import { MessageService, Type } from '../../message.service'
import { Router } from '@angular/router'
import { User } from '../user.model'
import { environment } from '../../../environments/environment'
import { catchError } from 'rxjs/operators'
import { Observable, of } from 'rxjs'

@Injectable()
export class SessionsService {
  constructor (
    private http: HttpClient,
    private authService: AuthService,
    private messageService: MessageService,
  ) {}

  generateCode (sessionId: string, expirationDate: Date) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authService.getToken().token}`
      })
    }

    return this.http.post<User>(
      environment.cannonUrl + `/sessions/${sessionId}/generate`,
      {
        expiration: expirationDate
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
        text: 'When generating session code',
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
