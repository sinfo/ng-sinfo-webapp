import { Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'

import { Observable, of } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'

import { Session } from './session.model'

import { environment } from '../../environments/environment'
import { MessageService, Type } from '../message.service'

@Injectable()
export class SessionService {
  private sessionsUrl = environment.deckUrl + '/public/sessions'
  private sessions: Session[]
  private eventId: string

  constructor (
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  getSessions (eventId: string): Observable<Session[]> {
    if (this.sessions && this.eventId === eventId) {
      return of(this.sessions)
    }

    this.eventId = eventId

    const params = new HttpParams({
      fromObject: {
        'event': eventId
      }
    })

    return this.http.get<Session[]>(this.sessionsUrl, { params })
      .pipe(
        tap(sessions => this.sessions = sessions),
        catchError(this.handleError<Session[]>('getSessions', []))
      )
  }

  getSession (id: string): Observable<Session> {
    if (this.sessions) {
      return of(this.sessions.find(session => session.id === id))
    } else {
      return this.http.get<Session>(`${this.sessionsUrl}/${id}`)
        .pipe(
          catchError(this.handleError<Session>('getSession'))
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
        origin: `SessionService: ${operation}`,
        text: 'When fetching session from server',
        type: Type.error,
        showAlert: false,
        errorObject: error,
        timeout: 4000
      })

      // Let the app keep running by returning an empty result.
      return of(result as T)
    }
  }

}
