import { Injectable } from '@angular/core'
import { MessageService, Type } from '../../partials/messages/message.service'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { environment } from '../../../environments/environment'
import { Observable } from 'rxjs/Observable'
import { catchError, map, tap } from 'rxjs/operators'
import { of } from 'rxjs/observable/of'
import { AuthService } from '../../auth/auth.service'
import { Link } from './link.model'

@Injectable()
export class LinkService {
  private companiesUrl = environment.cannonUrl + '/company'
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${this.authService.getToken().token}`
  })

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private authService: AuthService
  ) { }

  getLink(companyId: string, attendeeId: string): Observable<Link> {
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

  createLink(companyId: string, userId: string, attendeeId: string, note: string): Observable<Link> {
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

  updateLink(companyId: string, userId: string, attendeeId: string, note: string): Observable<Link> {
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

  deleteLink(companyId: string, attendeeId: string) {
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
  private handleError<T>(operation = 'operation', result?: T) {
    if (operation === 'getLink') {
      return (error: any): Observable<T> => {
        return of(result as T)
      }
    }

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
