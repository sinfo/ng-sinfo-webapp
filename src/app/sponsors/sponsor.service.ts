import { Injectable } from '@angular/core'
import { environment } from '../../environments/environment'
import { Sponsor } from './sponsor.model'
import { HttpClient, HttpParams } from '@angular/common/http'
import { MessageService, Type } from '../partials/messages/message.service'
import { Observable } from 'rxjs/Observable'
import { tap, catchError } from 'rxjs/operators'
import { of } from 'rxjs/observable/of'

@Injectable()
export class SponsorService {
  private sponsorUrl = environment.deckUrl + '/api/companies'
  private sponsors: Sponsor[]

  constructor (
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  getSponsors (): Observable<Sponsor[]> {
    const params = new HttpParams({
      fromObject: {
        'sort': 'name',
        'event': '24-sinfo',
        'participations': 'true'
      }
    })
    return this.http.get<Sponsor[]>(this.sponsorUrl, { params })
      .pipe(
        tap(sponsors => this.setLocalSponsors(sponsors)),
        catchError(this.handleError<Sponsor[]>('getSponsors', []))
      )
  }

  getLocalSponsors (): Sponsor[] {
    return this.sponsors ? this.sponsors : undefined
  }

  getLocalSponsor (id: string): Sponsor {
    if (this.sponsors) {
      return this.sponsors.find(speaker => speaker.id === id)
    } else {
      return undefined
    }
  }

  setLocalSponsors (sponsors: Sponsor[]): void {
    this.sponsors = sponsors
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error) // log to console instead

      this.messageService.add({
        origin: `SponsorService: ${operation}`,
        text: error.message,
        type: Type.error
      })

      // Let the app keep running by returning an empty result.
      return of(result as T)
    }
  }

}
