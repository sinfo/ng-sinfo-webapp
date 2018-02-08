import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs/Observable'
import { catchError, map, tap } from 'rxjs/operators'
import { of } from 'rxjs/observable/of'
import { Speaker } from './speaker.model'
import { environment } from '../../environments/environment'
import { MessageService } from '../partials/messages/message.service'

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable()
export class SpeakerService {
  private speakersUrl = environment.deckUrl + '/api/speakers'

  constructor (
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  private log (message: string) {
    this.messageService.add('SpeakerService: ' + message)
  }

  getSpeakers (): Observable<Speaker[]> {
    const params = new HttpParams({
      fromObject: {
        'sort': 'name',
        'event': environment.currentEvent,
        'participations': 'true'
      }
    })
    return this.http.get<Speaker[]>(this.speakersUrl, { params })
      .pipe(
        catchError(this.handleError<Speaker[]>('getSpeakers', []))
      )
  }

  getSpeaker (id: string): Observable<Speaker> {
    return this.http.get<Speaker>(`${this.speakersUrl}/${id}`)
      .pipe(
        catchError(this.handleError<Speaker>(`getSpeaker id=${id}`))
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

      // TODO: send the error to remote logging infrastructure
      console.error(error) // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`)

      // Let the app keep running by returning an empty result.
      return of(result as T)
    }
  }

}
