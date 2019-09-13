import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AuthService} from "../../auth.service";

@Component({
  selector: 'app-confirm-address',
  templateUrl: './confirm-address.component.html',
  styleUrls: ['./confirm-address.component.scss']
})
export class ConfirmAddressComponent implements OnInit {
  @Output() cancelConfirmAddress = new EventEmitter();
  public language;
  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    })
  }

}
