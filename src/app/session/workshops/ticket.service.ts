import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'

import { Observable ,  of } from 'rxjs'
import { catchError, map, tap } from 'rxjs/operators'

import { Ticket } from './ticket.model'

import { environment } from '../../../environments/environment'
import { AuthService } from '../../auth/auth.service'
import { MessageService, Type } from '../../message.service'

@Injectable()
export class TicketService {

  private ticketsUrl = environment.cannonUrl + '/tickets'

  constructor (
    private http: HttpClient,
    private messageService: MessageService,
    private authService: AuthService
  ) { }

  // TODO VAI REBENTAR SE USER NAO LOGGED IN
  private httpHeader: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  })

  getTicket (sessionId: string): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.ticketsUrl}/${sessionId}`, { headers: this.httpHeader })
      .pipe(
        catchError(this.handleError<Ticket>('getTicket'))
      )
  }

  registerTicket (sessionId: string) {
    let httpOptions = {
      headers: this.httpHeader.append('Authorization', `Bearer ${this.authService.getToken().token}`)
    }
    return this.http.post<Ticket>(`${this.ticketsUrl}/${sessionId}`, {}, httpOptions)
      .pipe(
        catchError(this.handleError<Ticket>('registerTicket'))
      )
  }

  voidTicket (sessionId: string) {
    let httpOptions = {
      headers: this.httpHeader.append('Authorization', `Bearer ${this.authService.getToken().token}`)
    }
    return this.http.delete<Ticket>(`${this.ticketsUrl}/${sessionId}`, httpOptions)
      .pipe(map(ticket => {
        return ticket
      }))
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
        origin: `TicketService: ${operation}`,
        showAlert: false,
        text: 'When fetching tickets from server',
        errorObject: error,
        type: Type.error,
        timeout: 4000
      })

      // Let the app keep running by returning an empty result.
      return of(result as T)
    }
  }
}
