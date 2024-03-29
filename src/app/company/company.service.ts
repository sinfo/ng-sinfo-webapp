import { Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { Company } from './company.model'
import { Observable, of } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import { EventService } from '../events/event.service'
import { Event } from '../events/event.model'
import { MatSnackBar } from '@angular/material/snack-bar'

@Injectable()
export class CompanyService {

  private companiesUrl = environment.cannonUrl + '/company'
  private companies: Company[]
  private event: Event

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private eventService: EventService
  ) {
    this.eventService.getCurrent().subscribe(event => this.event = event)
  }

  getCompanies(): Observable<Company[]> {
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

  getCompany(id: string): Observable<Company> {
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
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // this.snackBar.open(error.message, "Ok", {
      //   panelClass: ['mat-toolbar', 'mat-warn'],
      //   duration: 2000
      // })

      this.snackBar.open("An error occurred and was sent to SINFO team.", "Ok", {
        panelClass: ['mat-toolbar', 'mat-warn'],
        duration: 2000
      })

      // Let the app keep running by returning an empty result.
      return of(result)
    }
  }

}
