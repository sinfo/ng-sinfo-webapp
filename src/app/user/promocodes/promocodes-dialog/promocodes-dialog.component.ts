import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Promocode } from "../promocode.model";

@Component({
  selector: "promocodes-dialog-component",
  templateUrl: "./promocodes-dialog.component.html",
  styleUrls: ["./promocodes-dialog.component.css"],
})
export class PromocodesDialogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public promocode: Promocode) {}

  ngOnInit(): void {}
}
