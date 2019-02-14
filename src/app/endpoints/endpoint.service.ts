import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { Endpoint } from './endpoint.model'
import { Observable ,  of } from 'rxjs'
import { catchError, map, tap } from 'rxjs/operators'
import { MessageService, Type } from '../message.service'
import { AuthService } from '../auth/auth.service'
import { EventService } from '../events/event.service'
import { Event } from '../events/event.model'

@Injectable()
export class EndpointService {

  private endpointsUrl = environment.cannonUrl + '/company-endpoint'
  private endpoints: Endpoint[]
  private event: Event
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${this.authService.getToken().token}`
  })
  private params = new HttpParams({
    fromObject: {
      'edition': this.event.id
    }
  })

  constructor (
    private http: HttpClient,
    private messageService: MessageService,
    private authService: AuthService,
    private eventService: EventService
  ) {
    this.eventService.getCurrent().subscribe(event => this.event)
  }

  getEndpoints (): Observable<Endpoint[]> {
    if (this.endpoints) {
      return of(this.endpoints)
    }

    return this.http.get<Endpoint[]>(this.endpointsUrl, { params: this.params, headers: this.headers })
      .pipe(
      tap(endpoints => this.endpoints = endpoints),
      catchError(this.handleError<Endpoint[]>('getEndpoints', []))
      )
  }

  getEndpoint (companyId: string): Observable<Endpoint> {
    if (this.endpoints) {
      return of(this.endpoints.find(c => {
        return c.company === companyId && c.edition === this.event.id
      }))
    }

    return this.http.get<Endpoint>(`${this.endpointsUrl}/${companyId}`, {
      headers: this.headers,
      params: this.params
    })
    .pipe(
      catchError(this.handleError<Endpoint>('getEndpoint'))
    )
  }

  createEndpoints (companies: string[], from: Date, to: Date): Observable<Endpoint[]> {
    return this.http.post<Endpoint[]>(`${this.endpointsUrl}`, {
      companies,
      edition: this.event.id,
      validaty: {
        from,
        to
      }
    }, { headers: this.headers })
    .pipe(
      tap(endpoints => this.endpoints = endpoints),
      catchError(this.handleError<Endpoint[]>('createEndpoints'))
    )
  }

  updateEndpoint (companyId: string, from: Date, to: Date): Observable<Endpoint> {
    return this.http.post<Endpoint>(`${this.endpointsUrl}/${companyId}`, {
      validaty: {
        from,
        to
      }
    }, {
      headers: this.headers,
      params: this.params
    })
    .pipe(
      catchError(this.handleError<Endpoint>('updateEndpoints'))
    )
  }

  deleteEndpoint (companyId: string): Observable<Endpoint> {
    return this.http.delete<Endpoint>(`${this.endpointsUrl}/${companyId}`, {
      headers: this.headers,
      params: this.params
    })
    .pipe(
      tap(endpoint => this.endpoints = this.endpoints.filter(e => {
        return e.company !== endpoint.company && e.edition !== endpoint.edition
      })),
      catchError(this.handleError<Endpoint>('deleteEndpoints'))
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
        origin: `CompanyService: ${operation}`,
        showAlert: true,
        text: error.message,
        type: Type.error
      })

      // Let the app keep running by returning an empty result.
      return of(result as T)
    }
  }

}
