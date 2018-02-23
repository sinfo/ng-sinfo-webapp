import { Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'

import { Observable } from 'rxjs/Observable'
import { catchError } from 'rxjs/operators'
import { of } from 'rxjs/observable/of'

import { MessageService, Type } from '../message.service'
import { environment } from '../../environments/environment'

import { User } from '../user/user.model'

@Injectable()
export class ScoreboardService {
  private usersUrl = environment.cannonUrl + '/users'

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  getTop20Users(): Observable<User[]> {
    const params = new HttpParams({
      fromObject: {
        'sort': '-points.total',
        'limit': '20'
      }
    })

    return this.http.get<User[]>(this.usersUrl, { params })
      .pipe(
        catchError(this.handleError<User[]>('getTop20Users', []))
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
        showAlert: true,
        type: Type.error,
        timeout: 4000,
        errorObject: error
      })

      // Let the app keep running by returning an empty result.
      return of(result as T)
    }
  }
}
