import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http'
import { environment } from '../../../environments/environment'
import { Observable } from 'rxjs'
import { Achievement } from '../achievements/achievement.model'
import { AuthService } from '../../auth/auth.service'
import { MessageService, Type } from '../../message.service'

@Injectable()
export class RedeemService {
  private redeemUrl = environment.cannonUrl + '/redeem'

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private messageService: MessageService
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

          let found = myAchievements.filter(a => a.id === achievement.id).length > 0

          !found
            ? this.messageService.add({
              origin: 'Redeem',
              showAlert: true,
              text: `Achievement unlocked! You won ${achievement.value} points!`,
              type: Type.success,
              timeout: 7000
            })
            : this.messageService.add({
              origin: 'Redeem',
              showAlert: true,
              text: `You already have this achievement`,
              type: Type.warning,
              timeout: 7000
            })
        },
        () => {
          this.messageService.add({
            origin: 'Redeem',
            showAlert: true,
            text: `Invalid redeem code`,
            type: Type.warning,
            timeout: 7000
          })
        }
      )
  }
}
