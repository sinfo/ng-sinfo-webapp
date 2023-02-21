import { Component, OnInit, ViewChild } from "@angular/core";
import { DateAdapter } from "@angular/material/core";
import { AchievementService } from "../achievements/achievement.service";
import { EventService } from "../../events/event.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SessionService } from '../../session/session.service';

@Component({
  selector: "app-add-achievement",
  templateUrl: "./add-achievement.component.html",
  styleUrls: ["./add-achievement.component.css"],
})
export class AddAchievementComponent implements OnInit {
  submitted: Boolean;
  eventId: string;
  imageFile: File;
  kind: string;
  sessionPresentationIds: string[] = [];
  sessionWorkshopIds: string[] = [];
  sessionKeynoteIds: string[] = [];

  @ViewChild("achievementForm") achievementForm;

  kinds = [
    { value: "stand", viewValue: "Stand" },
    { value: "presentation", viewValue: "Presentation" },
    { value: "workshop", viewValue: "Workshop" },
    { value: "keynote", viewValue: "Keynote" },
    { value: "cv", viewValue: "CV" },
    { value: "secret", viewValue: "Secret" },
    { value: "standDay", viewValue: "Stand Day" },
    { value: "other", viewValue: "Other" },
  ];

  constructor(
    private dateAdapter: DateAdapter<Date>,
    private achievementService: AchievementService,
    private eventService: EventService,
    private sessionService: SessionService,
    private snackBar: MatSnackBar
  ) {
    this.submitted = false;
    this.dateAdapter.setLocale("en-GB"); //dd/MM/yyyy
    this.eventService.getCurrent().subscribe((event) => {
      this.eventId = event.id;
    });
    this.sessionService.getSessions(this.eventId, true).subscribe((sessions) => {
      for (const session of sessions) {
        if (session.kind == 'Presentation') {
          this.sessionPresentationIds.push(session.id);
        } else if (session.kind == 'Workshop') {
          this.sessionWorkshopIds.push(session.id);
        } else if (session.kind == 'Keynote') {
          this.sessionKeynoteIds.push(session.id);
        }
      }
    });
  }

  ngOnInit(): void {}

  submitAchievement(form: any) {
    this.submitted = true;

    const formData: FormData = new FormData();
    formData.append("img", this.imageFile, this.imageFile.name);

    const ach = {
      name: form.name,
      event: this.eventId,
      session: form.session,
      value: Number(form.value),
      validFrom: new Date(form.from),
      validTo: new Date(form.to),
      kind: form.kind,
      description: form.description,
      category: form.category,
      instructions: form.instructions,
    };

    Object.keys(ach).forEach((key) => {
      if (ach[key]) {
        formData.append(key, ach[key]);
      }
    });

    this.achievementService.createAchievement(formData).subscribe((msg) => {
      if (msg) {
        this.snackBar.open(`Done!`, "Ok", {
          panelClass: ["mat-toolbar", "mat-primary"],
          duration: 2000,
        });
      }
    });

    if (form.kind.value == 'presentation') {
      this.sessionPresentationIds = this.sessionPresentationIds.filter(function(session) {
        return session !== form.session;
      });
    } else if (form.kind.value == 'workshop') {
      this.sessionWorkshopIds = this.sessionWorkshopIds.filter(function(session) {
        return session !== form.session;
      });
    } else if (form.kind.value == 'keynote') {
      this.sessionKeynoteIds = this.sessionKeynoteIds.filter(function(session) {
        return session !== form.session;
      });
    }

    this.achievementForm.resetForm();
    this.imageFile = null;
    this.submitted = false;
  }

  uploadImage(event) {
    if (event.target.files && event.target.files.length > 0) {
      this.imageFile = event.target.files[0] as File;
    }
  }
}
