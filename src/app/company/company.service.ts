import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { Company } from './company.model'
import { Observable } from 'rxjs/Observable'
import { catchError, map, tap } from 'rxjs/operators'
import { of } from 'rxjs/observable/of'
import { MessageService, Type } from '../message.service'
import { User } from '../user/user.model'
import { AuthService } from '../auth/auth.service'

@Injectable()
export class CompanyService {

  private companiesUrl = environment.deckUrl + '/api/companies'
  private companies: Company[]
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${this.authService.getToken().token}`
  })

  constructor (
    private http: HttpClient,
    private messageService: MessageService,
    private authService: AuthService
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
        showAlert: true,
        text: error.message,
        type: Type.error
      })

      // Let the app keep running by returning an empty result.
      return of(result as T)
    }
  }

}
