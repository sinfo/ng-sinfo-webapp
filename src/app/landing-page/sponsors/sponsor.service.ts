import { Injectable } from '@angular/core'
import { environment } from '../../../environments/environment'
import { Sponsor } from './sponsor.model'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable, of } from 'rxjs'
import { tap, catchError } from 'rxjs/operators'
import { MessageService, Type } from '../../message.service'
import { MatSnackBar } from '@angular/material/snack-bar'

@Injectable()
export class SponsorService {
  private sponsorUrl = environment.cannonUrl + '/company'
  private sponsors: Sponsor[]
  private eventId: string

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private messageService: MessageService
  ) { }

  getSponsors(eventId: string): Observable<Sponsor[]> {
    if (this.sponsors && this.eventId === eventId) {
      return of(this.sponsors)
    }

    this.eventId = eventId

    const params = new HttpParams({
      fromObject: {
        'sort': 'name',
        'event': eventId,
        'participations': 'true'
      }
    })

    return this.http.get<Sponsor[]>(this.sponsorUrl, { params })
      .pipe(
        tap(sponsors => this.sponsors = sponsors),
        catchError(this.handleError<Sponsor[]>('getSponsors', []))
      )
  }

  getSponsor(id: string): Observable<Sponsor> {
    if (this.sponsors) {
      return of(this.sponsors.find(sponsor => sponsor.id === id))
    }

    /* TODO params might be necessary
    const params = new HttpParams({
      fromObject: {
        'sort': 'name',
        'event': event,
        'participations': 'true'
      }
    })

    return this.http.get<Sponsor>(`${this.sponsorUrl}/${id}`, { params })*/
    return this.http.get<Sponsor>(`${this.sponsorUrl}/${id}`)
      .pipe(
        catchError(this.handleError<Sponsor>(`getSponsor id=${id}`))
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
