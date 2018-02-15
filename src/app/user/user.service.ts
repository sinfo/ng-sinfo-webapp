import { Injectable } from '@angular/core'
import { MessageService, Type } from '../partials/messages/message.service'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { User } from './user.model'
import { Observable } from 'rxjs/Observable'
import { catchError } from 'rxjs/operators'
import { of } from 'rxjs/observable/of'
import { Achievement } from './achievement.model'
import { AuthService } from '../auth/auth.service'

@Injectable()
export class UserService {
  private usersUrl = environment.cannonUrl + '/users'

  constructor (
    private http: HttpClient,
    private messageService: MessageService,
    private authService: AuthService
  ) { }

  getUser (id: string): Observable<User> {
    return this.http.get<User>(`${this.usersUrl}/${id}`)
      .pipe(
        catchError(this.handleError<User>(`getUser id=${id}`))
      )
  }

  getMe (): Observable<User> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authService.getToken().token}`
      })
    }
    return this.http.get<User>(`${this.usersUrl}/me`, httpOptions)
      .pipe(
        catchError(this.handleError<User>('getMe'))
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
      this.messageService.add({
        origin: `UserService: ${operation}`,
        text: error.message,
        type: Type.error
      })

      // Let the app keep running by returning an empty result.
      return of(result as T)
    }
  }
}
