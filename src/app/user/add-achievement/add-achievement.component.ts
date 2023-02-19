import { Component, OnInit } from "@angular/core";
import { CreateAchievement } from "./add-achievement.model";
import { DateAdapter } from "@angular/material/core";

@Component({
  selector: "app-add-achievement",
  templateUrl: "./add-achievement.component.html",
  styleUrls: ["./add-achievement.component.css"],
})
export class AddAchievementComponent implements OnInit {
  submitted: Boolean;
  achievement: CreateAchievement;

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

  constructor(private dateAdapter: DateAdapter<Date>) {
    this.submitted = false;
    this.dateAdapter.setLocale("en-GB"); //dd/MM/yyyy
    const validity = {
      from: new Date(),
      to: new Date()
    }
    this.achievement = new CreateAchievement("", "", "30-sinfo", "", 0, validity, "", "", "", "");
  }

  ngOnInit(): void {}

  submitAchievement(form: any) {
    this.submitted = true;
    console.log(form);
  }

  uploadImage(event) {}
}
