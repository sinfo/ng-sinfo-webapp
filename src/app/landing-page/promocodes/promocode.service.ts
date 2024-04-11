import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Observable, of } from 'rxjs'
import { tap, catchError } from 'rxjs/operators'
import { environment } from '../../../environments/environment'
import { Promocode } from './promocode.model'
import { SponsorService } from '../sponsors/sponsor.service'

@Injectable()
export class PromocodeService {
  private promocodeUrl = environment.cannonUrl + '/promo-code'
  private promocodes: Promocode[]

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private sponsorService: SponsorService
  ) { }

  getPromocodes(eventId: string): Observable<Promocode[]> {
    if (this.promocodes) {
      return of(this.promocodes)
    }


    return this.http.get<Promocode[]>(this.promocodeUrl).pipe(
      tap(promocodes => this.sponsorService.getSponsors(eventId).subscribe(sponsors => {
        this.promocodes = promocodes.map(promocode => {
          const sponsor = sponsors.find(sponsor => sponsor.id === promocode.company)
          promocode.company = sponsor
          promocode.link = this.isLink(promocode.code)
          return promocode
        })
      })),
      catchError(this.handleError<Promocode[]>('getPromocodes', []))
    )
  }

  isLink(code: string): boolean {
    return code.startsWith('http://') || code.startsWith('https://')
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
