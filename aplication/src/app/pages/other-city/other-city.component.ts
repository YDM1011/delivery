import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../auth.service";

@Component({
  selector: 'app-other-city',
  templateUrl: './other-city.component.html',
  styleUrls: ['./other-city.component.scss']
})
export class OtherCityComponent implements OnInit {
  public language: string;
  public phone;
  public cityplaceholder = {
    ru: 'Город',
    ua: 'Місто'
  };
  constructor(
      private auth: AuthService
  ) { }

  ngOnInit() {
    this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    })
  }

  phoneOutput(e) {
    this.phone = e;
  }

}
