import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from '../../../environments/environment'
import { Achievement } from '../achievements/achievement.model'
import { AuthService } from '../../auth/auth.service'
import { MessageService, Type } from '../../message.service'
import { Router } from '@angular/router'

@Injectable()
export class RedeemService {
  private redeemUrl = environment.cannonUrl + '/redeem'

  private secretUrl = environment.cannonUrl + '/achievements/redeem/secret'

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {
  }

  redeem(id: string, myAchievements: Achievement[]): void {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authService.getToken().token}`
      })
    }

    this.http.get<{ success: boolean, achievement: Achievement }>(`${this.redeemUrl}/${id}`, httpOptions)
      .subscribe(
        response => {
          let achievement = response.achievement

          if (!response.success || !achievement || achievement.id === undefined) {
            this.messageService.add({
              origin: 'Redeem',
              showAlert: true,
              text: `Invalid redeem code`,
              type: Type.warning,
              timeout: 7000
            })
            return
          }

          this.router.navigate([`/user/achievement/${achievement.id}`])
        },
        err => {
          if (err.status === 406) {
            this.messageService.add({
              origin: 'Redeem',
              showAlert: true,
              text: `Already redeemed code`,
              type: Type.warning,
              timeout: 7000
            })

            return
          }

          this.messageService.add({
            origin: 'Redeem',
            showAlert: true,
            text: `Invalid redeem code`,
            type: Type.error,
            timeout: 7000
          })
        }
      )
  }

  redeemSecret(code: string): void {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authService.getToken().token}`
      })
    }

    this.http.post<Achievement>(`${this.secretUrl}`, { code: code }, httpOptions)
      .subscribe(
        achievement => {
          this.router.navigate([`/user/achievement/${achievement.id}`])
        },
        err => {
          if (err.status === 406) {
            this.messageService.add({
              origin: 'Redeem',
              showAlert: true,
              text: `Already redeemed code`,
              type: Type.warning,
              timeout: 7000
            })

            return
          } else if (err.status === 404) {
            this.messageService.add({
              origin: 'Secret Codes',
              showAlert: true,
              text: `No valid secret achievements found with that code`,
              type: Type.warning,
              timeout: 7000
            })
            return
          }

          this.messageService.add({
            origin: 'Redeem',
            showAlert: true,
            text: `Invalid redeem code`,
            type: Type.error,
            timeout: 7000
          })
        }
      )
  }
}
