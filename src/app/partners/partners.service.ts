import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment'
import { Partner } from './partner.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MessageService, Type } from '../message.service';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PartnersService {
  private partnerUrl = environment.cannonUrl + '/promo-code'
  private partners: Partner[]
  private eventId: string

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  getPartners(): Observable<Partner[]> {
    if (this.partners) {
      return of(this.partners)
    }


    return this.http.get<Partner[]>(this.partnerUrl)
      .pipe(
        tap(partners => {
          this.partners = partners
          console.log(partners)
        }),
        catchError(this.handleError<Partner[]>('getPartners', []))
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
      this.messageService.add({
        origin: `PartnerService: ${operation}`,
        showAlert: false,
        text: 'When fetching partners from server',
        type: Type.error,
        errorObject: error,
        timeout: 4000
      })

      // Let the app keep running by returning an empty result.
      return of(result as T)
    }
  }
}
