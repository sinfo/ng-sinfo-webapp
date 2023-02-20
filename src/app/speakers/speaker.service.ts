import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { Observable, of } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import { Speaker, SpeakerData } from './speaker.model'
import { environment } from '../../environments/environment'
import { MatSnackBar } from '@angular/material/snack-bar'

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable()
export class SpeakerService {
  private speakersUrl = environment.cannonUrl + '/speaker'
  private speakersData: SpeakerData
  isCollapsed = false

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) { }

  getSpeakers(): Observable<SpeakerData> {
    if (this.speakersData) {
      return of(this.speakersData)
    }

    return this.http.get<SpeakerData>(this.speakersUrl)
      .pipe(
        tap(data => this.speakersData = data),
        catchError(this.handleError<SpeakerData>('getSpeakers'))
      )
  }

  getSpeaker(id: string): Observable<Speaker> {
    if (this.speakersData) {
      return of(this.speakersData.speakers.find(speaker => speaker.id === id))
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
