import { Component, OnInit, NgZone } from '@angular/core'
import { UserService } from '../user.service'
import { User } from '../user.model'
import { environment } from './../../../environments/environment'
import { AuthService } from '../../auth/auth.service'
import { File as CV } from './file'

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

  constructor (
    private userService: UserService,
    private authService: AuthService,
    private zone: NgZone
  ) {
    this.cvDownloadUrl = `${environment.cannonUrl}/files/me/download?access_token=${this.authService.getToken().token}`
    /**
     *  TODO: To fix the unknown error with Google login
     * (https://github.com/sinfo/ng-sinfo-webapp/issues/62) we need to call getMe()
     * in the constructor this isn't a best practise, change this in the future.
     * Similar problem:
     * https://stackoverflow.com/questions/48876926/ngoninit-function-not-called-after-google-login-in-angular4
     */
    this.zone.run(() => {
      this.userService.getMe()
        .subscribe(user => {
          this.user = user

          this.userService.isCVSubmited().subscribe(response => {
            // TODO CANNON MUST RETURN 404 on no file
            this.submitedCV = response !== null && response.id !== null
            this.myCv = response
          }, () => {
            this.submitedCV = false
          })
        })
    })
  }

  ngOnInit () {
  }

  uploadCV (event) {
    let fileList: FileList = event.target.files
    if (fileList.length > 0) {
      let file: File = fileList[0]
      let formData: FormData = new FormData()
      formData.append('file', file, file.name)
      this.userService.uploadCV(formData).subscribe(res => {
        this.submitedCV = true
      }, () => {
        this.submitedCV = false
      })
    }
  }

  deleteCV () {
    this.userService.deleteCV().subscribe(res => {
      this.submitedCV = false
    })
  }

}
