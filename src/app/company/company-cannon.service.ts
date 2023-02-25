import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { Observable, of } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { MessageService, Type } from '../message.service'
import { AuthService } from '../auth/auth.service'
import { Link, Note } from '../user/link/link.model'
import { environment } from '../../environments/environment'
import { User } from '../user/user.model'
import { MatSnackBar } from '@angular/material/snack-bar'

@Injectable()
export class CompanyCannonService {
  private companiesUrl = environment.cannonUrl + '/company'
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${this.authService.getToken().token}`
  })

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private snackBar: MatSnackBar,
    private authService: AuthService,
  ) {}

  getLink(companyId: string, attendeeId: string): Observable<Link> {
    const httpOptions = {
      headers: this.headers
    }

    return this.http.get<Link>(`${this.companiesUrl}/${companyId}/link/${attendeeId}`, httpOptions)
      .pipe(
        catchError(this.handleError<Link>('getLink'))
      )
  }

  getLinks(companyId: string): Observable<Link[]> {
    const httpOptions = {
      headers: this.headers
    }

    return this.http.get<Link[]>(`${this.companiesUrl}/${companyId}/link`, httpOptions)
      .pipe(
        catchError(this.handleError<Link[]>('getLinks', []))
      )
  }

  createLink(companyId: string, userId: string, attendeeId: string, note: Note): Observable<Link> {
    return this.http.post<Link>(`${this.companiesUrl}/${companyId}/link`, {
      userId: userId,
      attendeeId: attendeeId,
      notes: {
        contacts: {
          email: note.contacts.email ? note.contacts.email : '',
          phone: note.contacts.phone ? note.contacts.phone : ''
        },
        interestedIn: note.interestedIn ? note.interestedIn : '',
        degree: note.degree ? note.degree : '',
        availability: note.availability ? note.availability : '',
        otherObservations: note.otherObservations ? note.otherObservations : ''
      }
    }, { headers: this.headers })
      .pipe(
        catchError(this.handleError<Link>('createLink'))
      )
  }

  updateLink(companyId: string, userId: string, attendeeId: string, note: Note): Observable<Link> {
    const httpOptions = {
      headers: this.headers
    }

    return this.http.put<Link>(`${this.companiesUrl}/${companyId}/link/${attendeeId}`, {
      userId: userId,
      notes: note
    }, httpOptions)
      .pipe(
        catchError(this.handleError<Link>('updateLink'))
      )
  }

  deleteLink(companyId: string, attendeeId: string) {
    const httpOptions = {
      headers: this.headers
    }

    return this.http.delete<Link>(`${this.companiesUrl}/${companyId}/link/${attendeeId}`, httpOptions)
      .pipe(
        catchError(this.handleError<Link>('deleteLink'))
      )
  }

  sign(companyId: string, attendeeId: string): Observable<User> {
    const httpOptions = {
      headers: this.headers
    }

    return this.http.post<User>(`${this.companiesUrl}/${companyId}/sign/${attendeeId}`, null, httpOptions)
      .pipe(
        catchError(this.handleError<User>('sign'))
      )
  }

  signSpeedDate(companyId: string, attendeeId: string): Observable<User> {
    const httpOptions = {
      headers: this.headers
    }

    return this.http.post<User>(`${this.companiesUrl}/${companyId}/speed/${attendeeId}`, null, httpOptions)
      .pipe(
        catchError(this.handleError<User>('sign speed'))
      )
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    var msg = {
      origin: `UserService: ${operation}`,
      showAlert: false,
      text: null,
      type: Type.error
    }

    return (error: any): Observable<T> => {
      if (error.status === 404 && operation === 'getLink') {
        return of(result)
      }
      msg.text = error.message
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
