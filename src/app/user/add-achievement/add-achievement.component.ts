import { Component, OnInit } from "@angular/core";
import { DateAdapter } from "@angular/material/core";
import { AchievementService } from "../achievements/achievement.service";
import { EventService } from "../../events/event.service";
import { Achievement } from "../achievements/achievement.model";

@Component({
  selector: "app-add-achievement",
  templateUrl: "./add-achievement.component.html",
  styleUrls: ["./add-achievement.component.css"],
})
export class AddAchievementComponent implements OnInit {
  submitted: Boolean;
  eventId: string;
  achievement: Achievement;

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
    private eventService: EventService
  ) {
    this.submitted = false;
    this.dateAdapter.setLocale("en-GB"); //dd/MM/yyyy
    this.eventService.getCurrent().subscribe((event) => {
      this.eventId = event.id;
    });

    const validity = {
      from: new Date(),
      to: new Date(),
    };

    this.achievement = new Achievement("", "", this.eventId, validity, "", 0);
  }

  ngOnInit(): void {}

  submitAchievement(form: any) {
    const ach = {
      id: form.id,
      name: form.name,
      event: this.eventId,
      session: form.session,
      value: Number(form.value),
      validity: {
        from: new Date(form.from),
        to: new Date(form.to),
      },
      kind: form.kind,
      description: form.description,
      category: form.category,
      instructions: form.instructions,
      // img: this.achievement.img,
    };

    console.log(ach);

    this.achievementService
      .createAchievement(ach as Achievement)
      .subscribe(() => {
        this.submitted = true;
      });
  }

  uploadImage(event) {
    if (event.target.files && event.target.files.length > 0) {
      const file = (event.target.files[0] as File);
      this.achievement.img = file;
    }
  }
}
