import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'

import { Observable, of } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'

import { Session } from './session.model'

import { environment } from '../../environments/environment'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MessageService, Type } from '../message.service'
import { SpeakerService } from '../speakers/speaker.service'
import { SponsorService } from '../landing-page/sponsors/sponsor.service'



const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable()
export class SessionService {
  private sessionsUrl = environment.cannonUrl + '/session'
  private sessions: Session[]
  private eventId: string

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private speakerService: SpeakerService,
    private companyService: SponsorService

  ) { }

  getSessions(eventId: string, withoutAchievement: boolean = false): Observable<Session[]> {
    if (this.sessions && this.eventId === eventId) {
      return of(this.sessions)
    }

    this.eventId = eventId

    return this.http.get<Session[]>(this.sessionsUrl + '?withoutAchievements=' + withoutAchievement)
      .pipe(
        tap(sessions => {
          this.sessions = sessions
          sessions.forEach(s => {
            if (s.speakers.length > 0) {
              s.speakers.forEach((sSpe, i) => {
                this.speakerService.getSpeaker(sSpe.id).subscribe(val => {
                  s.speakers[i] = val
                })
              })
            }

            if (s.companies.length > 0) {
              s.companies.forEach((sComp, i) => {
                this.companyService.getSponsor(sComp as unknown as string).subscribe(val => {
                  s.companies[i] = val
                })
              })
            }
          })
        }),
        catchError(this.handleError<Session[]>('getSessions', []))
      )
  }

  getSession(id: string): Observable<Session> {
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
