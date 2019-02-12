import { Component, OnInit, NgZone } from '@angular/core'
import { UserService } from '../user.service'
import { User } from '../user.model'
import { environment } from './../../../environments/environment'
import { AuthService } from '../../auth/auth.service'
import { File as CV } from './file'
import { HttpEventType, HttpResponse } from '@angular/common/http'
import { EventService } from '../../events/event.service'
import { Event } from '../../events/event.model'

@Component({
  selector: 'app-cv',
  templateUrl: './cv.component.html',
  styleUrls: ['./cv.component.css']
})
export class CvComponent implements OnInit {

  user: User
  myCv: CV
  submitedCV: boolean
  cvDownloadUrl: string
  upload_progress: number
  updated: boolean

  constructor (
    private userService: UserService,
    private authService: AuthService,
    private eventService: EventService,
    private zone: NgZone
  ) {
    this.cvDownloadUrl = `${environment.cannonUrl}/files/me/download?access_token=${this.authService.getToken().token}`
    this.zone.run(() => {
      this.userService.getMe()
        .subscribe(user => {
          this.user = user

          this.userService.isCVSubmited().subscribe(response => {
            // TODO CANNON MUST RETURN 404 on no file
            this.submitedCV = response !== null && response.id !== null
            this.myCv = response

            this.checkIfUpdated()
          }, () => {
            this.submitedCV = false
          })
        })
    })
  }

  ngOnInit () {
  }

  checkIfUpdated () {
    this.eventService.getCurrent().subscribe(event => {
      this.updated = new Date(this.myCv.updated).getTime() >= event.date.getTime()
    })
  }

  uploadCV (event) {
    let fileList: FileList = event.target.files
    if (fileList.length > 0) {
      let file: File = fileList[0]
      let formData: FormData = new FormData()
      formData.append('file', file, file.name)

      this.userService.uploadCV(formData).subscribe(e => {
        if (e.type === HttpEventType.UploadProgress) {
          this.upload_progress = Math.round(100 * e.loaded / e.total)
        } else if (e instanceof HttpResponse) {
          this.submitedCV = true
          this.myCv = e.body
          this.upload_progress = 100
          this.checkIfUpdated()

          setTimeout(() => { this.upload_progress = undefined }, 1000)
        }

      }, () => {
        this.submitedCV = false
      })
    }
  }

  deleteCV () {
    this.userService.deleteCV().subscribe(res => {
      this.submitedCV = false
      this.myCv = undefined
    })
  }

}
