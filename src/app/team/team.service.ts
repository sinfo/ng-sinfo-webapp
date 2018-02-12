import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'

import { Observable } from 'rxjs/Observable'
import { catchError, map, tap } from 'rxjs/operators'
import { of } from 'rxjs/observable/of'

import { Member } from './member.model'

import { environment } from '../../environments/environment'
import { MessageService } from '../partials/messages/message.service'

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable()
export class TeamService {
  private memberUrl = environment.deckUrl + '/api/members'
  private team: Member[]

  constructor (
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  private log (message: string) {
    this.messageService.add('TeamService: ' + message)
  }

  getTeam (): Observable<Member[]> {
    const params = new HttpParams({
      fromObject: {
        'sort': 'name',
        'event': environment.currentEvent,
        'participations': 'true'
      }
    })
    return this.http.get<Member[]>(this.memberUrl, { params })
      .pipe(
        tap(team => this.setLocalTeam(team)),
        catchError(this.handleError<Member[]>('getTeam', []))
      )
  }

  getLocalTeam (): Member[] {
    return this.team ? this.team : undefined
  }

  setLocalTeam (team: Member[]): void {
    this.team = team
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
