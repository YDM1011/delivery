import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "../../auth.service";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  public verification = false;
  public language: string;
  public phone;
  public nameplaceholder = {
    ru: 'ФИО',
    ua: "ПІБ"
  };
  constructor(
      private auth: AuthService
  ) { }

  ngOnInit() {
    this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    });
  }

  phoneOutput(e) {
    this.phone = e;
  }
}
