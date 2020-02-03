import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { MessageService, Type } from '../../message.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LivestreamService {

  private channelID = "UC1yAz5N4s78RIxIS4GggEJg";
  private youtubeApiKey = "";

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  /*getEvents (): Observable<Event[]> {
    if (this.events) {
      return of(this.events)
    }

    return this.http.get<Event[]>(this.eventsUrl)
      .pipe(
        tap(events => this.events = events),
        catchError(this.handleError<Event[]>('getEvents', []))
      )
  }*/

  /*isLive() {
    var livestreamUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${this.channelID}&type=video&eventType=live&key=${this.youtubeApiKey}`;
    
    this.http.get(livestreamUrl)
      .pipe(
        
      )
  }*/

  isLive() {
    return true;
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
