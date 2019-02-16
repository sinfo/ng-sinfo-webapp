import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'

import { Observable , of } from 'rxjs'
import { catchError, map, tap } from 'rxjs/operators'

import { environment } from '../../environments/environment'

import { Achievement } from './achievement.model'
import { MessageService, Type } from '../message.service'

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable()
export class AchievementService {
  private achievementsUrl = environment.cannonUrl + '/achievements'
  private activeUrl = this.achievementsUrl + '/active'
  private achievements: Achievement[]

  constructor (
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  getAchievements (): Observable<Achievement[]> {
    if (this.achievements) {
      return of(this.achievements)
    }

    return this.http.get<Achievement[]>(this.achievementsUrl)
      .pipe(
        tap(achievements => this.achievements = achievements),
        catchError(this.handleError<Achievement[]>('getAchievements', []))
      )
  }

  getActiveAchievements (): Observable<Achievement[]> {
    return this.http.get<Achievement[]>(this.activeUrl)
      .pipe(
        tap(achievements => this.achievements = achievements),
        catchError(this.handleError<Achievement[]>('getAchievements', []))
      )
  }

  getAchievement (id: string): Observable<Achievement> {
    if (this.achievements) {
      return of(this.achievements.find(achievement => achievement.id === id))
    } else {
      return this.http.get<Achievement>(`${this.achievementsUrl}/${id}`)
        .pipe(
          catchError(this.handleError<Achievement>('getAchievement'))
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
        origin: `AchievementService: ${operation}`,
        text: 'When fetching achievements from server',
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
