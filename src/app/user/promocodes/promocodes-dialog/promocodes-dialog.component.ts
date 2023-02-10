import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Promocode } from "../promocode.model";

@Component({
  selector: "promocodes-dialog-component",
  templateUrl: "./promocodes-dialog.component.html",
  styleUrls: ["./promocodes-dialog.component.css"],
})
export class PromocodesDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public promocode: Promocode,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  copy(event, str: string) {
    const el = document.createElement("textarea");
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    event.stopPropagation();

    this.snackBar.open(`Code copied!`, "Ok", {
      panelClass: ["mat-toolbar", "mat-primary"],
      duration: 2000,
    });
  }
}
