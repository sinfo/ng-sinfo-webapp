import { Component, OnInit, NgZone } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { HttpEventType, HttpResponse } from '@angular/common/http'

import { EventService } from '../../events/event.service'
import { UserService } from '../user.service'
import { User } from '../user.model'
import { environment } from './../../../environments/environment'
import { AuthService } from '../../auth/auth.service'
import { File as CV } from './file'
import { MatDialog } from '@angular/material/dialog'
import { GdprDialogComponent } from './gdpr-dialog/gdpr-dialog.component'

const GRPD_PERMISSIONS_KEY = "grpd-permissions"


@Component({
  selector: 'app-cv',
  templateUrl: './cv.component.html',
  styleUrls: ['./cv.component.css']
})
export class CvComponent implements OnInit {

  user: User
  myCv: CV
  cvDownloadUrl: string
  upload_progress: number
  updated: boolean

  constructor (
    private eventService: EventService,
    private userService: UserService,
    private authService: AuthService,
    private zone: NgZone,
    private titleService: Title,
    public dialog: MatDialog
  ) {
    this.cvDownloadUrl = `${environment.cannonUrl}/files/me/download?access_token=${this.authService.getToken().token}`
    this.zone.run(() => {
      this.userService.getMe()
        .subscribe(user => {
          this.user = user

          this.userService.getCv().subscribe(cv => this.myCv = cv)
          this.userService.isCvUpdated().subscribe(updated => this.updated = updated)
        })
    })
  }

  ngOnInit () {
    this.eventService.getCurrent().subscribe(event => {
      this.titleService.setTitle(event.name + ' - Curriculum')
    })
    let permissions = this.hasGrpdPermissions()
    if(!permissions){
      this.showDialog()
    }
  }


  hasGrpdPermissions(){
    let permissions = localStorage.getItem(GRPD_PERMISSIONS_KEY)
    if(permissions == undefined){
      localStorage.setItem(GRPD_PERMISSIONS_KEY,"false")
      return false
    } else {
       return permissions == "true" 
    } 
  }

  showDialog(){
    const dialogRef = this.dialog.open(GdprDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      // Check here and change permissions
      localStorage.setItem(GRPD_PERMISSIONS_KEY,"true") 
     });
  }

  uploadCV (event) {
    let fileList: FileList = event.target.files
    if (fileList.length > 0) {
      let file: File = fileList[0]
      let formData: FormData = new FormData()
      formData.append('file', file, file.name)

      this.upload_progress = 0
      this.userService.uploadCV(formData).subscribe(e => {
        if (e.type === HttpEventType.UploadProgress) {
          this.upload_progress = Math.round(100 * e.loaded / e.total)
        } else if (e instanceof HttpResponse) {
          this.myCv = e.body
          this.upload_progress = 100

          this.userService.isCvUpdated().subscribe(updated => {
            this.updated = updated
          })

          setTimeout(() => { this.upload_progress = undefined }, 1000)
        }
      })
    }
  }

  deleteCV () {
    this.userService.deleteCV().subscribe(res => {
      this.myCv = undefined
    })
  }
}
