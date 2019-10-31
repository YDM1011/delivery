import { Component } from '@angular/core';
import {AuthService} from "./auth.service";
import {CrudService} from "./crud.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'delivery';
  public localStorage = localStorage ;
  public setting: any;
  public me: any;
  public loaded = false;
  public count;

  private _subscription: Subscription[] = [];

  constructor(
      private auth: AuthService,
      private crud: CrudService
  ) {
    this.crud.get('translator').then((v: any) => {
      if (v) {
        this.auth.setTranslate(v);
        this.crud.get('setting').then((v: any) => {
          this.setting = Object.assign({}, v);
          this.auth.setSettings(this.setting);
          if (this.setting.city) {
            this.auth.setCity(this.setting.city);
          }
          this.loaded = true;
        });
        if (this.localStorage.getItem('token')) {
          this.crud.get('me').then((v: any) => {
            this.me = Object.assign({}, v);
            this.auth.setMe(this.me);
            if (this.me && this.me._id) {
              this.crud.get(`basket/count?query={"createdBy":"${this.me._id}","status":0}`).then((count: any) => {
                this.count = count.count;
                this.auth.setBasketCount(this.count);
              });
            }
          });
        }
      }
    });
    this.auth.onCheckBasket.subscribe((v: any) => {
      if (v) {
        if (this.me && this.me._id) {
          this.crud.get(`basket/count?query={"createdBy":"${this.me._id}","status":0}`).then((count: any) => {
            if (count) {
              this.count = count.count;
              this.auth.setBasketCount(this.count);
              return;
            }
          });
        } else {
          this.auth.setBasketCount(0);
        }
      }
    });
  }
}
