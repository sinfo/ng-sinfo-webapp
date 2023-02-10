import { Component, OnInit } from "@angular/core";
import { Sponsor } from "../../landing-page/sponsors/sponsor.model";
import { SponsorService } from "../../landing-page/sponsors/sponsor.service";
import { Promocode } from "./promocode.model";
import { PromocodesService } from "./promocodes.service";
import { DatePipe } from "@angular/common";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { PromocodesDialogComponent } from "./promocodes-dialog/promocodes-dialog.component";

@Component({
  selector: "app-promocodes",
  templateUrl: "./promocodes.component.html",
  styleUrls: ["./promocodes.component.css"],
  providers: [DatePipe],
})
export class PromocodesComponent implements OnInit {
  partners: Promocode[];
  isPartnersEmpty: boolean;

  constructor(
    private partnerService: PromocodesService,
    private sponsorService: SponsorService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.getPartners();
  }

  getPartners(): void {
    this.partnerService.getPartners().subscribe((partners) => {
      this.getImages(partners);
      partners.forEach((p) => {
        p.expirationDate = this.datePipe.transform(p.expire, "yyyy-MM-dd");
        if (this.isValidHttpUrl(p.code)) {
          p.link = true;
        }
      });
    });
  }

  isValidHttpUrl(string) {
    let url;

    try {
      url = new URL(string);
    } catch (_) {
      return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
  }

  getImages(partners: Promocode[]) {
    partners.forEach((p) => {
      this.sponsorService
        .getSponsor(p.company)
        .subscribe((sponsor: Sponsor) => {
          p.img = sponsor.img;
          p.name = sponsor.name;
        });
    });

    this.partners = partners;
    this.isPartnersEmpty = this.partners.length === 0;
  }

  copy(event, str: string) {
    const el = document.createElement("textarea");
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    event.stopPropagation();

    this.snackBar.open(`Copied!`, "Ok", {
      panelClass: ["mat-toolbar", "mat-primary"],
      duration: 2000,
    });
  }

  openDialog(promocode) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = promocode;    

    this.dialog.open(PromocodesDialogComponent, dialogConfig);
  }
}
