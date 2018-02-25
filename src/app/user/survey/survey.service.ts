import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { MessageService, Type } from '../../message.service'
import { Observable } from 'rxjs/Observable'
import { of } from 'rxjs/observable/of'
import { RedeemCode } from './redeem-code.model'
import { catchError } from 'rxjs/operators'
import { environment } from '../../../environments/environment'
import { AuthService } from '../../auth/auth.service'

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

  getRedeemCode (id: string): Observable<RedeemCode> {
    let httpOptions = {
      headers: this.httpHeader.append('Authorization', `Bearer ${this.authService.getToken().token}`)
    }
    const url = `${environment.cannonUrl}/redeem/${id}`
    return this.http.get<RedeemCode>(url, httpOptions)
      .pipe(
        catchError(this.handleError<RedeemCode>(`fetching redeem code`))
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
        showAlert: true,
        text: `When ${operation} from server`,
        errorObject: error,
        type: Type.error,
        timeout: 4000
      })

      // Let the app keep running by returning an empty result.
      return of(result as T)
    }
  }
}
