import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { Company } from './company.model'
import { Observable, of } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import { MessageService, Type } from '../message.service'
import { AuthService } from '../auth/auth.service'
import { EventService } from '../events/event.service'
import { Event } from '../events/event.model'

@Injectable()
export class CompanyService {

  private companiesUrl = environment.deckUrl + '/api/companies'
  private companies: Company[]
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

  getCompanies (): Observable<Company[]> {
    if (this.companies) {
      return of(this.companies)
    }

    const params = new HttpParams({
      fromObject: {
        'event': this.event.id,
        'participations': 'true'
      }
    })

    return this.http.get<Company[]>(this.companiesUrl, { params })
      .pipe(
      tap(companies => this.companies = companies),
      catchError(this.handleError<Company[]>('getCompanies', []))
      )
  }

  getCompany (id: string): Observable<Company> {
    if (this.companies) {
      return of(this.companies.find(c => {
        return c.id === id
      }))
    }

    return this.http.get<Company>(`${this.companiesUrl}/${id}`)
      .pipe(
      catchError(this.handleError<Company>('getCompany'))
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
        showAlert: false,
        text: error.message,
        type: Type.error
      })

      // Let the app keep running by returning an empty result.
      return of(result)
    }
  }

}
