import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { MessageService, Type } from '../../message.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class LivestreamService {

  private channelID = "UC1yAz5N4s78RIxIS4GggEJg";
  private youtubeApiKey = "";
  private livestreamCount = 0;
  private livestreamId = "";

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  private getLivestreamInformation() {
    if (!this.youtubeApiKey || !this.channelID)
      return;

    var livestreamUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${this.channelID}&type=video&eventType=live&key=${this.youtubeApiKey}`;

    this.http.get(livestreamUrl)
      .pipe(
        catchError(this.handleError("getLivestreamInfo"))
      )
      .subscribe(
        data => this.getLivestreamData(data)
      );
  }

  getLivestreamData(data) {
    this.livestreamCount = data["pageInfo"]["totalResults"];

    if (this.livestreamCount > 0)
      this.livestreamId = data["items"][0]["id"]["videoId"];
  }

  isLive() {
    this.getLivestreamInformation();
    return this.livestreamCount > 0 ? true : false;
  }

  getChannelId() {
    return this.channelID;
  }

  getLivestreamId() {
    if (this.isLive() && this.livestreamId.length > 0)
      return this.livestreamId;
    else
      return null;
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
        origin: `LiveStream Service: ${operation}`,
        showAlert: true,
        text: error.message,
        type: Type.error
      })

      // Let the app keep running by returning an empty result.
      return of(result as T)
    }
  }
}
