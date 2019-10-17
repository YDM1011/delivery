import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AuthService} from '../../auth.service';

@Component({
  selector: 'app-confirm-order',
  templateUrl: './confirm-order.component.html',
  styleUrls: ['./confirm-order.component.scss']
})
export class ConfirmOrderComponent implements OnInit {
  public language: string;
  public user: any;
  public address: any;
  public changeCity: boolean = false;
  @Output() closeConfirm = new EventEmitter();
  constructor(
      private auth: AuthService
  ) { }

  ngOnInit() {
    this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    });
    this.auth.onMe.subscribe((v: string) => {
      if (v) {
        this.user = v;
      }
    });
  }
  outputAddress() {

  }
  cancelConfirmAddress(e) {
    this.changeCity = e.value;
  }
}
