import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { User } from './user.model'
import { Observable } from 'rxjs/Observable'
import { catchError, map, tap } from 'rxjs/operators'
import { of } from 'rxjs/observable/of'
import { Achievement } from '../achievements/achievement.model'
import { AuthService } from '../auth/auth.service'
import { Company } from '../company/company.model'
import { CompanyService } from '../company/company.service'
import { MessageService, Type } from '../message.service'

@Injectable()
export class UserService {
  private usersUrl = environment.cannonUrl + '/users'
  private companiesUrl = environment.cannonUrl + '/companies'
  private me: User

  constructor (
    private http: HttpClient,
    private messageService: MessageService,
    private companyService: CompanyService,
    private authService: AuthService
  ) { }

  getUser (id: string): Observable<User> {
    let headers = {
      'Content-Type': 'application/json',
      'Authorization': ''
    }

    if (this.authService.isLoggedIn()) {
      headers.Authorization = `Bearer ${this.authService.getToken().token}`
    }

    return this.http.get<User>(`${this.usersUrl}/${id}`, { headers: new HttpHeaders(headers) })
      .pipe(
      catchError(this.handleError<User>(`getUser id=${id}`))
      )
  }

  getMe (): Observable<User> {
    if (this.me) {
      return of(this.me)
    }

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

  updateUser (id: string, role: string, company?: string): Observable<User> {
    if (['user', 'team', 'company'].indexOf(role) === -1) {
      return of(null)
    }

    if (role === 'company' && !company) {
      return of(null)
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authService.getToken().token}`
      })
    }

    if (role === 'company') {
      return this.http.put<User>(`${this.usersUrl}/${id}`, {
        role: role,
        company: {
          edition: environment.currentEvent,
          company: company
        }
      }, httpOptions)
        .pipe(
        catchError(this.handleError<User>('updateUser'))
        )
    } else {
      return this.http.put<User>(`${this.usersUrl}/${id}`, { role: role }, httpOptions)
        .pipe(
        tap(user => {
          for (let i = 0; i < user.company.length; i++) {
            if (user.company[i].edition === environment.currentEvent) {
              this.removeThisEventsCompanyFromUser(id).subscribe()
              break
            }
          }
        }),
        catchError(this.handleError<User>('updateUser'))
        )
    }
  }

  demoteSelf () {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authService.getToken().token}`
      })
    }

    return this.http.put<User>(`${this.usersUrl}/me`, { role: 'user' }, httpOptions)
      .pipe(
      catchError(this.handleError<User>('updateUser'))
      )
  }

  removeThisEventsCompanyFromUser (id: string): Observable<User> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authService.getToken().token}`
      })
    }

    return this.http.delete<User>(`${this.usersUrl}/${id}/company?editionId=${environment.currentEvent}`,
      httpOptions).pipe(
      catchError(this.handleError<User>('removeThisEventsCompanyFromUser'))
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
        showAlert: true,
        text: 'When fetching user information from server',
        errorObject: error,
        type: Type.error
      })

      // Let the app keep running by returning an empty result.
      return of(result as T)
    }
  }
}
