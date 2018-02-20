import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'

import { Observable } from 'rxjs/Observable';
import { catchError, map, tap } from 'rxjs/operators'
import { of } from 'rxjs/observable/of'

import { environment } from '../../environments/environment'
import { MessageService, Type } from '../partials/messages/message.service'

import { Achievement } from './achievement.model'

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable()
export class AchievementService {
  
  private achievementsUrl = environment.cannonUrl + '/achievements'
  private achievemens: Achievement[]

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  getAchievements (): Observable<Achievement[]> {
    if (this.achievemens) {
      return of(this.achievemens)
    }

    return this.http.get<Achievement[]>(this.achievementsUrl)
      .pipe(
        tap(achievemens => this.achievemens = achievemens),
        catchError(this.handleError<Achievement[]>('getAchiements', []))
      )
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
        text: error.message,
        type: Type.error
      })

      // Let the app keep running by returning an empty result.
      return of(result as T)
    }
  }

}
