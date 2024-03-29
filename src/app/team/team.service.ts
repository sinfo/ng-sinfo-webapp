import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'

import { Observable, of } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'

import { Member } from './member.model'

import { environment } from '../../environments/environment'
import { MessageService, Type } from '../message.service'
import { MatSnackBar } from '@angular/material/snack-bar'

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable()
export class TeamService {
  private memberUrl = environment.cannonUrl + '/member'
  private team: Member[]
  private eventId: string

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private messageService: MessageService
  ) { }

  getTeam(eventId: string): Observable<Member[]> {
    if (this.team && this.eventId === eventId) {
      return of(this.team)
    }

    this.eventId = eventId

    const params = new HttpParams({
      fromObject: {
        'sort': 'name',
        'event': eventId,
        'participations': 'true'
      }
    })
    return this.http.get<Member[]>(this.memberUrl, { params })
      .pipe(
        tap(team => this.team = team),
        catchError(this.handleError<Member[]>('getTeam', []))
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
      this.snackBar.open('When fetching team members from server', "Ok", {
        panelClass: ['mat-toolbar', 'mat-warn'],
        duration: 2000
      })
      /*       this.messageService.add({
              origin: `TeamService: ${operation}`,
              showAlert: false,
              text: 'When fetching team members from server',
              type: Type.error,
              errorObject: error,
              timeout: 4000
            })
       */
      // Let the app keep running by returning an empty result.
      return of(result)
    }
  }

}
