import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AuthService} from '../../auth.service';
import {CrudService} from '../../crud.service';

@Component({
  selector: 'app-confirm-address',
  templateUrl: './confirm-address.component.html',
  styleUrls: ['./confirm-address.component.scss']
})
export class ConfirmAddressComponent implements OnInit {
  @Output() cancelConfirmAddress = new EventEmitter();
  @Output() outputConfirmAddress = new EventEmitter();
  public language;
  public address = [];
  public user;
  public loading = false;
  public addressChoose = null;
  constructor(
      private auth: AuthService,
      private crud: CrudService
  ) { }

  ngOnInit() {
    this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    });
    this.auth.onMe.subscribe((v: string) => {
      if (v) {
        this.user = v;
        this.crud.get(`shopAddress?query={"createdBy":"${this.user._id}"}&populate={"path":"city"}`).then((v: any) => {
          if (v) {
            this.address = v;
            this.addressChoose = v[0];
            this.loading = true;
          }
        });
      }
    });
  }
}
