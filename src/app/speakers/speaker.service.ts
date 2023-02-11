import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { Observable, of } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import { Speaker } from './speaker.model'
import { environment } from '../../environments/environment'
import { MessageService, Type } from '../message.service'
import { MatSnackBar } from '@angular/material/snack-bar'

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable()
export class SpeakerService {
  private speakersUrl = environment.deckUrl + '/api/speakers'
  private speakers: Speaker[]
  private eventId: string

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private messageService: MessageService
  ) { }

  getSpeakers(eventId: string): Observable<Speaker[]> {
    if (this.speakers && this.eventId === eventId) {
      return of(this.speakers)
    }

    this.eventId = eventId

    const params = new HttpParams({
      fromObject: {
        'sort': 'name',
        'event': eventId,
        'participations': 'true'
      }
    })

    return this.http.get<Speaker[]>(this.speakersUrl, { params })
      .pipe(
        tap(speakers => this.speakers = speakers),
        catchError(this.handleError<Speaker[]>('getSpeakers', []))
      )
  }

  getSpeaker(id: string): Observable<Speaker> {
    if (this.speakers) {
      return of(this.speakers.find(speaker => speaker.id === id))
    }
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
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.snackBar.open(error.message, "Ok", {
        panelClass: ['mat-toolbar', 'mat-warn'],
        duration: 2000
      })
      /* this.messageService.add({
        origin: `SpeakerService: ${operation}`,
        showAlert: false,
        text: 'When fetching speakers from server',
        errorObject: error,
        type: Type.error,
        timeout: 4000
      }) */

      // Let the app keep running by returning an empty result.
      return of(result)
    }
  }

}
