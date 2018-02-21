import { Injectable } from '@angular/core'
import { MessageService, Type } from '../partials/messages/message.service'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { Company } from './company.model'
import { Observable } from 'rxjs/Observable'
import { catchError, map, tap } from 'rxjs/operators'
import { of } from 'rxjs/observable/of'

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable()
export class CompanyService {

  private companiesUrl = environment.deckUrl + '/api/companies'
  private companies: Company[]

  constructor (
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  getCompanies (): Observable<Company[]> {
    if (this.companies) {
      return of(this.companies)
    }

    const params = new HttpParams({
      fromObject: {
        'event': environment.currentEvent,
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
        text: error.message,
        type: Type.error
      })

      // Let the app keep running by returning an empty result.
      return of(result as T)
    }
  }

}
