import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'

import { Observable } from 'rxjs/Observable'
import { catchError, map, tap } from 'rxjs/operators'
import { of } from 'rxjs/observable/of'

import { Session } from './session.model'

import { environment } from '../../environments/environment'
import { MessageService } from '../partials/messages/message.service'

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable()
export class SessionService {

  private sessionsUrl = environment.deckUrl + '/api/sessions'
  private sessions: Session[]

  constructor (
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  private log (message: string) {
    this.messageService.add('SessionService: ' + message)
  }

  getSessions (): Observable<Session[]> {
    const params = new HttpParams({
      fromObject: {
        'sort': 'date',
        'event': environment.currentEvent
      }
    })
    return this.http.get<Session[]>(this.sessionsUrl, { params })
      .pipe(
        tap(sessions => this.setLocalSessions(sessions)),
        catchError(this.handleError<Session[]>('getSessions', []))
      )
  }

  getSession (id: string): Observable<Session> {
    return this.http.get<Session>(`${this.sessionsUrl}/${id}`)
      .pipe(
        catchError(this.handleError<Session>(`getSession id=${id}`))
      )
  }

  getLocalSessions (): Session[] {
    return this.sessions ? this.sessions : undefined
  }

  getLocalSession (id: string): Session {
    if (this.sessions) {
      return this.sessions.find(session => session.id === id)
    } else {
      return undefined
    }
  }

  setLocalSessions (sessions: Session[]): void {
    this.sessions = sessions
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
