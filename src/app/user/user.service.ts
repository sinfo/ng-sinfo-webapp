import { Injectable } from '@angular/core'
import { MessageService } from '../partials/messages/message.service'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { User } from './user.model'
import { Observable } from 'rxjs/Observable'
import { catchError } from 'rxjs/operators'
import { of } from 'rxjs/observable/of'
import { Achievement } from './achievement.model'

@Injectable()
export class UserService {
  private usersUrl = environment.cannonUrl + '/users'

  constructor (
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  private log (message: string) {
    this.messageService.add('SpeakerService: ' + message)
  }

  getUser (id: string): Observable<User> {
    return this.http.get<User>(`${this.usersUrl}/${id}`)
      .pipe(
        catchError(this.handleError<User>(`getUser id=${id}`))
      )
  }

  getUserAchievements (id: string): Observable<Achievement> {
    return this.http.get<Achievement>(`${this.usersUrl}/${id}/achievements`)
      .pipe(
        catchError(this.handleError<Achievement>(`getUserAchievements id=${id}`))
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

      // TODO: send the error to remote logging infrastructure
      console.error(error) // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`)

      // Let the app keep running by returning an empty result.
      return of(result as T)
    }
  }
}
