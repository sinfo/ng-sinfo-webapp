import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { environment } from '../../../environments/environment'
import { Observable } from 'rxjs/Observable'
import { catchError, map, tap } from 'rxjs/operators'
import { of } from 'rxjs/observable/of'
import { AuthService } from '../../auth/auth.service'
import { Link } from './link.model'
import { MessageService, Type } from '../../message.service'

@Injectable()
export class LinkService {
  private companiesUrl = environment.cannonUrl + '/company'
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${this.authService.getToken().token}`
  })

  constructor (
    private http: HttpClient,
    private messageService: MessageService,
    private authService: AuthService
  ) { }

  getLink (companyId: string, attendeeId: string): Observable<Link> {
    const httpOptions = {
      params: new HttpParams({
        fromObject: {
          'editionId': environment.currentEvent
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
          'editionId': environment.currentEvent
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
      editionId: environment.currentEvent,
      note: note
    }, { headers: this.headers })
      .pipe(
        catchError(this.handleError<Link>('createLink'))
      )
  }

  updateLink (companyId: string, userId: string, attendeeId: string, note: string): Observable<Link> {
    const httpOptions = {
      params: new HttpParams({
        fromObject: {
          'editionId': environment.currentEvent
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
          'editionId': environment.currentEvent
        }
      }),
      headers: this.headers
    }

    return this.http.delete<Link>(`${this.companiesUrl}/${companyId}/link/${attendeeId}`, httpOptions)
      .pipe(
        catchError(this.handleError<Link>('deleteLink'))
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
      showAlert: true,
      text: null,
      type: Type.error
    }

    // even if link does not exist, doesn't show the message
    msg.showAlert = (operation === 'getLink') ? false : true

    return (error: any): Observable<T> => {
      msg.text = error.message
      this.messageService.add(msg)

      // Let the app keep running by returning an empty result.
      return of(result as T)
    }
  }
}
