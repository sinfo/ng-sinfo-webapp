import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs/Observable'
import { catchError, map, tap } from 'rxjs/operators'
import { of } from 'rxjs/observable/of'
import { Speaker } from './speaker.model'
import { environment } from '../../environments/environment'
import { MessageService, Type } from '../partials/messages/message.service'

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable()
export class SpeakerService {
  private speakersUrl = environment.deckUrl + '/api/speakers'
  private speakers: Speaker[]

  constructor (
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  getSpeakers (): Observable<Speaker[]> {
    if (this.speakers) {
      return of(this.speakers)
    }

    const params = new HttpParams({
      fromObject: {
        'sort': 'name',
        'event': environment.currentEvent,
        'participations': 'true'
      }
    })

    return this.http.get<Speaker[]>(this.speakersUrl, { params })
      .pipe(
        tap(speakers => this.speakers = speakers),
        catchError(this.handleError<Speaker[]>('getSpeakers', []))
      )
  }

  getSpeaker (id: string): Observable<Speaker> {
    if (this.speakers) {
      return of(this.speakers.find(speaker => speaker.id === id))
    } else {
      return this.http.get<Speaker>(`${this.speakersUrl}/${id}`)
        .pipe(
          catchError(this.handleError<Speaker>('getSpeaker'))
        )
    }
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
        origin: `SpeakerService: ${operation}`,
        text: error.message,
        type: Type.error
      })

      // Let the app keep running by returning an empty result.
      return of(result as T)
    }
  }

}
