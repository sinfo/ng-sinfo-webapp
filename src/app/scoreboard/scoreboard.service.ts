import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

import { Observable, of } from 'rxjs'
import { catchError } from 'rxjs/operators'

import { MessageService, Type } from '../message.service'
import { environment } from '../../environments/environment'

import { User } from '../user/user.model'

@Injectable()
export class ScoreboardService {
  private usersUrl = environment.cannonUrl + '/users?date='

  constructor (
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  getUsersPoints (date: string): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl + date)
      .pipe(
        catchError(this.handleError<User[]>('getUsersPoints', []))
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
        origin: `ScoreboardService: ${operation}`,
        text: error.message,
        showAlert: false,
        type: Type.error,
        timeout: 4000,
        errorObject: error
      })

      // Let the app keep running by returning an empty result.
      return of(result as T)
    }
  }
}
