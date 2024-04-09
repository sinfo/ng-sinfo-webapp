import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'

import { Observable, of } from 'rxjs'
import { catchError, map, tap } from 'rxjs/operators'

import { environment } from '../../environments/environment'

import { Event } from './event.model'
import { MessageService, Type } from '../message.service'
import { MatSnackBar } from '@angular/material/snack-bar'

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable()
export class EventService {
  private eventsUrl = environment.cannonUrl + '/event'
  private currentEventUrl = environment.cannonUrl + '/event/latest'
  private events: Event[]
  private current: Event

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) { }

  getEvents(): Observable<Event[]> {
    if (this.events) {
      return of(this.events)
    }

    return this.http.get<Event[]>(this.eventsUrl)
      .pipe(
        tap(events => this.events = events),
        catchError(this.handleError<Event[]>('getEvents', []))
      )
  }

  getEvent(id: string): Observable<Event> {
    if (this.events) {
      return of(this.events.find(event => event.id === id))
    } else {
      return this.http.get<Event>(`${this.eventsUrl}/${id}`)
        .pipe(
          catchError(this.handleError<Event>('getEvent'))
        )
    }
  }

  getCurrent(): Observable<Event> {
    if (this.current) {
      return of(this.current)
    } else {
      return this.http.get<Event>(`${this.currentEventUrl}`)
        .pipe(
          tap(event => this.current = event),
          catchError(this.handleError<Event>('getCurrentEvent'))
        )
    }
  }

  getCalendarUrl(): Observable<string> {
    return this.http.get<string>(`${environment.cannonUrl}/calendar`)
      .pipe(
        catchError(this.handleError<string>('getCalendarUrl', ''))
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
