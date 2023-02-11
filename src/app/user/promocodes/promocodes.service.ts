import { Injectable } from '@angular/core'
import { environment } from '../../../environments/environment'
import { Promocode } from './promocode.model'
import { HttpClient } from '@angular/common/http'
import { MessageService, Type } from '../../message.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Observable, of } from 'rxjs'
import { tap, catchError } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class PromocodesService {
  private partnerUrl = environment.cannonUrl + '/promo-code'
  private partners: Promocode[]

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private messageService: MessageService
  ) { }

  getPartners(): Observable<Promocode[]> {
    if (this.partners) {
      return of(this.partners)
    }

    return this.http.get<Promocode[]>(this.partnerUrl)
      .pipe(
        tap(partners => {
          this.partners = partners
        }),
        catchError(this.handleError<Promocode[]>('getPartners', []))
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
      this.snackBar.open('When fetching partners from server', "Ok", {
        panelClass: ['mat-toolbar', 'mat-warn'],
        duration: 2000
      })
      this.messageService.add({
        origin: `PartnerService: ${operation}`,
        showAlert: false,
        text: 'When fetching partners from server',
        type: Type.error,
        errorObject: error,
        timeout: 4000
      })

      // Let the app keep running by returning an empty result.
      return of(result)
    }
  }
}
