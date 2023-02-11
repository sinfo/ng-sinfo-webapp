import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { AuthService } from '../../auth/auth.service'
import { MessageService, Type } from '../../message.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { environment } from '../../../environments/environment'
import { catchError } from 'rxjs/operators'
import { Observable, of } from 'rxjs'
import { Achievement } from '../achievements/achievement.model'

@Injectable({
  providedIn: 'root'
})
export class SessionsService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private messageService: MessageService
  ) { }

  generateCode(sessionId: string, expirationDate: Date) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authService.getToken().token}`
      })
    }

    return this.http.post<Achievement>(
      environment.cannonUrl + `/sessions/${sessionId}/generate`,
      {
        expiration: expirationDate
      }, httpOptions)
      .pipe(
        catchError(this.handleError<any>('generate-code'))
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
      this.snackBar.open('When generating session code', "Ok", {
        panelClass: ['mat-toolbar', 'mat-warn'],
        duration: 2000
      })
      this.messageService.add({
        origin: `SessionService: ${operation}`,
        text: 'When generating session code',
        type: Type.error,
        showAlert: true,
        errorObject: error,
        timeout: 4000
      })

      // Let the app keep running by returning an empty result.
      return of(result)
    }
  }
}
