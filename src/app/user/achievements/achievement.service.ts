import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { environment } from "../../../environments/environment";

import { Achievement, SpeedDate } from "./achievement.model";
import { MessageService, Type } from "../../message.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AuthService } from "../../auth/auth.service";
import { EventService } from "../../events/event.service";
import { Event } from "../../events/event.model";

@Injectable()
export class AchievementService {
  private achievementsUrl = environment.cannonUrl + "/achievements";
  private activeUrl = this.achievementsUrl + "/active";
  private codeUrl = this.achievementsUrl + "/code";
  private achievements: Achievement[];
  private event: Event;

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private eventService: EventService
  ) {
    this.eventService.getCurrent().subscribe((event) => (this.event = event));
  }

  getAchievements(): Observable<Achievement[]> {
    if (this.achievements) {
      return of(this.achievements);
    }

    return this.http.get<Achievement[]>(this.achievementsUrl).pipe(
      tap((achievements) => (this.achievements = achievements)),
      catchError(this.handleError<Achievement[]>("getAchievements", []))
    );
  }

  getAchievementsCode(
    start: Date,
    end: Date,
    kind?: string
  ): Observable<Achievement[]> {
    let query = `?start=${start ? start : new Date()}&end=${
      end ? end : new Date()
    }`;
    if (kind) {
      query += `&kind=${kind}`;
    }
    return this.http.get<Achievement[]>(this.codeUrl + query).pipe(
      tap((achievements) => (this.achievements = achievements)),
      catchError(this.handleError<Achievement[]>("getAchievementsCode", []))
    );
  }

  getActiveAchievements(): Observable<Achievement[]> {
    return this.http.get<Achievement[]>(this.activeUrl).pipe(
      tap((achievements) => (this.achievements = achievements)),
      catchError(this.handleError<Achievement[]>("getAchievements", []))
    );
  }

  getAchievement(id: string): Observable<Achievement> {
    if (this.achievements) {
      return of(this.achievements.find((achievement) => achievement.id === id));
    } else {
      return this.http
        .get<Achievement>(`${this.achievementsUrl}/${id}`)
        .pipe(catchError(this.handleError<Achievement>("getAchievement")));
    }
  }

  getAchievementCode(id: string): Observable<Achievement> {
    if (this.achievements) {
      return of(this.achievements.find((achievement) => achievement.id === id));
    } else {
      return this.http
        .get<Achievement>(`${this.achievementsUrl}/${id}/code`)
        .pipe(catchError(this.handleError<Achievement>("getAchievementCode")));
    }
  }

  getMyAchievements(): Observable<Achievement[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.authService.getToken().token}`,
      }),
    };

    return this.http
      .get<Achievement[]>(`${this.achievementsUrl}/me`, httpOptions)
      .pipe(catchError(this.handleError<Achievement[]>("getMyAchievements")));
  }

  getMyAchievementsAndPoints(): Observable<Object> {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.authService.getToken().token}`,
      }),
    };

    return this.http.get(`${this.activeUrl}/me`, { ...httpOptions });
  }

  getMySpeedDates(): Observable<{ achievements: SpeedDate[]; points: number }> {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.authService.getToken().token}`,
      }),
    };

    return this.http
      .get<{ achievements: SpeedDate[]; points: number }>(
        `${this.achievementsUrl}/speed/me`,
        httpOptions
      )
      .pipe(
        catchError(
          this.handleError<{ achievements: SpeedDate[]; points: number }>(
            "getMySpeedDates"
          )
        )
      );
  }

  deleteMyAchievements(): Observable<Achievement[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.authService.getToken().token}`,
      }),
    };

    return this.http
      .delete<Achievement[]>(`${this.achievementsUrl}/me`, httpOptions)
      .pipe(
        catchError(this.handleError<Achievement[]>("deleteMyAchievements"))
      );
  }

  createSecretAchievement(
    validity: Date,
    points: number
  ): Observable<Achievement> {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.authService.getToken().token}`,
      }),
    };

    return this.http
      .post<Achievement>(
        `${this.achievementsUrl}/secret`,
        {
          event: this.event.id,
          validity: validity,
          points: points,
        },
        httpOptions
      )
      .pipe(catchError(this.handleError<Achievement>("create secret")));
  }

  createAchievement(formData: FormData): Observable<Achievement> {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.authService.getToken().token}`
      }),
    };

    return this.http
      .post<Achievement>(this.achievementsUrl, formData, httpOptions)
      .pipe(catchError(this.handleError<Achievement>("create achievement")));
  }

  getAchievementSession(sessionID: String): Observable<Achievement> {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.authService.getToken().token}`,
      }),
    };

    return this.http
      .get<Achievement>(
        `${this.achievementsUrl}/session/${sessionID}`,
        httpOptions
      )
      .pipe(catchError(this.handleError<Achievement>("get by session")));
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      // this.snackBar.open(error.message, "Ok", {
      //   panelClass: ["mat-toolbar", "mat-warn"],
      //   duration: 2000,
      // });

      this.snackBar.open("An error occurred and was sent to SINFO team.", "Ok", {
        panelClass: ['mat-toolbar', 'mat-warn'],
        duration: 2000
      })

      // Let the app keep running by returning an empty result.
      return of(result);
    };
  }
}
