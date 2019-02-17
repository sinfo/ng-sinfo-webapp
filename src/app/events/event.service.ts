import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'

import { Observable, of } from 'rxjs'
import { catchError, map, tap, take, filter } from 'rxjs/operators'

import { environment } from '../../environments/environment'

import { Event } from './event.model'
import { MessageService, Type } from '../message.service'

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable()
export class EventService {
  private eventsUrl = environment.deckUrl + '/api/events?sort=-date'
  private currentEventUrl = environment.deckUrl + '/api/events?sort=-date&limit=1'
  private previousEventUrl = environment.deckUrl + '/api/events?sort=-date&limit=1&skip=1'
  private events: Event[]
  private current: Event
  private previous: Event

  constructor (
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  getEvents (): Observable<Event[]> {
    if (this.events) {
      return of(this.events)
    }

    return this.http.get<Event[]>(this.eventsUrl)
      .pipe(
        tap(events => this.events = events),
        catchError(this.handleError<Event[]>('getEvents', []))
      )
  }

  getEvent (id: string): Observable<Event> {
    if (this.events) {
      return of(this.events.find(event => event.id === id))
    } else {
      return this.http.get<Event>(`${this.eventsUrl}/${id}`)
        .pipe(
          catchError(this.handleError<Event>('getEvent'))
        )
    }
  }

  getCurrent (): Observable<Event> {
    if (this.current) {
      return of(this.current)
    } else {
      return this.http.get<Event>(`${this.currentEventUrl}`)
      .pipe(
          map(events => new Event(events[0])),
          tap(event => this.current = event),
          catchError(this.handleError<Event>('getCurrentEvent'))
        )
    }
  }

  getPrevious (): Observable<Event> {
    if (this.previous) {
      return of(this.previous)
    } else {
      return this.http.get<Event>(`${this.previousEventUrl}`)
        .pipe(
          map(events => events[0]),
          tap(event => this.previous = event),
          catchError(this.handleError<Event>('getPreviousEvent'))
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
        origin: `EventService: ${operation}`,
        text: 'When fetching events from server',
        showAlert: false,
        type: Type.error,
        timeout: 4000,
        errorObject: error
      })

      // Let the app keep running by returning an empty result.
      return of(result as T)
    }
  }

}
