import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { User } from './user.model'
import { Observable, of } from 'rxjs'
import { catchError, map, tap } from 'rxjs/operators'
import { Achievement } from './achievements/achievement.model'
import { AuthService } from '../auth/auth.service'
import { MessageService, Type } from '../message.service'
import { EventService } from '../events/event.service'
import { Event } from '../events/event.model'
import { File as CV } from './cv/file'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Link, Note } from './link/link.model'

@Injectable()
export class UserService {
  private usersUrl = environment.cannonUrl + '/users'
  private filesUrl = environment.cannonUrl + '/files'
  public me: User
  private event: Event
  private cv: CV
  private links = new Map<string,Link>();

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private snackBar: MatSnackBar,
    private eventService: EventService,
    private authService: AuthService
  ) {
    this.eventService.getCurrent().subscribe(event => this.event = event)
  }

  getUser(id: string): Observable<User> {
    let headers = {
      'Content-Type': 'application/json',
      'Authorization': ''
    }

    if (this.authService.isLoggedIn()) {
      headers.Authorization = `Bearer ${this.authService.getToken().token}`
    }

    const httpOptions = {
      params: new HttpParams({
        fromObject: {
          'editionId': this.event.id
        }
      }),
      headers: new HttpHeaders(headers)
    }

    return this.http.get<User>(`${this.usersUrl}/${id}`, httpOptions)
      .pipe(
        catchError(this.handleError<User>(`getting user profile`))
      )
  }

  getUsers(ids: Array<string>): Observable<User[]> {
    let headers = {
      'Content-Type': 'application/json',
      'Authorization': ''
    }

    if (this.authService.isLoggedIn()) {
      headers.Authorization = `Bearer ${this.authService.getToken().token}`
    }

    return this.http.post<User[]>(`${this.usersUrl}/users`, { users: ids }, { headers: new HttpHeaders(headers) })
      .pipe(
        catchError(this.handleError<User[]>(`getting user profile`))
      )
  }

  getActiveUsers(): Observable<User[]> {
    let headers = {
      'Content-Type': 'application/json',
      'Authorization': ''
    }

    if (this.authService.isLoggedIn()) {
      headers.Authorization = `Bearer ${this.authService.getToken().token}`
    }

    return this.http.get<User[]>(this.usersUrl, { headers: new HttpHeaders(headers) })
      .pipe(
        catchError(this.handleError<User[]>(`getting all users with achievements`))
      )
  }

  getMe(forceRefresh = false): Observable<User> {
    if (this.me && !forceRefresh) {
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
        tap((user) => {
          this.me = user
        }),
        catchError(this.handleError<User>('getting user personal profile'))
      )
  }

  deleteMe() {
    this.me = null
  }

  getLink(attendeeId: string, companyId: string, forceRefresh = false): Observable<Link> {
    if (this.links.has(companyId) && !forceRefresh) {
      return of(this.links.get(companyId))
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authService.getToken().token}`
      })
    }

    return this.http.get<Link>(`${this.usersUrl}/${attendeeId}/link/${companyId}`, httpOptions)
      .pipe(
        tap(link => {
          this.links.set(link.company, link)
        }),
        catchError(this.handleError<Link>('getLink'))
      )
  }

  createLink(attendeeId: string, companyId: string, userId: string, note: Note): Observable<Link> {
    return this.http.post<Link>(`${this.usersUrl}/${attendeeId}/link`, {
      userId: userId,
      companyId: companyId,
      notes: {
        contacts: {
          email: note.contacts.email ?? '',
        },
        internships: note.internships ?? '',
        otherObservations: note.otherObservations ?? ''
      }
    }, { headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken().token}`
    })})
      .pipe(
        tap(link => {
          this.links.set(link.company, link)
        }),
        catchError(this.handleError<Link>('createLink'))
      )
  }

  updateLink(attendeeId: string, companyId: string, userId: string, note: Note): Observable<Link> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authService.getToken().token}`
      })
    }

    return this.http.put<Link>(`${this.usersUrl}/${attendeeId}/link/${companyId}`, {
      userId: userId,
      notes: note
    }, httpOptions)
      .pipe(
        tap(link => {
          this.links.set(link.company, link)
        }),
        catchError(this.handleError<Link>('updateLink'))
      )
  }

  getLinks(attendeeId: string, forceRefresh = false): Observable<Link[]> {
    if (!forceRefresh && this.links.size !== 0) {
      return of(Array.from(this.links.values()))
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authService.getToken().token}`
      })
    }

    return this.http.get<Link[]>(`${this.usersUrl}/${attendeeId}/link`, httpOptions)
      .pipe(
        tap(links => {
          links.forEach(link => {
            this.links.set(link.company, link)
          })
        }),
        catchError(this.handleError<Link[]>('getLinks', []))
      )
  }

  deleteLink(attendeeId: string, companyId: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authService.getToken().token}`
      })
    }

    return this.http.delete<Link>(`${this.usersUrl}/${attendeeId}/link/${companyId}`, httpOptions)
      .pipe(
        tap(link => {
          this.links.delete(link.company)
        }),
        catchError(this.handleError<Link>('deleteLink'))
      )
  }

  getCv(): Observable<CV> {
    if (this.cv) {
      return of(this.cv)
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.authService.getToken().token}`
      })
    }

    return this.http.get<any>(`${this.filesUrl}/me`, httpOptions)
  }

  isCvUpdated(): Observable<boolean> {
    return this.getCv().pipe(
      map((cv: CV) => {
        const curr = new Date()
        const year = 1000 * 60 * 60 * 24 * 365 // 1 year

        // cvs get old once an event begins
        // if a cv is posted after the current event it is updated
        // if the current event hasn't started yet, a cv is updated if it has less than a year
        if (new Date(cv.updated).getTime() >= new Date(this.event.date).getTime()) {
          return true
        }
        if (curr.getTime() < new Date(this.event.date).getTime() &&
          new Date(cv.updated).getTime() >= new Date(new Date(this.event.date).getTime() - year).getTime()) {
          return true
        }
        return false
      })
    )
  }

  uploadCV(formData: FormData): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.authService.getToken().token}`
      }),
      reportProgress: true
    }
    const req = new HttpRequest('POST', `${this.filesUrl}/me`, formData, httpOptions)

    return this.http.request(req).pipe(
      catchError(this.handleError<string[]>(`uploading user cv`))
    )
  }

  deleteCV(): Observable<any> {
    this.cv = null
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.authService.getToken().token}`
      })
    }

    return this.http.delete<any>(`${this.filesUrl}/me`, httpOptions).pipe(
      catchError(this.handleError<string[]>(`deleting user cv`))
    )
  }

  getUserAchievements(id: string): Observable<Achievement[]> {
    return this.http.get<Achievement[]>(`${this.usersUrl}/${id}/achievements`)
      .pipe(
        catchError(this.handleError<Achievement[]>(`getting user achievements`))
      )
  }

  updateUser(id: string, role: string, company?: string): Observable<User> {
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
          edition: this.event.id,
          company: company
        }
      }, httpOptions)
        .pipe(
          catchError(this.handleError<User>('updating user'))
        )
    } else {
      return this.http.put<User>(`${this.usersUrl}/${id}`, { role: role }, httpOptions)
        .pipe(
          tap(user => {
            for (let i = 0; i < user.company.length; i++) {
              if (user.company[i].edition === this.event.id) {
                this.removeThisEventsCompanyFromUser(id).subscribe()
                break
              }
            }
          }),
          catchError(this.handleError<User>('updating user'))
        )
    }
  }

  demoteSelf() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authService.getToken().token}`
      })
    }

    return this.http.put<User>(`${this.usersUrl}/me`, { role: 'user' }, httpOptions)
      .pipe(
        catchError(this.handleError<User>('updating user'))
      )
  }

  removeThisEventsCompanyFromUser(id: string): Observable<User> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authService.getToken().token}`
      })
    }

    return this.http.delete<User>(`${this.usersUrl}/${id}/company?editionId=${this.event.id}`,
      httpOptions).pipe(
        catchError(this.handleError<User>('removing this events company from user'))
      )
  }

  getUserSessions(id: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.usersUrl}/${id}/sessions`)
      .pipe(
        catchError(this.handleError<string[]>(`getting user session`))
      )
  }

  validateCard(id: string): Observable<User> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.authService.getToken().token}`
      })
    }

    return this.http.post<User>(`${this.usersUrl}/${id}/redeem-card`, null, httpOptions)
  }

  removeUserInfo() {
    this.me = null
    this.event = null
    this.cv = null
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      if (error.status === 404 && operation === 'getLink') {
        return of(result)
      }

      this.snackBar.open(error.message, "Ok", {
        panelClass: ['mat-toolbar', 'mat-warn'],
        duration: 2000
      })
      /* this.messageService.add({
        origin: `UserService: ${operation}`,
        showAlert: false,
        text: `When ${operation}`,
        errorObject: error,
        type: Type.error
      }) */

      // Let the app keep running by returning an empty result.
      return of(result)
    }
  }
}
