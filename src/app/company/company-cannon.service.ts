import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { Observable , of } from 'rxjs'
import { catchError, map, tap } from 'rxjs/operators'
import { MessageService, Type } from '../message.service'
import { AuthService } from '../auth/auth.service'
import { Link } from '../user/link/link.model'
import { environment } from '../../environments/environment'
import { User } from '../user/user.model'
import { EventService } from '../events/event.service'
import { Event } from '../events/event.model'

@Injectable()
export class CompanyCannonService {
  private companiesUrl = environment.cannonUrl + '/company'
  private event: Event
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${this.authService.getToken().token}`
  })

  constructor (
    private http: HttpClient,
    private messageService: MessageService,
    private authService: AuthService,
    private eventService: EventService
  ) {
    this.eventService.getCurrent().subscribe(event => this.event = event)
  }

  getLink (companyId: string, attendeeId: string): Observable<Link> {
    const httpOptions = {
      params: new HttpParams({
        fromObject: {
          'editionId': this.event.id
        }
      }),
      headers: this.headers
    }

    return this.http.get<Link>(`${this.companiesUrl}/${companyId}/link/${attendeeId}`, httpOptions)
      .pipe(
        catchError(this.handleError<Link>('getLink'))
      )
  }

  getLinks (companyId: string): Observable<Link[]> {
    const httpOptions = {
      params: new HttpParams({
        fromObject: {
          'editionId': this.event.id
        }
      }),
      headers: this.headers
    }

    return this.http.get<Link[]>(`${this.companiesUrl}/${companyId}/link`, httpOptions)
      .pipe(
        catchError(this.handleError<Link[]>('getLinks', []))
      )
  }

  createLink (companyId: string, userId: string, attendeeId: string, note: string): Observable<Link> {
    return this.http.post<Link>(`${this.companiesUrl}/${companyId}/link`, {
      userId: userId,
      attendeeId: attendeeId,
      editionId: this.event.id,
      note: note || ' '
    }, { headers: this.headers })
      .pipe(
        catchError(this.handleError<Link>('createLink'))
      )
  }

  updateLink (companyId: string, userId: string, attendeeId: string, note: string): Observable<Link> {
    const httpOptions = {
      params: new HttpParams({
        fromObject: {
          'editionId': this.event.id
        }
      }),
      headers: this.headers
    }

    return this.http.patch<Link>(`${this.companiesUrl}/${companyId}/link/${attendeeId}`, {
      userId: userId,
      note: note
    }, httpOptions)
      .pipe(
        catchError(this.handleError<Link>('updateLink'))
      )
  }

  deleteLink (companyId: string, attendeeId: string) {
    const httpOptions = {
      params: new HttpParams({
        fromObject: {
          'editionId': this.event.id
        }
      }),
      headers: this.headers
    }

    return this.http.delete<Link>(`${this.companiesUrl}/${companyId}/link/${attendeeId}`, httpOptions)
      .pipe(
        catchError(this.handleError<Link>('deleteLink'))
      )
  }

  sign (companyId: string, attendeeId: string): Observable<User> {
    const httpOptions = {
      headers: this.headers
    }

    return this.http.post<User>(`${this.companiesUrl}/${companyId}/sign/${attendeeId}`, {
      editionId: this.event.id,
      day: new Date().getDate().toString() // current day
    }, httpOptions)
      .pipe(
      catchError(this.handleError<User>('sign'))
      )
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    var msg = {
      origin: `UserService: ${operation}`,
      showAlert: false,
      text: null,
      type: Type.error
    }

    return (error: any): Observable<T> => {
      msg.text = error.message
      this.messageService.add(msg)

      // Let the app keep running by returning an empty result.
      return of(result as T)
    }
  }
}
