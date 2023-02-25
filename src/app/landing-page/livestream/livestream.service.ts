import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { MessageService, Type } from '../../message.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Observable, of } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class LivestreamService {

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private messageService: MessageService
  ) { }

  getLivestreamInformation() {

    var livestreamUrl = environment.cannonUrl + '/google/livestream'

    return this.http.get(livestreamUrl)
      .pipe(
        catchError(this.handleError('getLivestreamInfo'))
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
