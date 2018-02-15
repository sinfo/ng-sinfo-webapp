import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'

import { Observable } from 'rxjs/Observable'
import { catchError, map, tap } from 'rxjs/operators'
import { of } from 'rxjs/observable/of'

import { Session } from './session.model'

import { environment } from '../../environments/environment'
import { MessageService, Type } from '../partials/messages/message.service'

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

  /*
  isActive (): Observable<boolean> {
    this.hasContent = new Promise<boolean>((resolve, reject) => {
      this.resolve
    })
  }*/

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
        text: error.message,
        type: Type.error
      })

      // Let the app keep running by returning an empty result.
      return of(result as T)
    }
  }

}
