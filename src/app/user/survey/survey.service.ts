import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { MessageService, Type } from '../../message.service'
import { Observable , of } from 'rxjs'
import { RedeemCode } from './redeem-code.model'
import { catchError } from 'rxjs/operators'
import { environment } from '../../../environments/environment'
import { AuthService } from '../../auth/auth.service'
import { SurveyResponse } from './response.model'
import { Achievement } from '../../achievements/achievement.model'

@Injectable()
export class SurveyService {
  private httpHeader: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  })

  constructor (
    private http: HttpClient,
    private messageService: MessageService,
    private authService: AuthService
  ) { }

  submitSurvey (surveyResponse: SurveyResponse, redeemCode: string): Observable<Achievement> {
    let httpOptions = {
      headers: this.httpHeader.append('Authorization', `Bearer ${this.authService.getToken().token}`)
    }
    const url = `${environment.cannonUrl}/surveys/${redeemCode}`
    return this.http.post<Achievement>(url, surveyResponse, httpOptions)
      .pipe(
        catchError(this.handleError<Achievement>(`submiting survey to server`))
      )
  }

  getMyRedeemCodes () {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authService.getToken().token}`
      })
    }

    return this.http.get<RedeemCode[]>(`${environment.cannonUrl}/redeem/me`, httpOptions)
      .pipe(
        catchError(this.handleError<any>('getMyRedeemCodes'))
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
        origin: `SurveyService: ${operation}`,
        showAlert: false,
        text: error.error.message,
        errorObject: error,
        type: Type.error
      })

      // Let the app keep running by returning an empty result.
      return of(result as T)
    }
  }
}
