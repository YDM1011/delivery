import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AuthService} from "../../auth.service";

@Component({
  selector: 'app-confirm-address',
  templateUrl: './confirm-address.component.html',
  styleUrls: ['./confirm-address.component.scss']
})
export class ConfirmAddressComponent implements OnInit {
  @Output() cancelConfirmAddress = new EventEmitter();
  @Output() outputConfirmAddress = new EventEmitter();
  public language;
  public user;
  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    });
    this.auth.onMe.subscribe((v: string) => {
      if (v) {
        this.user = v;
        console.log(this.user);
      }
    });
  }

}
